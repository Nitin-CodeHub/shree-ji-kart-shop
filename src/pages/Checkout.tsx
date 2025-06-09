
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Truck, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart, addOrder } = useCart();
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
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const upiId = "9691565650@paytm";

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    toast({
      title: "UPI ID Copied",
      description: "UPI ID has been copied to clipboard",
    });
  };

  const handlePlaceOrder = async () => {
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
      setShowPaymentDetails(true);
      toast({
        title: "Payment Instructions",
        description: "Please complete the UPI payment and then confirm your order",
      });
      return;
    }

    setIsProcessing(true);
    
    // Create order
    const order = {
      id: Date.now().toString(),
      items: [...cart],
      customer: { ...customerInfo },
      paymentMethod,
      total: getTotalPrice(),
      status: 'pending' as const,
      timestamp: new Date().toISOString()
    };

    // Simulate order processing
    setTimeout(() => {
      console.log('Order placed:', order);
      
      addOrder(order);
      clearCart();
      setIsProcessing(false);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order will be delivered soon. Payment method: ${paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}`,
      });

      navigate('/');
    }, 2000);
  };

  const confirmUpiPayment = () => {
    setIsProcessing(true);
    
    const order = {
      id: Date.now().toString(),
      items: [...cart],
      customer: { ...customerInfo },
      paymentMethod,
      total: getTotalPrice(),
      status: 'confirmed' as const,
      timestamp: new Date().toISOString()
    };

    setTimeout(() => {
      console.log('UPI Order confirmed:', order);
      
      addOrder(order);
      clearCart();
      setIsProcessing(false);
      setShowPaymentDetails(false);
      
      toast({
        title: "Payment Confirmed!",
        description: "Your order has been placed successfully",
      });

      navigate('/orders');
    }, 2000);
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

  if (showPaymentDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Complete UPI Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Amount to Pay</p>
                <p className="text-3xl font-bold text-orange-600">₹{getTotalPrice().toFixed(2)}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="font-medium mb-2">Pay to UPI ID:</p>
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded">
                  <span className="font-mono">{upiId}</span>
                  <Button size="sm" variant="outline" onClick={copyUpiId}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  1. Open your UPI app (PhonePe, Google Pay, Paytm, etc.)
                </p>
                <p className="text-sm text-gray-600">
                  2. Send ₹{getTotalPrice().toFixed(2)} to {upiId}
                </p>
                <p className="text-sm text-gray-600">
                  3. Click "Payment Completed" below after successful payment
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={confirmUpiPayment}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Payment Completed'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowPaymentDetails(false)}
                >
                  Back to Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
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
                    placeholder="Enter your complete address"
                    required
                  />
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
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="font-medium">UPI Payment</div>
                        <div className="text-sm text-gray-600">Pay using UPI: {upiId}</div>
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
                      <p>You will be redirected to complete UPI payment</p>
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
                    {isProcessing ? 'Processing...' : paymentMethod === 'upi' ? 'Proceed to Payment' : 'Place Order'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
