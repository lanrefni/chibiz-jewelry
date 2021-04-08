import PageHeader from "./common/pageHeader";
import React, { Component } from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import http from "../services/http";
import { apiUrl } from "../config.json";
import { toast } from "react-toastify";
import userService from "../services/userService";
import { Redirect } from "react-router-dom";
import PageTitle from "./common/pageTitle";

class SignupMain extends Form {
  state = {
    data: {
      email: "",
      password: "",
      name: "",
    },
    errors: {},
  };
  schema = {
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(6).label("Password"),
    name: Joi.string().required().min(2).label("Name"),
  };

  async doSubmit() {
    const { data } = this.state;
    try {
      await http.post(`${apiUrl}/users`, data);
      toast("✅ Signed up successfuly", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      this.props.history.replace("/signin");
      //redirect to signIN
    } catch (err) {
      if (err.response && err.response.status === 400)
        this.setState({ errors: { email: "Email is already taken" } });
    }
  }
  render() {
    if (userService.getCurrentUser()) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <PageTitle titleText="הירשם" className="mb-3" />
        <div className="row">
          <div className="col-lg-6">
            <form noValidate onSubmit={this.handleSubmit}>
              {this.renderInput("email", "אימייל", "email")}
              {this.renderInput("password", "סיסמא", "password")}
              {this.renderInput("name", "שם מלא")}
              {this.renderButton("הירשם", "btn btn-dark form-control mt-2")}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupMain;
