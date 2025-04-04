"use client";
import React, { useState } from 'react';
import Image from "next/image";

const faqData = [
  {
    question: 'Associated with Best Expert Writers',
    answer: 'Our professionals can write essays in a variety of fields regardless of the subject you may require an essay on. We produce original academic papers in a variety of subjects, including Math, Programming, Business Management, Nursing, Psychology, and English. The academic writers on our staff have degrees in both exact sciences and humanities.'
  },
  {
    question: 'Two Months Training',
    answer: 'Taking assistance from the professionals to complete your assignment would surely be a good idea if you are dreaming for the good grades. For enjoying all the benefits that we offer, you just need to contact us and place your order on Whatsapp or Call.'
  },
  {
    question: '24X7 Support Service',
    answer: 'The timeline depends on the complexity and length of the assignment. We always aim to deliver as soon as possible without compromising quality.'
  },
  {
    question: 'Every Assignment is New Assignment',
    answer: 'All our writers are highly qualified with degrees in relevant fields and extensive experience in academic writing.'
  },
  {
    question: 'Provide Free Feedback Facility',
    answer: 'Yes, all content is thoroughly researched and verified for authenticity before delivery.'
  },
  {
    question: 'Responsibility Guaranteed',
    answer: 'We accept payments through multiple gateways including credit/debit cards, PayPal, and bank transfers.'
  },
  {
    question: 'Thoroughly Revised after Completion',
    answer: 'All our writers are highly qualified with degrees in relevant fields and extensive experience in academic writing.'
  },
  {
    question: 'Your Feedback is our Stairs to Growth',
    answer: 'Yes, all content is thoroughly researched and verified for authenticity before delivery.'
  },
];




const Section2_copy = () => {
	const [activeIndex, setActiveIndex] = useState(null);

	const toggleAccordion = (index) => {
	  setActiveIndex(activeIndex === index ? null : index);
	};

  	return (
		<section className="bg-white pb-5 px-5">
		<div className="max-w-5xl mx-auto">
		  <h2 className="text-[48px] font-bold font-inter text-center mb-6 text-[#00384F]">How We Work?</h2>
		  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{faqData.map((item, index) => (
			  <div key={index} className="border items-center overflow-hidden shadow-sm">
				<button
				  onClick={() => toggleAccordion(index)}
				  className={`w-full items-center justify-center text-left px-4 py-3 font-semibold font-inter text-[#00384F] ${activeIndex === index ? 'bg-[#5577D1]/[0.23]' : 'bg-[#5577D1]/[0.23]'}`}
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
export default Section2_copy;
																																																																																																																																		