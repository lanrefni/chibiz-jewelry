import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import PageHeader from "./common/pageHeader";
import prodService from "../services/prodService";
import Prod from "./common/prod";
import Select from "react-select";
import { toast } from "react-toastify";
import userService from "../services/userService";
import "../style/storeContainerStyle.scss";
import PageTitle from "./common/pageTitle";

class MyProds extends Component {
  state = {
    prods: [],
    errors: {},
    user: {},
    perPage: 12,
    page: 0,
    sortBy: "",
    reverse: "",
    arrPage: [],
  };

  async componentDidMount() {
    const { perPage, sortBy, reverse, page } = this.state;
    this.setDataFromServer(page, sortBy, reverse, perPage);
    this.setDataForLoop();
  }

  /* <= Check if the state has changed => */

  componentDidUpdate(previousProps, previousState) {
    if (
      this.state.sortBy != previousState.sortBy ||
      this.state.reverse != previousState.reverse ||
      this.state.page !== previousState.page
    ) {
      this.setDataFromServer(
        this.state.page,
        this.state.sortBy,
        this.state.reverse,
        this.state.perPage
      );
    }
  }

  /* <= getting the prods data and updating the state => */
  async setDataForLoop() {
    const { data } = await prodService.getAllProds();
    for (let i = 1; i <= data.numOfPages + 1; i++) {
      this.state.arrPage.push(i);
    }
  }

  async setDataFromServer(page, sortBy, reverse, perPage) {
    const { data } = await prodService.getAllProds(
      this.state.perPage,
      this.state.page,
      this.state.sortBy,
      this.state.reverse
    );
    this.setState({
      prods: data.data,
      page: page,
      sortBy: sortBy,
      reverse: reverse,
    });
    const user = await userService.getCurrentUser();
    if (!user) {
      return null;
    }
    const userInfo = await userService.getUserInfo();
    this.setState({ user: userInfo });
  }
  /* <= delete button function => */
  handleDelete = async (id) => {
    await prodService.deleteProd(id);
    toast.dark("Prod Deleted Succuessfuly");
    this.setDataFromServer();
  };

  /* handle the  select changes (price) */

  handleSelectChange = async (e) => {
    if (e.value === "prodPriceExpToCheap") {
      await this.setState({
        sortBy: "prodPrice",
        reverse: true,
        page: 0,
      });
    } else {
      await this.setState({
        sortBy: e.value,
        reverse: false,
        page: 0,
      });
    }
  };
  /* pagination */
  handlePage = async ({ num }) => {
    if (!num) num = 0;
    const { data } = await prodService.getAllProds(
      this.state.perPage,
      num - 1,
      this.state.sortBy,
      this.state.reverse
    );
    this.setState({
      prods: data.data,
      page: num - 1,
      sortBy: this.state.sortBy,
      reverse: this.state.reverse,
    });
  };
  render() {
    if (!userService.getCurrentUser()) {
      return <Redirect to="/" />;
    }
    const cat = [
      { value: "_id", label: "סדר לפי ברירת מחדל" },
      { value: "prodPrice", label: "סדר מהזול ליקר" },
      { value: "prodPriceExpToCheap", label: "סדר מהיקר לזול" },
    ];
    const { prods } = this.state;
    return (
      <>
        <div className="container">
          <PageTitle titleText="כלל המוצרים בחנות" />
          <div className="row ">
            <div className="col-12 flex-column-reverse">
              <p>רשימת המוצרים הקיימים בחנות</p>
              <p className="btn btn-primary">
                <Link className="text-white" to="/create-prod">
                  הוסף מוצר חדש
                </Link>
              </p>
              <div className="d-flex flex-row row overflowVisible selectionz">
                <div className="col-lg-7 col-12">
                  <Select
                    onChange={this.handleSelectChange}
                    value={cat.find((item) => item.value == cat.value)}
                    name="prodCat"
                    className="mt-1 w-25"
                    error={this.state.errors}
                    options={cat}
                    placeholder="מיון לפי"
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: "rgb(246, 213, 206,0.5)",
                        primary: "rgb(246, 213, 206)",
                      },
                    })}
                  />
                </div>
              </div>
              {
                <div className="row">
                  <>
                    {prods.length > 0 &&
                      prods.map((prod) => (
                        <Prod
                          key={prod._id}
                          prod={prod}
                          admin={this.state.user.admin}
                          onDelete={() => {
                            if (
                              window.confirm(
                                "האם אתה בטוח שברצונך למחוק את מוצר זה?"
                              )
                            )
                              this.handleDelete(prod._id);
                          }}
                        />
                      ))}

                    {prods.length === 0 && (
                      <p className="ml-3 col-12 text-muted">
                        <i>No prods, create a prod</i>
                      </p>
                    )}
                  </>
                </div>
              }
              <div className="row">
                <div className="col text-center">
                  {this.state.arrPage.map((num) => (
                    <button
                      className="btn btn-info mb-3 ml-2"
                      key={num}
                      onClick={() => this.handlePage({ num })}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto text-center mb-4 mt-2">
          {/*  {pageCountArr.length >= 1 &&
            pageCountArr.map((i) => {
              <button
                key={i}
                className="btn btn-danger ml-1 "
                onClick={() => this.setState({ page: i })}
              >
                {i + 1}
              </button>;
            })} */}
        </div>
      </>
    );
  }
}

export default MyProds;
