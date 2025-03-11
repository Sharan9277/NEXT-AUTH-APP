import Image from "next/image";
import GetStartedButton from "./get-started-button";
import PropTypes from "prop-types";

const Section = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch flex flex-col items-center justify-center py-[0px] px-[80px] box-border max-w-full text-left text-[29px] text-[#00384f] font-inter mq750:pl-[40px] mq750:pr-[40px] mq750:box-border ${className}`}
    >
      <div className="w-[1280px] flex flex-row items-center justify-center max-w-[1280px] mq1275:max-w-full">
        <div className="flex-1 flex flex-row items-start justify-center min-h-[1px] max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start pt-[79.6px] px-[0px] pb-[90.2px] box-border gap-[8.4px] max-w-full mq750:pt-[52px] mq750:pb-[59px] mq750:box-border">
            <div className="flex flex-col items-start justify-start max-w-full">
              <div className="w-[590px] flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[20px] box-border max-w-full">
                <div className="self-stretch flex flex-col items-start justify-start">
                  <h2 className="m-[0px] self-stretch relative text-inherit leading-[30px] font-bold font-[inherit] mq450:text-[23px] mq450:leading-[24px]">
                    <p className="m-[0px]">
                      Lowest Prices for the Best Quality Assignments
                    </p>
                  </h2>
                </div>
              </div>
              <div className="w-[590px] flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[34.4px] box-border max-w-full text-[18px]">
                <div className="self-stretch flex flex-col items-start justify-start">
                  <div className="self-stretch relative leading-[24px]">
                    <p className="m-[0px]">
                      We are offering the best assignment writing service in low
                      prices. We provide high-quality, plagiarism and AI-free assistance across all
                      subjects. From statistics assignment helpers to finance assignment
                      experts, we cater to diverse academic needs. Our assignment writing service
                      ensures timely delivery, affordable pricing, and expert guidance.
                      Experience the easiest and most stress-free way to achieve academic success with our
                      best assignment helpers today</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[590px] flex flex-col items-start justify-start max-w-[640px] mq750:max-w-full">
              <div className="self-stretch flex flex-col items-start justify-start">
                <GetStartedButton property1="Inactive" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-[0.9688] flex flex-row items-start justify-center p-[10px] box-border min-h-[1px]">
          <div className="self-stretch flex-1 flex flex-col items-center justify-start">
            <div className="w-[620px] flex flex-row items-start justify-start max-w-[1280px] mq1275:max-w-full">
              <div className="self-stretch w-[388.7px] flex flex-row items-start justify-center min-h-[1px]">
                <div className="self-stretch flex-1 flex flex-row items-start justify-start flex-wrap content-start p-[10px]">
                  <div className="self-stretch flex-1 flex flex-col items-start justify-start max-w-[463px] mq450:max-w-full">
                    <div className="self-stretch flex flex-col items-center justify-center">
                      <Image
                        className="w-[368.7px] h-[488.6px] relative overflow-hidden shrink-0 object-cover max-w-[368.73px]"
                        loading="lazy"
                        width={369}
                        height={489}
                        alt=""
                        src="/untitled-400-x-530-px.png.png"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch w-[229.6px] flex flex-row items-start justify-center min-h-[1px]">
                <div className="self-stretch flex-1 flex flex-col items-start justify-center pt-[10px] px-[10px] pb-[10.7px]">
                  <div className="w-[209.6px] h-[210.2px] flex flex-col items-start justify-start max-w-[273.7px]">
                    <div className="self-stretch flex flex-col items-center justify-center">
                      <Image
                        className="w-[209.6px] h-[190.2px] relative overflow-hidden shrink-0 object-cover max-w-[209.58px]"
                        loading="lazy"
                        width={210}
                        height={190}
                        alt=""
                        src="/untitled-270-x-245-px.png.png"
                      />
                    </div>
                  </div>
                  <div className="w-[209.6px] h-[277.7px] flex flex-col items-start justify-start max-w-[273.7px]">
                    <div className="self-stretch flex flex-col items-center justify-center">
                      <Image
                        className="w-[209.6px] h-[277.7px] relative overflow-hidden shrink-0 object-cover max-w-[209.58px]"
                        loading="lazy"
                        width={210}
                        height={278}
                        alt=""
                        src="/untitled-400-x-530-px-1.png.png"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Section.propTypes = {
  className: PropTypes.string,
};

export default Section;
