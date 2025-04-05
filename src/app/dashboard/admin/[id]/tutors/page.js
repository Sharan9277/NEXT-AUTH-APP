"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import { Search, Filter, Edit2, Trash2, User, Briefcase, Calendar, Star, ChevronLeft, Eye, X, Check, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tutorDetailsLoading, setTutorDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "name",
    sortOrder: "asc",
    verificationStatus: "all",
    minHourlyRate: "",
    maxHourlyRate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    about_me: "",
    country: "",
    hourly_rate: 0,
    monthly_rate: 0,
    subject_expertise: [],
    specialties: [],
    qualifications: [],
    languages_spoken: [],
    isVerified: false,
    isAdminVerified: false
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const router = useRouter();

  // Fetch all tutors on component mount
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tutors");
        if (!response.ok) {
          throw new Error("Failed to fetch tutors");
        }
        const data = await response.json();
        setTutors(data);
      } catch (err) {
        console.error("Error fetching tutors:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  // Process hourly rate (convert from Decimal128 format if needed)
  const processHourlyRate = (tutor) => {
    if (typeof tutor.hourly_rate === 'object' && tutor.hourly_rate.$numberDecimal) {
      return parseFloat(tutor.hourly_rate.$numberDecimal);
    }
    return tutor.hourly_rate || 0;
  };

  // Process monthly rate (convert from Decimal128 format if needed)
  const processMonthlyRate = (tutor) => {
    if (typeof tutor.monthly_rate === 'object' && tutor.monthly_rate.$numberDecimal) {
      return parseFloat(tutor.monthly_rate.$numberDecimal);
    }
    return tutor.monthly_rate || 0;
  };

  // Process earnings (convert from Decimal128 format)
  const processEarnings = (tutor) => {
    if (typeof tutor.earnings === 'object' && tutor.earnings.$numberDecimal) {
      return parseFloat(tutor.earnings.$numberDecimal);
    }
    return 0;
  };

  // Filter and sort tutors based on search term and filters
  const filteredTutors = tutors
    .filter(tutor => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          tutor.name?.toLowerCase().includes(searchLower) ||
          tutor.user_id?.email?.toLowerCase().includes(searchLower) ||
          tutor.country?.toLowerCase().includes(searchLower) ||
          tutor.subject_expertise?.some(subject => subject.toLowerCase().includes(searchLower)) ||
          tutor.specialties?.some(specialty => specialty.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }
      
      // Verification status filter
      if (filters.verificationStatus !== "all") {
        if (filters.verificationStatus === "verified" && !tutor.isAdminVerified) {
          return false;
        }
        if (filters.verificationStatus === "unverified" && tutor.isAdminVerified) {
          return false;
        }
      }
      
      // Hourly rate filter
      const hourlyRate = processHourlyRate(tutor);
      if (filters.minHourlyRate && hourlyRate < parseFloat(filters.minHourlyRate)) {
        return false;
      }
      if (filters.maxHourlyRate && hourlyRate > parseFloat(filters.maxHourlyRate)) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      const { sortBy, sortOrder } = filters;
      
      let valueA, valueB;
      
      if (sortBy === "email") {
        valueA = a.user_id?.email?.toLowerCase() || "";
        valueB = b.user_id?.email?.toLowerCase() || "";
      } else if (sortBy === "hourly_rate") {
        valueA = processHourlyRate(a);
        valueB = processHourlyRate(b);
      } else if (sortBy === "country") {
        valueA = a.country?.toLowerCase() || "";
        valueB = b.country?.toLowerCase() || "";
      } else {
        // Default to name
        valueA = a.name?.toLowerCase() || "";
        valueB = b.name?.toLowerCase() || "";
      }
      
      if (sortOrder === "asc") {
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
      } else {
        if (valueA > valueB) return -1;
        if (valueA < valueB) return 1;
        return 0;
      }
    });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Fetch tutor details when a tutor is selected
  const handleViewTutor = async (tutor) => {
    setSelectedTutor(tutor);
    setFormData({
      name: tutor.name || "",
      email: tutor.user_id?.email || "",
      phone: tutor.phone || "",
      bio: tutor.bio || "",
      about_me: tutor.about_me || "",
      country: tutor.country || "",
      hourly_rate: processHourlyRate(tutor),
      monthly_rate: processMonthlyRate(tutor),
      subject_expertise: tutor.subject_expertise || [],
      specialties: tutor.specialties || [],
      qualifications: tutor.qualifications || [],
      languages_spoken: tutor.languages_spoken || [],
      isVerified: tutor.isVerified || false,
      isAdminVerified: tutor.isAdminVerified || false
    });
    setTutorDetailsLoading(true);
    
    try {
      // Fetch bookings
      const bookingsResponse = await fetch(`/api/tutors/${tutor.user_id._id}/bookings`);
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.bookings || []);
      }
      
      // Fetch reviews
      const reviewsResponse = await fetch(`/api/reviews/fetch/${tutor._id}`);
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || []);
      }
    } catch (err) {
      console.error("Error fetching tutor details:", err);
    } finally {
      setTutorDetailsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle array inputs (comma-separated)
  const handleArrayChange = (e, field) => {
    const arrayValues = e.target.value.split(",").map(s => s.trim()).filter(s => s);
    setFormData(prev => ({
      ...prev,
      [field]: arrayValues
    }));
  };

  // Update tutor details
  const handleUpdateTutor = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/admins/tutors/${selectedTutor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update tutor");
      }
      
      const updatedTutor = await response.json();
      
      // Update the tutors list with the updated tutor
      setTutors(prevTutors => 
        prevTutors.map(t => 
          t._id === selectedTutor._id ? updatedTutor : t
        )
      );
      
      // Update the selected tutor
      setSelectedTutor(updatedTutor);
      setIsEditing(false);
      
      // Show success notification
      alert("Tutor updated successfully");
      
    } catch (err) {
      console.error("Error updating tutor:", err);
      alert("Failed to update tutor: " + err.message);
    }
  };

  // Delete tutor
  const handleDeleteTutor = async () => {
    try {
      const response = await fetch(`/api/admins/tutors/${selectedTutor._id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete tutor");
      }
      
      // Remove the tutor from the list
      setTutors(prevTutors => 
        prevTutors.filter(t => t._id !== selectedTutor._id)
      );
      
      // Close the tutor details panel
      setSelectedTutor(null);
      setDeleteConfirmOpen(false);
      
      // Show success notification
      alert("Tutor deleted successfully");
      
    } catch (err) {
      console.error("Error deleting tutor:", err);
      alert("Failed to delete tutor: " + err.message);
    }
  };

  // Toggle verification status
  const handleToggleVerification = async (tutor) => {
    try {
      const response = await fetch(`/api/admins/tutors/${tutor._id}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isAdminVerified: !tutor.isAdminVerified
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update verification status");
      }
      
      const updatedTutor = await response.json();
      
      // Update the tutors list with the updated tutor
      setTutors(prevTutors => 
        prevTutors.map(t => 
          t._id === tutor._id ? updatedTutor : t
        )
      );
      
    } catch (err) {
      console.error("Error updating verification status:", err);
      alert("Failed to update verification status: " + err.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen text-black">
      {/* Navbar */}
      <AdminNavbar />
    
      {/* Main Content with Sidebar and Dashboard Section */}
      <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
        {/* Sidebar */}
        <div className="w-full md:w-60 mb-4 md:mb-0">
          <AdminSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Tutors Management</h1>
              
              {/* Search and Filter Bar */}
              <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 md:min-w-64">
                  <input
                    type="text"
                    placeholder="Search tutors..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                <button
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={18} />
                  <span>Filter</span>
                </button>
              </div>
            </div>
            
            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Sort By</label>
                    <select
                      className="border border-gray-300 rounded-md p-2"
                      value={filters.sortBy}
                      onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    >
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="hourly_rate">Hourly Rate</option>
                      <option value="country">Country</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Order</label>
                    <select
                      className="border border-gray-300 rounded-md p-2"
                      value={filters.sortOrder}
                      onChange={(e) => setFilters({...filters, sortOrder: e.target.value})}
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Verification Status</label>
                    <select
                      className="border border-gray-300 rounded-md p-2"
                      value={filters.verificationStatus}
                      onChange={(e) => setFilters({...filters, verificationStatus: e.target.value})}
                    >
                      <option value="all">All</option>
                      <option value="verified">Verified</option>
                      <option value="unverified">Unverified</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 mb-1">Min Rate ($)</label>
                      <input
                        type="number"
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={filters.minHourlyRate}
                        onChange={(e) => setFilters({...filters, minHourlyRate: e.target.value})}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 mb-1">Max Rate ($)</label>
                      <input
                        type="number"
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={filters.maxHourlyRate}
                        onChange={(e) => setFilters({...filters, maxHourlyRate: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => {
                      setFilters({
                        sortBy: "name",
                        sortOrder: "asc",
                        verificationStatus: "all",
                        minHourlyRate: "",
                        maxHourlyRate: "",
                      });
                      setSearchTerm("");
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Tutors Table */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                Error: {error}
              </div>
            ) : filteredTutors.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No tutors found matching your search criteria
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tutor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expertise
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rates
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTutors.map((tutor) => (
                      <tr key={tutor._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {tutor.profile_image ? (
                                <img 
                                  src={tutor.profile_image} 
                                  alt={tutor.name} 
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <User size={20} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{tutor.name}</div>
                              <div className="text-sm text-gray-500">{tutor.country}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{tutor.user_id?.email}</div>
                          <div className="text-sm text-gray-500">{tutor.phone || "No phone"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {tutor.subject_expertise?.join(", ") || "No subjects"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(processHourlyRate(tutor))}/hr</div>
                          {processMonthlyRate(tutor) > 0 && (
                            <div className="text-sm text-gray-500">{formatCurrency(processMonthlyRate(tutor))}/mo</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleVerification(tutor)}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              tutor.isAdminVerified 
                                ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            }`}
                          >
                            {tutor.isAdminVerified ? (
                              <>
                                <CheckCircle size={14} className="mr-1" />
                                Verified
                              </>
                            ) : (
                              "Unverified"
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewTutor(tutor)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Tutor Details Sidebar */}
        {selectedTutor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
            <div className="bg-white w-full md:w-2/5 lg:w-1/3 h-full overflow-y-auto p-6 animate-slide-in-right">
              <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={() => {
                    setSelectedTutor(null);
                    setIsEditing(false);
                    setDeleteConfirmOpen(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeft size={24} />
                </button>
                <h2 className="text-xl font-bold text-center flex-1">Tutor Details</h2>
                <div className="flex gap-2">
                  {!isEditing && (
                    <>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmOpen(true)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {deleteConfirmOpen && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h3 className="text-red-600 font-semibold mb-2">Delete Tutor Account</h3>
                  <p className="text-red-600 mb-4">Are you sure you want to delete this tutor? This action cannot be undone and will remove all associated data.</p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setDeleteConfirmOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteTutor}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
              
              {tutorDetailsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {isEditing ? (
                    <form onSubmit={handleUpdateTutor} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                          <input
                            type="number"
                            name="hourly_rate"
                            value={formData.hourly_rate}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rate ($)</label>
                          <input
                            type="number"
                            name="monthly_rate"
                            value={formData.monthly_rate}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows="2"
                          ></textarea>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Detailed About Me</label>
                          <textarea
                            name="about_me"
                            value={formData.about_me}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows="4"
                          ></textarea>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Subject Expertise (comma-separated)</label>
                          <input
                            type="text"
                            value={formData.subject_expertise.join(", ")}
                            onChange={(e) => handleArrayChange(e, "subject_expertise")}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Specialties (comma-separated)</label>
                          <input
                            // Continuation of the TutorsPage component form section
                            type="text"
                            value={formData.specialties.join(", ")}
                            onChange={(e) => handleArrayChange(e, "specialties")}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications (comma-separated)</label>
                          <input
                            type="text"
                            value={formData.qualifications.join(", ")}
                            onChange={(e) => handleArrayChange(e, "qualifications")}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken (comma-separated)</label>
                          <input
                            type="text"
                            value={formData.languages_spoken.join(", ")}
                            onChange={(e) => handleArrayChange(e, "languages_spoken")}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="isVerified"
                              name="isVerified"
                              checked={formData.isVerified}
                              onChange={handleCheckboxChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-700">
                              Self-verified
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="isAdminVerified"
                              name="isAdminVerified"
                              checked={formData.isAdminVerified}
                              onChange={handleCheckboxChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isAdminVerified" className="ml-2 block text-sm text-gray-700">
                              Admin-verified
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      {/* Profile Header */}
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0">
                          {selectedTutor.profile_image ? (
                            <img 
                              src={selectedTutor.profile_image} 
                              alt={selectedTutor.name} 
                              className="h-16 w-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                              <User size={24} className="text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">{selectedTutor.name}</h3>
                          <p className="text-sm text-gray-500">{selectedTutor.country}</p>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              selectedTutor.isAdminVerified 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {selectedTutor.isAdminVerified ? (
                                <>
                                  <CheckCircle size={12} className="mr-1" />
                                  Verified
                                </>
                              ) : "Unverified"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-start">
                            <div className="text-sm text-gray-500 w-20">Email:</div>
                            <div className="text-sm text-gray-900">{selectedTutor.user_id?.email}</div>
                          </div>
                          <div className="flex items-start">
                            <div className="text-sm text-gray-500 w-20">Phone:</div>
                            <div className="text-sm text-gray-900">{selectedTutor.phone || "Not provided"}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tutor Profile */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Bio</h4>
                        <p className="text-sm text-gray-900">{selectedTutor.bio || "No bio provided"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">About Me</h4>
                        <p className="text-sm text-gray-900">{selectedTutor.about_me || "No detailed description provided"}</p>
                      </div>
                      
                      {/* Teaching Information */}
                      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <h4 className="text-sm font-medium text-gray-700">Teaching Information</h4>
                        
                        <div>
                          <h5 className="text-xs font-medium text-gray-500 mb-1">Rates</h5>
                          <div className="flex items-center gap-4">
                            <div className="text-sm">
                              <span className="font-medium">{formatCurrency(processHourlyRate(selectedTutor))}</span> hourly
                            </div>
                            {processMonthlyRate(selectedTutor) > 0 && (
                              <div className="text-sm">
                                <span className="font-medium">{formatCurrency(processMonthlyRate(selectedTutor))}</span> monthly
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-xs font-medium text-gray-500 mb-1">Subject Expertise</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedTutor.subject_expertise?.length > 0 ? (
                              selectedTutor.subject_expertise.map((subject, index) => (
                                <span 
                                  key={index} 
                                  className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                                >
                                  {subject}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">No subjects specified</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-xs font-medium text-gray-500 mb-1">Specialties</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedTutor.specialties?.length > 0 ? (
                              selectedTutor.specialties.map((specialty, index) => (
                                <span 
                                  key={index} 
                                  className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">No specialties specified</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-xs font-medium text-gray-500 mb-1">Qualifications</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedTutor.qualifications?.length > 0 ? (
                              selectedTutor.qualifications.map((qualification, index) => (
                                <span 
                                  key={index} 
                                  className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full"
                                >
                                  {qualification}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">No qualifications specified</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-xs font-medium text-gray-500 mb-1">Languages</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedTutor.languages_spoken?.length > 0 ? (
                              selectedTutor.languages_spoken.map((language, index) => (
                                <span 
                                  key={index} 
                                  className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full"
                                >
                                  {language}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">No languages specified</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Bookings */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Bookings</h4>
                        {bookings.length > 0 ? (
                          <div className="space-y-2">
                            {bookings.slice(0, 5).map((booking) => (
                              <div key={booking._id} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {booking.student_name || "Unknown Student"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(booking.start_time).toLocaleString()} - {new Date(booking.end_time).toLocaleTimeString()}
                                    </div>
                                  </div>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    booking.status === "completed" ? "bg-green-100 text-green-800" :
                                    booking.status === "upcoming" ? "bg-blue-100 text-blue-800" :
                                    booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}>
                                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {bookings.length > 5 && (
                              <div className="text-center mt-2">
                                <Link href={`/admin/bookings?tutor=${selectedTutor._id}`} className="text-blue-500 text-sm hover:underline">
                                  View all {bookings.length} bookings
                                </Link>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">No bookings found for this tutor</div>
                        )}
                      </div>
                      
                      {/* Reviews */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Reviews</h4>
                        {reviews.length > 0 ? (
                          <div className="space-y-2">
                            {reviews.slice(0, 3).map((review) => (
                              <div key={review._id} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center mb-1">
                                  <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        size={14} 
                                        fill={i < review.rating ? "currentColor" : "none"} 
                                        className={i < review.rating ? "text-yellow-400" : "text-gray-300"} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500 ml-2">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{review.comment}</p>
                                <div className="text-xs text-gray-500 mt-1">
                                  By {review.student_name || "Anonymous Student"}
                                </div>
                              </div>
                            ))}
                            {reviews.length > 3 && (
                              <div className="text-center mt-2">
                                <Link href={`/admin/reviews?tutor=${selectedTutor._id}`} className="text-blue-500 text-sm hover:underline">
                                  View all {reviews.length} reviews
                                </Link>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">No reviews found for this tutor</div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}