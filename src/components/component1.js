import Image from "next/image";
import PropTypes from "prop-types";

const Component1 = ({ className = "", variant = 1, component1 }) => {
  return (
    <div
      className={`w-[40px] h-[40px] rounded-[8px] flex flex-row items-center justify-center p-[8px] box-border min-h-[40px] ${className}`}
      data-variant={variant}
    >
      <Image
        className="h-[24px] w-[24px] relative"
        loading="lazy"
        width={24}
        height={24}
        alt=""
        src={component1}
      />
    </div>
  );
};

Component1.propTypes = {
  className: PropTypes.string,
  component1: PropTypes.string.isRequired,

  /** Variant props */
  variant: PropTypes.number,
};

export default Component1;
