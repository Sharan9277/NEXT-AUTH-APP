import PropTypes from "prop-types";

const Component3 = ({ className = "", variant = 1, text = "03:30" }) => {
  return (
    <div
      className={`self-stretch rounded-[8px] flex flex-row items-center justify-center py-[9px] px-[22.6px] text-center text-[16px] text-[#6a697c] font-[Figtree] data-[variant='1']:py-[9px] data-[variant='1']:px-[20.8px] [&_.text]:data-[variant='1']:text-[#121117] [&_.text]:data-[variant='1']:[text-decoration:underline] [&_.text]:data-[variant='1']:font-semibold ${className}`}
      data-variant={variant}
    >
      <div className="text flex-1 relative leading-[22px]">{text}</div>
    </div>
  );
};

Component3.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,

  /** Variant props */
  variant: PropTypes.number,
};

export default Component3;
