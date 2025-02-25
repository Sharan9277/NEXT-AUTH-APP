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




const Sectionss = () => {
	const [activeIndex, setActiveIndex] = useState(null);

	const toggleAccordion = (index) => {
	  setActiveIndex(activeIndex === index ? null : index);
	};

  	return (
		<div>
    		<div className="w-full relative flex flex-col items-start justify-start gap-[50px] text-left text-[59.63px] text-color-azure-15 font-askmeassignmentcom-semantic-link">
      			<div className="h-[674px] overflow-y-auto shrink-0 flex flex-col items-center justify-center py-0 px-20 box-border text-preplycom-woodsmoke font-preplycom-semantic-heading-3">
        				<div className="w-[1280px] flex flex-col items-start justify-start max-w-[1280px]">
          					<div className="self-stretch flex flex-col items-start justify-start gap-height-48">
            						<div className="self-stretch flex flex-row items-start justify-start flex-wrap content-start">
              							<div className="self-stretch flex flex-col items-start justify-start">
                								<div className="relative tracking-[-0.32px] leading-[68px] font-medium">How Preply works:</div>
              							</div>
            						</div>
            						<div className="self-stretch flex flex-row items-start justify-start gap-item-spacing-12 text-13xl">
              							<div className="self-stretch flex flex-col items-start justify-start max-w-[1280px] text-[30.13px]">
                								<div className="self-stretch rounded bg-tutorhivecouk-white border-preplycom-woodsmoke border-[1px] border-solid box-border h-[516px] overflow-hidden shrink-0 flex flex-col items-start justify-start pt-[33px] px-[33px] pb-px min-w-[410px]">
                  									<div className="self-stretch flex flex-col items-start justify-start gap-line-height-24">
                    										<div className="self-stretch flex flex-col items-start justify-start gap-item-spacing-12">
                      											<div className="w-10 rounded bg-preplycom-spray h-10 flex flex-row items-center justify-center py-0.5 pl-[15.7px] pr-[15.6px] box-border">
                        												<div className="flex flex-col items-start justify-start">
                          													<div className="relative tracking-[0.32px] leading-[36px] font-medium">1</div>
                        												</div>
                      											</div>
                      											<div className="self-stretch flex flex-col items-start justify-start text-[41.63px]">
                        												<div className="self-stretch relative leading-[52px] font-medium">Find your tutor.</div>
                      											</div>
                      											<div className="self-stretch flex flex-col items-start justify-start text-base font-preplycom-semantic-button">
                        												<div className="self-stretch relative leading-[24px]">
                          													<p className="m-0">We’ll connect you with a tutor who will</p>
                          													<p className="m-0">motivate, challenge, and inspire you.</p>
                        												</div>
                      											</div>
                    										</div>
                    										<div className="self-stretch relative h-px text-sm text-preplycom-trout font-preplycom-semantic-button">
                      											<div className="absolute w-[101.74%] top-[176px] right-[-11.05%] left-[9.3%] rounded-lg bg-tutorhivecouk-white border-preplycom-dolphin border-[1px] border-solid box-border overflow-hidden flex flex-col items-start justify-start p-[13px] min-w-[350px]">
                        												<div className="self-stretch flex flex-row items-start justify-start gap-item-spacing-12">
                          													<Image className="w-24 relative  overflow-hidden shrink-0 object-cover" width={96} height={96} alt="" src="/Sophia-b96057aa0eb60c3dd1995d0212f1f514.jpg.png" />
                          													<div className="self-stretch flex flex-col items-start justify-start gap-item-spacing-xxs">
                            														<div className="self-stretch flex flex-row items-start justify-start flex-wrap content-start text-[18.75px] text-preplycom-woodsmoke font-preplycom-semantic-heading-3">
                              															<div className="self-stretch flex flex-col items-start justify-start">
                                																<div className="relative tracking-[0.35px] leading-[24px] font-medium">Sophia</div>
                              															</div>
                            														</div>
                            														<div className="self-stretch flex flex-row items-start justify-start gap-item-spacing-xxs">
                              															<div className="flex flex-col items-start justify-start pt-0 px-0 pb-px">
                                																<div className="w-4 flex flex-row items-start justify-center">
                                  																	<Image className="flex-1 relative max-w-full overflow-hidden h-4" width={16} height={16} alt="" src="/Component 1.svg" />
                                																</div>
                              															</div>
                              															<div className="self-stretch flex flex-col items-start justify-start">
                                																<div className="relative tracking-[0.07px] leading-[20px]">French tutor</div>
                              															</div>
                            														</div>
                            														<div className="self-stretch flex flex-row items-start justify-start gap-item-spacing-xxs">
                              															<div className="flex flex-col items-start justify-start pt-0 px-0 pb-px">
                                																<div className="w-4 flex flex-row items-start justify-center">
                                  																	<Image className="flex-1 relative max-w-full overflow-hidden h-4" width={16} height={16} alt="" src="/Component 1.svg" />
                                																</div>
                              															</div>
                              															<div className="self-stretch flex flex-col items-start justify-start py-0 pl-0 pr-[45.2px]">
                                																<div className="relative tracking-[0.07px] leading-[20px]">
                                  																	<p className="m-0">Speaks French (Native),</p>
                                  																	<p className="m-0">English (Advanced) +2</p>
                                																</div>
                              															</div>
                            														</div>
                          													</div>
                        												</div>
                      											</div>
                      											<div className="absolute w-[101.74%] top-[88px] right-[-6.4%] left-[4.65%] rounded-lg bg-tutorhivecouk-white border-preplycom-dolphin border-[1px] border-solid box-border overflow-hidden flex flex-col items-start justify-start p-[13px] min-w-[350px]">
                        												<div className="self-stretch flex flex-row items-start justify-start gap-item-spacing-12">
                          													<Image className="w-24 relative rounded h-24 overflow-hidden shrink-0 object-cover" width={96} height={96} alt="" src="/Bassel-61d8f18fa66d8bb94d172bede9abfdc7.jpg.png" />
                          													<div className="self-stretch flex flex-col items-start justify-start gap-item-spacing-xxs">
                            														<div className="self-stretch flex flex-row items-start justify-start flex-wrap content-start text-[17.97px] text-preplycom-woodsmoke font-preplycom-semantic-heading-3">
                              															<div className="self-stretch flex flex-col items-start justify-start">
                                																<div className="relative tracking-[0.35px] leading-[24px] font-medium">Bassel</div>
                              															</div>
                            														</div>
                            														<div className="self-stretch flex flex-row items-start justify-start gap-item-spacing-xxs">
                              															<div className="flex flex-col items-start justify-start pt-0 px-0 pb-px">
                                																<div className="w-4 flex flex-row items-start justify-center">
                                  																	<Image className="flex-1 relative max-w-full overflow-hidden h-4" width={16} height={16} alt="" src="/Component 1.svg" />
                                																</div>
                              															</div>
                              															<div className="self-stretch flex flex-col items-start justify-start">
                                																<div className="relative tracking-[0.07px] leading-[20px]">French tutor</div>
                              															</div>
                            														</div>
                            														<div className="self-stretch flex flex-row items-start justify-start gap-item-spacing-xxs">
                              															<div className="flex flex-col items-start justify-start pt-0 px-0 pb-px">
                                																<div className="w-4 flex flex-row items-start justify-center">
                                  																	<Image className="flex-1 relative max-w-full overflow-hidden h-4" width={16} height={16} alt="" src="/Component 1.svg" />
                                																</div>
                              															</div>
                              															<div className="self-stretch flex flex-col items-start justify-start py-0 pl-0 pr-[45.2px]">
                                																<div className="relative tracking-[0.07px] leading-[20px]">
                                  																	<p className="m-0">Speaks French (Native),</p>
                                  																	<p className="m-0">English (Advanced) +2</p>
                                																</div>
                              															</div>
                            														</div>
                          													</div>
                        												</div>
                      											</div>
                      											<div className="absolute w-[101.74%] top-[0px] right-[-1.74%] left-[0%] rounded-lg bg-tutorhivecouk-white border-preplycom-dolphin border-[1px] border-solid box-border overflow-hidden flex flex-col items-start justify-start p-[13px] min-w-[350px]">
                        												<div className="self-stretch flex flex-row items-start justify-start gap-item-spacing-12">
                          													<Image className="w-24 relative rounded h-24 overflow-hidden shrink-0 object-cover" width={96} height={96} alt="" src="/Milena-6565f848c6ee914e0d7c853e6aab5b3b.jpg.png" />
                          													<div className="self-stretch flex flex-col items-start justify-start gap-item-spacing-xxs">
                            														<div className="self-stretch flex flex-row items-start justify-between flex-wrap content-start text-[18.44px] text-preplycom-woodsmoke font-preplycom-semantic-heading-3">
                              															<div className="self-stretch flex flex-col items-start justify-start">
                                																<div className="relative tracking-[0.35px] leading-[24px] font-medium">Milena</div>
                              															</div>
                              															<div className="self-stretch flex flex-row items-start justify-start text-xl">
                                																<div className="w-6 flex flex-row items-start justify-center">
                                  																	<Image className="flex-1 relative max-w-full overflow-hidden h-6" width={24} height={24} alt="" src="/Component 1.svg" />
                                																</div>
                                																<div className="relative tracking-[0.35px] leading-[24px] font-medium"> 4.9</div>
                              															</div>
                            														</div>
                            														<div className="self-stretch flex flex-row items-start justify-start gap-item-spacing-xxs">
                              															<div className="flex flex-col items-start justify-start pt-0 px-0 pb-px">
                                																<div className="w-4 flex flex-row items-start justify-center">
                                  																	<Image className="flex-1 relative max-w-full overflow-hidden h-4" width={16} height={16} alt="" src="/Component 1.svg" />
                                																</div>
                              															</div>
                              															<div className="self-stretch flex flex-col items-start justify-start">
                                																<div className="relative tracking-[0.07px] leading-[20px]">French tutor</div>
                              															</div>
                            														</div>
                            														<div className="self-stretch flex flex-row items-start justify-start gap-item-spacing-xxs">
                              															<div className="flex flex-col items-start justify-start pt-0 px-0 pb-px">
                                																<div className="w-4 flex flex-row items-start justify-center">
                                  																	<Image className="flex-1 relative max-w-full overflow-hidden h-4" width={16} height={16} alt="" src="/Component 1.svg" />
                                																</div>
                              															</div>
                              															<div className="self-stretch flex flex-col items-start justify-start py-0 pl-0 pr-[45.2px]">
                                																<div className="relative tracking-[0.07px] leading-[20px]">
                                  																	<p className="m-0">Speaks French (Native),</p>
                                  																	<p className="m-0">English (Advanced) +2</p>
                                																</div>
                              															</div>
                            														</div>
                          													</div>
                        												</div>
                      											</div>
                    										</div>
                  									</div>
                								</div>
              							</div>
              							<div className="self-stretch flex flex-col items-start justify-start max-w-[1280px]">
                								<div className="w-[419.4px] relative rounded bg-tutorhivecouk-white border-preplycom-woodsmoke border-[1px] border-solid box-border h-[516px] overflow-hidden shrink-0 min-w-[410px]">
                  									<div className="absolute w-[calc(100%_-_66px)] top-[33px] right-[33px] left-[33px] flex flex-col items-start justify-start gap-line-height-24">
                    										<div className="self-stretch flex flex-col items-start justify-start gap-item-spacing-12">
                      											<div className="w-10 rounded bg-preplycom-bright-sun h-10 flex flex-row items-center justify-center py-0.5 px-[11.9px] box-border">
                        												<div className="flex-1 flex flex-col items-start justify-start">
                          													<div className="self-stretch relative tracking-[0.32px] leading-[36px] font-medium">2</div>
                        												</div>
                      											</div>
                      											<div className="self-stretch flex flex-col items-start justify-start text-[40.88px]">
                        												<div className="self-stretch relative leading-[52px] font-medium">Start learning.</div>
                      											</div>
                      											<div className="self-stretch flex flex-col items-start justify-start text-base font-preplycom-semantic-button">
                        												<div className="self-stretch relative leading-[24px]">
                          													<p className="m-0">Your tutor will guide the way through your first</p>
                          													<p className="m-0">lesson and help you plan your next steps.</p>
                        												</div>
                      											</div>
                    										</div>
                    										<div className="self-stretch flex flex-row items-start justify-center flex-wrap content-start">
                      											<Image className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover" width={353} height={372} alt="" src="/card-2-da929e1032468274fff3c7a827157232.jpg.png" />
                    										</div>
                  									</div>
                								</div>
              							</div>
              							<div className="self-stretch flex flex-col items-start justify-start max-w-[1280px]">
                								<div className="self-stretch rounded bg-tutorhivecouk-white border-preplycom-woodsmoke border-[1px] border-solid box-border h-[516px] overflow-hidden shrink-0 flex flex-col items-start justify-start pt-[33px] px-[33px] pb-px min-w-[410px]">
                  									<div className="self-stretch flex flex-col items-start justify-start gap-line-height-24">
                    										<div className="self-stretch flex flex-col items-start justify-start gap-item-spacing-12">
                      											<div className="w-10 rounded bg-preplycom-dodger-blue h-10 flex flex-row items-center justify-center py-0.5 px-[11.9px] box-border">
                        												<div className="flex-1 flex flex-col items-start justify-start">
                          													<div className="self-stretch relative tracking-[0.32px] leading-[36px] font-medium">3</div>
                        												</div>
                      											</div>
                      											<div className="self-stretch flex flex-col items-start justify-center gap-line-height-24 text-[43.88px]">
                        												<div className="self-stretch h-[104px] flex flex-col items-start justify-start">
                          													<div className="self-stretch flex flex-col items-start justify-start">
                            														<div className="self-stretch relative leading-[52px] font-medium">
                              															<p className="m-0">Speak. Read.</p>
                              															<p className="m-0">Write. Repeat.</p>
                            														</div>
                          													</div>
                        												</div>
                        												<div className="self-stretch h-12 flex flex-col items-start justify-start text-base font-preplycom-semantic-button">
                          													<div className="self-stretch flex flex-col items-start justify-start">
                            														<div className="self-stretch relative leading-[24px]">
                              															<p className="m-0">Choose how many lessons you want to take each
                              															week and get ready to reach your goals!</p>
                            														</div>
                          													</div>
                        												</div>
                      											</div>
                    										</div>
                    										<div className="self-stretch flex flex-row items-start justify-center flex-wrap content-start">
                      											<Image className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover" width={361} height={175} alt="" src="/card-3-0bab46dd6b35951f6fc2e87968b6e3ea.jpg.png" />
                    										</div>
                  									</div>
                								</div>
              							</div>
            						</div>
          					</div>
        				</div>
      			</div>
      			<div className="self-stretch h-[1130px] flex flex-col items-center justify-center text-29xl">
        				<div className="self-stretch flex flex-col items-center justify-start pt-[50px] px-20 pb-0 text-center text-16xl">
          					<div className="w-[1280px] flex flex-row items-start justify-center max-w-[1280px]">
            						<div className="self-stretch flex-1 flex flex-row items-center justify-center flex-wrap content-center py-2.5 px-[129.7px]">
              							<div className="flex-1 flex flex-col items-start justify-start max-w-[1036.8px]">
                								<div className="self-stretch flex flex-col items-center justify-start py-0 px-[148.6px]">
                  									<b className="w-[881px] relative leading-[43px] flex items-center justify-center">Your Need for Assignment Help Is Fulfilled Here</b>
                								</div>
              							</div>
            						</div>
          					</div>
        				</div>
        				<div className="self-stretch flex flex-col items-center justify-start pt-[30px] px-20 pb-0 text-at-off-white">
          					<div className="w-[1280px] flex flex-row items-start justify-start max-w-[1280px]">
            						<div className="self-stretch flex-1 flex flex-row items-start justify-center py-0 pl-0 pr-5 box-border min-h-[1px]">
              							<div className="self-stretch flex-1 rounded-6xs border-at-off-white border-[1px] border-solid flex flex-row items-center justify-center flex-wrap content-center p-[11px]">
                								<div className="flex-1 flex flex-col items-center justify-start">
                  									<div className="w-[598px] flex flex-row items-start justify-start max-w-[1280px]">
                    										<div className="self-stretch w-[86.9px] flex flex-row items-start justify-center min-h-[1px]">
                      											<div className="self-stretch flex-1 rounded-81xl flex flex-row items-start justify-start flex-wrap content-start p-2.5">
                        												<div className="flex-1 flex flex-col items-center justify-start">
                          													<div className="w-[66.9px] flex flex-row items-start justify-center max-w-[1280px]">
                            														<div className="self-stretch flex-1 rounded-81xl bg-at-blue-again flex flex-row items-center justify-center flex-wrap content-center py-2.5 px-[20.8px]">
                              															<div className="flex-1 flex flex-col items-start justify-start max-w-[66.95px]">
                                																<div className="self-stretch flex flex-col items-start justify-start">
                                  																	<b className="self-stretch relative leading-[52.8px]">1</b>
                                																</div>
                              															</div>
                            														</div>
                          													</div>
                        												</div>
                      											</div>
                    										</div>
                    										<div className="self-stretch w-[511px] flex flex-row items-start justify-center min-h-[1px] text-4xl text-color-azure-15">
                      											<div className="self-stretch flex-1 flex flex-col items-start justify-center pt-[9.1px] px-2.5 pb-2.5">
                        												<div className="self-stretch h-[37.7px] flex flex-col items-start justify-start">
                          													<div className="self-stretch flex flex-col items-start justify-start pt-0 px-0 pb-[0.9px]">
                            														<b className="self-stretch relative leading-[36.8px]">Trusted Assignment Writing Service:</b>
                          													</div>
                        												</div>
                        												<div className="self-stretch h-[110.4px] flex flex-col items-start justify-start text-lg">
                          													<div className="self-stretch flex flex-col items-start justify-start">
                            														<div className="self-stretch relative leading-[24px]">
                              															<p className="m-0">At Askmeassignment.com, we pride ourselves on being the best</p>
                              															<p className="m-0">assignment writing service. Our expert assignment writers deliver</p>
                              															<p className="m-0">high-quality, plagiarism and AI-free assignments tailored to meet</p>
                              															<p className="m-0">your academic requirements.</p>
                            														</div>
                          													</div>
                        												</div>
                      											</div>
                    										</div>
                  									</div>
                								</div>
              							</div>
            						</div>
            						<div className="self-stretch flex-1 flex flex-row items-start justify-center py-0 pl-0 pr-5 box-border min-h-[1px]">
              							<div className="self-stretch flex-1 rounded-6xs border-at-off-white border-[1px] border-solid flex flex-row items-center justify-center flex-wrap content-center p-[11px]">
                								<div className="flex-1 flex flex-col items-center justify-start">
                  									<div className="w-[598px] flex flex-row items-start justify-start max-w-[1280px]">
                    										<div className="self-stretch w-[86.9px] flex flex-row items-start justify-center min-h-[1px]">
                      											<div className="self-stretch flex-1 rounded-81xl flex flex-row items-start justify-start flex-wrap content-start p-2.5">
                        												<div className="flex-1 flex flex-col items-center justify-start">
                          													<div className="w-[66.9px] flex flex-row items-start justify-center max-w-[1280px]">
                            														<div className="self-stretch flex-1 rounded-81xl bg-at-blue-again flex flex-row items-center justify-center flex-wrap content-center py-2.5 px-[20.8px]">
                              															<div className="flex-1 flex flex-col items-start justify-start max-w-[66.95px]">
                                																<div className="self-stretch flex flex-col items-start justify-start">
                                  																	<b className="self-stretch relative leading-[52.8px]">2</b>
                                																</div>
                              															</div>
                            														</div>
                          													</div>
                        												</div>
                      											</div>
                    										</div>
                    										<div className="self-stretch w-[511px] flex flex-row items-start justify-center min-h-[1px] text-4xl text-color-azure-15">
                      											<div className="self-stretch flex-1 flex flex-col items-start justify-center pt-[9.1px] px-2.5 pb-2.5">
                        												<div className="self-stretch h-[37.7px] flex flex-col items-start justify-start">
                          													<div className="self-stretch flex flex-col items-start justify-start pt-0 px-0 pb-[0.9px]">
                            														<b className="self-stretch relative leading-[36.8px]">Expert Assignment Help:</b>
                          													</div>
                        												</div>
                        												<div className="self-stretch h-[110.4px] flex flex-col items-start justify-start text-lg">
                          													<div className="self-stretch flex flex-col items-start justify-start">
                            														<div className="self-stretch relative leading-[24px]">
                              															<p className="m-0">Get access to a professional assignment helper for all your</p>
                              															<p className="m-0">academic needs. From university assignments to specialized</p>
                              															<p className="m-0">subjects like statistics and finance, our global assignment experts</p>
                              															<p className="m-0">are here to assist</p>
                            														</div>
                          													</div>
                        												</div>
                      											</div>
                    										</div>
                  									</div>
                								</div>
              							</div>
            						</div>
          					</div>
        				</div>
        				<div className="self-stretch flex flex-col items-center justify-start pt-[23px] px-20 pb-[70px] text-at-off-white">
          					<div className="w-[1280px] flex flex-row items-start justify-start max-w-[1280px]">
            						<div className="self-stretch flex-1 flex flex-row items-start justify-center py-0 pl-0 pr-5 box-border min-h-[1px]">
              							<div className="self-stretch flex-1 rounded-6xs border-at-off-white border-[1px] border-solid flex flex-row items-center justify-center flex-wrap content-center p-[11px]">
                								<div className="flex-1 flex flex-col items-center justify-start">
                  									<div className="w-[598px] flex flex-row items-start justify-start max-w-[1280px]">
                    										<div className="self-stretch w-[86.9px] flex flex-row items-start justify-center min-h-[1px]">
                      											<div className="self-stretch flex-1 rounded-81xl flex flex-row items-start justify-start flex-wrap content-start p-2.5">
                        												<div className="flex-1 flex flex-col items-center justify-start">
                          													<div className="w-[66.9px] flex flex-row items-start justify-center max-w-[1280px]">
                            														<div className="self-stretch flex-1 rounded-81xl bg-at-blue-again flex flex-row items-center justify-center flex-wrap content-center py-2.5 px-[20.8px]">
                              															<div className="flex-1 flex flex-col items-start justify-start max-w-[66.95px]">
                                																<div className="self-stretch flex flex-col items-start justify-start">
                                  																	<b className="self-stretch relative leading-[52.8px]">3</b>
                                																</div>
                              															</div>
                            														</div>
                          													</div>
                        												</div>
                      											</div>
                    										</div>
                    										<div className="self-stretch w-[511px] flex flex-row items-start justify-center min-h-[1px] text-4xl text-color-azure-15">
                      											<div className="self-stretch flex-1 flex flex-col items-start justify-center pt-[9.1px] px-2.5 pb-2.5">
                        												<div className="self-stretch h-[37.7px] flex flex-col items-start justify-start">
                          													<div className="self-stretch flex flex-col items-start justify-start pt-0 px-0 pb-[0.9px]">
                            														<b className="self-stretch relative leading-[36.8px]">Affordable Online Assignment Help:</b>
                          													</div>
                        												</div>
                        												<div className="self-stretch h-[110.4px] flex flex-col items-start justify-start text-lg">
                          													<div className="self-stretch flex flex-col items-start justify-start">
                            														<div className="self-stretch relative leading-[24px]">
                              															<p className="m-0">Looking for a cheap assignment helper without compromising</p>
                              															<p className="m-0">quality? We offer cost- effective solutions with 24/7 support. Our</p>
                                																<p className="m-0">online homework help ensures your assignments are completed</p>
                                																<p className="m-0">on time</p>
                                																</div>
                                																</div>
                                																</div>
                                																</div>
                                																</div>
                                																</div>
                                																</div>
                                																</div>
                                																</div>
                                																<div className="self-stretch flex-1 flex flex-row items-start justify-center py-0 pl-0 pr-5 box-border min-h-[1px]">
                                  																	<div className="self-stretch flex-1 rounded-6xs border-at-off-white border-[1px] border-solid flex flex-row items-center justify-center flex-wrap content-center py-[18.2px] px-[11px]">
                                    																		<div className="flex-1 flex flex-col items-center justify-start">
                                      																			<div className="w-[598px] flex flex-row items-start justify-start max-w-[1280px]">
                                        																				<div className="self-stretch w-[86.9px] flex flex-row items-start justify-center min-h-[1px]">
                                          																					<div className="self-stretch flex-1 rounded-81xl flex flex-row items-start justify-start flex-wrap content-start p-2.5">
                                            																						<div className="flex-1 flex flex-col items-center justify-start">
                                              																							<div className="w-[66.9px] flex flex-row items-start justify-center max-w-[1280px]">
                                                																								<div className="self-stretch flex-1 rounded-81xl bg-at-blue-again flex flex-row items-center justify-center flex-wrap content-center py-2.5 px-[20.8px]">
                                                  																									<div className="flex-1 flex flex-col items-start justify-start max-w-[66.95px]">
                                                    																										<div className="self-stretch flex flex-col items-start justify-start">
                                                      																											<b className="self-stretch relative leading-[52.8px]">4</b>
                                                    																										</div>
                                                  																									</div>
                                                																								</div>
                                              																							</div>
                                            																						</div>
                                          																					</div>
                                        																				</div>
                                        																				<div className="self-stretch w-[511px] flex flex-row items-start justify-center min-h-[1px] text-4xl text-color-azure-15">
                                          																					<div className="self-stretch flex-1 flex flex-col items-start justify-center pt-[9.1px] px-2.5 pb-2.5">
                                            																						<div className="self-stretch h-[37.7px] flex flex-col items-start justify-start">
                                              																							<div className="self-stretch flex flex-col items-start justify-start pt-0 px-0 pb-[0.9px]">
                                                																								<b className="self-stretch relative leading-[36.8px]">Trusted Assignment Writing Service:</b>
                                              																							</div>
                                            																						</div>
                                            																						<div className="self-stretch h-24 flex flex-col items-start justify-start text-lg">
                                              																							<div className="self-stretch flex flex-col items-start justify-start">
                                                																								<div className="self-stretch relative leading-[24px]">
                                                  																									<p className="m-0">Your Academic Success Partner: Whether you need help with</p>
                                                  																									<p className="m-0">assignments or guidance from the best assignment helper,</p>
                                                  																									<p className="m-0">Askmeassignment.com is your go-to platform. Order now for</p>
                                                  																									<p className="m-0">reliable and timely results</p>
                                                																								</div>
                                              																							</div>
                                            																						</div>
                                          																					</div>
                                        																				</div>
                                      																			</div>
                                    																		</div>
                                  																	</div>
                                																</div>
                                																</div>
                                																</div>
                                																<div className="self-stretch flex flex-col items-center justify-start py-0 px-20 text-10xl m-20">
                                  																	<div className="w-[1280px] flex flex-row items-start justify-start max-w-[1280px]">
                                    																		<div className="self-stretch flex-1 flex flex-row items-start justify-center min-h-[1px]">
                                      																			<div className="w-[640px] h-[528.6px] flex flex-col items-start justify-end pt-[79.6px] pb-[90.1px] pl-0 pr-[50px] box-border">
                                        																				<div className="w-[590px] flex flex-col items-start justify-start pt-0 px-0 pb-5 box-border">
                                          																					<div className="self-stretch flex flex-col items-start justify-start">
                                            																						<b className="self-stretch relative leading-[30px]">
                                              																							<p className="m-0">Lowest Prices for the Best Quality</p>
                                              																							<p className="m-0">Assignments</p>
                                            																						</b>
                                          																					</div>
                                        																				</div>
                                        																				<div className="w-[590px] flex flex-col items-start justify-start pt-0 px-0 pb-[34.4px] box-border text-lg">
                                          																					<div className="self-stretch flex flex-col items-start justify-start">
                                            																						<div className="self-stretch relative leading-[24px]">
                                              																							<p className="m-0">We are offering the best assignment writing service in low prices. We provide
                                              																							high-quality, plagiarism and AI-free assistance across all subjects. From
                                              																							statistics assignment helpers to finance assignment experts, we cater to
                                              																							diverse academic needs. Our assignment writing service ensures timely
                                              																							delivery, affordable pricing, and expert guidance. Experience the easiest and
                                              																							most stress-free way to achieve academic success with our best assignment
                                              																							helpers
                                              																							today</p>
                                            																						</div>
                                          																					</div>
                                        																				</div>
                                        																				<div className="w-[590px] flex flex-col items-start justify-start max-w-[640px] text-base text-text-colors-25 font-text-md-semibold">
                                          																					<div className="self-stretch flex flex-col items-start justify-start">
                                            																						<div className="shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] rounded-lg bg-at-button-light border-at-button-light border-[1px] border-solid overflow-hidden flex flex-row items-center justify-center py-2.5 px-3.5">
                                              																							<div className="relative leading-[24px] font-semibold">Got an Assignment?</div>
                                                																								</div>
                                                																								</div>
                                                																								</div>
                                                																								</div>
                                                																								</div>
                                                																								<div className="self-stretch flex-[0.9688] flex flex-row items-start justify-center p-2.5 box-border min-h-[1px]">
                                                  																									<div className="self-stretch flex-1 flex flex-col items-center justify-start">
                                                    																										<div className="w-[620px] flex flex-row items-start justify-start max-w-[1280px]">
                                                      																											<div className="self-stretch w-[388.7px] flex flex-row items-start justify-center min-h-[1px]">
                                                        																												<div className="self-stretch flex-1 flex flex-row items-start justify-start flex-wrap content-start p-2.5">
                                                          																													<div className="self-stretch flex-1 flex flex-col items-start justify-start max-w-[463.43px]">
                                                            																														<div className="self-stretch flex flex-col items-center justify-center">
                                                              																															<Image className="w-[368.7px] relative h-[488.6px] overflow-hidden shrink-0 object-cover max-w-[368.73px]" width={369} height={489} alt="" src="/Untitled-400-x-530-px.png.png" />
                                                            																														</div>
                                                          																													</div>
                                                        																												</div>
                                                      																											</div>
                                                      																											<div className="self-stretch w-[229.6px] flex flex-row items-start justify-center min-h-[1px]">
                                                        																												<div className="self-stretch flex-1 flex flex-col items-start justify-center pt-2.5 px-2.5 pb-[10.7px]">
                                                          																													<div className="w-[209.6px] h-[210.2px] flex flex-col items-start justify-start max-w-[273.7px]">
                                                            																														<div className="self-stretch flex flex-col items-center justify-center">
                                                              																															<Image className="w-[209.6px] relative h-[190.2px] overflow-hidden shrink-0 object-cover max-w-[209.58px]" width={210} height={190} alt="" src="/Untitled-270-x-245-px.png.png" />
                                                            																														</div>
                                                          																													</div>
                                                          																													<div className="w-[209.6px] h-[277.7px] flex flex-col items-start justify-start max-w-[273.7px]">
                                                            																														<div className="self-stretch flex flex-col items-center justify-center">
                                                              																															<Image className="w-[209.6px] relative h-[277.7px] overflow-hidden shrink-0 object-cover max-w-[209.58px]" width={210} height={278} alt="" src="/Untitled-400-x-530-px-1.png.png" />
                                                            																														</div>
                                                          																													</div>
                                                        																												</div>
                                                      																											</div>
                                                    																										</div>
                                                  																									</div>
                                                																								</div>
                                                																								</div>
                                                																								</div>
                                                																								</div>

																																				</div>
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
																																			  </div>
																																				);
																																				};
																																				export default Sectionss;
																																																																																																																																		