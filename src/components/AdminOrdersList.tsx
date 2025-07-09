
import React from 'react';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import AdminOrdersHeader from '@/components/admin/AdminOrdersHeader';
import AdminOrdersEmpty from '@/components/admin/AdminOrdersEmpty';
import AdminOrderCard from '@/components/admin/AdminOrderCard';

const AdminOrdersList = () => {
  const { orders, loading, fetchAllOrders, updateOrderStatus } = useAdminOrders();

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminOrdersHeader onRefresh={fetchAllOrders} />
      
      {orders.length === 0 ? (
        <AdminOrdersEmpty />
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <AdminOrderCard
              key={order.id}
              order={order}
              onUpdateStatus={updateOrderStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersList;
