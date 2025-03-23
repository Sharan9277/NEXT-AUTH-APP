import Container from "./container1";
import Section from "./section1";

const Root = () => {
  const cards = [
    { number: '1', heading: 'Trusted Assignment Writing Service:', description: 'At Askmeassignment.com, we pride ourselves on being the best assignment writing service. Our expert assignment writers deliver high-quality, plagiarism and AI-free assignments tailored to meet your academic requirements.' },
    { number: '2', heading: 'Expert Assignment Help:', description: 'Get access to a professional assignment helper for all your academic needs. From university assignments to specialized subjects like statistics and finance, our global assignment experts are here to assist' },
    { number: '3', heading: 'Affordable Online Assignment Help:', description: 'Looking for a cheap assignment helper without compromising quality? We offer cost- effective solutions with 24/7 support. Our online homework help ensures your assignments are completed on time' },
    { number: '4', heading: 'Trusted Assignment Writing Service:', description: 'Your Academic Success Partner: Whether you need help with assignments or guidance from the best assignment helper, Askmeassignment.com is your go-to platform. Order now for reliable and timely results.' },
  ];

  return (    
  <div className="w-9xl max-w-8xl md:w-full mx-auto px-6 py-12">
        <h2 className="text-black text-2xl md:text-3xl lg:text-[30px] font-inter font-bold text-center mb-6">
            Your Need for Assignment Help Is Fulfilled Here
        </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="flex flex-col md:flex-row items-start bg-white p-6 rounded-lg border border-gray-300 ">
          {/* Left Column - Number inside a Circle */}
          <div className="w-[67px] h-[73px] flex items-center justify-center text-gray-800 font-bold text-[25px] sm:text-[45px] rounded-full bg-at-light-orange md:mr-4">
            {card.number}
          </div>
          {/* Right Column - Heading and Description */}
          <div className="mt-4 md:mt-0 w-full md:w-3/4">
            <h3 className="text-[23px] font-inter font-bold text-gray-800">{card.heading}</h3>
            <p className="text-[14px] font-inter text-gray-600 mt-2">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
    <Section/>
  </div>
  );
};

export default Root;
