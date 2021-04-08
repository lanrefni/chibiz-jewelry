import React from "react";
import { Link } from "react-router-dom";
import "../../style/cartItem.scss";

const CartItem = ({
  prod: {
    _id,
    prodPrice,
    prodDescription,
    prodStock,
    prodImage,
    prodName,
    prodCat,
    prodCatSecondary,
    prodQty,
  },
  onQtyChange,
  onDelete,
}) => {
  return (
    <>
      <tr>
        <td className="col-sm-8 col-md-6">
          <div className="media">
            <Link to={`/prodDetails/${_id}`}>
              <img
                alt={prodName}
                className="thumbnail mt-1"
                src={prodImage}
                style={{ width: "120px", maxHeight: "120px" }}
              />
            </Link>
            <div className="media-body mr-4">
              <h4 className="media-heading">
                <Link to={`/prodDetails/${_id}`}> {prodName}</Link>
              </h4>
              <span>סטטוס: </span>
              <span>
                {prodStock == 0 && (
                  <span className="text-danger"> אזל מהמלאי </span>
                )}
                {prodStock > 0 && <span className="text-success"> במלאי </span>}
              </span>
            </div>
          </div>
        </td>
        <td className="col-sm-1 col-md-1" style={{ textAlign: "center" }}>
          <select
            className="form-control"
            value={prodQty}
            style={{ minWidth: "70px" }}
            onChange={onQtyChange}
          >
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
          </select>
        </td>
        <td className="col-sm-1 col-md-1 text-center">
          <strong>{prodPrice}₪</strong>
        </td>
        <td className="col-sm-1 col-md-1 text-center">
          <strong>{prodPrice * prodQty}.00₪</strong>
        </td>
        <td className="col-sm-1 col-md-1">
          <button onClick={onDelete} type="button" className="btn btn-danger">
            הסר מהעגלה
          </button>
        </td>
      </tr>

      {/*-------------------------  */}
    </>
  );
};

export default CartItem;
