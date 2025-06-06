import React, { useState } from 'react';
import { ShoppingCart, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartSidebar from './CartSidebar';

interface HeaderProps {
  onCategorySelect?: (category: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onCategorySelect }) => {
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Add search functionality here
  };

  const handleCategoryClick = (category: string) => {
    console.log('Category clicked:', category);
    setActiveCategory(category);
    
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    
    // Scroll to products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
    console.log('Login clicked');
    // Add login functionality here
  };

  const categories = ['Groceries', 'Vegetables', 'Fruits', 'Snacks', 'Body Care', 'Personal Care'];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="py-2 text-sm text-gray-600 border-b">
          <div className="flex justify-between items-center">
            <span>Free delivery on orders above ₹500</span>
            <a href="tel:+919755665650" className="hover:text-orange-600">
              Call us: +91 97556 65650
            </a>
          </div>
        </div>
        
        {/* Main header */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-orange-600 cursor-pointer">
              Shree Ji Kirana Store
            </h1>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-orange-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:flex" onClick={handleLogin}>
              Login
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Shopping Cart</SheetTitle>
                  <SheetDescription>
                    Review your items before checkout
                  </SheetDescription>
                </SheetHeader>
                <CartSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="pb-4">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => handleCategoryClick('All')}
              className={`text-gray-700 hover:text-orange-600 whitespace-nowrap py-2 transition-colors duration-200 ${
                activeCategory === 'All' ? 'text-orange-600 font-semibold border-b-2 border-orange-600' : ''
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`text-gray-700 hover:text-orange-600 whitespace-nowrap py-2 transition-colors duration-200 ${
                  activeCategory === category ? 'text-orange-600 font-semibold border-b-2 border-orange-600' : ''
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
