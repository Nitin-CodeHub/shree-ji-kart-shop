import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, ShoppingCart, User, MapPin, Phone, CreditCard } from 'lucide-react';
import AuthDialog from '@/components/AuthDialog';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setCustomerDetails({
            name: data.name || '',
            phone: data.phone || '',
            address: data.address || '',
            pincode: data.pincode || ''
          });
        }
      }
    };

    if (user && !authLoading) {
      fetchUserProfile();
    }
  }, [user, authLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { name, phone, address, pincode } = customerDetails;
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "कृपया अपना नाम दर्ज करें",
        variant: "destructive"
      });
      return false;
    }
    
    if (!phone.trim() || phone.length < 10) {
      toast({
        title: "Error", 
        description: "कृपया वैध फोन नंबर दर्ज करें",
        variant: "destructive"
      });
      return false;
    }
    
    if (!address.trim()) {
      toast({
        title: "Error",
        description: "कृपया अपना पूरा पता दर्ज करें",
        variant: "destructive"
      });
      return false;
    }
    
    if (!pincode.trim() || pincode.length !== 6) {
      toast({
        title: "Error",
        description: "कृपया वैध पिनकोड दर्ज करें",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting order...', { customerDetails, cart, total: getTotalPrice() });
      
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getTotalPrice(),
          items: cart as any,
          customer_name: customerDetails.name,
          customer_phone: customerDetails.phone,
          customer_address: customerDetails.address,
          customer_pincode: customerDetails.pincode,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }

      console.log('Order created successfully:', orderData);

      // Send WhatsApp notification
      try {
        console.log('Sending WhatsApp notification...');
        const { data: notificationData, error: notificationError } = await supabase.functions.invoke('send-whatsapp-notification', {
          body: {
            customerName: customerDetails.name,
            customerPhone: customerDetails.phone,
            totalAmount: getTotalPrice(),
            items: cart,
            customerAddress: customerDetails.address,
            customerPincode: customerDetails.pincode
          }
        });

        if (notificationError) {
          console.error('WhatsApp notification error:', notificationError);
          // Don't fail the order if notification fails
        } else {
          console.log('WhatsApp notification sent:', notificationData);
        }
      } catch (notificationError) {
        console.error('WhatsApp notification failed:', notificationError);
        // Continue with success even if notification fails
      }

      // Update user profile if needed
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: customerDetails.name,
          phone: customerDetails.phone,
          address: customerDetails.address,
          pincode: customerDetails.pincode
        });

      toast({
        title: "Order Placed Successfully!",
        description: "आपका ऑर्डर सफलतापूर्वक प्लेस हो गया है। हम जल्द ही आपसे संपर्क करेंगे।",
      });

      clearCart();
      navigate('/order-history');

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Order placement में समस्या हुई। कृपया दोबारा कोशिश करें।",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mr-4 hover:bg-orange-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Checkout
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">Complete your order</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Order Summary */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          ₹{item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                      <span>Total:</span>
                      <span className="text-green-600">₹{getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Details Form */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <User className="h-5 w-5" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={customerDetails.name}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={customerDetails.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Complete Address *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="House No., Street, Area, City"
                      value={customerDetails.address}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                      Pincode *
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      placeholder="Enter 6-digit pincode"
                      value={customerDetails.pincode}
                      onChange={handleInputChange}
                      maxLength={6}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Payment Section */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Payment Method</h3>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                      <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                      <p className="text-xs text-gray-500 mt-1">Pay when your order arrives</p>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 text-base sm:text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing Order...
                      </div>
                    ) : (
                      `Place Order - ₹${getTotalPrice().toFixed(2)}`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog} 
      />
    </div>
  );
};

export default Checkout;
