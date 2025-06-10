
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import LoginDialog from './LoginDialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CartSidebar from './CartSidebar';

interface HeaderProps {
  onCategorySelect?: (category: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onCategorySelect }) => {
  const { cart } = useCart();
  const { user, isLoggedIn, logout } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Add search functionality here
  };

  const handleCategoryClick = (category: string) => {
    console.log('Header category clicked:', category);
    setActiveCategory(category);
    
    if (onCategorySelect) {
      console.log('Calling onCategorySelect with:', category);
      onCategorySelect(category);
    }
    
    // Close mobile menu if open
    setMobileMenuOpen(false);
    
    // Scroll to products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
    setLoginDialogOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const categories = ['Groceries', 'Vegetables', 'Snacks', 'Body Care', 'Personal Care'];

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
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through our categories
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  {/* User login/logout for mobile */}
                  <div className="border-b pb-4">
                    {isLoggedIn ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Welcome, {user?.name}!</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleLogout}
                          className="w-full"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={handleLogin}
                        className="w-full"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                    )}
                  </div>
                  
                  <Link 
                    to="/products"
                    className="text-left py-2 px-4 rounded transition-colors duration-200 text-gray-700 hover:bg-orange-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    All Products
                  </Link>
                  <button
                    onClick={() => handleCategoryClick('All')}
                    className={`text-left py-2 px-4 rounded transition-colors duration-200 ${
                      activeCategory === 'All' 
                        ? 'bg-orange-600 text-white' 
                        : 'text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    Featured Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`text-left py-2 px-4 rounded transition-colors duration-200 ${
                        activeCategory === category 
                          ? 'bg-orange-600 text-white' 
                          : 'text-gray-700 hover:bg-orange-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/" className="text-2xl font-bold text-orange-600 cursor-pointer hover:text-orange-700 transition-colors">
              Shree Ji Kirana Store
            </Link>
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
            {/* Desktop Login/User Menu */}
            <div className="hidden md:block">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      Order History
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" onClick={handleLogin}>
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
            
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
        
        {/* Navigation - Desktop */}
        <nav className="pb-4 hidden md:block">
          <div className="flex space-x-8 overflow-x-auto">
            <Link
              to="/products"
              className="text-gray-700 hover:text-orange-600 whitespace-nowrap py-2 transition-colors duration-200"
            >
              All Products
            </Link>
            <button
              onClick={() => handleCategoryClick('All')}
              className={`text-gray-700 hover:text-orange-600 whitespace-nowrap py-2 transition-colors duration-200 ${
                activeCategory === 'All' ? 'text-orange-600 font-semibold border-b-2 border-orange-600' : ''
              }`}
            >
              Featured Products
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
      
      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </header>
  );
};

export default Header;
