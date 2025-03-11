import Container from "./container1";
import Section from "./section1";

const Root = () => {
  return (
    <div className="w-full relative flex flex-col items-start justify-start leading-[normal] tracking-[normal]">
      <header className="self-stretch flex flex-col items-center justify-start pt-[50px] px-[80px] pb-[0px] text-center text-[35px] text-[#00384f] font-inter mq750:pl-[40px] mq750:pr-[40px] mq750:box-border">
        <div className="w-[1280px] flex flex-row items-start justify-center max-w-[1280px] mq1275:max-w-full">
          <div className="self-stretch flex-1 flex flex-row items-center justify-center flex-wrap content-center py-[10px] px-[129px] mq750:pl-[32px] mq750:pr-[32px] mq750:box-border mq1275:pl-[64px] mq1275:pr-[64px] mq1275:box-border">
            <div className="flex-1 flex flex-col items-start justify-start py-[0px] px-[1px] box-border max-w-[1037px] mq1100:max-w-full">
              <div className="self-stretch flex flex-col items-center justify-start py-[0px] px-[148px] mq750:pl-[37px] mq750:pr-[37px] mq750:box-border mq1100:pl-[74px] mq1100:pr-[74px] mq1100:box-border">
                <h2 className="m-[0px] w-[881px] relative text-inherit leading-[43px] font-bold font-[inherit] flex items-center justify-center">
                  Your Need for Assignment Help Is Fulfilled Here
                </h2>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section className="self-stretch flex flex-col items-center justify-center py-[30px] px-[0px]">
        <div className="w-full flex flex-row items-center justify-center py-[0px] px-[20px] box-border max-w-[1320px] [row-gap:20px] mq1100:flex-wrap mq1275:max-w-full">
          <Container
            prop="1"
            trustedAssignmentWritingService="Trusted Assignment Writing Service:"
            atAskmeassignmentcomWePride="At Askmeassignment.com, we pride ourselves on being the best assignment writing service. Our expert assignment writers deliver high-quality, plagiarism and AI-free assignments tailored to meet your academic requirements."
            assignmentWritingServiceOur=""
            highQualityPlagiarismAndAI=""
            yourAcademicRequirements=""
          />
          <Container
            prop="2"
            trustedAssignmentWritingService="Expert Assignment Help:"
            atAskmeassignmentcomWePride="Get access to a professional assignment helper for all your academic needs. From university assignments to specialized subjects like statistics and finance, our global assignment experts are here to assist."
            containerMinWidth="416px"
            borderPadding="9px 10px"
            containerHeight="110.4px"
          />
        </div>
      </section>
      <section className="self-stretch flex flex-col items-center justify-start py-[30px] px-[0px]">
        <div className="w-[1280px] flex flex-row items-start justify-start max-w-[1280px] mq1275:max-w-full">
          <Container
            prop="3"
            trustedAssignmentWritingService="Affordable Online Assignment Help:"
            atAskmeassignmentcomWePride="Looking for a cheap assignment helper without compromisin gquality? We offer cost- effective solutions with 24/7 support. Our online homework help ensures your assignments are completed on time."
            assignmentWritingServiceOur=""
            highQualityPlagiarismAndAI=""
            yourAcademicRequirements=""
            containerMinWidth="unset"
            borderPadding="9px 10px"
            containerHeight="110.4px"
          />
          <Container
            prop="4"
            trustedAssignmentWritingService="Trusted Assignment Writing Service:"
            atAskmeassignmentcomWePride="Your Academic Success Partner: Whether you need help with assignments or guidance from the best assignment helper, Askmeassignment.com is your go-to platform. Order now for reliable and timely results."
            assignmentWritingServiceOur=""
            highQualityPlagiarismAndAI=""
            yourAcademicRequirements=""
            containerMinWidth="unset"
            borderPadding="17px 10px"
            containerHeight="96px"
          />
        </div>
      </section>
      <Section />
    </div>
  );
};

export default Root;
