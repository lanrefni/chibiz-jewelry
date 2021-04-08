import PageHeader from "./common/pageHeader";
import woman from "../images/forWomanHomePage.jpg";
import { Link } from "react-router-dom";
import men from "../images/forMenHomePage.jpg";
import "../style/homePage.scss";
import Prod from "./common/prod";

const Home = () => {
  return (
    <div className="container">
      <div className="row mt-4 d-flex justify-content-center">
        <div className="wrapper">
          <Link to="/men" className="linkText">
            <img
              src={men}
              alt=""
              className="shadow img-responsive homePic p-0 col-sm-12 col-lg-6 ml-4 col-md-12 col-xs-12"
              style={{ maxWidth: "700px" }}
            />
            <h1
              className="position-relative text-center text-white h1Home"
              style={{ top: "-50px" }}
            >
              תכשיטים לגבר
            </h1>
          </Link>
        </div>
        <div className="wrapper">
          <Link to="/woman" className="linkText">
            <img
              src={woman}
              alt=""
              className="shadow img-responsive homePic shadow img-responsive homePic p-0 col-sm-12 col-lg-6 col-md-12 col-xs-12"
              style={{ maxWidth: "700px" }}
            />
            <h1
              className="position-relative text-center h1Home"
              style={{ top: "-50px" }}
            >
              תכשיטים לאישה
            </h1>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
