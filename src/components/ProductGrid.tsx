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
    image: "data:image/jpeg;base64,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",
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
            filteredProducts.slice(0, 8).map((product, index) => (
              <div key={product.id} className={`animate-fade-in`} style={{animationDelay: `${index * 0.1}s`}}>
                <ProductCard product={product} />
              </div>
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
