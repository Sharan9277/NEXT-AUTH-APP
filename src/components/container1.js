import { useMemo } from "react";
import PropTypes from "prop-types";

const Container = ({
  className = "",
  prop,
  trustedAssignmentWritingService,
  atAskmeassignmentcomWePride,
  assignmentWritingServiceOur,
  highQualityPlagiarismAndAI,
  yourAcademicRequirements,
  containerMinWidth,
  borderPadding,
  containerHeight,
}) => {
  const containerStyle = useMemo(() => {
    return {
      minWidth: containerMinWidth,
    };
  }, [containerMinWidth]);

  const borderStyle = useMemo(() => {
    return {
      padding: borderPadding,
    };
  }, [borderPadding]);

  const container1Style = useMemo(() => {
    return {
      height: containerHeight,
    };
  }, [containerHeight]);

  return (
    <div
      className={`self-stretch flex-1 flex flex-row items-start justify-center py-[0px] pl-[0px] pr-[20px] box-border min-w-[416px] min-h-[1px] text-left text-[48px] text-[#fafafa] font-inter mq750:min-w-full ${className}`}
      style={containerStyle}
    >
      <div
        className="self-stretch flex-1 rounded-[7px] border-[#fafafa] border-solid border-[1px] flex flex-row items-center justify-center flex-wrap content-center py-[9px] px-[10px]"
        style={borderStyle}
      >
        <div className="flex-1 flex flex-col items-center justify-start">
          <div className="w-[598px] flex flex-row items-start justify-start max-w-[1280px] mq1275:max-w-full">
            <div className="self-stretch w-[86.9px] flex flex-row items-start justify-center min-h-[1px]">
              <div className="self-stretch flex-1 rounded-[100px] flex flex-row items-start justify-start flex-wrap content-start p-[10px]">
                <div className="flex-1 flex flex-col items-center justify-start">
                  <div className="w-[66.9px] flex flex-row items-start justify-center max-w-[1280px] mq1275:max-w-full">
                    <div className="self-stretch flex-1 rounded-[100px] bg-[#5577d1] flex flex-row items-center justify-center flex-wrap content-center py-[10px] px-[19px]">
                      <div className="flex-1 flex flex-col items-start justify-start py-[0px] px-[1px] box-border max-w-[67px]">
                        <div className="self-stretch flex flex-col items-start justify-start">
                          <b className="self-stretch relative leading-[52.8px] mq750:text-[38px] mq750:leading-[42px] mq450:text-[29px] mq450:leading-[32px]">
                            {prop}
                          </b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch w-[511px] flex flex-row items-start justify-center min-h-[1px] text-[23px] text-[#00384f]">
              <div className="self-stretch flex-1 flex flex-col items-start justify-center pt-[9.1px] px-[10px] pb-[10px]">
                <div className="self-stretch h-[37.7px] flex flex-col items-start justify-start">
                  <div className="self-stretch flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[0.9px]">
                    <b className="self-stretch relative leading-[36.8px] mq450:text-[18px] mq450:leading-[29px]">
                      {trustedAssignmentWritingService}
                    </b>
                  </div>
                </div>
                <div
                  className="self-stretch h-[110.4px] flex flex-col items-start justify-start text-[18px]"
                  style={container1Style}
                >
                  <div className="self-stretch flex flex-col items-start justify-start">
                    <div className="self-stretch relative leading-[24px]">
                      <p className="m-[0px]">{atAskmeassignmentcomWePride}</p>
                      <p className="m-[0px]">{assignmentWritingServiceOur}</p>
                      <p className="m-[0px]">{highQualityPlagiarismAndAI}</p>
                      <p className="m-[0px]">{yourAcademicRequirements}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Container.propTypes = {
  className: PropTypes.string,
  prop: PropTypes.string,
  trustedAssignmentWritingService: PropTypes.string,
  atAskmeassignmentcomWePride: PropTypes.string,
  assignmentWritingServiceOur: PropTypes.string,
  highQualityPlagiarismAndAI: PropTypes.string,
  yourAcademicRequirements: PropTypes.string,

  /** Style props */
  containerMinWidth: PropTypes.string,
  borderPadding: PropTypes.string,
  containerHeight: PropTypes.string,
};

export default Container;
