"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import { Search, Filter, Edit2, Trash2, User, BookOpen, Calendar, ChevronLeft, Eye, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [studentDetailsLoading, setStudentDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "name",
    sortOrder: "asc",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subjects: []
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const router = useRouter();

  // Fetch all students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/students");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter and sort students based on search term and filters
  const filteredStudents = students
    .filter(student => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        student.name?.toLowerCase().includes(searchLower) ||
        student.user_id?.email?.toLowerCase().includes(searchLower) ||
        student.subjects?.some(sub => sub.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      const { sortBy, sortOrder } = filters;
      
      let valueA, valueB;
      
      if (sortBy === "email") {
        valueA = a.user_id?.email?.toLowerCase() || "";
        valueB = b.user_id?.email?.toLowerCase() || "";
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

  // Fetch student details when a student is selected
  const handleViewStudent = async (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name || "",
      email: student.user_id?.email || "",
      phone: student.phone || "",

      subjects: student.subjects || []
    });
    setStudentDetailsLoading(true);
    
    try {
      // Fetch bookings
      const bookingsResponse = await fetch(`/api/students/${student.user_id._id}/bookings`);
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.bookings || []);
      }
      
      // Fetch assignments
      const assignmentsResponse = await fetch(`/api/students/${student.user_id._id}/assignments`);
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        setAssignments(assignmentsData.assignments || []);
      }
    } catch (err) {
      console.error("Error fetching student details:", err);
    } finally {
      setStudentDetailsLoading(false);
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

  // Handle subjects input (comma-separated)
  const handleSubjectsChange = (e) => {
    const subjectsArray = e.target.value.split(",").map(s => s.trim());
    setFormData(prev => ({
      ...prev,
      subjects: subjectsArray
    }));
  };

  // Update student details
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/admins/students/${selectedStudent.user_id._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update student");
      }
      
      const updatedStudent = await response.json();
      
      // Update the students list with the updated student
      setStudents(prevStudents => 
        prevStudents.map(s => 
          s._id === selectedStudent._id ? updatedStudent : s
        )
      );
      
      // Update the selected student
      setSelectedStudent(updatedStudent);
      setIsEditing(false);
      
      // Show success notification (you can implement a toast notification system)
      alert("Student updated successfully");
      
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Failed to update student: " + err.message);
    }
  };

  // Delete student
  const handleDeleteStudent = async () => {
    try {
      const response = await fetch(`/api/admins/students/${selectedStudent.user_id._id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
      
      // Remove the student from the list
      setStudents(prevStudents => 
        prevStudents.filter(s => s._id !== selectedStudent._id)
      );
      
      // Close the student details panel
      setSelectedStudent(null);
      setDeleteConfirmOpen(false);
      
      // Show success notification
      alert("Student deleted successfully");
      
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student: " + err.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
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
              <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Students Management</h1>
              
              {/* Search and Filter Bar */}
              <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 md:min-w-64">
                  <input
                    type="text"
                    placeholder="Search students..."
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
              <div className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">Sort By</label>
                  <select
                    className="border border-gray-300 rounded-md p-2"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
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
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md ml-auto"
                  onClick={() => {
                    setFilters({
                      sortBy: "name",
                      sortOrder: "asc",
                    });
                    setSearchTerm("");
                  }}
                >
                  Reset
                </button>
              </div>
            )}
            
            {/* Students Table */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                Error: {error}
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No students found matching your search criteria
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subjects
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                              <User size={20} className="text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{student.user_id?.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {student.subjects?.join(", ") || "No subjects"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewStudent(student)}
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
        
        {/* Student Details Sidebar */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end text-black">
            <div className="bg-white w-full md:w-2/5 lg:w-1/3 h-full overflow-y-auto p-6 animate-slide-in-right">
              <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={() => {
                    setSelectedStudent(null);
                    setIsEditing(false);
                    setDeleteConfirmOpen(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeft size={24} />
                </button>
                <h2 className="text-xl font-bold text-center flex-1 text-black">Student Details</h2>
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
                  <h3 className="text-red-600 font-semibold mb-2">Delete Student Account</h3>
                  <p className="text-red-600 mb-4">Are you sure you want to delete this student? This action cannot be undone.</p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setDeleteConfirmOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteStudent}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
              
              {studentDetailsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {isEditing ? (
                    <form onSubmit={handleUpdateStudent} className="space-y-4">
                      <div>
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
                      <div>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (comma-separated)</label>
                        <input
                          type="text"
                          name="subjects"
                          value={formData.subjects.join(", ")}
                          onChange={handleSubjectsChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
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
                    <>
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center mb-4">
                          <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                            <User size={36} className="text-gray-500" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-center">{selectedStudent.name}</h3>
                        <p className="text-gray-500 text-center">{selectedStudent.user_id?.email}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700">Details</h4>
                          <div className="bg-gray-50 p-4 rounded-lg mt-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p>{selectedStudent.phone || "Not specified"}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-sm text-gray-500">Subjects</p>
                                <p>{selectedStudent.subjects?.join(", ") || "No subjects"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Bookings Section */}
                        <div>
                          <h4 className="font-medium text-gray-700 flex items-center">
                            <Calendar size={18} className="mr-2" />
                            Bookings
                          </h4>
                          <div className="bg-gray-50 p-4 rounded-lg mt-2">
                            {bookings && bookings.length > 0 ? (
                              <div className="space-y-3">
                                {bookings.map((booking) => (
                                  <div key={booking._id} className="bg-white p-3 rounded-md shadow-sm">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <p className="font-medium">
                                          {booking.tutor_id?.name || "Unknown Tutor"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {booking.slot_id?.day} • {booking.slot_id?.start_time} - {booking.slot_id?.end_time}
                                        </p>
                                      </div>
                                      <div className={`px-2 py-1 rounded-full text-xs ${
                                        booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                                        booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                        "bg-gray-100 text-gray-800"
                                      }`}>
                                        {booking.status || "Unknown"}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center py-4">No bookings found</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Assignments Section */}
                        <div>
                          <h4 className="font-medium text-gray-700 flex items-center">
                            <BookOpen size={18} className="mr-2" />
                            Assignments
                          </h4>
                          <div className="bg-gray-50 p-4 rounded-lg mt-2">
                            {assignments && assignments.length > 0 ? (
                              <div className="space-y-3">
                                {assignments.map((assignment) => (
                                  <div key={assignment._id} className="bg-white p-3 rounded-md shadow-sm">
                                    <p className="font-medium">{assignment.title}</p>
                                    <p className="text-sm text-gray-600 mb-1">{assignment.description}</p>
                                    <div className="flex justify-between items-center">
                                      <p className="text-sm text-gray-500">
                                        Assigned to: {assignment.assigned_to?.name || "Unassigned"}
                                      </p>
                                      <div className={`px-2 py-1 rounded-full text-xs ${
                                        assignment.status === "completed" ? "bg-green-100 text-green-800" :
                                        assignment.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                                        "bg-yellow-100 text-yellow-800"
                                      }`}>
                                        {assignment.status || "Pending"}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center py-4">No assignments found</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
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