
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product, useCart } from '@/contexts/CartContext';
import { ShoppingCart, Plus, Minus, ImageIcon } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError ? '/placeholder.svg' : product.image;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover-scale">
      <CardContent className="p-4">
        <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100">
          {/* Loading Placeholder */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Error Placeholder */}
          {imageError && (
            <div className="w-full h-48 flex items-center justify-center bg-gray-200">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Image not available</p>
              </div>
            </div>
          )}
          
          {/* Actual Image */}
          <img
            src={imageSrc}
            alt={product.name}
            className={`w-full h-48 object-cover group-hover:scale-105 transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          
          {product.originalPrice && imageLoaded && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold animate-fade-in">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.category}</p>
          
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-green-600">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
            <span className="text-xs text-gray-500">/{product.unit}</span>
          </div>
          
          {cartItem ? (
            <div className="flex items-center justify-between bg-orange-50 rounded-lg p-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-orange-600">{cartItem.quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => addToCart(product)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
