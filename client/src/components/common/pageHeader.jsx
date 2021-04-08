import "../../style/pageHeader.scss";

const PageHeader = ({ titleText, img }) => {
  return (
    <div className="row mb-4">
      <img src={img} alt={img} style={{ width: "100%", height: "280px" }} />
      <h1
        className="position-relative mr-2 text-black px-3 headerText"
        style={{
          top: "-90px",
          fontSize: "4rem",
          backgroundColor: "rgba(255,255,255,0.5)",
        }}
      >
        {titleText}
      </h1>
    </div>
  );
};

export default PageHeader;
