import Image from "next/image";



const Header = () => {
  	return (
    		<div className="w-full relative bg-at-light-orange h-[709px] flex flex-col items-center justify-center py-spacing-1 px-[15px] box-border gap-[50px] text-left text-53xl text-preplycom-black font-text-md-regular">
      			<div className="flex flex-row items-start justify-center gap-8">
        				<div className="w-[633px] flex flex-col items-start justify-center gap-14">
          					<div className="w-[633px] relative tracking-[-0.02em] leading-[90px] font-semibold flex items-center">Adapting and Thriving in a Changing World</div>
          					<div className="w-[522px] rounded-xl bg-tomato h-11 flex flex-row items-center justify-start gap-[17px] text-base">
            						<div className="shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] rounded-lg bg-at-off-white border-at-off-white border-[1px] border-solid overflow-hidden flex flex-row items-center justify-center py-2.5 px-[58px]">
              							<div className="relative leading-[24px] font-semibold">Get Started</div>
            						</div>
            						<div className="shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] rounded-lg bg-at-button-light border-at-button-light border-[1px] border-solid overflow-hidden flex flex-row items-center justify-center py-2.5 px-[58px] text-at-off-white">
              							<div className="relative leading-[24px] font-semibold">Become a Tutor</div>
            						</div>
          					</div>
        				</div>
        				<div className="w-[561px] relative h-[372px]">
          					<Image className="absolute top-[50px] left-[0px] rounded-xl w-[190px] h-[272px] overflow-hidden object-cover" width={190} height={272} alt="" src="/Frame 1272637872.png" />
          					<Image className="absolute top-[50px] left-[371px] rounded-xl w-[190px] h-[272px] overflow-hidden object-cover" width={190} height={272} alt="" src="/Frame 1272637873.png" />
          					<Image className="absolute top-[0px] left-[152px] rounded-xl w-[251px] h-[372px] overflow-hidden object-cover" width={251} height={372} alt="" src="/Frame 1272637870.png" />
        				</div>
      			</div>
      			<div className="w-[1225px] flex flex-row items-center justify-center gap-[87px] text-5xl">
        				<div className="w-[352px] rounded-xl bg-at-off-white flex flex-col items-start justify-start p-5 box-border gap-4">
          					<div className="self-stretch relative leading-[32px] font-medium">Design Guideline</div>
          					<div className="self-stretch relative text-base leading-[24px]">Consistency is key to effective design. Establishing consistent visual elements.</div>
        				</div>
        				<div className="w-[352px] rounded-xl bg-at-off-white flex flex-col items-start justify-start p-5 box-border gap-4">
          					<div className="self-stretch relative leading-[32px] font-medium">Design Guideline</div>
          					<div className="self-stretch relative text-base leading-[24px]">Consistency is key to effective design. Establishing consistent visual elements.</div>
        				</div>
        				<div className="w-[352px] rounded-xl bg-at-off-white flex flex-col items-start justify-start p-5 box-border gap-4">
          					<div className="self-stretch relative leading-[32px] font-medium">Design Guideline</div>
          					<div className="self-stretch relative text-base leading-[24px]">Consistency is key to effective design. Establishing consistent visual elements.</div>
        				</div>
      			</div>
    		</div>);
};

export default Header;
