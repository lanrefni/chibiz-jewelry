import "../../style/pageHeader.scss";

const PageTitle = ({ titleText }) => {
  return (
    <div className="row mb-1 mt-4 p-0">
      <h1
        className="position-relative text-black px-3 headerText"
        style={{
          fontSize: "4rem",
        }}
      >
        {titleText}
      </h1>
    </div>
  );
};

export default PageTitle;
