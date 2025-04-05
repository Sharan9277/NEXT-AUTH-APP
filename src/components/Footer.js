import Image from "next/image";

const Footer = () => {
    return (
        <>
            <div className="bg-[#5577D1] shadow-sm">
                <div className="w-full max-w-screen-xl mx-auto p-3 md:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <a href="https://AssignTutors.com/" className="flex items-center mb-3 sm:mb-0 space-x-3 rtl:space-x-reverse">
                            <img src="/AssignTutor_Final_Logo_White.png" className="w-2/3 sm:w-1/2" alt="AssignTutors Logo" />
                        </a>
                        <div className="flex flex-wrap gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 font-inter text-[14px]">
                            <button className="text-black bg-white dark:text-black py-[8px] px-[10px] rounded-full focus:outline-none hover:text-black dark:hover:text-black">Book a Demo</button>
                            <button className="text-black bg-white dark:text-black py-[8px] px-[10px] rounded-full focus:outline-none hover:text-black dark:hover:text-black">Contact Us</button>
                        </div>
                    </div>
                    <hr className="my-4 border-white sm:mx-auto dark:border-white lg:my-6" />
                </div>

                <footer className="bg-[#5577D1]">
                    <div className="mx-auto w-full max-w-screen-xl">
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 px-4 pb-4 lg:pb-6 md:grid-cols-3 lg:grid-cols-5 items-middle">
                            <div>
                                <h2 className="mb-3 text-[16px] md:text-[18px] font-semibold font-inter text-white uppercase dark:text-white">Company</h2>
                                <ul className="text-white text-[14px] font-inter dark:text-white font-regular">
                                    <li className="mb-2">
                                        <a href="/about-us" className="hover:underline">About Us</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="/How-we-work" className="hover:underline">How we work?</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="/our-services" className="hover:underline">Our Services</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">Blog</a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-3 text-[16px] md:text-[18px] font-semibold font-inter text-white uppercase dark:text-white">Help center</h2>
                                <ul className="text-white text-[14px] font-inter dark:text-white font-regular">
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">Discord Server</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">Twitter</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">Facebook</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">Contact Us</a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-3 text-[16px] md:text-[18px] font-semibold font-inter text-white uppercase dark:text-white">Legal</h2>
                                <ul className="text-white text-[14px] font-inter dark:text-white font-regular">
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">Privacy Policy</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">Licensing</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-3 text-[16px] md:text-[18px] font-semibold font-inter text-white uppercase dark:text-white">Download</h2>
                                <ul className="text-white text-[14px] font-inter dark:text-white font-regular">
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">iOS</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">Android</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">Windows</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">MacOS</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="hidden md:block lg:block">
                                <h2 className="mb-3 text-[16px] md:text-[18px] font-semibold font-inter text-white uppercase dark:text-white">Download</h2>
                                <ul className="text-white text-[14px] font-inter dark:text-white font-regular">
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">iOS</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">Android</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">Windows</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="hover:underline">MacOS</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <hr className="my-4 border-white sm:mx-auto dark:border-white lg:my-6" />
                        <div className="px-4 pb-4 flex flex-col md:flex-row md:items-center md:justify-between">
                            <span className="text-xs md:text-sm text-white dark:text-white text-center md:text-left mb-3 md:mb-0">© 2025 <a href="https://AssignTutors.com/">AssignTutors™</a>. All Rights Reserved.
                            </span>
                            <div className="flex justify-center md:justify-end mt-2 sm:justify-center md:mt-0 space-x-4 rtl:space-x-reverse">
                                <div className="bg-white w-[32px] h-[32px] rounded-full flex items-center justify-center">
                                    <a href="#" className="text-[#5577D1] hover:text-[#5577D1] dark:hover:text-[#5577D1]">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/>
                                        </svg>
                                        <span className="sr-only">GitHub account</span>
                                    </a>
                                </div>
                                <div className="bg-white w-[32px] h-[32px] rounded-full flex items-center justify-center">
                                    <a href="#" className="text-[#5577D1] hover:text-[#5577D1] dark:hover:text-[#5577D1]">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/>
                                        </svg>
                                        <span className="sr-only">GitHub account</span>
                                    </a>
                                </div>
                                <div className="bg-white w-[32px] h-[32px] rounded-full flex items-center justify-center">
                                    <a href="#" className="text-[#5577D1] hover:text-[#5577D1] dark:hover:text-[#5577D1]">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/>
                                        </svg>
                                        <span className="sr-only">GitHub account</span>
                                    </a>
                                </div>
                                <div className="bg-white w-[32px] h-[32px] rounded-full flex items-center justify-center">
                                    <a href="#" className="text-[#5577D1] hover:text-[#5577D1] dark:hover:text-[#5577D1]">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/>
                                        </svg>
                                        <span className="sr-only">GitHub account</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default Footer;