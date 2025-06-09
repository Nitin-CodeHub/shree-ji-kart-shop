
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const OrderHistory = () => {
  const { orders } = useCart();

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500">Your order history will appear here after you place your first order.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Order History</h2>
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(order.timestamp).toLocaleDateString('en-IN')} at {new Date(order.timestamp).toLocaleTimeString('en-IN')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Items:</h4>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>Total Amount</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Payment:</strong> {order.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}</p>
                <p><strong>Delivery to:</strong> {order.customer.name}</p>
                <p>{order.customer.address}, {order.customer.pincode}</p>
                <p><strong>Phone:</strong> {order.customer.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderHistory;
