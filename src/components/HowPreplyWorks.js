import Image from "next/image";
import PropTypes from "prop-types";

const HowPreplyWorks = ({ className = "" }) => {
  return (
    <div
      className={`w-[1440px] h-[682px] max-w-[1440px] overflow-y-auto flex flex-col items-center justify-center max-h-[682px] leading-[normal] tracking-[normal] ${className}`}
    >
      <section className="flex flex-col items-center justify-center py-[0px] px-[20px] box-border max-w-[1320px] text-left text-[32px] text-[#121117] font-inter mq1275:max-w-full">
        <div className="w-[1423px] flex flex-col items-center justify-center gap-[48px] mq750:gap-[24px]">
          <header className="self-stretch flex flex-row items-start justify-start flex-wrap content-start py-[0px] px-[45px] text-left text-[59.6px] text-[#121117] font-inter mq750:pl-[36px] mq750:pr-[36px] mq750:box-border">
            <div className="self-stretch flex flex-col items-start justify-start">
              <div className="relative tracking-[-0.32px] leading-[68px] font-medium">
                How Preply works:
              </div>
            </div>
          </header>
          <div className="self-stretch overflow-auto flex flex-row items-center justify-center gap-[12px]">
            <div className="self-stretch flex flex-col items-start justify-start max-w-[1280px] text-[30.1px] mq1275:max-w-full">
              <div className="self-stretch h-[516px] rounded-[4px] bg-[#fff] border-[#121117] border-solid border-[1px] box-border overflow-hidden shrink-0 flex flex-col items-start justify-start pt-[31px] px-[32px] pb-[0px] min-w-[410px]">
                <div className="self-stretch flex flex-col items-start justify-start gap-[24px]">
                  <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">
                    <div className="w-[40px] h-[40px] rounded-[4px] bg-[#7bead6] flex flex-row items-center justify-center py-[2px] px-[11px] box-border">
                      <div className="flex flex-col items-start justify-start">
                        <div className="relative tracking-[0.32px] leading-[36px] font-medium mq450:text-[18px] mq450:leading-[22px] mq750:text-[24px] mq750:leading-[29px]">
                          1
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch flex flex-col items-start justify-start text-[41.6px]">
                      <div className="self-stretch relative leading-[52px] font-medium mq450:text-[25px] mq450:leading-[31px] mq750:text-[33px] mq750:leading-[42px]">
                        Find your tutor.
                      </div>
                    </div>
                    <div className="self-stretch flex flex-col items-start justify-start text-[16px] font-inter">
                      <div className="self-stretch relative leading-[24px]">
                        <p className="m-[0px]">
                          We’ll connect you with a tutor who will
                        </p>
                        <p className="m-[0px]">
                          motivate, challenge, and inspire you.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Image
                    className="w-[378px] relative max-h-full object-cover"
                    loading="lazy"
                    width={378}
                    height={296}
                    alt=""
                    src="/Container_2.png"
                  />
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-col items-start justify-start max-w-[1280px] mq1275:max-w-full">
              <div className="w-[419.4px] h-[516px] rounded-[4px] bg-[#fff] border-[#121117] border-solid border-[1px] box-border overflow-hidden shrink-0 flex flex-row items-start justify-start pt-[31px] pb-[0px] pl-[33px] pr-[31px] min-w-[410px]">
                <div className="w-[353.4px] flex flex-col items-start justify-start gap-[24px]">
                  <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">
                    <div className="w-[40px] h-[40px] rounded-[4px] bg-[#ffdf3d] flex flex-row items-center justify-center py-[2px] px-[10px] box-border">
                      <div className="flex-1 flex flex-col items-start justify-start">
                        <div className="self-stretch relative tracking-[0.32px] leading-[36px] font-medium mq450:text-[19px] mq450:leading-[22px] mq750:text-[26px] mq750:leading-[29px]">
                          2
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch flex flex-col items-start justify-start text-[40.9px]">
                      <div className="self-stretch relative leading-[52px] font-medium mq450:text-[25px] mq450:leading-[31px] mq750:text-[33px] mq750:leading-[42px]">
                        Start learning.
                      </div>
                    </div>
                    <div className="self-stretch flex flex-col items-start justify-start text-[16px] font-inter">
                      <div className="self-stretch relative leading-[24px]">
                        <p className="m-[0px]">
                          Your tutor will guide the way through your first
                        </p>
                        <p className="m-[0px]">
                          lesson and help you plan your next steps.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-row items-start justify-center flex-wrap content-start">
                    <Image
                      className="h-[296px] flex-1 relative max-w-full overflow-hidden object-cover"
                      loading="lazy"
                      width={353}
                      height={296}
                      alt=""
                      src="/card-2-da929e1032468274fff3c7a827157232.jpg.png"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-col items-start justify-start max-w-[1280px] mq1275:max-w-full">
              <div className="self-stretch h-[516px] rounded-[4px] bg-[#fff] border-[#121117] border-solid border-[1px] box-border overflow-hidden shrink-0 flex flex-col items-start justify-start pt-[33px] px-[32px] pb-[1px] min-w-[410px]">
                <div className="self-stretch flex flex-col items-start justify-start gap-[24px]">
                  <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">
                    <div className="w-[40px] h-[40px] rounded-[4px] bg-[#2885fd] flex flex-row items-center justify-center py-[2px] px-[10px] box-border">
                      <div className="flex-1 flex flex-col items-start justify-start">
                        <div className="self-stretch relative tracking-[0.32px] leading-[36px] font-medium mq450:text-[19px] mq450:leading-[22px] mq750:text-[26px] mq750:leading-[29px]">
                          3
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch flex flex-col items-start justify-center gap-[24px] text-[43.9px]">
                      <div className="self-stretch h-[104px] flex flex-col items-start justify-start">
                        <div className="self-stretch flex flex-col items-start justify-start">
                          <div className="self-stretch relative leading-[52px] font-medium mq450:text-[26px] mq450:leading-[31px] mq750:text-[35px] mq750:leading-[42px]">
                            <p className="m-[0px]">Speak. Read.</p>
                            <p className="m-[0px]">Write. Repeat.</p>
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch h-[48px] flex flex-col items-start justify-start text-[16px] font-inter">
                        <div className="self-stretch flex flex-col items-start justify-start">
                          <div className="self-stretch relative leading-[24px]">
                            <p className="m-[0px]">
                              Choose how many lessons you want to take each
                            </p>
                            <p className="m-[0px]">
                              week and get ready to reach your goals!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-row items-start justify-center flex-wrap content-start">
                    <Image
                      className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover"
                      loading="lazy"
                      width={360}
                      height={175}
                      alt=""
                      src="/card-3-0bab46dd6b35951f6fc2e87968b6e3ea.jpg.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

HowPreplyWorks.propTypes = {
  className: PropTypes.string,
};

export default HowPreplyWorks;
