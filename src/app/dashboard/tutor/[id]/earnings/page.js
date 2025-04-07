"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { FaDollarSign, FaBook, FaFileInvoice } from "react-icons/fa";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TutorNavbar from "@/components/TutorNavbar";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const TutorEarnings = ({ params }) => {
    const { data: session } = useSession();
    const tutorId = session?.user?.id;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [earnings, setEarnings] = useState({
        totalIncome: 0,
        incomeFromLessons: 0,
        incomeFromAssignments: 0,
    });

    const [chartData, setChartData] = useState(null);
    const [timeRange, setTimeRange] = useState("7days");

    useEffect(() => {
        fetchEarnings();
        fetchChartData(timeRange);
    }, [tutorId, timeRange]);

    const fetchEarnings = async () => {
        try {
            const res = await fetch(`/api/tutors/${tutorId}/earnings`);
            const data = await res.json();
            if (data.success) setEarnings(data);
        } catch (error) {
            console.error("Error fetching earnings:", error);
        }
    };

    const fetchChartData = async (range) => {
        try {
            const res = await fetch(`/api/tutors/${tutorId}/earnings/chart?range=${range}`);
            const data = await res.json();
            if (data.success) {
                setChartData({
                    labels: data.labels, // Dates
                    datasets: [
                        {
                            label: "Earnings ($)",
                            data: data.values, // Earnings per day
                            borderColor: "#4F46E5",
                            backgroundColor: "rgba(79, 70, 229, 0.2)",
                        },
                    ],
                });
            }
        } catch (error) {
            console.error("Error fetching chart data:", error);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex bg-[#F1f1f1] min-h-screen">
            {/* Sidebar - hidden on mobile by default */}
            <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block fixed md:static z-30 h-full md:h-auto`}>
                <Sidebar active="Earnings" />
            </div>
            
            {/* Overlay when sidebar is open on mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 w-full">
                <div className="sticky top-0 z-10">
                    <TutorNavbar>
                        <button 
                            className="md:hidden mr-2 p-2" 
                            onClick={toggleSidebar}
                        >
                            <Menu size={24} />
                        </button>
                    </TutorNavbar>
                </div>

                <div className="p-4 md:p-6 text-black font-inter">
                    {/* Earnings Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
                        <EarningsCard icon={<FaDollarSign size={20} />} amount={earnings.totalIncome} title="Total Earnings" />
                        <EarningsCard icon={<FaBook size={20} />} title="Lesson Earnings" amount={earnings.incomeFromLessons} />
                        <EarningsCard icon={<FaFileInvoice size={20} />} title="Assignment Earnings" amount={earnings.incomeFromAssignments} />
                    </div>

                    {/* Statistics & Bank Details Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        {/* Earnings Chart */}
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                <h2 className="text-base md:text-lg font-semibold mb-2 sm:mb-0">Earnings Statistics</h2>
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="border p-1 md:p-2 rounded text-sm md:text-base"
                                >
                                    <option value="7days">Last 7 Days</option>
                                    <option value="30days">Last 30 Days</option>
                                    <option value="6months">Last 6 Months</option>
                                </select>
                            </div>
                            <div className="h-64 md:h-80">
                                {chartData ? <Line data={chartData} options={{ 
                                    maintainAspectRatio: false,
                                    responsive: true 
                                }} /> : <p>Loading chart...</p>}
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                            <h2 className="text-base md:text-lg font-semibold mb-4">Bank Account Details</h2>
                            <BankAccountDetails tutorId={tutorId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Earnings Card Component
const EarningsCard = ({ icon, amount, title }) => (
    <div className="bg-white shadow-md rounded-lg flex items-center p-3 md:p-4 w-full">
        <div className="bg-indigo-100 text-indigo-600 p-2 md:p-3 rounded-lg flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
            {icon}
        </div>
        <div className="ml-3 md:ml-4">
            <h2 className="text-lg md:text-xl font-semibold">${amount.toFixed(2)}</h2>
            <p className="text-gray-500 text-xs md:text-sm">{title}</p>
        </div>
    </div>
);

// Bank Account Component
const BankAccountDetails = ({ tutorId }) => {
    const [bankDetails, setBankDetails] = useState({ accountNumber: "", bankName: "" });

    useEffect(() => {
        fetchBankDetails();
    }, [tutorId]);

    const fetchBankDetails = async () => {
        try {
            const res = await fetch(`/api/tutors/${tutorId}/bank`);
            const data = await res.json();
            if (data.success) setBankDetails(data);
        } catch (error) {
            console.error("Error fetching bank details:", error);
        }
    };

    return (
        <div className="text-sm md:text-base">
            <p className="mb-2"><strong>Bank Name:</strong> {bankDetails.bankName || "N/A"}</p>
            <p className="mb-2"><strong>Account Number:</strong> {bankDetails.accountNumber || "N/A"}</p>
            <button className="mt-3 md:mt-4 px-3 py-1 md:px-4 md:py-2 bg-indigo-600 text-white text-sm md:text-base rounded hover:bg-indigo-700 transition-colors">
                Update Bank Details
            </button>
        </div>
    );
};

export default TutorEarnings;   