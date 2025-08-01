import React, { useRef } from "react";

import HeroSection from "../component/Herosection";
import ProductCategory from "../component/Productcategory";
import FeaturedProducts from "../component/Featuredproduct";
import Footer from "../component/Footer";


export default function Landing() {
  const productCategoryRef = useRef(null);

  const scrollToProductCategory = () => {
    if (productCategoryRef.current) {
      productCategoryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <HeroSection onBrowseCategoriesClick={scrollToProductCategory} />
      <ProductCategory sectionRef={productCategoryRef} />
      <FeaturedProducts />
      <Footer />
    </div>
  );
}
