import { Link, NavLink } from "react-router-dom";
import "../style/navbar.scss";
import logo from "../images/logo.png";
import useSticky from "./common/useSticky";
import SearchBar from "./common/searchBar";

const Navbar = ({ user, handleSearchChange, prods }) => {
  const isSticky = useSticky();
  let cart = JSON.parse(localStorage.getItem("cart"));

  let res = "";
  if (!cart) {
    res = 0;
  } else {
    res = Object.keys(cart).length;
  }

  return (
    <>
      <div className="topNavBarDelivery">
        <p className="position-absolute ptext">
          * משלוחים חינם למזמינים מעל ₪250 *
        </p>
      </div>
      <nav
        id="navbarNav"
        className={
          isSticky
            ? "sticky navbar navbar-expand-lg navbarBgc"
            : "navbar navbar-expand-lg navbarBgc shadow"
        }
      >
        <button
          className="navbar-toggler ml-auto"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link
          to="/"
          className="brandMobile"
          data-toggle="collapse"
          data-target=".navbar-collapse.show"
        >
          <img src={logo} alt="Logo" style={{ width: "100%" }} />
        </Link>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/cart"
                data-toggle="collapse"
                data-target=".navbar-collapse.show"
              >
                <span className="cart-items">{res ? res : 0}</span>
                <i
                  className="fas fa-shopping-cart"
                  style={{ fontSize: "1.3em " }}
                ></i>
              </NavLink>
            </li>
            <li className="nav-item">
              <SearchBar
                handleSearchChange={(e) => handleSearchChange(e)}
                prods={prods}
              ></SearchBar>
            </li>
            {user && user.admin && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/my-prods"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show"
                  >
                    רשימת המוצרים
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/create-prod"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show"
                  >
                    צור מוצר חדש
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <ul className="nav navbar-nav abs-center-x">
            <li className="nav-item ">
              <NavLink
                className="nav-link"
                to="/men"
                data-toggle="collapse"
                data-target=".navbar-collapse.show"
              >
                תכשיטי גברים
              </NavLink>
            </li>
            <li className="nav-item">
              <Link
                to="/"
                className="navbar-brand mr-0"
                data-toggle="collapse"
                data-target=".navbar-collapse.show"
              >
                <img src={logo} alt="Logo" className="" />
              </Link>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/woman"
                data-toggle="collapse"
                data-target=".navbar-collapse.show"
              >
                תכשיטי נשים
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav nav ml-auto">
            {!user && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/signin"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show"
                  >
                    <i className="fas fa-sign-in-alt mr-1"></i> התחבר
                  </NavLink>
                </li>
              </>
            )}
            {user && (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="mr-2">
                      {user.name} {user.admin ? `(Admin)` : ``}
                    </span>
                    <i className="fas fa-angle-down"></i>
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink"
                    style={{ direction: "rtl", textAlign: "right" }}
                  >
                    <NavLink
                      className="dropdown-item"
                      to={`/me/${user._id}`}
                      data-toggle="collapse"
                      data-target=".navbar-collapse.show"
                    >
                      הגדרות חשבון
                    </NavLink>
                    {user && user.admin && (
                      <>
                        <NavLink
                          className="dropdown-item"
                          to="/my-prods"
                          data-toggle="collapse"
                          data-target=".navbar-collapse.show"
                        >
                          רשימת המוצרים בחנות
                        </NavLink>
                        <NavLink
                          className="dropdown-item"
                          to="/create-prod"
                          data-toggle="collapse"
                          data-target=".navbar-collapse.show"
                        >
                          הוסף מוצר חדש
                        </NavLink>
                      </>
                    )}
                    {/* TODO USER INFO */}
                  </div>
                </li>
                <li className="nav-item ml-3">
                  <NavLink
                    to="/logout"
                    className="nav-link"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show"
                  >
                    <i className="fas fa-sign-out-alt mr-1"></i>התנתק
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <div className="menu-overlay"></div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
