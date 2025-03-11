"use client";
import { useMemo } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

const MegaMenu = ({
  className = "",
  property1 = "Default",
  text,
  textTextDecoration,
  vector,
  showVectorIcon,
}) => {
  const textStyle = useMemo(() => {
    return {
      textDecoration: textTextDecoration,
    };
  }, [textTextDecoration]);

  return (
    <div
      className={`flex flex-row items-center justify-center py-[8px] px-[12px] gap-[10px] text-left text-[14px] text-[#808080] font-inter ${className}`}
      data-property1={property1}
    >
      <a
        className="[text-decoration:none] relative leading-[20px] font-semibold text-[inherit]"
        style={textStyle}
      >
        {text}
      </a>
      {showVectorIcon && (
        <Image
          className="w-[11.7px] relative h-[5.8px]"
          width={12}
          height={6}
          alt=""
          src={vector}
        />
      )}
    </div>
  );
};

MegaMenu.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  vector: PropTypes.string.isRequired,
  showVectorIcon: PropTypes.bool,

  /** Variant props */
  property1: PropTypes.number,

  /** Style props */
  textTextDecoration: PropTypes.string,
};

export default MegaMenu;
