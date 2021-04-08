import PageHeader from "./common/pageHeader";
import React, { Component } from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import http from "../services/http";
import { apiUrl } from "../config.json";
import { toast } from "react-toastify";
import userService from "../services/userService";
import { Link, Redirect } from "react-router-dom";
import PageTitle from "./common/pageTitle";

class AccSettings extends Form {
  state = {
    data: {
      email: "",
      password: "",
      name: "",
      _id: "",
      admin: false,
    },
    errors: {},
  };
  schema = {
    _id: Joi.string(),
    admin: Joi.boolean(),
    email: Joi.string().required().email().label("Email"),
    name: Joi.string().required().min(2).label("Name"),
  };

  async componentDidMount() {
    await this.setDataFromServer();
  }
  /* set user info */
  async setDataFromServer() {
    const data = await userService.getUserInfo();
    this.setState({ data: this.InsertInfo(data) });
  }
  InsertInfo(user) {
    return {
      email: user.email,
      name: user.name,
      _id: user._id,
      admin: user.admin,
    };
  }
  async doSubmit() {
    const { data } = this.state;
    await userService.updateOneUser(data);
    this.setDataFromServer();
    toast("Account settings has been updated Successfuly!");
    this.props.history.replace("/");
  }
  render() {
    return (
      <div className="container">
        <PageTitle titleText="הגדרות חשבון" />
        <div className="row">
          <div className="col-lg-6">
            <form noValidate onSubmit={this.handleSubmit}>
              {this.renderInput("email", "אימייל", "email")}
              {this.renderInput("name", "שם מלא")}
              {this.renderButton("עדכן פרטים", "btn btn-success ml-2")}
              {this.state.data.admin !== false && (
                <Link
                  to="/my-prods"
                  className="btn btn-secondary ml-2 text-white"
                >
                  לרשימת המוצרים בחנות
                </Link>
              )}
              <Link
                to={`/passChange/${this.state.data._id}`}
                className="btn btn-warning ml-2"
              >
                שינוי סיסמא
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default AccSettings;
