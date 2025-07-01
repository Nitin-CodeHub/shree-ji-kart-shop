
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Copy, Smartphone, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UpiPaymentProps {
  amount: number;
  orderId: string;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

const UpiPayment: React.FC<UpiPaymentProps> = ({ 
  amount, 
  orderId, 
  onPaymentSuccess, 
  onBack 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const upiId = "9755665650@ibl";
  const paymentNote = `Order #${orderId.slice(-8)}`;
  
  // Generate UPI payment URLs for different apps
  const generateUpiUrl = (app: string) => {
    const baseUrl = `upi://pay?pa=${upiId}&pn=Store&am=${amount}&tn=${paymentNote}&cu=INR`;
    
    switch (app) {
      case 'phonepe':
        return `phonepe://pay?pa=${upiId}&pn=Store&am=${amount}&tn=${paymentNote}&cu=INR`;
      case 'gpay':
        return `gpay://upi/pay?pa=${upiId}&pn=Store&am=${amount}&tn=${paymentNote}&cu=INR`;
      case 'paytm':
        return `paytmmp://pay?pa=${upiId}&pn=Store&am=${amount}&tn=${paymentNote}&cu=INR`;
      default:
        return baseUrl;
    }
  };

  const handleUpiPayment = (app: string) => {
    const upiUrl = generateUpiUrl(app);
    window.location.href = upiUrl;
    
    toast({
      title: "Opening UPI App",
      description: `Opening ${app} app for payment of ₹${amount}`,
    });
    
    // Start payment verification process
    setTimeout(() => {
      setIsProcessing(true);
    }, 2000);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    toast({
      title: "UPI ID Copied", 
      description: "UPI ID has been copied to clipboard",
    });
  };

  const confirmPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment verification (in real app, verify with payment gateway)
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful!",
        description: "Your payment has been confirmed",
      });
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">UPI Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Display */}
          <div className="text-center">
            <p className="text-lg font-medium mb-2">Amount to Pay</p>
            <p className="text-3xl font-bold text-orange-600">₹{amount.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Order #{orderId.slice(-8)}</p>
          </div>
          
          <Separator />
          
          {/* UPI Apps */}
          <div className="space-y-3">
            <h3 className="font-medium text-center">Choose UPI App</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleUpiPayment('phonepe')}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Smartphone className="h-4 w-4" />
                PhonePe
              </Button>
              
              <Button
                onClick={() => handleUpiPayment('gpay')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <CreditCard className="h-4 w-4" />
                Google Pay
              </Button>
              
              <Button
                onClick={() => handleUpiPayment('paytm')}
                className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900"
              >
                <Smartphone className="h-4 w-4" />
                Paytm
              </Button>
              
              <Button
                onClick={() => handleUpiPayment('upi')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="h-4 w-4" />
                Other UPI
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Manual UPI */}
          <div className="space-y-3">
            <h3 className="font-medium text-center">Or Pay Manually</h3>
            <div>
              <p className="text-sm text-gray-600 mb-2">Pay to UPI ID:</p>
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded">
                <span className="font-mono text-sm">{upiId}</span>
                <Button size="sm" variant="outline" onClick={copyUpiId}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>1. Open any UPI app</p>
              <p>2. Send ₹{amount.toFixed(2)} to {upiId}</p>
              <p>3. Add note: {paymentNote}</p>
              <p>4. Complete payment and click "Payment Done"</p>
            </div>
          </div>
          
          <Separator />
          
          {/* Action Buttons */}
          <div className="space-y-2">
            {isProcessing ? (
              <Button 
                onClick={confirmPayment}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isProcessing}
              >
                Payment Done - Click to Confirm
              </Button>
            ) : (
              <Button 
                onClick={() => setIsProcessing(true)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                I Have Made the Payment
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onBack}
            >
              Back to Checkout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpiPayment;
