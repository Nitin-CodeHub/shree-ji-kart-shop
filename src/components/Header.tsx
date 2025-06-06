
import React from 'react';
import { ShoppingCart, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';

const Header = () => {
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="py-2 text-sm text-gray-600 border-b">
          <div className="flex justify-between items-center">
            <span>Free delivery on orders above ₹500</span>
            <span>Call us: +91 98765 43210</span>
          </div>
        </div>
        
        {/* Main header */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-orange-600">
              Shree Ji Kirana Store
            </h1>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for products..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-orange-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:flex">
              Login
            </Button>
            <Button variant="outline" className="relative">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="pb-4">
          <div className="flex space-x-8 overflow-x-auto">
            {['Groceries', 'Vegetables', 'Fruits', 'Dairy', 'Snacks', 'Beverages', 'Personal Care'].map((category) => (
              <a
                key={category}
                href="#"
                className="text-gray-700 hover:text-orange-600 whitespace-nowrap py-2 transition-colors duration-200"
              >
                {category}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
