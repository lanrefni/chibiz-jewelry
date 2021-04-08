import React, { Component } from "react";
import prodService from "../services/prodService";
import { toast } from "react-toastify";
import userService from "../services/userService";
import "../style/prodDetails.scss";
import { Link } from "react-router-dom";

class ProdDetails extends Component {
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
    user: {},
    cartItems: [],
    cartQty: 0,
  };

  async componentDidMount() {
    const id = this.props.match.params.id;
    const { data } = await prodService.getOneProd(id);
    this.setState({ data: this.InsertInfo(data) });
    const user = await userService.getCurrentUser();
    if (!user) {
      return null;
    }
    const userInfo = await userService.getUserInfo();
    this.setState({ user: userInfo });
  }
  /* insert prod details */
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
  async componentDidUpdate() {
    const id = this.props.match.params.id;
    if (this.props.match.params.id != this.state.data._id) {
      const { data } = await prodService.getOneProd(id);
      this.setState({ data: this.InsertInfo(data) });
    }
  }
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
    window.scroll(0, window.pageYOffset);
  };
  /* set cart quantity */
  setCartQtyFromLocalStorage = () => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart) return;
    let res = Object.keys(cart).length;
    this.setState({ cartQty: res });
  };

  render() {
    const {
      prodCat,
      prodCatSecondary,
      prodDescription,
      prodImage,
      prodName,
      prodPrice,
      prodService,
      prodStock,
      ProdDetails,
      _id,
    } = this.state.data;
    const containerStyle = {
      maxWidth: "1100px !important",
    };
    const { user } = this.state;
    return (
      <>
        <div style={containerStyle} className="container mt-4">
          <div className="row justify-content-center">
            <div className="ml-4">
              <img
                src={`${prodImage}`}
                className="img shadow card-img mb-4"
                id="prodImage"
                style={{ maxWidth: "500px", width: "400px" }}
              />
            </div>
            <div className="col-xs-4 col-sm-8 col-lg-4">
              <article className=" m-0 pt-0 pl-5">
                <h3 className="title text-uppercase">{prodName}</h3>
                <div className="rating">
                  <div className="stars">
                    <span className="fa fa-star checked"></span>
                    <span className="fa fa-star checked"></span>
                    <span className="fa fa-star checked"></span>
                    <span className="fa fa-star"></span>
                    <span className="fa fa-star"></span>
                    <span className="ml-2">
                      ({Math.floor(Math.random() * 3 * 100)} דירוגים)
                    </span>
                  </div>
                </div>
                <div className="mb-3 mt-3">
                  {prodStock > 0 && <span className="text-success">במלאי</span>}
                  {prodStock <= 0 && (
                    <span className="text-danger">אזל מהמלאי</span>
                  )}
                </div>
                <div className="mb-3 mt-3">
                  <span className="price-title">מחיר : {prodPrice}</span>
                  <span>₪</span>
                </div>
                <hr
                  style={{
                    borderWidth: "1px",
                    backgroundColor: "black",
                  }}
                />
                <span>תיאור</span>
                <p>{prodDescription}</p>
              </article>
              <div className="row">
                <div className="col-6 mt-4">
                  {prodStock > 0 && user.admin !== true && (
                    <button
                      className="btn btn-dark form-control"
                      onClick={() => this.handleAddToCart(this.state.data)}
                    >
                      הוספה לסל
                    </button>
                  )}
                  {user.admin === true && (
                    <Link
                      className="text-white btn btn-dark form-control"
                      to={`/my-prods/edit/${_id}`}
                    >
                      ערוך מוצר{" "}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ProdDetails;
/*  <span>Quantity: </span>
                  <select className="form-control form-control-sm">
                    <option> 1 </option>
                    <option> 2 </option>
                    <option> 3 </option>
                    <option> 4 </option>
                    <option> 5 </option>
                    <option> 6 </option>
                    <option> 7 </option>
                    <option> 8 </option>
                    <option> 9 </option>
                    <option> 10 </option>
                  </select> */
