import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUpload,
  FaTrash,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../component/AdminNavbar";
import { createProduct } from "../service/productApi.js";

export default function AddProduct() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    stock: "",
    brand: "",
    sellerName: "",
    location: "",
    isActive: true,
    isFeatured: false,
    tags: "",
    specifications: {},
  });

  const categories = [
    "Helmets",
    "Riding Suits",
    "Gloves",
    "Accessories",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please upload only image files.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages((prev) => [...prev, e.target.result]);
        setImages((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      alert("Please fill in all required fields.");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one product image.");
      return;
    }

    try {
      setIsLoading(true);
      // Only send the first image if one exists
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        stock: formData.stock,
      };
      
      // Only add image if one is selected
      if (images.length > 0 && images[0]) {
        productData.image = images[0];
      }
      
      await createProduct(productData);
      alert("Product has been successfully added!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Add product error:", error);
      alert("Unable to add product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        style={{ marginTop: "80px" }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Add New Product
                </h1>
                <p className="text-gray-600">
                  Create a new product for the Helmets and Gears catalog
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/products")}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Products
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                      placeholder="Enter brand name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (NPR) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price (NPR)
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="text-black"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                  placeholder="Enter product description"
                  required
                />
              </div>

              {/* Additional Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                      placeholder="Enter subcategory"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seller Name
                    </label>
                    <input
                      type="text"
                      name="sellerName"
                      value={formData.sellerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                      placeholder="Enter seller name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                      placeholder="Enter location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Images
                </h3>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-500 font-medium">
                          Click to upload images
                        </span>
                        <span className="text-gray-500"> or drag and drop</span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      PNG, JPG, GIF up to 5MB each (max 5 images)
                    </p>
                  </div>

                  {/* Image Previews */}
                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
