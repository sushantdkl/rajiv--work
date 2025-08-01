import React, { useState, useEffect } from 'react';
import { Phone, Mail, Send, Star, Sparkles } from 'lucide-react';

import Footer from '../component/Footer.jsx';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  const FloatingParticle = ({ delay = 0, size = 'w-1 h-1' }) => (
    <div 
      className={`${size} bg-red-200 rounded-full absolute animate-pulse opacity-60`}
      style={{
        animation: `float ${3 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    />
  );

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 font-sans relative overflow-hidden">
      {/* Removed duplicate Navbar */}
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-200 rounded-full blur-2xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-red-50 rounded-full blur-3xl opacity-40 animate-pulse animation-delay-2000"></div>
        
        {/* Floating Particles */}
        <FloatingParticle delay={0} size="w-2 h-2" />
        <FloatingParticle delay={1} size="w-1 h-1" />
        <FloatingParticle delay={2} size="w-1.5 h-1.5" />
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-sm text-gray-500">
          <span className="hover:text-red-600 cursor-pointer transition-colors">Home</span>
          <span className="mx-2">/</span>
          <span className="text-black">Contact</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-16 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            {/* Left Side - Contact Information */}
            <div className="lg:col-span-2">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 h-full border border-white/20 relative overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 transition-opacity duration-500"></div>
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-pink-500 to-red-500 opacity-0 blur-sm transition-all duration-500"></div>
                
                <div className="relative z-10">
                  {/* Call To Us Section */}
                  <div className="mb-8 ">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4 transform shadow-lg relative">
                        <Phone className="w-5 h-5 text-white transform transition-transform duration-300" />
                        <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></div>
                      </div>
                      <h2 className="text-base font-medium text-gray-900 transition-colors duration-300">Call To Us</h2>
                    </div>
                    <div className="ml-14 space-y-4">
                      <p className="text-sm text-gray-600 leading-relaxed transition-colors duration-300">We are available 24/7, 7 days a week.</p>
                      <p className="text-sm text-gray-600 transition-colors duration-300 cursor-pointer">Phone: +8801611112222</p>
                      <hr className="border-gray-200 transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Write To US Section */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4 transform shadow-lg relative">
                        <Mail className="w-5 h-5 text-white transform transition-transform duration-300" />
                        <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></div>
                      </div>
                      <h2 className="text-base font-medium text-gray-900 transition-colors duration-300">Write To US</h2>
                    </div>
                    <div className="ml-14 space-y-4">
                      <p className="text-sm text-gray-600 leading-relaxed transition-colors duration-300">Fill out our form and we will contact you within 24 hours.</p>
                      <p className="text-sm text-gray-600 transition-colors duration-300 cursor-pointer">Emails: customer@exclusive.com</p>
                      <p className="text-sm text-gray-600 transition-colors duration-300 cursor-pointer">Emails: support@exclusive.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 h-full border border-white/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                {/* Animated background gradient */}
                {/* <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div> */}
                
                {/* Success message */}
                {submitted && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl z-50 animate-in fade-in duration-500">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <Star className="w-8 h-8 text-green-500 animate-pulse" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-600">We'll get back to you soon.</p>
                    </div>
                  </div>
                )}
                
                <div className="relative z-10">
                  <div className="space-y-6">
                    
                    {/* First Row - Name, Email, Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative group">
                        <input
                          type="text"
                          name="name"
                          placeholder="Your Name *"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 bg-gray-100/80 backdrop-blur-sm border-0 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white/90 transition-all duration-300"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      <div className="relative group">
                        <input
                          type="email"
                          name="email"
                          placeholder="Your Email *"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 bg-gray-100/80 backdrop-blur-sm border-0 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white/90 transition-all duration-300"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      <div className="relative group">
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Your Phone *"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 bg-gray-100/80 backdrop-blur-sm border-0 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white/90 transition-all duration-300"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Message Textarea */}
                    <div className="relative group">
                      <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={8}
                        className="w-full px-4 py-4 bg-gray-100/80 backdrop-blur-sm border-0 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white/90 resize-none transition-all duration-300"
                      ></textarea>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-12 py-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl relative overflow-hidden group"
                      >
                        {/* Button shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        <div className="relative flex items-center">
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                              Send Message
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      </div>
      


      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
     <Footer />
     </>
  );
}
