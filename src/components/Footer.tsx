
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-orange-400 mb-4">Shree Ji Kirana Store</h3>
            <p className="text-gray-300 mb-4">
              Your trusted neighborhood grocery store, now delivering fresh products to your doorstep with love and care.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold">i</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Products</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Offers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Vegetables</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Fruits</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Dairy Products</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Groceries</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-orange-400 mr-3" />
                <span className="text-gray-300">Main Market Bada Darwaja Barachh</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-orange-400 mr-3" />
                <span className="text-gray-300">+91 97556 65650</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-orange-400 mr-3" />
                <span className="text-gray-300">info@shreejikirana.com</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-orange-400 mr-3" />
                <span className="text-gray-300">Mon-Sun: 7:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Shree Ji Kirana Store. All rights reserved. | Made with ❤️ for our community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
