import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUpload,
  FaTrash,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../component/AdminNavbar";
import { getProductById, updateProduct } from "../service/productApi.js";

export default function EditProduct() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

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

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoadingProduct(true);
      const product = await getProductById(productId);

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        category: product.category || "",
        subcategory: product.subcategory || "",
        stock: product.stock || "",
        brand: product.brand || "",
        sellerName: product.sellerName || "",
        location: product.location || "",
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: product.isFeatured || false,
        tags: product.tags ? product.tags.join(", ") : "",
        specifications: product.specifications || {},
      });

      // Handle existing images - the product might have imageUrl instead of images array
      if (product.imageUrl) {
        setExistingImages([product.imageUrl]);
      } else if (product.images && product.images.length > 0) {
        setExistingImages(product.images);
      }
    } catch (error) {
      console.error("Fetch product error:", error);
      alert("Unable to load product data.");
      navigate("/admin/products");
    } finally {
      setIsLoadingProduct(false);
    }
  };

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

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare product data for update
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        stock: formData.stock,
      };
      
      // Only add image if a new one is selected
      if (images.length > 0 && images[0]) {
        productData.image = images[0];
      }
      
      await updateProduct(productId, productData);
      alert("Product has been successfully updated!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Update product error:", error);
      alert("Unable to update product.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product data...</p>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we fetch the product details
          </p>
        </div>
      </div>
    );
  }

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
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Edit Product
                </h1>
                <p className="text-gray-600">
                  Update product information in the Helmets and Gears catalog
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

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Images
                </h3>

                {existingImages.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Current Images
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`http://localhost:5000${image}`}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <FaUpload className="text-gray-400 text-3xl mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload images (max 5)
                      </span>
                    </label>
                  </div>

                  {previewImages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        New Images Preview
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {previewImages.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Update Product
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
