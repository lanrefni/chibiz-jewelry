import React, { Component } from "react";
import PageHeader from "./common/pageHeader";
import prodService from "../services/prodService";
import Prod from "./common/prod";
import { toast } from "react-toastify";
import userService from "../services/userService";
import "../style/storeContainerStyle.scss";
import Select from "react-select";
import bannerImg from "../images/bannerWoman.jpg";

class WomanProds extends Component {
  state = {
    data: {},
    prods: [],
    errors: {},
    user: {},
    perPage: "",
    page: 0,
    sortBy: "",
    reverse: "",
    prodCatSec: "all",
    arrPage: [],
    bannerImg: bannerImg,
  };
  async componentDidMount() {
    const { prodCatSec, perPage, sortBy, reverse, page } = this.state;
    await this.setDataFromServer(prodCatSec, page, sortBy, reverse, perPage);
  }

  /* <= Check if the state has changed => */

  componentDidUpdate(previousProps, previousState) {
    if (
      this.state.sortBy != previousState.sortBy ||
      this.state.reverse != previousState.reverse ||
      this.state.prodCatSec != previousState.prodCatSec ||
      this.state.page !== previousState.page ||
      this.state.perPage !== previousState.perPage
    ) {
      this.setDataFromServer(
        this.state.prodCatSec,
        this.state.page,
        this.state.sortBy,
        this.state.reverse,
        this.state.perPage
      );
    }
  }

  /* <= getting the prods data and updating the state => */

  async setDataFromServer(prodCatSec, page, sortBy, reverse, perPage) {
    let prodType = "woman";
    //TODO SORT BY SECOND CAT
    const { data } = await prodService.getProdsAccorToGender(
      this.state.prodCatSec,
      prodType,
      this.state.perPage,
      this.state.page,
      this.state.sortBy,
      this.state.reverse
    );
    let tempArr = [];
    for (let i = 1; i <= data.numOfPages + 1; i++) {
      tempArr.push(i);
    }
    this.setState({
      arrPage: tempArr,
      prodCatSec: prodCatSec,
      prods: data.data,
      page: page,
      sortBy: sortBy,
      perPage: perPage,
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
  /* handle the first select changes (price) */

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

  /* handle the second select changes ( ring / bracelet / necklace) */

  handleSelectSecChange = async (e) => {
    if (e.value === "all") {
      await this.setState({
        prodCatSec: "all",
        page: 0,
      });
    } else {
      await this.setState({
        prodCatSec: e.value,
        page: 0,
      });
    }
  };

  /* pagination */
  handlePage = async ({ num }) => {
    if (!num) num = 0;
    let prodType = "woman";
    const { data } = await prodService.getProdsAccorToGender(
      this.state.prodCatSec,
      prodType,
      this.state.perPage,
      num - 1,
      this.state.sortBy,
      this.state.reverse
    );
    this.setState({
      prodCatSec: this.state.prodCatSec,
      prods: data.data,
      page: num - 1,
      sortBy: this.state.sortBy,
      reverse: this.state.reverse,
    });
    window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
  };

  /* add to cart */
  handleAddToCart = async (product) => {
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : {};
    let id = product._id.toString();
    cart[id] = cart[id] ? cart[id] : 0;
    let qty = 1;
    if (product.quantity < qty) {
      cart[id] = product.qty;
    } else {
      cart[id]++;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast(`${product.prodName} התווסף לסל בהצלחה`);
    window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
  };

  /* cart quantity from local storage */
  setCartQtyFromLocalStorage = () => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart) return;
    let res = Object.keys(cart).length;
    this.setState({ cartQty: res });
  };
  handlePerPage = async (num) => {
    await this.setState({ perPage: num });
  };

  render() {
    const cat = [
      { value: "_id", label: "סדר לפי ברירת מחדל" },
      { value: "prodPrice", label: "סדר מהזול ליקר" },
      { value: "prodPriceExpToCheap", label: "סדר מהיקר לזול" },
    ];
    const catSec = [
      { value: "all", label: "הצג הכל" },
      { value: "rings", label: "טבעות" },
      { value: "bracelet", label: "צמידים" },
      { value: "necklace", label: "שרשראות" },
    ];
    const { prods } = this.state;

    return (
      <>
        <PageHeader titleText="תכשיטי נשים" img={this.state.bannerImg} />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="row overflowVisible">
                <h2
                  className="mt-2 mr-3 textSort"
                  style={{ fontSize: "1.5em" }}
                >
                  מיון לפי:
                </h2>
                <div className="col-xl-2 col-lg-3 col-md-3 col-12">
                  <Select
                    onChange={this.handleSelectChange}
                    value={cat.find((item) => item.value == cat.value)}
                    name="prodCat"
                    className="mt-1"
                    error={this.state.errors}
                    options={cat}
                    placeholder="מחיר"
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primar75: "rgb(246, 213, 206)",
                        primar50: "rgb(246, 213, 206)",
                        primary25: "rgb(246, 213, 206,0.5)",
                        primary: "rgb(246, 213, 206)",
                      },
                      color: "rgb(246, 213, 206)",
                    })}
                  />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-3 col-12 ">
                  <Select
                    onChange={this.handleSelectSecChange}
                    value={catSec.find((item) => item.value == catSec.value)}
                    name="prodCat"
                    className="mt-1"
                    error={this.state.errors}
                    options={catSec}
                    placeholder="סוג תכשיט"
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
                <>
                  <div className="row">
                    {prods.length > 0 &&
                      prods.map((prod) => (
                        <Prod
                          key={prod._id}
                          prod={prod}
                          addToCart={() => this.handleAddToCart(prod)}
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
                        <i>אין מוצרים במלאי כרגע</i>
                      </p>
                    )}
                  </div>
                  <div className="row">
                    <div className="col text-center">
                      {this.state.arrPage.map((num) => (
                        <button
                          className="btn btn-outline-danger mb-3 ml-2"
                          active="pup"
                          key={num}
                          onClick={() => this.handlePage({ num })}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              }
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default WomanProds;
