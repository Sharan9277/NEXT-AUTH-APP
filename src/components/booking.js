import Image from "next/image";
import Component2 from "./component2";
import Component3 from "./component3";
import PropTypes from "prop-types";

const Container = ({ className = "" }) => {
  return (
    <div
      className={`max-w-[1140px] flex flex-row items-start justify-center py-[73px] px-[32px] box-border gap-[24px] leading-[normal] tracking-[normal] text-center text-[14px] text-[#6a697c] font-[Figtree] mq900:flex-wrap ${className}`}
    >
      <div className="rounded-[4px] bg-[#fff] border-[#dcdce5] border-solid border-[1px] box-border flex flex-col items-start justify-start max-w-full z-[1] mq900:flex-1">
        <div className="self-stretch flex flex-col items-center justify-start pt-[24px] px-[32px] pb-[40px] gap-[16px] mq450:pt-[20px] mq450:pb-[26px] mq450:box-border">
          <div className="flex flex-col items-start justify-end">
            <Image
              className="w-[96px] h-[96px] relative rounded-[4px] overflow-hidden shrink-0 object-cover"
              loading="lazy"
              width={96}
              height={96}
              alt=""
              src="/avatar-rbyutff3ndmjpg@2x.png"
            />
          </div>
          <div className="self-stretch flex flex-col items-start justify-start gap-[8px]">
            <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[3px]">
              <div className="self-stretch relative tracking-[0.07px] leading-[20px]">
                <p className="m-[0px]">
                  Your remaining balance with Hari Krishna
                </p>
                <p className="m-[0px]">S.</p>
              </div>
            </div>
            <div className="self-stretch overflow-hidden flex flex-row items-center justify-center py-[0px] px-[91px] text-left text-[16px] text-[#121117] mq450:pl-[20px] mq450:pr-[20px] mq450:box-border">
              <div className="flex-1 flex flex-col items-start justify-start">
                <div className="self-stretch relative leading-[24px] font-semibold">
                  0.5 lessons
                </div>
              </div>
            </div>
          </div>
          <div className="w-[264px] relative h-[1px]" />
          <div className="w-[264px] flex flex-col items-start justify-start text-[16px] text-[#121117]">
            <div className="self-stretch h-[48px] rounded-[8px] bg-[#dcdce5] border-[#dcdce5] border-solid border-[2px] box-border flex flex-row items-center justify-between py-[9px] pl-[16px] pr-[12px] gap-[0px] [row-gap:20px] mq450:h-auto mq450:flex-wrap">
              <div className="flex-1 overflow-hidden flex flex-col items-start justify-start min-w-[135px] max-w-[236px]">
                <div className="self-stretch overflow-hidden flex flex-row items-center justify-start">
                  <div className="overflow-hidden flex flex-col items-center justify-start pt-[2px] px-[0px] pb-[3px]">
                    <div className="overflow-hidden flex flex-row items-start justify-center">
                      <div className="relative leading-[24px]">25 minutes</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[24px] w-[24px] overflow-hidden shrink-0 flex flex-col items-start justify-start min-w-[24px] max-w-[24px]">
                <Image
                  className="self-stretch relative max-w-full overflow-hidden h-[24px] shrink-0"
                  width={24}
                  height={24}
                  alt=""
                  src="/component-1.svg"
                />
              </div>
            </div>
          </div>
          <div className="w-[264px] flex flex-col items-start justify-start text-left">
            <div className="self-stretch flex flex-col items-start justify-start">
              <div className="self-stretch relative tracking-[0.07px] leading-[20px]">
                <p className="m-[0px]">
                  Select available time slots on the right to
                </p>
                <p className="m-[0px]">schedule multiple lessons</p>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch border-[#dcdce5] border-solid border-t-[1px] flex flex-col items-start justify-start pt-[23px] px-[32px] pb-[24px] text-left text-[16px] text-[#121117]">
          <div className="self-stretch flex flex-row items-start justify-start gap-[8px]">
            <div className="h-[24px] w-[24px] flex flex-col items-start justify-start min-w-[24px] max-w-[24px]">
              <Image
                className="self-stretch h-[24px] relative max-w-full overflow-hidden shrink-0"
                loading="lazy"
                width={24}
                height={24}
                alt=""
                src="/component-1-1.svg"
              />
            </div>
            <div className="self-stretch flex flex-col items-start justify-start">
              <div className="rounded-[4px] flex flex-row items-start justify-center">
                <div className="flex flex-col items-start justify-start">
                  <div className="relative [text-decoration:underline] leading-[24px] font-semibold">
                    Connect Google Calendar
                  </div>
                </div>
              </div>
              <div className="relative text-[14px] tracking-[0.07px] leading-[20px] text-[#6a697c] mt-[-0.5px]">
                to sync all Preply lessons
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="self-stretch flex-1 overflow-hidden flex flex-col items-start justify-start min-w-[469px] max-w-full z-[0] text-left text-[20px] text-[#121117] font-[Figtree] mq700:min-w-full">
        <div className="self-stretch shadow-[0px_0px_8px_rgba(9,_15,_25,_0.1)] bg-[#fff] flex flex-col items-start justify-start p-[32px] box-border max-w-full mq700:pt-[21px] mq700:pb-[21px] mq700:box-border">
          <div className="w-full flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[57px] box-border max-w-[722px] min-h-[300px] mq450:pb-[37px] mq450:box-border mq900:h-auto mq900:max-w-full">
            <div className="w-[658px] flex flex-row items-center justify-start flex-wrap content-center max-w-full">
              <div className="flex flex-row items-center justify-start flex-wrap content-center pt-[0px] px-[0px] pb-[24px] gap-x-[12px] gap-y-[0px]">
                <div className="flex flex-row items-start justify-start">
                  <Component2 variant={2} component1="/component-1-2.svg" />
                  <Component2 variant={1} component1="/component-1-3.svg" />
                </div>
                <div className="flex flex-col items-start justify-start">
                  <a className="[text-decoration:none] relative tracking-[-0.1px] leading-[28px] font-semibold text-[inherit] mq450:text-[16px] mq450:leading-[22px]">
                    Jan 21 – 27, 2025
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-[#fff] overflow-x-auto flex flex-row items-start justify-center pt-[8px] px-[0px] pb-[2px] gap-[8px] z-[3] text-center text-[14px]">
              <div className="self-stretch w-[87.1px] bg-[rgba(85,119,209,0.23)] border-[#121117] border-solid border-t-[2px] box-border shrink-0 flex flex-col items-start justify-start pt-[11px] px-[0px] pb-[8px]">
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[31px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    Tue
                  </div>
                </div>
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[36px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    21
                  </div>
                </div>
              </div>
              <div className="self-stretch w-[87.1px] border-[#121117] border-solid border-t-[2px] box-border shrink-0 flex flex-col items-start justify-start pt-[11px] px-[0px] pb-[8px]">
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[28px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    Wed
                  </div>
                </div>
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[35px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    22
                  </div>
                </div>
              </div>
              <div className="self-stretch w-[87.1px] border-[#121117] border-solid border-t-[2px] box-border shrink-0 flex flex-col items-start justify-start pt-[11px] px-[0px] pb-[8px]">
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[30px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    Thu
                  </div>
                </div>
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[35px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    23
                  </div>
                </div>
              </div>
              <div className="self-stretch w-[87.1px] border-[#121117] border-solid border-t-[2px] box-border shrink-0 flex flex-col items-start justify-start pt-[11px] px-[0px] pb-[8px]">
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[35px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    Fri
                  </div>
                </div>
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[35px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    24
                  </div>
                </div>
              </div>
              <div className="self-stretch w-[87.1px] border-[#121117] border-solid border-t-[2px] box-border shrink-0 flex flex-col items-start justify-start pt-[11px] px-[0px] pb-[8px]">
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[32px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    Sat
                  </div>
                </div>
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[35px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    25
                  </div>
                </div>
              </div>
              <div className="self-stretch w-[87.1px] border-[#121117] border-solid border-t-[2px] box-border shrink-0 flex flex-col items-start justify-start pt-[11px] px-[0px] pb-[8px]">
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[31px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    Sun
                  </div>
                </div>
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[35px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    26
                  </div>
                </div>
              </div>
              <div className="self-stretch w-[87.2px] border-[#121117] border-solid border-t-[2px] box-border shrink-0 flex flex-col items-start justify-start pt-[11px] px-[0px] pb-[8px]">
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[29px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    Mon
                  </div>
                </div>
                <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[35px]">
                  <div className="self-stretch relative tracking-[0.07px] leading-[20px] font-semibold">
                    27
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-start justify-center gap-[8px] z-[2] mq900:flex-wrap">
              <div className="w-[87.1px] bg-[rgba(85,119,209,0.23)] flex flex-col items-start justify-center gap-[4px]">
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={2} text="03:30" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={2} text="04:00" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={2} text="04:30" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={2} text="05:00" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={2} text="05:30" />
                </div>
              </div>
              <div className="w-[87.1px] flex flex-col items-start justify-center gap-[4px]">
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={2} text="03:30" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="04:00" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="04:30" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="05:00" />
                </div>
              </div>
              <div className="w-[87.1px] flex flex-col items-start justify-center gap-[4px]">
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="03:30" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="04:00" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="04:30" />
                </div>
              </div>
              <div className="w-[87.1px] flex flex-col items-start justify-center gap-[4px]">
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="03:30" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="04:00" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="04:30" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="05:00" />
                </div>
              </div>
              <div className="w-[87.1px] flex flex-col items-start justify-center gap-[4px]">
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="03:30" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="04:00" />
                </div>
              </div>
              <div className="w-[87.1px] flex flex-col items-start justify-center gap-[4px]">
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="03:30" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="04:00" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="04:30" />
                </div>
              </div>
              <div className="w-[87.2px] flex flex-col items-start justify-center gap-[4px]">
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="03:30" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="04:00" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="04:30" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="05:00" />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <Component3 variant={1} text="05:30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

Container.propTypes = {
  className: PropTypes.string,
};

export default Container;
