
import React from 'react';
import { Package } from 'lucide-react';

const AdminOrdersEmpty: React.FC = () => {
  return (
    <div className="text-center py-8">
      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
      <p className="text-gray-500">Orders will appear here when customers place them.</p>
    </div>
  );
};

export default AdminOrdersEmpty;
