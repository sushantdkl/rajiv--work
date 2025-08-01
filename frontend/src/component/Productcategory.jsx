import { useNavigate } from "react-router-dom";
import ProductCard from "./Productcard";

import categoryImage from "../assets/category.png";
import suitsImage from "../assets/Suits.webp";
import ggImage from "../assets/GG.webp";
import accessoriesImage from "../assets/Accessories.jpg";

const productcategory = [
  {
    id: "1",
    name: "Helmets",
    price: 299,
    originalPrice: 399,
    image: categoryImage,
  },
  {
    id: "2",
    name: "Riding Suits",
    price: 249,
    image: suitsImage,
  },
  {
    id: "3",
    name: "Gloves",
    price: 799,
    originalPrice: 999,
    image: ggImage,
  },
  {
    id: "4",
    name: "Accessories",
    price: 159,
    image: accessoriesImage,
  },
];

export default function ProductCategory() {
  const navigate = useNavigate();

  const handleProductClick = (name) => {
    // Navigate to Shop page with category as query parameter
    navigate(`/shop?category=${encodeURIComponent(name)}`);
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Product Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular safety equipment
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
          {productcategory.map(({ id, name, image }) => (
            <ProductCard
              key={id}
              name={name}
              image={image}
              showAddToCart={false}
              hideDollarSign={true}
              onClick={() => handleProductClick(name)}
            />
          ))}
        </div>

        <div className="text-center mt-12"></div>
      </div>
    </section>
  );
}
