
import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCategorySelect={handleCategorySelect} />
      <Hero />
      <ProductGrid selectedCategory={selectedCategory} />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
