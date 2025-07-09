
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CartSidebar = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheckout = () => {
    console.log('Proceeding to checkout with items:', cart);
    navigate('/checkout');
  };

  const handleCancelOrder = () => {
    clearCart();
    toast({
      title: "Order Cancelled",
      description: "Product not available for your location",
      variant: "destructive"
    });
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 px-4">
        <p className="text-lg mb-4 text-center">Your cart is empty</p>
        <p className="text-sm text-center">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-2 md:px-4">
      <div className="flex-1 overflow-y-auto space-y-3 mt-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center space-x-2 md:space-x-3 bg-gray-50 p-2 md:p-3 rounded-lg">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-10 h-10 md:w-12 md:h-12 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs md:text-sm font-medium text-gray-900 truncate">{item.name}</h4>
              <p className="text-xs md:text-sm text-gray-500">₹{item.price}/{item.unit}</p>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="h-6 w-6 p-0"
              >
                <Minus className="h-2 w-2 md:h-3 md:w-3" />
              </Button>
              <span className="text-xs md:text-sm font-medium w-6 md:w-8 text-center">{item.quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-6 w-6 p-0"
              >
                <Plus className="h-2 w-2 md:h-3 md:w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFromCart(item.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-2 w-2 md:h-3 md:w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-3 md:pt-4 mt-3 md:mt-4 space-y-3 md:space-y-4 pb-2">
        <div className="flex justify-between items-center text-base md:text-lg font-semibold">
          <span>Total: ₹{getTotalPrice().toFixed(2)}</span>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleCheckout}
            className="w-full bg-orange-600 hover:bg-orange-700 text-sm md:text-base py-2 md:py-3"
          >
            Proceed to Checkout
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={handleCancelOrder}
              variant="destructive" 
              className="w-full text-xs md:text-sm py-2"
            >
              <X className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Cancel Order
            </Button>
            <Button 
              onClick={clearCart}
              variant="outline" 
              className="w-full text-xs md:text-sm py-2"
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
