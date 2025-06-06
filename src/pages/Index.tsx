
import React from 'react';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <Hero />
        <ProductGrid />
        <Features />
        <Footer />
      </div>
    </CartProvider>
  );
};

export default Index;
