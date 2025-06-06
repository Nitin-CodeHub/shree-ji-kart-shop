
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product, useCart } from '@/contexts/CartContext';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const cartItem = cart.find(item => item.id === product.id);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.originalPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
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
