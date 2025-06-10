
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  total_amount: number;
  items: any[];
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

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

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
      setOrders(data || []);
    } catch (error) {
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

  const createOrder = async (orderData: {
    total_amount: number;
    items: any[];
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    customer_pincode: string;
  }) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to place an order",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          user_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully",
      });

      fetchOrders(); // Refresh orders
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    orders,
    loading,
    fetchOrders,
    createOrder
  };
};
