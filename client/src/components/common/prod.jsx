import React from "react";
import { Link } from "react-router-dom";
import "../../style/prod.scss";

const styleIcon = {
  position: "absolute",
  top: "15px",
  left: "15px",
  fontSize: "1.2em",
};
const Prod = ({
  prod: {
    _id,
    prodPrice,
    prodDescription,
    prodImage,
    prodName,
    prodStock,
    prodCat,
    prodCatSecondary,
  },
  onDelete,
  admin,
  addToCart,
}) => {
  return (
    <div
      className="col-sm-12 col-xs-10 col-md-4 col-lg-3 mt-3 mb-4"
      style={{ direction: "rtl" }}
    >
      <div className="card" style={{ width: "100%" }}>
        <Link to={`/prodDetails/${_id}`}>
          <img
            className="mx-auto img-rounded cart-img"
            src={prodImage}
            style={{ width: "100%" }}
            alt={prodName}
          />
        </Link>
        <div
          className="text-center soldOutDiv mr-2 mb-2"
          style={{ fontSize: "1em", fontWeight: "bold" }}
        >
          {/*           {prodStock > 0 && <span className="text-success"> במלאי </span>} */}
          {prodStock == 0 && <span className="text-danger"> SOLD OUT </span>}
        </div>
        <div className="mt-3 prod-details-header">
          <h5 className="text-center mb-0 bold" style={{ fontSize: "1.3em" }}>
            {prodName}
          </h5>
          <div className="text-center mb-2">
            <span style={{ fontSize: "1.2em" }}>₪</span>
            <span style={{ fontSize: "1em" }}>{prodPrice}</span>
          </div>
        </div>
        {/*           <p className="card-text text-center" style={{ fontSize: "1em" }}>
            {prodDescription}
          </p> */}

        {prodStock > 0 && admin != true && (
          <button
            onClick={addToCart}
            className="btn btn-dark form-control add-cart"
          >
            הוספה לסל
          </button>
        )}
        {prodStock == 0 && (
          <Link to={`/prodDetails/${_id}`}>
            <button className="btn btn-dark form-control add-cart">
              לצפיה בפריט
            </button>
          </Link>
        )}
        <div>
          {admin === true && (
            <div className="justify-content-between d-flex">
              <Link
                className="text-white btn btn-secondary"
                to={`/my-prods/edit/${_id}`}
              >
                ערוך
              </Link>
              <button
                className="text-white btn btn-danger mr-1"
                onClick={onDelete}
              >
                מחק
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prod;

{
  /* <article className="col-3 article mx-2">
  <img className="sale" alt="New" />
  <div className="prev">
    <a href="#">
      <img src={{ prodImage }} alt="Product 3" title="" />
    </a>
  </div>

  <h3 className="title">Emerald Cut Emerald Ring</h3>
  <div className="cart">
    <div className="price" style={{ left: "60px", textAlign: "center" }}>
      <div className="vert">
        $550.00
        <div className="price_old">$725.00</div>
      </div>
    </div>
    <a href="#" className="compare" style={{ left: "220px" }}></a>
    <a href="#" className="wishlist" style={{ left: "244px" }}></a>
    <a
      href="#"
      className="bay"
      style={{ transform: " rotate(0deg)", opacity: "0" }}
    >
      <img src={{ prodImage }} alt="Buy" title="" />
    </a>
  </div>
</article> */
}
