import { Shield, Truck, Award } from "lucide-react";

export default function HeroSection() {
  return (
    <>
      <section className="relative bg-gradient-to-r from-black via-gray-900 to-black min-h-[600px] overflow-hidden">
        {/* Background motorcycle rider image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="Motorcycle rider"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-red-900/20 to-black/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="text-white space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Premium Safety
                  <span className="block text-red-500">Equipment</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-lg">
                  Protect yourself with our professional-grade protective gear and
                  accessories. Trusted by professionals worldwide for ultimate
                  safety and performance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.location.href = '/shop'}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Shop Now →
                </button>
                <button
                  className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-semibold border rounded-lg transition-all duration-200"
                >
                  Browse Categories
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-gray-300">Contact Safety</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-400" />
                  <span className="text-sm text-gray-300">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-400" />
                  <span className="text-sm text-gray-300">Excellent Quality</span>
                </div>
              </div>
            </div>

            {/* Right side - Product showcase */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl p-6 shadow-2xl ml-12" style={{ height: '500px' }}>
                <div className="mb-6 h-full">
                  <img
                    src="/src/assets/productshowcase.png"
                    alt="Product Showcase"
                    className="w-full h-full object-cover rounded-lg"
                    style={{ maxHeight: 'none' }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                </div>

                <div className="text-right">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-lg inline-block">
                    <div className="text-lg font-bold">50,500+</div>
                    <div className="text-sm">Happy Customers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Featured Product Showcase
            </h2>
            <p className="text-lg text-gray-600">Discover our premium safety equipment collection</p>
          </div>
          
          <div className="bg-gradient-to-r from-black to-red-900 rounded-2xl p-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Professional Grade Protection
                </h3>
                <p className="text-lg text-gray-300 mb-6">
                  Experience the ultimate in safety and style with our premium collection. 
                  Engineered for professionals who demand the best.
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200">
                  Explore Collection
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src="/src/assets/productshowcase.png"
                  alt="Product Showcase"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
