import Image from "next/image";
import PropTypes from "prop-types";

const cards = [
  {
    number: '1',
    bgColor: 'bg-blue-500',
    heading: 'Find your tutor.',
    description: 'We’ll connect you with a tutor who will motivate, challenge, and inspire you.',
    image: '/Container_2.png',
  },
  {
    number: '2',
    bgColor: 'bg-green-500',
    heading: 'Start learning.',
    description: 'Your tutor will guide the way through your first lesson and help you plan your next steps.',
    image: '/card-2-da929e1032468274fff3c7a827157232.jpg.png',
  },
  {
    number: '3',
    bgColor: 'bg-red-500',
    heading: 'Speak. Read. Write. Repeat.',
    description: 'Choose how many lessons you want to take each week and get ready to reach your goals!',
    image: '/card-3-0bab46dd6b35951f6fc2e87968b6e3ea.jpg.png',
  },
];

export default function HowPreplyWorks() {
  return (
    <div className="w-full max-w-7xl  px-6 py-6">
        <h2 className="text-[35px] md:text-[55px] font-bold font-inter text-gray-900 text-left mb-8">
        How Preply Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg px-6 pt-6 flex flex-col items-start border border-black">
            <div className={`w-12 h-12 flex items-center justify-center text-black font-bold text-[25px] font-inter rounded ${card.bgColor}`}>
              {card.number}
            </div>
            <h3 className="mt-4 text-[40px] font-bold font-inter text-gray-800">{card.heading}</h3>
            <p className="mt-2 text-gray-600">{card.description}</p>
            <div className="w-full flex justify-center mt-4">
              <Image src={card.image} alt={card.heading} width={400} height={400} className="rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
