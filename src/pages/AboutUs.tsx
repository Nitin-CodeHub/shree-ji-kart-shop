
import React from 'react';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Heart, Shield, Star } from 'lucide-react';

const AboutUs = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-50 to-orange-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Welcome to Shree Ji Kirana Store – Your Trusted Neighborhood Grocery Store!
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              
              {/* Introduction */}
              <div className="mb-12">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  At Shree Ji Kirana Store, we believe that quality groceries and everyday essentials should be easily accessible, affordable, and trustworthy. Since our establishment, we have proudly served our community with a wide range of fresh, genuine, and reasonably priced products – from premium grains, spices, and pulses to household goods and daily necessities.
                </p>
              </div>

              {/* Why Choose Us Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Choose Us?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="h-8 w-8 text-orange-500 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-800">Fresh & Quality Products</h3>
                    </div>
                    <p className="text-gray-600">
                      We handpick our products to ensure only the best reaches your home. Freshness, purity, and authenticity are the core of what we offer.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                    <div className="flex items-center mb-4">
                      <Star className="h-8 w-8 text-orange-500 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-800">Affordable Prices</h3>
                    </div>
                    <p className="text-gray-600">
                      We offer competitive prices without compromising on quality, making your shopping experience budget-friendly and satisfying.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                    <div className="flex items-center mb-4">
                      <Heart className="h-8 w-8 text-orange-500 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-800">Customer Satisfaction</h3>
                    </div>
                    <p className="text-gray-600">
                      Our customers are our priority. Whether it's a single item or a bulk order, we ensure personalized service and a smile with every delivery.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                    <div className="flex items-center mb-4">
                      <Shield className="h-8 w-8 text-orange-500 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-800">A Store You Can Trust</h3>
                    </div>
                    <p className="text-gray-600">
                      With years of experience and a reputation built on honesty and service, Shree Ji Kirana Store is not just a shop – it's a part of your family.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mission Section */}
              <div className="mb-12 bg-orange-50 p-8 rounded-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Mission</h2>
                <p className="text-lg text-gray-700 text-center leading-relaxed">
                  To provide high-quality groceries and essential products with utmost integrity, keeping the needs of our customers at the heart of everything we do.
                </p>
              </div>

              {/* Visit Us Section */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Visit Us</h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  Come experience the warmth of traditional Indian hospitality with the convenience of a modern kirana store. Whether you shop in-store or order over the phone, we're always ready to serve you with care and commitment.
                </p>
                <div className="mt-8">
                  <a 
                    href="tel:+919755665650" 
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
                  >
                    Call Us Now: +91 97556 65650
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </CartProvider>
  );
};

export default AboutUs;
