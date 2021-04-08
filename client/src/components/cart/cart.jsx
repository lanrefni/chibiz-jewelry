import React, { Component } from "react";
import CartItem from "./cartItem";
import prodService from "../../services/prodService";
import { Link } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import userService from "../../services/userService";
import "../../style/cart.scss";

class Cart extends Component {
  state = {
    tempCartItems: [],
    user: null,
    finalCartItems: [],
    total: 0,
  };
  async componentDidMount() {
    await this.setDataFromLocalStroage();
    await this.setUserData();
  }
  /* User Info from db */
  async setUserData() {
    const user = await userService.getCurrentUser();
    if (!user) {
      return null;
    }
    const userInfo = await userService.getUserInfo();
    this.setState({ user: userInfo });
  }
  /* set data to cart */
  async setDataFromLocalStroage() {
    let { tempCartItems } = this.state;
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart) return;
    for (let key in cart) {
      tempCartItems.push(Object.assign({ qty: cart[key] }, { id: key }));
    }
    let tempArrInLoop = [];
    tempCartItems.map(async (prod) => {
      let { data } = await prodService.getOneProd(prod.id);
      let total = this.state.total;
      tempArrInLoop.push(data);
      data.prodQty = prod.qty;
      total = total + data.prodQty * data.prodPrice;
      this.setState({ finalCartItems: tempArrInLoop, total: total });
    });
  }
  /* remove from cart */
  removeFromCart = (prod) => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let newCart = cart;
    let prodId = prod._id;
    delete newCart[prodId];
    let total = this.state.total;
    total = total - prod.prodQty * prod.prodPrice;
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(newCart));
    let filterItems = this.state.finalCartItems.filter(
      (item) => item._id !== prod._id
    );
    this.setState({ finalCartItems: filterItems, total: total });
  };
  /* handle quantity change */
  handleQtyChange = (e, product) => {
    const { finalCartItems, total } = this.state;
    let tempArr = [...finalCartItems];
    let totalTemp = 0;
    tempArr.map((item) => {
      if (item._id === product._id) {
        let cart = localStorage.getItem("cart")
          ? JSON.parse(localStorage.getItem("cart"))
          : {};
        let id = product._id.toString();
        cart[id] = cart[id] ? cart[id] : 0;
        let qty = e.target.value;
        if (product.quantity < qty) {
          cart[id] = product.qty;
        } else {
          cart[id] = qty;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        item.prodQty = e.target.value;
        if (item.prodQty < 1) {
          return;
        }
        totalTemp += item.prodQty * item.prodPrice;
      } else {
        totalTemp += item.prodQty * item.prodPrice;
      }
    });
    this.setState({ finalCartItems: tempArr, total: totalTemp });
  };
  handleSubmitPayment(e) {
    e.preventDefault();
  }
  render() {
    const { finalCartItems, total, user } = this.state;
    return (
      <div className="container">
        <>
          <div className="row">
            <div className="mx-auto mt-4 table-responsive-md">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <Link className="btn btn-secondary mb-2 text-white" to="/">
                      חזרה לחנות
                      <span className="fa fa-arrow-alt-circle-right mr-2"></span>
                    </Link>
                  </tr>
                  <tr scope="row">
                    <th scope="col">פריט</th>
                    <th scope="col">כמות</th>
                    <th scope="col" className="text-center">
                      מחיר
                    </th>
                    <th scope="col" className="text-center">
                      סה"כ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {finalCartItems.length > 0 &&
                    finalCartItems.map((prod) => (
                      <CartItem
                        key={prod._id}
                        prod={prod}
                        onDelete={() => {
                          if (
                            window.confirm(
                              "האם אתה בטוח שברצונך למחוק מוצר זה מעגלת הקניות?"
                            )
                          )
                            this.removeFromCart(prod);
                        }}
                        onQtyChange={(e) => this.handleQtyChange(e, prod)}
                      />
                    ))}
                  {finalCartItems.length === 0 && (
                    <tr>
                      <td>
                        <p
                          className="ml-3 text-muted"
                          style={{ fontSize: "1.5em" }}
                        >
                          <i>אין מוצרים בעגלה </i>
                        </p>
                      </td>
                    </tr>
                  )}
                  {finalCartItems.length > 0 && (
                    <>
                      <tr>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td className="mt-3">
                          <h4>סה"כ לתשלום</h4>
                        </td>
                        <td className="text-right">
                          <h3 className="mt-3">
                            <strong>{total}.00₪</strong>
                          </h3>
                        </td>
                      </tr>
                      <tr>
                        <td> </td>
                        <td> </td>
                        <td colSpan="2"></td>
                        {user && (
                          <td className="d-flex justify-content-center">
                            <StripeCheckout
                              stripeKey="pk_test_4TbuO6qAW2XPuce1Q6ywrGP200NrDZ2233"
                              label="לתשלום באשראי"
                              amount={total * 100}
                              description={`סה"כ לתשלום ₪${total}.00`}
                              currency="ILS"
                              name="CHIBIZ JEWELRY"
                              billingAddress
                              shippingAddress
                            />
                          </td>
                        )}
                        {user === null && (
                          <td className="d-flex justify-content-center">
                            <Link
                              to="/signin"
                              className="btn btn-info text-white"
                            >
                              התחבר לתשלום
                            </Link>
                          </td>
                        )}
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
        {finalCartItems.length > 0 && (
          <div className="test-warning my-4">
            *אנא השתמש בכרטיס האשראי הבא לבדיקת תשלום"
            <br />
            4242 4242 4242 4242 - Exp: 10/21 - CVV: 123
          </div>
        )}
      </div>
    );
  }
}

export default Cart;

/*       <div>
        <div className="container mt-4">
          <h3>Shopping Cart</h3>
          <div className="asds">
            <div className="asd">
              <div className="ppp">
                {finalCartItems.map((prod) => (
                  <CartItem key={prod.id} prod={prod} />
                ))}
              </div>
              {finalCartItems.length && (
                <div className="alert alert-info">Cart is empty</div>
              )}
              <div className="">Total:</div>
            </div>
          </div>
        </div>
      </div> */
