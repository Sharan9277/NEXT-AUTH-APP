import Image from "next/image";
import PropTypes from "prop-types";

const Component2 = ({ className = "", variant = 1, component1 }) => {
  return (
    <div
      className={`rounded-tl-[8px] rounded-tr-[0px] rounded-br-[0px] rounded-bl-[8px] bg-[#dcdce5] border-[#dcdce5] border-solid border-t-[2px] border-b-[2px] border-l-[2px] flex flex-row items-center justify-center py-[10px] pl-[18px] pr-[16px] data-[variant='1']:rounded-tl-[0px] data-[variant='1']:rounded-tr-[8px] data-[variant='1']:rounded-br-[8px] data-[variant='1']:rounded-bl-[0px] data-[variant='1']:bg-[#fff] data-[variant='1']:[border-top:unset] data-[variant='1']:[border-bottom:unset] data-[variant='1']:[border-left:unset] data-[variant='1']:py-[10px] data-[variant='1']:px-[18px] data-[variant='1']:border-[#dcdce5] data-[variant='1']:border-solid data-[variant='1']:data-[variant='1']:border-[2px] ${className}`}
      data-variant={variant}
    >
      <div className="h-[24px] w-[24px] flex flex-col items-start justify-start min-w-[24px] max-w-[24px]">
        <Image
          className="self-stretch h-[24px] relative max-w-full overflow-hidden shrink-0"
          loading="lazy"
          width={24}
          height={24}
          alt=""
          src={component1}
        />
      </div>
    </div>
  );
};

Component2.propTypes = {
  className: PropTypes.string,
  component1: PropTypes.string.isRequired,

  /** Variant props */
  variant: PropTypes.number,
};

export default Component2;
