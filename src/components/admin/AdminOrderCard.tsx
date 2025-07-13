
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
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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
    <Card className="w-full shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div className="flex-1">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 mb-2">
              <div className="bg-orange-100 p-1.5 rounded-lg">
                {getStatusIcon(order.status)}
              </div>
              <span>Order #{order.id.slice(-8)}</span>
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <Badge className={`${getStatusColor(order.status)} border font-medium`}>
            <div className="flex items-center gap-1">
              {getStatusIcon(order.status)}
              <span className="text-xs">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Customer Details */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Delivery Details
          </h4>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-blue-800">Name:</span>
              <p className="text-blue-900">{order.customer_name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-blue-600" />
              <span className="font-medium text-blue-800">Phone:</span>
              <p className="text-blue-900">{order.customer_phone}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="font-medium text-blue-800">Address:</span>
              <p className="text-blue-900 break-words">{order.customer_address}</p>
            </div>
            <div>
              <span className="font-medium text-blue-800">Pincode:</span>
              <p className="text-blue-900">{order.customer_pincode}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-900">Order Items ({order.items.length}):</h4>
          <div className="space-y-2">
            {Array.isArray(order.items) && order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg border">
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className="text-gray-600 ml-2">× {item.quantity}</span>
                </div>
                <span className="font-semibold text-green-600">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center font-semibold text-lg bg-green-50 p-3 rounded-lg border border-green-200">
          <span className="text-green-800">Total Amount:</span>
          <span className="text-green-700">₹{Number(order.total_amount).toFixed(2)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-2">
          {order.status === 'pending' && (
            <div className="flex gap-2 w-full">
              <Button 
                onClick={() => onUpdateStatus(order.id, 'confirmed')}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
                size="sm"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Confirm Order
              </Button>
              <Button 
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                variant="destructive"
                size="sm"
                className="flex-1"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          )}
          {order.status === 'confirmed' && (
            <div className="flex gap-2 w-full">
              <Button 
                onClick={() => onUpdateStatus(order.id, 'delivered')}
                className="bg-green-600 hover:bg-green-700 flex-1"
                size="sm"
              >
                <Truck className="h-3 w-3 mr-1" />
                Mark Delivered
              </Button>
              <Button 
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                variant="destructive"
                size="sm"
                className="flex-1"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          )}
          <Button 
            onClick={() => window.open(`tel:${order.customer_phone}`)}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 border-green-300 text-green-700"
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
