
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Table, Grid, RefreshCw } from 'lucide-react';
import AdminOrdersList from '@/components/AdminOrdersList';
import AdminOrdersTable from '@/components/AdminOrdersTable';
import AdminPasswordPrompt from '@/components/AdminPasswordPrompt';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // If not authenticated, show password prompt
  if (!isAuthenticated) {
    return <AdminPasswordPrompt onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')} 
                className="mr-4 hover:bg-orange-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Admin Panel
                  </h1>
                  <p className="text-sm text-gray-600 hidden sm:block">Orders Management</p>
                </div>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                onClick={() => setViewMode('table')}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Table className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Table View</span>
                <span className="sm:hidden">Table</span>
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                onClick={() => setViewMode('cards')}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Grid className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Card View</span>
                <span className="sm:hidden">Cards</span>
              </Button>
            </div>
          </div>
          
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 sm:p-6 mb-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-orange-200 p-2 rounded-lg flex-shrink-0">
                <Shield className="h-5 w-5 text-orange-700" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800 mb-1">Admin Access Panel</h3>
                <p className="text-orange-700 text-sm sm:text-base">
                  यहाँ आप सभी customer orders देख सकते हैं और manage कर सकते हैं। 
                  Phone numbers पर click करके customers को call कर सकते हैं।
                </p>
              </div>
            </div>
          </div>
          
          {/* Orders Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {viewMode === 'table' ? <AdminOrdersTable /> : <AdminOrdersList />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
