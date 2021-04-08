import "../../style/searchBar.scss";
import SearchBarItem from "./searchBarItem";
const SearchBar = ({ handleSearchChange, prods }) => {
  return (
    <div className="fullstacks light">
      <div className="container">
        <div className="input-group">
          <input
            type="text"
            className="input"
            placeholder="חיפוש"
            required
            onChange={(e) => handleSearchChange(e)}
          />
          <svg className="search-icon">
            <use href="#search-symbol"></use>
          </svg>

          <ul className="suggestions">
            {prods.length > 0 &&
              prods.map((prod) => <SearchBarItem key={prod._id} prod={prod} />)}

            {prods.length === 0 && (
              <li className="suggestion">
                <p className="resNotFound">...לא נמצאו תוצאות</p>
              </li>
            )}
          </ul>
        </div>
        <svg style={{ display: "none" }}>
          <symbol id="search-symbol" viewBox="0 0 20 20">
            <path d="M19.129,18.164l-4.518-4.52c1.152-1.373,1.852-3.143,1.852-5.077c0-4.361-3.535-7.896-7.896-7.896 c-4.361,0-7.896,3.535-7.896,7.896s3.535,7.896,7.896,7.896c1.934,0,3.705-0.698,5.078-1.853l4.52,4.519 c0.266,0.268,0.699,0.268,0.965,0C19.396,18.863,19.396,18.431,19.129,18.164z M8.567,15.028c-3.568,0-6.461-2.893-6.461-6.461 s2.893-6.461,6.461-6.461c3.568,0,6.46,2.893,6.46,6.461S12.135,15.028,8.567,15.028z"></path>
          </symbol>
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
