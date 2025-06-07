
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Fresh Basmati Rice",
    price: 120,
    originalPrice: 150,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Groceries",
    unit: "kg"
  },
  {
    id: 2,
    name: "Organic Tomatoes",
    price: 40,
    originalPrice: 50,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Vegetables",
    unit: "kg"
  },
  {
    id: 4,
    name: "Toor Dal",
    price: 140,
    originalPrice: 160,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Groceries",
    unit: "kg"
  },
  {
    id: 5,
    name: "Fresh Onions",
    price: 30,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Vegetables",
    unit: "kg"
  },
  {
    id: 7,
    name: "Potato Chips",
    price: 45,
    originalPrice: 55,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Snacks",
    unit: "pack"
  },
  {
    id: 8,
    name: "Body Lotion",
    price: 250,
    originalPrice: 300,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Body Care",
    unit: "bottle"
  },
  {
    id: 9,
    name: "Namkeen Mix",
    price: 80,
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Snacks",
    unit: "pack"
  },
  {
    id: 10,
    name: "Face Wash",
    price: 180,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Body Care",
    unit: "tube"
  },
  {
    id: 11,
    name: "Wheat Flour",
    price: 55,
    originalPrice: 65,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Groceries",
    unit: "kg"
  },
  {
    id: 12,
    name: "Green Chillies",
    price: 25,
    image: "https://images.unsplash.com/photo-1583049254548-c5b8c7e84491?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Vegetables",
    unit: "250g"
  }
];

interface ProductGridProps {
  selectedCategory?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ selectedCategory = 'All' }) => {
  const [currentCategory, setCurrentCategory] = useState<string>('All');
  
  // Update current category when prop changes
  useEffect(() => {
    console.log('ProductGrid received selectedCategory:', selectedCategory);
    setCurrentCategory(selectedCategory);
  }, [selectedCategory]);
  
  // Filter products based on current category
  const filteredProducts = currentCategory === 'All' 
    ? sampleProducts 
    : sampleProducts.filter(product => product.category === currentCategory);

  console.log('Current category:', currentCategory);
  console.log('Filtered products count:', filteredProducts.length);

  const handleViewAllProducts = () => {
    console.log('View All Products clicked');
    alert('More products will be loaded here!');
  };

  const handleCategorySelect = (category: string) => {
    console.log('Local category select in ProductGrid:', category);
    setCurrentCategory(category);
  };

  const categories = ['All', 'Groceries', 'Vegetables', 'Snacks', 'Body Care', 'Personal Care'];

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully selected range of fresh groceries, vegetables, and daily essentials at unbeatable prices.
          </p>
        </div>

        {/* Category Filter Buttons - Only show if no external category is controlled */}
        {!selectedCategory || selectedCategory === 'All' ? (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => handleCategorySelect(category)}
                variant={currentCategory === category ? "default" : "outline"}
                className={`${
                  currentCategory === category 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                } transition-colors duration-200`}
              >
                {category}
              </Button>
            ))}
          </div>
        ) : null}

        {/* Products Display */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {currentCategory === 'All' ? 'All Products' : `${currentCategory} Products`}
            <span className="text-sm text-gray-500 ml-2">({filteredProducts.length} items)</span>
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No products found in {currentCategory} category.</p>
              <Button 
                onClick={() => handleCategorySelect('All')}
                className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
              >
                View All Products
              </Button>
            </div>
          )}
        </div>
        
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              onClick={handleViewAllProducts}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
