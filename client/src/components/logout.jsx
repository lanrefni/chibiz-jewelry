import { Component } from "react";
import userService from "../services/userService";
class Logout extends Component {
  state = {};
  /* Logout */
  componentDidMount() {
    userService.logOut();
    window.location = "/";
  }
  render() {
    return null;
  }
}

export default Logout;
