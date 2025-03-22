"use client";
import Image from "next/image";
import PropTypes from "prop-types";

export default function TutorsByQues  ({ className = "" })  {
  return (
    <div
      className={`max-w-full flex flex-row items-start justify-start p-[24px] pb-[48px] box-border gap-[160px] leading-[normal] tracking-[normal] text-left text-[53.9px] text-[#121117] font-inter mq450:gap-[40px] mq750:gap-[80px] mq1225:flex-wrap ${className}`}
    >
      <div className="flex flex-col items-start justify-start pt-[50px] px-[0px] pb-[0px] box-border max-w-full mq1050:min-w-full mq450:pt-[32px] mq450:box-border mq1225:flex-1">
        <div className="h-[332px] flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[196px] box-border gap-[32px] mq450:pb-[127px] mq450:box-border mq750:gap-[16px]">
          <div className="w-[748px] h-[176px] flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[175px] box-border gap-[16px] mq450:pb-[114px] mq450:box-border">
            <div className="w-[748px] h-[136px] flex flex-col items-start justify-start pt-[0px] pb-[135px] pl-[0px] pr-[20px] box-border">
              <div className="relative tracking-[-0.32px] leading-[68px] font-medium mq450:text-[32px] mq450:leading-[41px] mq750:text-[43px] mq750:leading-[54px]">{`Online English tutors & `}</div>
              <div className="relative tracking-[-0.32px] leading-[68px] font-medium mq450:text-[32px] mq450:leading-[41px] mq750:text-[43px] mq750:leading-[54px]">
                teachers for private lessons
              </div>
            </div>
            <div className="w-[760px] h-[24px] flex flex-row items-start justify-start text-[16px] font-inter">
              <div className="h-[24px] w-[670.7px] overflow-hidden shrink-0 flex flex-row items-start justify-start py-[0px] pl-[0px] pr-[7px] box-border">
                <div className="flex flex-col items-start justify-start">
                  <div className="w-[642px] relative leading-[24px] inline-block">{`Looking for an online English tutor? Preply is the leading online language learning platform `}</div>
                  <div className="w-[664px] relative leading-[24px] inline-block">{`worldwide. You can choose from 27763 English teachers with an average rating of 4.91 out of `}</div>
                  <div className="w-[648px] relative leading-[24px] inline-block">{`5 stars given by 262808 customers. Book a lesson with a private English teacher today and `}</div>
                  <div className="w-[607px] relative leading-[24px] inline-block">{`start learning. Not entirely happy with your tutor? No worries, Preply offers free tutor `}</div>
                  <div className="w-[614px] relative leading-[24px] inline-block">{`replacement till you're 100% satisfied. Looking for a different way to learn a language? `}</div>
                  <div className="w-[215px] relative leading-[24px] inline-block">
                    {`Explore `}
                    <span className="[text-decoration:underline]">
                      online English classes
                    </span>
                    .
                  </div>
                </div>
              </div>
              <div className="h-[24px] w-[77.3px] rounded-[4px] flex flex-row items-end justify-start pt-[0px] pb-[0.5px] px-[0px] box-border">
                <a className="[text-decoration:underline] w-[82px] relative leading-[24px] text-[inherit] inline-block shrink-0">
                  Read more
                </a>
              </div>
            </div>
          </div>
          <div className="w-[748px] h-[124px] flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[123px] box-border gap-[24px] text-[16px] font-inter">
            <div className="w-[748px] h-[76px] flex flex-col items-start justify-start pt-[0px] px-[0px] pb-[75px] box-border gap-[4.5px]">
              <div className="relative leading-[24px]">
                <b>Get a personalized choice of tutors</b>
                <span className="font-semibold">
                  {" "}
                  by answering a few quick questions
                </span>
              </div>
              <div className="w-[748px] h-[48px] flex flex-row items-start justify-start gap-[12px] text-[15px] text-[#000] font-inter">
                <div className="h-[48px] w-[553.3px] rounded-[8px] bg-[#fff] border-[#dcdce5] border-solid border-[2px] box-border flex flex-row items-start justify-start py-[0px] px-[16px]">
                  <div className="flex flex-row items-end justify-start pt-[10.6px] pb-[10.5px] pl-[5px] pr-[0px]">
                    <div className="h-[22.9px] w-[500.3px] relative leading-[22.9px] font-semibold flex items-center overflow-hidden text-ellipsis whitespace-nowrap shrink-0">
                      English
                    </div>
                    <div className="flex flex-col items-start justify-end pt-[0px] px-[0px] pb-[5.5px]">
                      <Image
                        className="w-[12px] h-[8px] relative overflow-hidden shrink-0"
                        width={12}
                        height={8}
                        alt=""
                        src="/Vector (1).svg"
                      />
                    </div>
                  </div>
                </div>
                <button className="cursor-pointer border-[#fff] border-solid border-[2px] py-[9px] pl-[26px] pr-[22px] bg-[#5577d1] h-[48px] w-[182.7px] rounded-[8px] box-border flex flex-row items-start justify-start">
                  <div className="h-[25.7px] flex flex-row items-end justify-start pt-[0.9px] px-[0px] pb-[0.5px] box-border gap-[11.7px]">
                    <div className="w-[95px] relative text-[16px] tracking-[0.09px] leading-[25.7px] font-semibold font-inter text-[#fff] text-left inline-block">
                      Get started
                    </div>
                    <Image
                      className="h-[24px] w-[24px] relative overflow-hidden shrink-0"
                      width={24}
                      height={24}
                      alt=""
                      src="/Vector (1).svg"
                    />
                  </div>
                </button>
              </div>
            </div>
            <div className="w-[269.3px] h-[24px] rounded-[4px] flex flex-row items-end justify-start pt-[0px] pb-[0.5px] px-[0px] box-border">
              <div className="w-[290px] relative [text-decoration:underline] leading-[24px] font-semibold inline-block shrink-0">
                Choose by myself from 27,763 tutors
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-start justify-start max-w-full mq1225:flex-1">
        <Image
          className="h-[432px] flex-1 relative rounded-[4px] max-w-full overflow-hidden object-cover z-[1]"
          width={324}
          height={432}
          alt=""
          src="/Image [styles-module_image__LAg3H].png"
        />
        <Image
          className="h-[432px] flex-1 relative rounded-[4px] max-w-full overflow-hidden object-cover z-[2] ml-[-324px]"
          width={324}
          height={432}
          alt=""
          src="/Image [styles-module_image__LAg3H].png"
        />
        <Image
          className="h-[432px] flex-1 relative rounded-[4px] max-w-full overflow-hidden object-cover z-[3] ml-[-324px]"
          loading="lazy"
          width={324}
          height={432}
          alt=""
          src="/Image [styles-module_image__LAg3H].png"
        />
      </div>
    </div>
  );
};
TutorsByQues.propTypes = {
  className: PropTypes.string,
};



