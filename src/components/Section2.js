"use client";
import React, { useState } from 'react';
import Image from "next/image";

const faqData = [
  {
    question: 'What are the disciplines covered by Askassignment.com?',
    answer: 'Our professionals can write essays in a variety of fields regardless of the subject you may require an essay on. We produce original academic papers in a variety of subjects, including Math, Programming, Business Management, Nursing, Psychology, and English. The academic writers on our staff have degrees in both exact sciences and humanities.'
  },
  {
    question: 'How do the things work? There are just five simple steps to help yourself!',
    answer: 'Taking assistance from the professionals to complete your assignment would surely be a good idea if you are dreaming for the good grades. For enjoying all the benefits that we offer, you just need to contact us and place your order on Whatsapp or Call.'
  },
  {
    question: 'How soon can I get my assignment?',
    answer: 'The timeline depends on the complexity and length of the assignment. We always aim to deliver as soon as possible without compromising quality.'
  },
  {
    question: 'What is the credibility of the writers?',
    answer: 'All our writers are highly qualified with degrees in relevant fields and extensive experience in academic writing.'
  },
  {
    question: 'Does AMA ensure credible content?',
    answer: 'Yes, all content is thoroughly researched and verified for authenticity before delivery.'
  },
  {
    question: 'What are the paying options?',
    answer: 'We accept payments through multiple gateways including credit/debit cards, PayPal, and bank transfers.'
  }
];




const Section2 = () => {
	const [activeIndex, setActiveIndex] = useState(null);

	const toggleAccordion = (index) => {
	  setActiveIndex(activeIndex === index ? null : index);
	};

  	return (
		<section className="bg-white py-10 px-5">
		<div className="max-w-4xl mx-auto">
		  <h2 className="text-[35px] font-bold font-inter text-center mb-6 text-[#00384F]">Frequently Asked Questions (FAQs)</h2>
		  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{faqData.map((item, index) => (
			  <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
				<button
				  onClick={() => toggleAccordion(index)}
				  className={`w-full text-left px-4 py-3 font-semibold font-inter text-[#00384F] ${activeIndex === index ? 'bg-[#5577D1]/[0.23]' : 'bg-[#5577D1]/[0.23]'}`}
				>
				  {item.question}
				  <span className="float-right">
					{activeIndex === index ? '−' : '+'}
				  </span>
				</button>
				{activeIndex === index && (
				  <div className="px-4 py-3 bg-white text-[#00384F] font-inter text-[17px]">
					{item.answer}
				  </div>
				)}
			  </div>
			))}
		  </div>
		</div>
    </section>
	)
};
export default Section2;
																																																																																																																																		