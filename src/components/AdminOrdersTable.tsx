
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Phone, Eye, CheckCircle, Clock, Truck, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface DatabaseOrder {
  id: string;
  user_id: string;
  total_amount: number;
  items: any;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_pincode: string;
  status: string;
  created_at: string;
}

const AdminOrdersTable = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchAllOrders = async () => {
    try {
      setRefreshing(true);
      console.log('Fetching all orders for admin...');
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive"
        });
        return;
      }

      console.log('Fetched orders:', data);

      const transformedOrders: AdminOrder[] = (data || []).map((order: DatabaseOrder) => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : []
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive"
        });
        return;
      }

      let statusMessage = `Order status updated to ${newStatus}`;
      if (newStatus === 'cancelled') {
        statusMessage = "Order cancelled - Product not available for location";
      }

      toast({
        title: "Status Updated",
        description: statusMessage,
      });

      fetchAllOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    fetchAllOrders();

    // Set up real-time subscription for new orders
    const channel = supabase
      .channel('admin-table-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Real-time order change detected in table view:', payload);
          // Refresh orders when any change happens
          fetchAllOrders();
          
          // Show notification for new orders
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Order Received!",
              description: `New order from ${payload.new.customer_name}`,
            });
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Orders</h2>
          <p className="text-sm text-gray-600 mt-1">Total: {orders.length} orders</p>
        </div>
        <Button 
          onClick={fetchAllOrders} 
          variant="outline" 
          size="sm"
          disabled={refreshing}
          className="w-full sm:w-auto"
        >
          {refreshing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Orders
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Truck className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-500">कोई orders अभी तक नहीं आए हैं।</p>
        </div>
      ) : (
        <>
          {/* Mobile Cards View */}
          <div className="block sm:hidden space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm font-medium">
                        #{order.id.slice(-8)}
                      </CardTitle>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} border`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        <span className="text-xs">{order.status}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Customer:</span>
                      <p className="text-gray-900">{order.customer_name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Amount:</span>
                      <p className="font-medium text-green-600">₹{Number(order.total_amount).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">{order.customer_phone}</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Items:</span>
                    <p className="text-gray-900">{order.items.length} items</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`tel:${order.customer_phone}`)}
                      className="flex-1"
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  </div>
                  {order.status === 'pending' && (
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className="bg-blue-600 hover:bg-blue-700 flex-1"
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        variant="destructive"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  {order.status === 'confirmed' && (
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        Delivered
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        variant="destructive"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Order ID</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Phone</TableHead>
                  <TableHead className="font-semibold">Address</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">
                      #{order.id.slice(-8)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{order.customer_name}</div>
                        <div className="text-xs text-gray-500">Items: {order.items.length}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {order.customer_phone}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm" title={order.customer_address}>
                        {order.customer_address}
                      </div>
                      <div className="text-xs text-gray-500">PIN: {order.customer_pincode}</div>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      ₹{Number(order.total_amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)} border`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          <span className="text-xs">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${order.customer_phone}`)}
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        {order.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              variant="destructive"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {order.status === 'confirmed' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Delivered
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              variant="destructive"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto border-2 border-orange-200">
            <CardHeader className="bg-orange-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg sm:text-xl">
                  Order Details - #{selectedOrder.id.slice(-8)}
                </CardTitle>
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-gray-700">Name:</strong> {selectedOrder.customer_name}</p>
                    <p><strong className="text-gray-700">Phone:</strong> {selectedOrder.customer_phone}</p>
                    <p><strong className="text-gray-700">Address:</strong> {selectedOrder.customer_address}</p>
                    <p><strong className="text-gray-700">Pincode:</strong> {selectedOrder.customer_pincode}</p>
                    <p><strong className="text-gray-700">Date:</strong> {new Date(selectedOrder.created_at).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-green-600">₹{Number(selectedOrder.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersTable;
