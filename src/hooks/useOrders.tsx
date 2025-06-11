
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
  const { user, session } = useAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!user || !session) {
      console.log('No user or session available for fetching orders');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching orders for user:', user.id);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Fetched orders:', data);

      // Transform database orders to frontend format
      const transformedOrders: Order[] = (data || []).map((order: DatabaseOrder) => ({
        id: order.id,
        items: Array.isArray(order.items) ? order.items : [],
        customer: {
          name: order.customer_name || '',
          phone: order.customer_phone || '',
          address: order.customer_address || '',
          pincode: order.customer_pincode || '',
        },
        paymentMethod: 'cod' as const,
        total: Number(order.total_amount) || 0,
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
    if (!user || !session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place an order",
        variant: "destructive"
      });
      return { error: new Error('User not authenticated') };
    }

    try {
      console.log('Adding order for user:', user.id);
      console.log('Order data:', order);

      const orderData = {
        user_id: user.id,
        total_amount: order.total,
        items: order.items,
        customer_name: order.customer.name,
        customer_phone: order.customer.phone,
        customer_address: order.customer.address,
        customer_pincode: order.customer.pincode,
        status: order.status,
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) {
        console.error('Error adding order:', error);
        toast({
          title: "Error",
          description: "Failed to place order. Please try again.",
          variant: "destructive"
        });
        return { error };
      }

      console.log('Order added successfully:', data);

      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully!",
      });

      // Refresh orders
      await fetchOrders();
      
      return { error: null };
    } catch (error: any) {
      console.error('Error adding order:', error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive"
      });
      return { error };
    }
  };

  useEffect(() => {
    if (user && session) {
      console.log('User authenticated, fetching orders...');
      fetchOrders();
    } else {
      console.log('User not authenticated, clearing orders');
      setOrders([]);
    }
  }, [user, session]);

  return { orders, loading, addOrder, fetchOrders };
};
