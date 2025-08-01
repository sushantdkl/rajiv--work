import React from "react";
import { useNavigate } from "react-router-dom";

import coupleImage from "../assets/couple.jpg";
import Footer from "../component/Footer";
import standingImage from "../assets/standing.jpg"; // Assuming you have this image
import servicingImage from "../assets/servicing.png";
import insuranceImage from "../assets/insurance.png";

export default function About() {
  const navigate = useNavigate();

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-sm text-gray-500">
          <span
            onClick={() => navigate("/")}
            className="hover:text-red-600 cursor-pointer transition-colors"
          >
            Home
          </span>
          <span className="mx-2">/</span>
          <span className="text-black">About</span>
        </div>
      </div>
      <main className="bg-white text-gray-900">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="overflow-hidden rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
            <img
              src={coupleImage}
              alt="Couple image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              In the bustling streets of Kathmandu and the winding roads of the
              Himalayas, one thing became clear to us: safety should never be
              optional for riders.

              Founded in 2025, Helmets & Gears was born out of a deep passion
              for biking and a strong commitment to rider safety. We noticed a
              growing number of passionate bikers in Nepal and beyond
              adventurers, commuters, delivery heroes, and weekend cruisers yet
              many lacked access to trusted, quality safety equipment.

              We set out to change that.

              Helmets & Gears isn’t just an online store. It's a movementa
              mission to promote awareness, accessibility, and style in road
              safety. Our curated collection of helmets, riding jackets, gloves,
              boots, knee guards, and accessories brings together the best of
              protection and performance. Every product we offer is chosen with
              care, tested for durability, and designed to inspire confidence on
              the road.

              Our team is made up of real riders. We understand what it’s like
              to chase sunsets on two wheels, to ride through rain or rough
              terrain, and to seek freedom on the road. That’s why we aim to
              deliver not just gearbut gear that protects your journey, tells
              your story, and fuels your passion.

              Whether you're a seasoned rider or just starting your biking
              journey, Helmets & Gears is here to support you with safety,
              style, and speed.

              Ride Bold. Ride Safe. Ride with Helmets & Gears.
            </p>
            <button className="inline-flex items-center px-6 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 rounded-md">
              Our approach to products
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </section>

        {/* Text and Image Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 h-150 items-center">
          {/* Image on the left for md and up */}  
          <div className="order-2 md:order-2">
            <img
              src={standingImage}
              alt="Standing image"
              className="w-full h-100 object-cover rounded-md"
            />
          </div>

          {/* Text content on the right for md and up */}
          <div className="space-y-6 order-1 md:order-1">
            <h3 className="text-xl font-semibold">
              Protection isn’t just a feature — it’s a mindset. At Helmets &  
              Gears, we craft every detail with the rider’s instinct to endure,
              to explore, and to return safely. Because every ride deserves
              armor built with purpose.
            </h3>
            <button className="inline-flex items-center px-6 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 rounded-md">
              Discover Products
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-center text-red-600 mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Reliability Card */}
            <div className="border border-gray-300 rounded-lg p-8 shadow-md text-center hover:shadow-lg transition-shadow duration-300">
              <svg
                className="mx-auto mb-4 w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Reliability</h3>
              <p className="text-gray-600">
                Timely delivery and trustworthy sellers to ensure your peace of mind.
              </p>
            </div>

            {/* Community Card */}
            <div className="border border-gray-300 rounded-lg p-8 shadow-md text-center hover:shadow-lg transition-shadow duration-300">
              <svg
                className="mx-auto mb-4 w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Supporting local businesses and creating a vibrant marketplace.
              </p>
            </div>

            {/* Quality Card */}
            <div className="border border-gray-300 rounded-lg p-8 shadow-md text-center hover:shadow-lg transition-shadow duration-300">
              <svg
                className="mx-auto mb-4 w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="6" y="6" width="12" height="12" stroke="currentColor" strokeWidth="3" fill="none" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">
                Carefully selected products that meet our high standards.
              </p>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="bg-gray-100 py-16 px-6 text-center max-w-4xl mx-auto">
          <p className="text-gray-700 italic text-lg leading-relaxed">
            Our gear is built from the toughest, most trusted materials — enhanced with modern engineering to deliver maximum protection, comfort, and performance for every rider.
          </p>
          <p className="mt-4 text-gray-500 uppercase tracking-widest text-sm">
            "Tomorrow’s Protection, Today"
          </p>
        </section>

        {/* Two Side-by-Side Sections */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section with one servicing.png image */}
          <div className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer">
            <img
              src={servicingImage}
              alt="Servicing"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Right Section */}
          <div className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer">
            <img
              src={insuranceImage}
              alt="Insurance"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-start p-8 text-white">
              <h4 className="text-xl font-semibold mb-2">"Stay Protected, Ride with Confidence"</h4>
              <p className="mb-4 text-sm">
                Accidents happen when we least expect them. That’s why every purchase from us comes with optional accidental insurance — to protect you, not just your gear. Stay safe, ride smart, and shop knowing you're covered from injury and unexpected incidents.
              </p>
              <button className="inline-flex items-center px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 rounded-md" onClick={() => navigate('/shop')}>
                Discover More
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
