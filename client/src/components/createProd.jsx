import PageHeader from "./common/pageHeader";
import React from "react";
import Select from "react-select";
import Form from "./common/form";
import Joi from "joi-browser";
import userService from "../services/userService";
import { Redirect } from "react-router-dom";
import prodService from "../services/prodService";
import { toast } from "react-toastify";
import "../style/prod.scss";
import PageTitle from "./common/pageTitle";
class CreateProd extends Form {
  state = {
    data: {
      prodName: "",
      prodDescription: "",
      prodPrice: "",
      prodImage: "",
      prodStock: "",
      prodCat: "",
      prodCatSecondary: "",
    },
    errors: {},
  };
  async doSubmit() {
    const { prodImage, ...data } = this.state.data;
    if (prodImage) {
      data.prodImage = prodImage;
    }
    await prodService.createProd(data);
    toast("A new product is opened");
    this.props.history.replace(`/${data.prodCat}`);
  }
  schema = {
    prodName: Joi.string().min(2).max(255).required().label("Product Name"),
    prodDescription: Joi.string()
      .min(2)
      .max(1024)
      .required()
      .label("Product Description"),
    prodPrice: Joi.string().min(1).max(10).required().label("Product Price"),
    prodImage: Joi.string().min(11).max(1024).uri().label("Product Image"),
    prodStock: Joi.string().min(1).required(),
    prodCat: Joi.string().required(),
    prodCatSecondary: Joi.string().required(),
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
        <PageTitle titleText="טופס יצירת מוצר" />
        <div className="row">
          <div className="col-12">
            <p style={{ fontSize: "1.3em" }}>צור מוצר חדש </p>
          </div>
        </div>
        <div className="row overflowVisible">
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
              {this.renderButton(
                "צור מוצר חדש",
                "btn btn-secondary form-control mt-3 mb-4"
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateProd;
