
import React, { useState } from 'react';
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
    id: 3,
    name: "Fresh Milk",
    price: 60,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Dairy",
    unit: "liter"
  },
  {
    id: 4,
    name: "Bananas",
    price: 50,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Fruits",
    unit: "dozen"
  },
  {
    id: 5,
    name: "Toor Dal",
    price: 140,
    originalPrice: 160,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Groceries",
    unit: "kg"
  },
  {
    id: 6,
    name: "Fresh Onions",
    price: 30,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Vegetables",
    unit: "kg"
  },
  {
    id: 7,
    name: "Apples",
    price: 180,
    originalPrice: 200,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Fruits",
    unit: "kg"
  },
  {
    id: 8,
    name: "Paneer",
    price: 320,
    image: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Dairy",
    unit: "500g"
  }
];

interface ProductGridProps {
  selectedCategory?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ selectedCategory }) => {
  const [localSelectedCategory, setLocalSelectedCategory] = useState<string>('All');
  
  // Use prop if provided, otherwise use local state
  const activeCategory = selectedCategory || localSelectedCategory;
  
  // Filter products based on selected category
  const filteredProducts = activeCategory === 'All' 
    ? sampleProducts 
    : sampleProducts.filter(product => product.category === activeCategory);

  const handleViewAllProducts = () => {
    console.log('View All Products clicked');
    alert('More products will be loaded here!');
  };

  const handleCategorySelect = (category: string) => {
    setLocalSelectedCategory(category);
    console.log('Category selected:', category);
  };

  const categories = ['All', 'Groceries', 'Vegetables', 'Fruits', 'Dairy', 'Snacks', 'Beverages', 'Personal Care'];

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully selected range of fresh groceries, vegetables, fruits, and daily essentials at unbeatable prices.
          </p>
        </div>

        {/* Category Filter Buttons - Only show if no external category is selected */}
        {!selectedCategory && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => handleCategorySelect(category)}
                variant={activeCategory === category ? "default" : "outline"}
                className={`${
                  activeCategory === category 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                } transition-colors duration-200`}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Products Display */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {activeCategory === 'All' ? 'All Products' : `${activeCategory} Products`}
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
              <p className="text-gray-500 text-lg">No products found in {activeCategory} category.</p>
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
