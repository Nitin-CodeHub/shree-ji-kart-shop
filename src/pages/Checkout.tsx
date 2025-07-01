
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useLocation } from '@/hooks/useLocation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Truck, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UpiPayment from '@/components/UpiPayment';
import LocationTracker from '@/components/LocationTracker';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const { location } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpiPayment, setShowUpiPayment] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');

  // Load user details if logged in
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        name: user.email || '',
        phone: '',
        address: location?.address || '',
        pincode: ''
      });
    }
  }, [user, location]);

  // Auto-fill location data when available
  useEffect(() => {
    if (location && location.address) {
      setCustomerInfo(prev => ({
        ...prev,
        address: location.address || prev.address
      }));
    }
  }, [location]);

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationUpdate = (locationData: any) => {
    if (locationData.address) {
      setCustomerInfo(prev => ({
        ...prev,
        address: locationData.address
      }));
      
      toast({
        title: "Location Updated",
        description: "Address automatically filled from your location",
      });
    }
  };

  const handlePlaceOrder = async () => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to place an order",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'upi') {
      // Generate order ID and show UPI payment
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setCurrentOrderId(orderId);
      setShowUpiPayment(true);
      return;
    }

    // Handle COD orders
    await processOrder('pending');
  };

  const processOrder = async (status: 'pending' | 'confirmed') => {
    setIsProcessing(true);
    
    const order = {
      items: [...cart],
      customer: { 
        ...customerInfo,
        // Include location data if available
        location: location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy
        } : null
      },
      paymentMethod,
      total: getTotalPrice(),
      status,
    };

    try {
      console.log('Processing order with location data:', order);
      
      await addOrder(order);
      clearCart();
      setIsProcessing(false);
      setShowUpiPayment(false);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order has been ${status === 'confirmed' ? 'confirmed' : 'placed'}. ${paymentMethod === 'cod' ? 'You will pay on delivery.' : 'Payment received.'}`,
      });

      navigate('/orders');
    } catch (error) {
      setIsProcessing(false);
      console.error('Order processing error:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpiPaymentSuccess = async () => {
    await processOrder('confirmed');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some products to proceed with checkout</p>
          <Button onClick={() => navigate('/')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  if (showUpiPayment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setShowUpiPayment(false)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Checkout
          </Button>
          <h1 className="text-3xl font-bold">UPI Payment</h1>
        </div>
        
        <UpiPayment
          amount={getTotalPrice()}
          orderId={currentOrderId}
          onPaymentSuccess={handleUpiPaymentSuccess}
          onBack={() => setShowUpiPayment(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="space-y-6">
            {/* Location Tracker */}
            <LocationTracker onLocationUpdate={handleLocationUpdate} />

            <Card>
              <CardHeader>
                <CardTitle>
                  Delivery Information
                  {user && (
                    <span className="text-sm font-normal text-green-600 ml-2">
                      (Auto-filled from your profile)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Complete Address *</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder={location ? "Address auto-filled from location" : "Enter your complete address"}
                    required
                  />
                  {location && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Address auto-filled from your location
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={customerInfo.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="Enter your pincode"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'upi' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="text-orange-600"
                      />
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <div className="font-medium">UPI Payment</div>
                        <div className="text-sm text-gray-600">PhonePe, Google Pay, Paytm & more</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'cod' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-orange-600"
                      />
                      <Truck className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">Pay when your order arrives</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          ₹{item.price}/{item.unit} × {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span>₹{getTotalPrice().toFixed(2)}</span>
                  </div>

                  <div className="text-sm text-gray-600">
                    {paymentMethod === 'upi' && (
                      <p>Pay instantly using UPI apps like PhonePe, Google Pay, Paytm</p>
                    )}
                    {paymentMethod === 'cod' && (
                      <p>You will pay ₹{getTotalPrice().toFixed(2)} on delivery</p>
                    )}
                  </div>

                  <Button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : paymentMethod === 'upi' ? 'Pay with UPI' : 'Place Order'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location Info Display */}
            {location && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Delivery Location Details</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-600">
                  <p>Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
                  {location.accuracy && (
                    <p>Location Accuracy: ~{Math.round(location.accuracy)} meters</p>
                  )}
                  <p className="text-green-600 mt-1">✓ Location captured for accurate delivery</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
