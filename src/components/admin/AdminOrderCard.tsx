
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Phone, MapPin, Package, Clock, CheckCircle, Truck, X } from 'lucide-react';

interface AdminOrder {
  id: string;
  user_id: string;
  total_amount: number;
  items: any[];
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_pincode: string;
  status: string;
  created_at: string;
}

interface AdminOrderCardProps {
  order: AdminOrder;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

const AdminOrderCard: React.FC<AdminOrderCardProps> = ({ order, onUpdateStatus }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'delivered': return <Truck className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {getStatusIcon(order.status)}
              Order #{order.id.slice(-8)}
            </CardTitle>
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Customer Details */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Delivery Details
          </h4>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong>Name:</strong> {order.customer_name}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              <strong>Phone:</strong> {order.customer_phone}
            </div>
            <div className="md:col-span-2">
              <strong>Address:</strong> {order.customer_address}
            </div>
            <div>
              <strong>Pincode:</strong> {order.customer_pincode}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h4 className="font-semibold mb-2">Order Items:</h4>
          <div className="space-y-2">
            {Array.isArray(order.items) && order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between items-center font-semibold">
          <span>Total Amount:</span>
          <span className="text-lg text-green-600">₹{Number(order.total_amount).toFixed(2)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {order.status === 'pending' && (
            <>
              <Button 
                onClick={() => onUpdateStatus(order.id, 'confirmed')}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                Confirm Order
              </Button>
              <Button 
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                variant="destructive"
                size="sm"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel Order
              </Button>
            </>
          )}
          {order.status === 'confirmed' && (
            <>
              <Button 
                onClick={() => onUpdateStatus(order.id, 'delivered')}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                Mark as Delivered
              </Button>
              <Button 
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                variant="destructive"
                size="sm"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel Order
              </Button>
            </>
          )}
          <Button 
            onClick={() => window.open(`tel:${order.customer_phone}`)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Phone className="h-3 w-3" />
            Call Customer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminOrderCard;
