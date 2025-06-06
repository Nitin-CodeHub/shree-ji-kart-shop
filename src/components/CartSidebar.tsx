
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2 } from 'lucide-react';

const CartSidebar = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    console.log('Proceeding to checkout with items:', cart);
    alert('Checkout functionality will be implemented here!');
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-lg mb-4">Your cart is empty</p>
        <p className="text-sm">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 mt-6">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
              <p className="text-sm text-gray-500">₹{item.price}/{item.unit}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="h-6 w-6 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-6 w-6 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFromCart(item.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4 mt-4 space-y-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total: ₹{getTotalPrice().toFixed(2)}</span>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleCheckout}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Proceed to Checkout
          </Button>
          <Button 
            onClick={clearCart}
            variant="outline" 
            className="w-full"
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
