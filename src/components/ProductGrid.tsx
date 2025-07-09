import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  },
  // New Body Care Products
  {
    id: 13,
    name: "Dettol Soap",
    price: 35,
    originalPrice: 40,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Body Care",
    unit: "piece"
  },
  {
    id: 14,
    name: "Himalaya Face Wash",
    price: 120,
    originalPrice: 140,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Body Care",
    unit: "tube"
  },
  {
    id: 15,
    name: "Garnier Face Wash",
    price: 150,
    originalPrice: 175,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Body Care",
    unit: "tube"
  },
  // New Snacks Products
  {
    id: 16,
    name: "Kurkure Masala Munch",
    price: 20,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Snacks",
    unit: "pack"
  },
  {
    id: 17,
    name: "Haldiram Bhujia",
    price: 60,
    originalPrice: 70,
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Snacks",
    unit: "pack"
  },
  {
    id: 18,
    name: "Diamond Biscuits",
    price: 25,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Snacks",
    unit: "pack"
  },
  // Updated Products with Real Images and Prices
  {
    id: 19,
    name: "Britannia Toastea Premium Bake Rusk",
    price: 10,
    image: "/lovable-uploads/e6bfda5d-8da8-4858-bb70-7cb6631e8237.png",
    category: "Snacks",
    unit: "pack"
  },
  {
    id: 20,
    name: "Patanjali Dant Kanti Natural Toothpaste",
    price: 60,
    originalPrice: 70,
    image: "/lovable-uploads/74ce55c6-a340-4d12-8283-35e00dff7494.png",
    category: "Body Care",
    unit: "tube"
  },
  {
    id: 21,
    name: "Parle-G Biscuits",
    price: 5,
    image: "/lovable-uploads/7a7fe89e-f706-46c4-ba3e-499829fd1458.png",
    category: "Snacks",
    unit: "pack"
  },
  {
    id: 22,
    name: "Oreo Chocolate Sandwich Biscuits",
    price: 10,
    image: "/lovable-uploads/02d6e5d5-5749-44d3-ac87-42206df61727.png",
    category: "Snacks",
    unit: "pack"
  },
  {
    id: 23,
    name: "Britannia Good Day Butter Cookies",
    price: 5,
    image: "/lovable-uploads/18d12bd9-fd50-4bfa-ace1-20266edb1c82.png",
    category: "Snacks",
    unit: "pack"
  },
  // New Real Products from User
  {
    id: 24,
    name: "Patanjali Cow Ghee",
    price: 160,
    image: "/lovable-uploads/d6ab323b-9c86-4a8b-b8d3-777254eceeae.png",
    category: "Dairy",
    unit: "200g"
  },
  {
    id: 25,
    name: "Golden Laxmi Sooji",
    price: 30,
    image: "/lovable-uploads/01c3131a-8284-4ebf-9556-737b4f465498.png",
    category: "Groceries",
    unit: "500g"
  },
  {
    id: 26,
    name: "Rin Detergent Soap",
    price: 10,
    image: "/lovable-uploads/ae45fe0b-fbfa-4766-ad6d-33c2047f3373.png",
    category: "Personal Care",
    unit: "piece"
  },
  {
    id: 27,
    name: "Tata Salt",
    price: 30,
    image: "/lovable-uploads/49fe2d2e-cd40-4659-833e-1d6f13eabc6f.png",
    category: "Groceries",
    unit: "1kg"
  },
  {
    id: 28,
    name: "Lifebuoy Total 10 Soap",
    price: 10,
    image: "/lovable-uploads/093bcd16-5de0-4011-af2d-ed8d5cebb6a0.png",
    category: "Personal Care",
    unit: "piece"
  },
  {
    id: 29,
    name: "Ghadi Detergent Soap",
    price: 10,
    image: "/lovable-uploads/45bcf28b-f759-476f-9926-d0787f05c84c.png",
    category: "Personal Care",
    unit: "piece"
  },
  {
    id: 30,
    name: "Ghadi Detergent Powder 500g",
    price: 35,
    image: "/lovable-uploads/3594e315-ad5f-4e28-ad7d-1729f99bc5d8.png",
    category: "Home Care",
    unit: "500g"
  },
  {
    id: 31,
    name: "Ghadi Detergent Powder 1kg",
    price: 70,
    image: "/lovable-uploads/3594e315-ad5f-4e28-ad7d-1729f99bc5d8.png",
    category: "Home Care",
    unit: "1kg"
  },
  {
    id: 32,
    name: "Besan Ke Laddu",
    price: 180,
    image: "/lovable-uploads/9299eb23-e2cc-4106-b007-b5b53ddd686f.png",
    category: "Sweets",
    unit: "1kg"
  },
  {
    id: 33,
    name: "Tata Tea Agni",
    price: 60,
    image: "/lovable-uploads/ac2c91ab-90d5-412f-b4af-d73acdc7a306.png",
    category: "Beverages",
    unit: "250g"
  },
  {
    id: 34,
    name: "Yellow Marvel Tea",
    price: 130,
    image: "/lovable-uploads/59c1e535-e710-4c4f-bd64-bcae2220e471.png",
    category: "Beverages",
    unit: "200g"
  }
];

interface ProductGridProps {
  selectedCategory?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ selectedCategory = 'All' }) => {
  const navigate = useNavigate();
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
    console.log('View All Products clicked - navigating to /products');
    navigate('/products');
  };

  const handleCategorySelect = (category: string) => {
    console.log('Local category select in ProductGrid:', category);
    setCurrentCategory(category);
  };

  const categories = ['All', 'Groceries', 'Vegetables', 'Snacks', 'Body Care', 'Home Care', 'Personal Care', 'Dairy', 'Sweets', 'Beverages'];

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
            filteredProducts.slice(0, 8).map((product) => (
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
