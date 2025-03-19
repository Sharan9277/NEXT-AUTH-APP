import { MessageSquare, FileCheck, BookOpen, FileText } from "lucide-react"

export default function AssignmentHelpFeatures() {
  return (
    <div className="bg-at-light-orange  py-16 px-4 ">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-[#1e2859] text-4xl font-bold mb-4">Our Distinctive Features for Assignment Help</h1>
          <p className="text-[#1e2859] max-w-4xl mx-auto">
            India Assignment Help is the best choice among students for all their academic needs as we deliver
            assignment writing services with unparalleled features.
          </p>
        </div>

        <div className="bg-[#fdfdfd] p-8 rounded-lg shadow-md mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 relative">
                <div className="w-20 h-20 flex items-center justify-center">
                  <MessageSquare className="w-16 h-16 text-[#e6a43a] stroke-[1.5]" />
                  <div className="absolute top-1 right-1 bg-white rounded-md px-1 border border-[#e6a43a]">
                    <span className="text-red-500 font-bold text-sm">LIVE</span>
                  </div>
                  <div className="absolute bottom-1 left-4 flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-[#e6a43a]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#e6a43a]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#e6a43a]"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-[#1e2859] text-xl font-bold mb-2">24/7 Live Sessions</h3>
              <p className="text-[#1e2859] text-sm">
                Connect with our online experts any time you want, call or live chat and get instant academic help. We
                are available round the clock for professional assistance and one-to-one sessions in English, Hindi, and
                Punjabi.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <div className="w-20 h-20 flex items-center justify-center">
                  <FileCheck className="w-16 h-16 text-[#e6a43a] stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-[#1e2859] text-xl font-bold mb-2">Quality Guarantee</h3>
              <p className="text-[#1e2859] text-sm">
                Each assignment is checked by our quality assurance team before submission. Our experts strictly adhere
                to marking criteria of each and every assignment to ensure the best quality.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <div className="w-20 h-20 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-[#e6a43a] stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-[#1e2859] text-xl font-bold mb-2">Services for All Subjects</h3>
              <p className="text-[#1e2859] text-sm">
                Stuck with your complex assignment? Get flawless assignment writing services on any subject at any level
                by our subject matter experts. Let us help you achieve the grades you aspire for.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <div className="w-20 h-20 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-[#e6a43a] stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-[#1e2859] text-xl font-bold mb-2">Credible References</h3>
              <p className="text-[#1e2859] text-sm">
                We only use credible academic sources such as peer-reviewed journal articles, books, research articles,
                government websites, and reputed newspapers in our assignments as a reference.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button className="bg-transparent hover:bg-[#1e2859] text-[#1e2859] hover:text-white border-2 border-[#1e2859] rounded-full py-3 px-8 font-medium transition-colors duration-300">
            Place Your Order
          </button>
        </div>
      </div>
    </div>
  )
}

