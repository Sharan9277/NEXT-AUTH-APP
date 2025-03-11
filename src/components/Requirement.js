const Requirement = () => {
  return (
    <div className="w-full bg-color-white-solid h-auto md:h-[70px] flex flex-col md:flex-row items-center justify-center py-4 md:py-0 px-4 md:px-[13px] box-border gap-4 md:gap-[35px] text-left text-[16px] md:text-[20px] text-preplycom-black font-inter">
      <div className="relative leading-[24px] text-center md:text-left">
        Didn’t find what you needed? You can share what you need with us
      </div>
      <div className="shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] rounded-lg bg-at-light-orange border-at-light-orange border-[1px] border-solid overflow-hidden flex flex-row items-center justify-center py-2.5 px-8 md:px-[58px] text-[14px] md:text-[16px] text-at-bg">
        <div className="relative leading-[24px] font-semibold">Post A Requirement</div>
      </div>
    </div>
  );
};

export default Requirement;