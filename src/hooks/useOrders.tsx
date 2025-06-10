
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  items: any[];
  customer: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
  };
  paymentMethod: 'upi' | 'cod';
  total: number;
  status: 'pending' | 'confirmed' | 'delivered';
  timestamp: string;
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

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database orders to frontend format
      const transformedOrders: Order[] = (data as DatabaseOrder[]).map((order) => ({
        id: order.id,
        items: Array.isArray(order.items) ? order.items : [],
        customer: {
          name: order.customer_name,
          phone: order.customer_phone,
          address: order.customer_address,
          pincode: order.customer_pincode,
        },
        paymentMethod: 'cod' as const,
        total: Number(order.total_amount),
        status: order.status as 'pending' | 'confirmed' | 'delivered',
        timestamp: order.created_at,
      }));

      setOrders(transformedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'timestamp'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: order.total,
          items: order.items,
          customer_name: order.customer.name,
          customer_phone: order.customer.phone,
          customer_address: order.customer.address,
          customer_pincode: order.customer.pincode,
          status: order.status,
        });

      if (error) throw error;

      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully!",
      });

      // Refresh orders
      fetchOrders();
    } catch (error: any) {
      console.error('Error adding order:', error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return { orders, loading, addOrder, fetchOrders };
};
