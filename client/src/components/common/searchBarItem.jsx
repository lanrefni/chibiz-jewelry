import { Link } from "react-router-dom";

const SearchBarItem = ({ prod }) => {
  return (
    <Link to={`/prodDetails/${prod._id}`}>
      <li className="suggestion mt-1">
        <div className="suggestion__text d-flex flex-row flex-row-reverse">
          <img
            src={prod.prodImage}
            style={{ width: "60px", height: "60px" }}
            className="img-thumbnail mt-3 ml-2"
          />
          <div
            className="mt-4 mr-1 suggestion__title"
            style={{ fontSize: "1em", lineHeight: "1" }}
          >
            {prod.prodName}
          </div>
        </div>
      </li>
    </Link>
  );
};
export default SearchBarItem;
