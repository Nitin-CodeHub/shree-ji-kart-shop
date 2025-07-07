
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Table, Grid } from 'lucide-react';
import AdminOrdersList from '@/components/AdminOrdersList';
import AdminOrdersTable from '@/components/AdminOrdersTable';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-orange-600" />
              <h1 className="text-3xl font-bold">Admin Panel - Orders Management</h1>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              onClick={() => setViewMode('table')}
              size="sm"
            >
              <Table className="h-4 w-4 mr-2" />
              Table View
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              onClick={() => setViewMode('cards')}
              size="sm"
            >
              <Grid className="h-4 w-4 mr-2" />
              Card View
            </Button>
          </div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-orange-800">
            <strong>Admin Access:</strong> यहाँ आप सभी customer orders देख सकते हैं delivery के लिए। 
            Phone numbers पर click करके customers को call कर सकते हैं।
          </p>
        </div>
        
        {viewMode === 'table' ? <AdminOrdersTable /> : <AdminOrdersList />}
      </div>
    </div>
  );
};

export default AdminOrders;
