"use client"
 
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import ProfileLayout from "../component/ProfileLayout"
 
export default function ManageAddresses (){
  const [showAddForm, setShowAddForm] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [editingAddress, setEditingAddress] = useState(null)
 
  const [newAddress, setNewAddress] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    alternatePhone: "",
    landmark: "",
  })
 
  // Fetch addresses from API
  const fetchAddresses = async () => {
    try {
      const response = await userapi.get("/api/addresses")
      setAddresses(response.data.data)
    } catch (error) {
      console.error("Failed to fetch addresses", error)
    }
  }
 
  useEffect(() => {
    fetchAddresses()
  }, [])
 
  const handleInputChange = (field, value) => {
    setNewAddress((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
 
  const handleSave = async () => {
    if (!newAddress.name || !newAddress.mobile || !newAddress.address || !newAddress.city) {
      alert("Please fill in all required fields: Name, Mobile, Address, City")
      return
    }
 
    try {
      if (editingAddress) {
        // Update existing address
        await userapi.put(`/api/addresses/${editingAddress.id}`, newAddress)
      } else {
        // Add new address
        await userapi.post("/api/addresses", newAddress)
      }
      // Reset form and reload addresses
      setNewAddress({
        name: "",
        mobile: "",
        address: "",
        city: "",
        alternatePhone: "",
        landmark: "",
      })
      setShowAddForm(false)
      setEditingAddress(null)
      fetchAddresses()
    } catch (error) {
      console.error("Failed to save address", error)
      alert("Failed to save address. Please try again.")
    }
  }
 
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return
    try {
      await userapi.delete(`/api/addresses/${id}`)
      fetchAddresses()
    } catch (error) {
      console.error("Failed to delete address", error)
      alert("Failed to delete address. Please try again.")
    }
  }
 
  const handleEdit = (address) => {
    setEditingAddress(address)
    setNewAddress({
      name: address.name,
      mobile: address.mobile,
      address: address.address,
      city: address.city,
      alternatePhone: address.alternatePhone,
      landmark: address.landmark,
    })
    setShowAddForm(true)
  }
 
  return (
    <ProfileLayout>
      <div className="p-10">
        <section className="space-y-6">
          <div className="flex justify-between max-w-6xl mb-4">
            <h2 className="text-xl font-bold text-gray-800">Manage Addresses</h2>
            <h2 className="text-lg font-semibold text-gray-700">Saved Addresses</h2>
          </div>
 
          <div className="flex gap-8 max-w-6xl">
            {/* Form Section */}
            <div className="flex-1 max-w-md">
              {!showAddForm ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(true)
                    setEditingAddress(null)
                    setNewAddress({
                      name: "",
                      mobile: "",
                      address: "",
                      city: "",
                      alternatePhone: "",
                      landmark: "",
                    })
                  }}
                  style={{borderColor: '#DB4444', color: '#DB4444'}}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#DB4444';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#DB4444';
                  }}
                  className="flex items-center gap-2 border font-semibold px-4 py-2 rounded w-full justify-center"
                >
                  <Plus className="w-4 h-4" /> ADD A NEW ADDRESS
                </button>
              ) : (
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newAddress.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="flex-1 p-3 border rounded bg-gray-100 text-sm text-gray-700 focus:outline-none"
                      style={{borderColor: '#DB4444'}}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="10-Digit mobile number"
                      value={newAddress.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      className="flex-1 p-3 border rounded bg-gray-100 text-sm text-gray-700 focus:outline-none"
                      style={{borderColor: '#DB4444'}}
                      required
                    />
                  </div>
 
                  <textarea
                    placeholder="Address ( Area / Street )"
                    value={newAddress.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full p-3 border rounded bg-gray-100 text-sm text-gray-700 min-h-[80px] resize-y focus:outline-none"
                    style={{borderColor: '#DB4444'}}
                    required
                  />
 
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="City / District / Town"
                      value={newAddress.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="flex-1 p-3 border rounded bg-gray-100 text-sm text-gray-700 focus:outline-none"
                      style={{borderColor: '#DB4444'}}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Alternate Phone (Optional)"
                      value={newAddress.alternatePhone}
                      onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
                      className="flex-1 p-3 border rounded bg-gray-100 text-sm text-gray-700 focus:outline-none"
                      style={{borderColor: '#DB4444'}}
                    />
                  </div>
 
                  <input
                    type="text"
                    placeholder="Landmark (Optional)"
                    value={newAddress.landmark}
                    onChange={(e) => handleInputChange("landmark", e.target.value)}
                    className="w-full p-3 border rounded bg-gray-100 text-sm text-gray-700 focus:outline-none"
                    style={{borderColor: '#DB4444'}}
                  />
 
                  <div className="flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="text-white px-8 py-2 rounded font-semibold"
                      style={{backgroundColor: '#DB4444'}}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#B63B3B';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#DB4444';
                      }}
                    >
                      {editingAddress ? "Update" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingAddress(null)
                      }}
                      className="bg-gray-600 text-white px-6 py-2 rounded font-semibold hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
 
            {/* Saved Addresses Section */}
            <div className="flex-1 max-w-md">
              <div className="space-y-4">
                {addresses.length === 0 && <p className="text-gray-600">No addresses saved yet.</p>}
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <p className="font-medium text-gray-900 mb-1">{address.name}</p>
                    <p className="text-sm text-gray-600 mb-2">{`${address.address}, ${address.city}`}</p>
                    <p className="text-sm text-gray-600">Number: {address.mobile}</p>
                    {address.alternatePhone && (
                      <p className="text-sm text-gray-600">Alternate: {address.alternatePhone}</p>
                    )}
                    {address.landmark && (
                      <p className="text-sm text-gray-600">Landmark: {address.landmark}</p>
                    )}
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-xs font-medium"
                        style={{color: '#DB4444'}}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = '#B63B3B';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = '#DB4444';
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProfileLayout>
  )
}
