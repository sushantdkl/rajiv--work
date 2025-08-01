import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../component/Productcard";
import { getProducts } from "../service/productApi.js";

const categories = ["Helmets", "Riding Suits", "Gloves", "Accessories"];
const colors = ["Blue", "Black", "Red", "White", "Green"];
const sizes = ["Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large"];

export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOption, setSortOption] = useState("Most Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const query = params.get("q");
    if (category) {
      setSelectedCategory(category);
    }
    if (query) {
      setSearchQuery(query);
    } else {
      setSearchQuery("");
    }
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [products, selectedCategory, selectedColors, selectedSize, searchQuery, sortOption]);

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const applyFilters = () => {
    let filtered = products;

    // Filter only active products
    filtered = filtered.filter(product => product.isActive !== false);

    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        (product.name || product.title || "").toLowerCase().includes(lowerQuery) ||
        (product.category || "").toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => selectedColors.includes(product.color));
    }

    if (selectedSize) {
      filtered = filtered.filter(product => product.size === selectedSize);
    }

    if (sortOption === "Price: Low to High") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOption === "Price: High to Low") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleApplyFilterClick = () => {
    applyFilters();
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }
  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-sm text-gray-500">
          <span className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-black">Products</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Shop</h1>
        <div className="text-sm text-gray-500">
          Showing {filteredProducts.length} of {products.length} Products
        </div>
        <div className="text-sm text-gray-500">
          Sort by: <select className="border border-gray-300 rounded px-2 py-1" value={sortOption} onChange={handleSortChange}>
            <option>Most Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="w-64 space-y-6">
          {/* Filters Header */}
          <div className="flex justify-between items-center text-gray-900 font-semibold text-lg">
            <span>Filters</span>
            <button className="text-gray-500 hover:text-gray-900" onClick={() => {
              setSelectedCategory(null);
              setSelectedColors([]);
              setSelectedSize(null);
              setSearchQuery("");
              setSortOption("Most Popular");
            }}>Clear All</button>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-2">Categories</h3>
            <ul className="space-y-1 text-gray-700">
              {categories.map(category => (
                <li
                  key={category}
                  className={`flex justify-between cursor-pointer hover:text-gray-900 ${
                    selectedCategory === category ? "font-bold text-black" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <span>{category}</span>
                  {'>'}
                </li>
              ))}
            </ul>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-semibold mb-2">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`px-3 py-1 rounded-full border ${selectedColors.includes(color) ? "bg-black text-white" : "bg-gray-200 text-gray-700"} text-xs`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h3 className="font-semibold mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 rounded-full border ${selectedSize === size ? "bg-black text-white" : "bg-gray-200 text-gray-700"} text-xs`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Filter Button */}
          <button className="w-full bg-black text-white py-3 rounded mt-4 hover:bg-gray-900 transition" onClick={handleApplyFilterClick}>
            Apply Filter
          </button>
        </aside>

        {/* Products Grid */}
        <section className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.title}
                price={product.price}
                originalPrice={product.oldPrice}
                discount={product.discount}
                image={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`) : ''}
                onClick={() => navigate(`/productdetails/${product.id}`)}
                onAddToCart={() => {
                  import("../utils/cart.js").then(({ addToCart }) => {
                    addToCart(product.id, 1);
                    alert(`${product.name || product.title} added to cart`);
                  });
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8 text-gray-700">
            <button
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &larr; Previous
            </button>
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-black text-white" : "hover:bg-gray-100"}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &rarr;
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
