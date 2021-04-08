import PageHeader from "./common/pageHeader";
import React from "react";
import Select from "react-select";
import Form from "./common/form";
import Joi from "joi-browser";
import userService from "../services/userService";
import { Link, Redirect } from "react-router-dom";
import prodService from "../services/prodService";
import { toast } from "react-toastify";
import PageTitle from "./common/pageTitle";

class EditProd extends Form {
  state = {
    data: {
      prodName: "",
      prodDescription: "",
      prodPrice: "",
      prodImage: "",
      prodStock: "",
      prodCat: "",
      prodCatSecondary: "",
      _id: "",
    },
    errors: {},
  };
  schema = {
    _id: Joi.string(),
    prodName: Joi.string().min(2).max(255).required().label("Product Name"),
    prodDescription: Joi.string()
      .min(2)
      .max(1024)
      .required()
      .label("Product Description"),
    prodPrice: Joi.string().min(1).max(10).required().label("Product Price"),
    prodImage: Joi.string()
      .min(11)
      .max(1024)
      .uri()
      .allow("")
      .label("Product Image"),
    prodStock: Joi.string().min(1).required(),
    prodCat: Joi.string().required(),
    prodCatSecondary: Joi.string().required(),
  };
  async componentDidMount() {
    const id = this.props.match.params.id;
    const { data } = await prodService.getOneProd(id);
    this.setState({ data: this.InsertInfo(data) });
  }
  /* insert the prod info to edit */
  InsertInfo(prod) {
    return {
      _id: prod._id,
      prodName: prod.prodName,
      prodDescription: prod.prodDescription,
      prodPrice: prod.prodPrice,
      prodImage: prod.prodImage,
      prodStock: prod.prodStock,
      prodCat: prod.prodCat,
      prodCatSecondary: prod.prodCatSecondary,
    };
  }

  doSubmit = async () => {
    const { data } = this.state;
    await prodService.updateProd(data);
    toast("Product is Updated");
    this.props.history.goBack();
  };

  /* handle the first select changes ( men / woman) */
  handleSelectChange = async (e) => {
    await this.setState({
      data: {
        ...this.state.data,
        prodCat: e ? e.value : "",
      },
    });
  };

  /* handle the second select changes ( ring / bracelet / necklace) */
  handleSelectChangeSec = async (e) => {
    await this.setState({
      data: {
        ...this.state.data,
        prodCatSecondary: e ? e.value : "",
      },
    });
  };

  render() {
    if (!userService.getCurrentUser()) {
      return <Redirect to="/" />;
    }
    const cat = [
      { value: "men", label: "גברים" },
      { value: "woman", label: "נשים" },
    ];
    const catSec = [
      { value: "rings", label: "טבעת" },
      { value: "bracelet", label: "צמיד" },
      { value: "necklace", label: "שרשרת" },
    ];
    let { prodCat, prodCatSecondary } = this.state.data;
    return (
      <div className="container">
        <PageTitle titleText="ערוך מוצר" />
        <div className="row"></div>
        <div className="row">
          <div className="col-lg-6">
            <form noValidate onSubmit={this.handleSubmit}>
              {this.renderInput("prodName", "שם המוצר")}
              {this.renderInput("prodDescription", "תיאור המוצר")}
              {this.renderInput("prodPrice", "מחיר המוצר", "number", 1)}
              {this.renderInput("prodImage", "תמונת המוצר")}
              {this.renderInput("prodStock", "מלאי זמין", "number", 0)}
              <Select
                onChange={this.handleSelectChange}
                value={cat.find((item) => item.value === prodCat)}
                name="prodCat"
                className="mt-4"
                error={this.state.errors}
                options={cat}
                placeholder="מין"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "rgba(183, 110, 121,0.5)",
                    primary: "rgb(183, 110, 121)",
                  },
                })}
              />
              <Select
                className="mt-4 mb-4"
                onChange={this.handleSelectChangeSec}
                value={catSec.find((item) => item.value === prodCatSecondary)}
                name="prodCatSecondary"
                error={this.state.errors}
                options={catSec}
                placeholder="סוג תכשיט"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "rgba(183, 110, 121,0.5)",
                    primary: "rgb(183, 110, 121)",
                  },
                })}
              />
              {this.renderButton("עדכן", "btn btn-dark ml-2")}
              <button className="btn btn-danger ml-2">
                <Link className="text-white" to="/my-prods">
                  ביטול
                </Link>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProd;
