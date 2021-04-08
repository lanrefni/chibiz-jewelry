import { Route, Switch } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import Home from "./components/home";
import Signup from "./components/signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "pretty-checkbox/dist/pretty-checkbox.min.css";
import Signin from "./components/signin";
import { Component } from "react";
import userService from "./services/userService";
import logout from "./components/logout";
import CreateProd from "./components/createProd";
import ProtectedRoute from "./components/common/protectedRoute";
import MyProds from "./components/myProds";
import EditProd from "./components/editProd";
import AccSettings from "./components/accSettings";
import PassowrdChange from "./components/common/passwordChange";
import MenProds from "./components/menProds";
import WomanProds from "./components/womanProds";
import ProdDetails from "./components/prodDetails";
import Cart from "./components/cart/cart";
import prodService from "./services/prodService";

class App extends Component {
  state = {
    user: null,
    userInfo: null,
    prods: [],
    cartQty: 0,
    prod: {},
  };

  async componentDidMount() {
    const user = userService.getCurrentUser();
    if (!user) {
      return null;
    }

    const userInfo = await userService.getUserInfo();
    this.setState({ user, userInfo });
    const EXPIRE_TIME = 1000 * 60 * 60 * 48;
    let userData = JSON.parse(localStorage.getItem("expireTime")) || {};
    let diff = new Date() - new Date(userData.time || new Date());
    console.log(diff);
    let timeout = Math.max(EXPIRE_TIME - diff, 0);

    setTimeout(function () {
      localStorage.removeItem("token");
      localStorage.removeItem("expireTime");
      window.location = "/";
      alert("token expired, try to login again");
    }, timeout);
  }
  /* handle search on navbar */
  async handleSearch(e) {
    const { data } = await prodService.searchProds(e.target.value);
    await this.setState({ prods: data });
  }

  render() {
    const { user, userInfo, cartQty, prods } = this.state;
    return (
      <div className="d-flex flex-column min-vh-100">
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <header>
          <Navbar
            user={user}
            user={userInfo}
            cartQty={cartQty}
            key={cartQty}
            prods={prods}
            handleSearchChange={(e) => this.handleSearch(e)}
          />
        </header>
        <main className="flex-fill container-fluid">
          <Switch>
            <ProtectedRoute path="/passChange/:id" component={PassowrdChange} />
            <ProtectedRoute path="/me/:id" component={AccSettings} />
            <ProtectedRoute
              path="/my-prods/edit/:id"
              component={EditProd}
              admin={true}
            />
            <ProtectedRoute
              path="/create-prod"
              component={CreateProd}
              admin={true}
            />
            <ProtectedRoute path="/my-prods" component={MyProds} admin={true} />
            <Route path="/prodDetails/:id" component={ProdDetails} />
            <Route path="/cart" component={Cart} />
            <Route path="/men" component={MenProds} />
            <Route path="/woman" component={WomanProds} />
            <Route path="/signin" component={Signin} />
            <Route path="/logout" component={logout} />
            <Route path="/signup" component={Signup} />
            <Route path="/" component={Home} exact />
          </Switch>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }
}

export default App;
