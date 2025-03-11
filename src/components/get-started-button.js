import PropTypes from "prop-types";

const GetStartedButton = ({ className = "", property1 = "Inactive" }) => {
  return (
    <button
      className={`cursor-pointer border-[#ed6c43] border-solid border-[1px] py-[10px] px-[14px] bg-[#ed6c43] shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] rounded-[8px] overflow-hidden flex flex-row items-center justify-center ${className}`}
      data-property1={property1}
    >
      <div className="relative text-[16px] leading-[24px] font-semibold font-inter text-[#fcfcfc] text-left">
        Got an Assignment?
      </div>
    </button>
  );
};

GetStartedButton.propTypes = {
  className: PropTypes.string,

  /** Variant props */
  property1: PropTypes.number,
};

export default GetStartedButton;
