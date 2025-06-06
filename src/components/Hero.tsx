
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-orange-50 to-green-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
              Fresh Groceries
              <span className="text-orange-600"> Delivered</span>
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Get fresh vegetables, fruits, and daily essentials delivered to your doorstep from your trusted neighborhood store.
            </p>
            <div className="flex space-x-4">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                Shop Now
              </Button>
              <Button variant="outline" size="lg" className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3">
                View Categories
              </Button>
            </div>
            <div className="flex items-center mt-6 space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">500+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1000+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">30min</div>
                <div className="text-sm text-gray-600">Delivery</div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-12">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Fresh Groceries"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="mt-4 text-center">
                <div className="text-lg font-semibold text-gray-800">Farm Fresh Quality</div>
                <div className="text-sm text-gray-600">Directly from local farmers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
