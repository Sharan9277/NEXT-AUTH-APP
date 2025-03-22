"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { FaDollarSign, FaBook, FaFileInvoice } from "react-icons/fa";
import Sidebar from "@/components/Sidebar";
import TutorNavbar from "@/components/TutorNavbar";


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const TutorEarnings = ({ params }) => {
    const { data: session } = useSession();

    const tutorId = session?.user?.id;

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

    return (
        <div className="flex bg-[#F1f1f1] h-screen">
          <Sidebar active="My Schedule" />
          <div className="mx-auto w-full">
            <TutorNavbar />
        <div className="p-6 text-black font-inter">
            {/* Earnings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <EarningsCard icon={<FaDollarSign size={20} />} amount={earnings.totalIncome} title="Total Earnings"  />
                <EarningsCard icon={<FaBook size={20}/>} title="Lesson Earnings" amount={earnings.incomeFromLessons} />
                <EarningsCard icon={<FaFileInvoice size={20} />} title="Assignment Earnings" amount={earnings.incomeFromAssignments} />
            </div>

            {/* Statistics & Bank Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Earnings Statistics</h2>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="6months">Last 6 Months</option>
                        </select>
                    </div>
                    {chartData ? <Line data={chartData} /> : <p>Loading chart...</p>}
                </div>

                {/* Bank Details */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Bank Account Details</h2>
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
    <div className="bg-white shadow-md rounded-lg flex items-center p-4 w-full">
        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg flex items-center justify-center w-12 h-12">
            {icon}
        </div>
        <div className="ml-4">
            <h2 className="text-xl font-semibold">${amount.toFixed(2)}</h2>
            <p className="text-gray-500 text-sm">{title}</p>
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
        <div>
            <p><strong>Bank Name:</strong> {bankDetails.bankName || "N/A"}</p>
            <p><strong>Account Number:</strong> {bankDetails.accountNumber || "N/A"}</p>
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Update Bank Details
            </button>
        </div>
    );
};

export default TutorEarnings;
