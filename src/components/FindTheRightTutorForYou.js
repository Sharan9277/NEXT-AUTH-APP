import Image from "next/image";
import Component1 from "./component1";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const FindTheRightTutorForYou = () => {
  return (
    <div className="w-full h-[815px] relative overflow-y-auto flex flex-col items-center justify-start max-w-[1440px] max-h-[815.06px] leading-[normal] tracking-[normal]">
      <section className="w-[1280px] flex flex-col items-center justify-center max-w-[1280px] max-h-[804.31px] text-left text-[28.8px] text-[#121117] font-inter mq1275:max-w-full">
        <div className="self-stretch flex flex-col items-start justify-start gap-[64px] mq450:gap-[16px] mq750:gap-[32px]">
          <header className="self-stretch flex flex-col items-start justify-start gap-[24px] text-center text-[81.8px] text-[#121117] font-inter">
            <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[137px] mq750:pl-[34px] mq750:pr-[34px] mq750:box-border mq1275:pl-[68px] mq1275:pr-[68px] mq1275:box-border">
              <div className="w-[1101px] relative tracking-[-0.48px] leading-[96px] font-black flex items-center justify-center">
                Find the right tutor for you.
              </div>
            </div>
            <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[300px] text-[20px] font-inter mq450:pl-[20px] mq450:pr-[20px] mq450:box-border mq750:pl-[82px] mq750:pr-[82px] mq750:box-border mq1275:pl-[164px] mq1275:pr-[164px] mq1275:box-border">
              <div className="self-stretch relative tracking-[-0.1px] leading-[20px]">
                With over 30,000 tutors and 1M+ learners, we know language
                learning.
              </div>
            </div>
          </header>
          <div className="self-stretch flex flex-row items-center justify-center gap-[24px]">
            <div className="w-[40px] flex flex-col items-start justify-start py-[20px] px-[0px] box-border">
                <FontAwesomeIcon icon={faArrowLeft} className="text-gray-800" />
            </div>
            <div className="w-[1152px] flex flex-row items-center justify-center py-[0px] px-[64px] box-border gap-[96px] mq750:gap-[24px] mq1275:gap-[48px] mq1275:pl-[32px] mq1275:pr-[32px] mq1275:box-border">
              <div className="w-[464px] flex flex-col items-end justify-start min-w-[350px]">
                <div className="w-[394.9px] flex flex-col items-start justify-start relative">
                  <div className="self-stretch flex flex-col items-start justify-start relative z-[0]">
                    <div className="w-[79.99%] !m-[0] absolute h-[calc(100%_-_118.4px)] top-[59.2px] right-[29.73%] bottom-[59.2px] left-[-9.72%] flex flex-col items-start justify-start z-[0]">
                      <div className="self-stretch flex flex-col items-start justify-start relative">
                        <div className="w-[79.99%] !m-[0] absolute h-[calc(100%_-_94.8px)] top-[47.4px] right-[29.72%] bottom-[47.4px] left-[-9.72%] flex flex-col items-start justify-start z-[0]">
                          <Image
                            className="self-stretch relative rounded-[4px] max-w-full overflow-hidden h-[379.1px] shrink-0 object-cover"
                            width={253}
                            height={379}
                            alt=""
                            src="/Bree-975f02dc03b8de3fd69f2b5f28437893.jpg.png"
                          />
                        </div>
                        <Image
                          className="self-stretch h-[473.9px] relative rounded-[4px] max-w-full overflow-hidden shrink-0 object-cover z-[1]"
                          width={316}
                          height={474}
                          alt=""
                          src="/Bree-975f02dc03b8de3fd69f2b5f28437893.jpg.png"
                        />
                      </div>
                    </div>
                    <Image
                      className="self-stretch h-[592.3px] relative rounded-[4px] max-w-full overflow-hidden shrink-0 object-cover z-[1]"
                      loading="lazy"
                      width={395}
                      height={592}
                      alt=""
                      src="/Bree-975f02dc03b8de3fd69f2b5f28437893.jpg.png"
                    />
                  </div>
                  <div className="w-[51.68%] !m-[0] absolute right-[3.77%] bottom-[0.1px] left-[44.54%] flex flex-row items-center justify-center z-[1]">
                    <div className="flex-1 flex flex-row items-start justify-start gap-[8px]">
                      <button className="cursor-pointer border-[#121117] border-solid border-[1px] py-[8px] px-[12px] bg-[#fff] self-stretch rounded-[4px] flex flex-col items-start justify-start hover:bg-[#e6e6e6] hover:border-[#45454a] hover:border-solid hover:hover:border-[1px] hover:box-border">
                        <div className="relative text-[16px] font-medium font-inter text-[#121117] text-left">
                          Brianna
                        </div>
                      </button>
                      <button className="cursor-pointer border-[#121117] border-solid border-[1px] py-[8px] px-[12px] bg-[#3ddabe] self-stretch rounded-[4px] flex flex-col items-start justify-start whitespace-nowrap hover:bg-[#0aa88a] hover:border-[#45454a] hover:border-solid hover:hover:border-[1px] hover:box-border">
                        <div className="relative text-[16px] font-medium font-inter text-[#121117] text-left">
                          English tutor
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[464px] flex flex-col items-start justify-start py-[20px] px-[0px] box-border gap-[24px]">
                <div className="self-stretch flex flex-col items-start justify-start">
                  <div className="self-stretch relative tracking-[0.32px] leading-[36px] font-medium mq450:text-[23px] mq450:leading-[29px]">
                    <p className="m-[0px]">"The energy she brings to each</p>
                    <p className="m-[0px]">lesson is amazing."</p>
                  </div>
                </div>
                <div className="self-stretch flex flex-col items-start justify-start gap-[2px] text-[16px] font-inter">
                  <div className="self-stretch flex flex-col items-start justify-start">
                    <div className="self-stretch relative leading-[24px] font-semibold">
                      Ismael
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col items-start justify-start">
                    <div className="self-stretch relative leading-[24px]">
                      English learner on Preply
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-row items-center justify-start flex-wrap content-center gap-[0px]">
                  <div className="h-[24px] w-[24px] flex flex-row items-center justify-center p-[6px] box-border">
                    <div className="w-[12px] relative rounded-[2px] bg-[#ff7aac] h-[12px]" />
                  </div>
                  <div className="h-[24px] w-[24px] flex flex-row items-center justify-center p-[8px] box-border">
                    <div className="w-[8px] relative rounded-[8px] bg-[#dcdce5] h-[8px]" />
                  </div>
                  <div className="h-[24px] w-[24px] flex flex-row items-center justify-center p-[8px] box-border">
                    <div className="w-[8px] relative rounded-[8px] bg-[#dcdce5] h-[8px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[40px] flex flex-col items-start justify-start py-[20px] px-[0px] box-border">
                <FontAwesomeIcon icon={faArrowRight} className="text-gray-800" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FindTheRightTutorForYou;
