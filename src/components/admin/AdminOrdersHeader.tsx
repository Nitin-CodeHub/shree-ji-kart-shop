
import React from 'react';
import { Button } from '@/components/ui/button';

interface AdminOrdersHeaderProps {
  onRefresh: () => void;
}

const AdminOrdersHeader: React.FC<AdminOrdersHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">All Customer Orders</h2>
      <Button onClick={onRefresh} variant="outline">
        Refresh Orders
      </Button>
    </div>
  );
};

export default AdminOrdersHeader;
