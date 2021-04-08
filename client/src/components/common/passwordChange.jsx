import Form from "./form";
import Joi from "joi-browser";
import PageHeader from "./pageHeader";
import userService from "../../services/userService";
import { toast } from "react-toastify";
import PageTitle from "./pageTitle";

class PassowrdChange extends Form {
  state = {
    data: {
      password: "",
      newPassword: "",
      _id: "",
    },
    errors: {},
  };
  async doSubmit() {
    const { _id, password, newPassword } = this.state.data;
    try {
      await userService.passChange(_id, password, newPassword);
      toast.success("סיסמא שונתה בהצלחה!");
    } catch (err) {
      toast.error("הסיסמא אינה נכונה, נסה שנית");
    }
  }

  schema = {
    _id: Joi.string(),
    password: Joi.string().min(6).max(1024).required(),
    newPassword: Joi.string().min(6).max(1024).required(),
  };
  async componentDidMount() {
    await this.setDataFromServer();
  }
  async setDataFromServer() {
    const data = await userService.getUserInfoWithPass();
    this.setState({ data: this.InsertInfo(data) });
  }
  InsertInfo(user) {
    return {
      _id: user._id,
    };
  }
  render() {
    return (
      <div className="container">
        <PageTitle titleText="שינוי סיסמא" />
        <div className="row">
          <div className="col-lg-6">
            <form noValidate onSubmit={this.handleSubmit}>
              {this.renderInput("password", "סיסמא ישנה", "password")}
              {this.renderInput("newPassword", "הכנס סיסמא חדשה", "password")}
              {/*               {this.renderInput("passwordConNew", "אשר סיסמא חדשה", "password")}
               */}
              {this.renderButton("שנה סיסמא", "btn btn-secondary")}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default PassowrdChange;
