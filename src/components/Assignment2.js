import Head from 'next/head';
import { FaFileAlt, FaChevronRight } from 'react-icons/fa';

export default function Assignment2() {
  return (
<div>
 <div className="container mx-auto px-4 py-8 font-roboto">
  <div className="flex flex-col md:flex-row justify-between items-center mb-8">
   <div className="text-left">
    <h1 className="text-3xl font-bold font-inter text-[40px] text-black">
     We Write any type of assignment
    </h1>
    <p className="text-gray-600">
     Just specify what kind of help you're looking for.
    </p>
   </div>
   <div className="text-right flex items-center">
    <FaFileAlt className="text-gray-600 mr-2">
    </FaFileAlt>
    <p className="text-gray-600">
     All we need is your instructions
    </p>
   </div>
  </div>
  <div className="flex flex-col md:flex-row justify-center gap-8">
   <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex-1">
    <h2 className=" font-medium mb-4 text-black font-Montserrat text-[40px] max-w-[400px]">
     We write assignments and more
    </h2>
    <p className="text-gray-600 mb-4">
     Our 460+ writers are always ready to tackle your papers, from research projects in management and psychology to creative writing tasks.
    </p>
    <a className="text-yellow-500 flex items-center" href="#">
     <FaChevronRight className="mr-2">
     </FaChevronRight>
     Learn more about writing subjects
    </a>
    <img alt="A shelf filled with colorful books" className="mt-4 rounded-lg w-full h-[400px]" src="/shutterstock_196039253.jpg"/>
   </div>
   <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex-1 relative">
   <img 
      alt="A hand holding a yellow sculpture of a head with a yellow stripe in the background" 
      className="absolute inset-0 w-full h-full object-cover rounded-lg max-w-full max-h-full" 
      src="/background23.png"
    />

    <div className="relative z-10">
     <h2 className="font-medium mb-4 text-black font-Montserrat text-[40px] max-w-[550px]">
      We help with STEM tasks of any size
     </h2>
     <p className="text-gray-600 mb-4">
      Assignments in maths, programming, and other complex subjects aren't an issue for our qualified experts. All you need to do is place an order.
     </p>
     <a className="text-yellow-500 flex items-center" href="#">
      <FaChevronRight className="mr-2">
      </FaChevronRight>
      Learn more about writing subjects
     </a>
    </div>
   </div>
  </div>
 </div>
</div>
);
}