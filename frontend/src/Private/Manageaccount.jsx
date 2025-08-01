"use client"
 
import { useState, useEffect } from "react"
import ProfileLayout from "../component/ProfileLayout"
 
export default function Manageaccount () {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    id: null,
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    mobile: "",
  })
 
  // Fetch user info from API
  const fetchUserInfo = async () => {
    try {
      const response = await userapi.get("/api/auth/init")
      if (response.data && response.data.data) {
        const { data } = response.data;
        setUserInfo({
          id: data.id || null,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          gender: data.gender || "",
          email: data.email || "",
          mobile: data.mobile || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user info", error)
    }
  }
 
  useEffect(() => {
    fetchUserInfo()
  }, [])
 
  // Toggle edit mode
  const handleEdit = () => setIsEditing(true)
 
  // Save updated user info
  const handleSave = async () => {
    try {
      if (!userInfo.id) {
        console.warn("User ID is missing. Cannot update profile.")
        return
      }
      await userapi.put(`/api/users/${userInfo.id}`, userInfo)
      setIsEditing(false)
      fetchUserInfo()
    } catch (error) {
      console.error("Profile update failed:", error)
      alert("Failed to update profile. Please try again.")
    }
  }
 
  const handleInputChange = (field, value) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
 
  return (
    <ProfileLayout>
      <div className="p-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Personal Information</h1>
          <button
            onClick={isEditing ? handleSave : handleEdit}
            className="px-4 py-2 text-[#DB4444] hover:text-[#B53A3A] font-medium"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
 
        <div className="space-y-6">
          {/* Name Fields */} 
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={userInfo.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={!isEditing}
              placeholder="First Name"
              className={`w-full p-3 border rounded text-sm text-gray-700 ${
                isEditing
                  ? "border-gray-300 bg-white focus:border-teal-500 focus:outline-none"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
            <input
              type="text"
              value={userInfo.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={!isEditing}
              placeholder="Last Name"
              className={`w-full p-3 border rounded text-sm text-gray-700 ${
                isEditing
                  ? "border-gray-300 bg-white focus:border-teal-500 focus:outline-none"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
 
          {/* Gender Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Gender</h3>
            <div className="flex space-x-6">
              {["male", "female"].map((genderOption) => (
                <label key={genderOption} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={genderOption}
                    checked={userInfo.gender === genderOption}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                  disabled={!isEditing}
                  className="mr-2 text-[#DB4444] focus:ring-[#DB4444]"
                />
                  <span className="text-gray-700 capitalize">{genderOption}</span>
                </label>
              ))}
            </div>
          </div>
 
          {/* Email Address */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">Email Address</h3>
              <div className="flex space-x-4">
                {/* These buttons can later be wired to specific modals or pages */}
                <button className="text-[#DB4444] hover:text-[#B53A3A] font-medium" disabled={!isEditing}>
                  Edit
                </button>
                {/* Removed Change Password button as requested */}
              </div>
            </div>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              placeholder="Email Address"
              className={`w-full p-3 border rounded text-sm text-gray-700 ${
                isEditing
                  ? "border-gray-300 bg-white focus:border-teal-500 focus:outline-none"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
 
          {/* Mobile Number */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">Mobile Number</h3>
              <button className="text-[#DB4444] hover:text-[#B53A3A] font-medium" disabled={!isEditing}>
                Edit
              </button>
            </div>
            <input
              type="tel"
              value={userInfo.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              disabled={!isEditing}
              placeholder="Mobile Number"
              className={`w-full p-3 border rounded text-sm text-gray-700 ${
                isEditing
                  ? "border-gray-300 bg-white focus:border-teal-500 focus:outline-none"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
        </div>
      </div>
    </ProfileLayout>
  )
}
