import Form from "./common/form";
import Joi from "joi-browser";
import PageHeader from "./common/pageHeader";
import userService from "../services/userService";
import { Link, Redirect } from "react-router-dom";
import PageTitle from "./common/pageTitle";
class Signin extends Form {
  state = {
    data: {
      email: "",
      password: "",
    },
    errors: {},
  };
  async doSubmit() {
    const { email, password } = this.state.data;
    try {
      await userService.login(email, password);
      const { state: locationState } = this.props.location;
      window.location =
        locationState && locationState.from ? locationState.from.pathname : "/";
    } catch (err) {
      this.setState({ errors: { error: err.response.data } });
    }
  }
  schema = {
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(6).label("Password"),
  };

  render() {
    if (userService.getCurrentUser()) {
      return <Redirect to="/" />;
    }
    const error = this.state.errors.error;
    return (
      <div className="container">
        <PageTitle titleText="התחבר" className="mb-3" />
        <div className="row">
          <div className="col-lg-6">
            <form
              style={{ fontSize: "1.2em" }}
              noValidate
              onSubmit={this.handleSubmit}
            >
              {this.renderInput("email", "אימייל", "email")}
              {this.renderInput("password", "סיסמא", "password")}

              {error && (
                <span className="text-danger mb-2">
                  שם משתמש או סיסמא שגויים
                </span>
              )}
              {this.renderButton("התחבר", "btn btn-dark form-control mt-3")}
            </form>
            <div className="mt-4">
              <span style={{ fontSize: "1.5em" }}>
                לקוח חדש? לחץ כאן להרשמה לאתר
              </span>
              <Link
                to="/signup"
                className="btn btn-secondary text-white form-control mt-2"
              >
                הירשם
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Signin;
