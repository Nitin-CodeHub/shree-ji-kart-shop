
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderNotification {
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  customerAddress: string;
  customerPincode: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerName, customerPhone, totalAmount, items, customerAddress, customerPincode }: OrderNotification = await req.json();

    console.log('Sending WhatsApp notification for new order');

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromWhatsApp = Deno.env.get('TWILIO_WHATSAPP_FROM');
    const adminWhatsApp = 'whatsapp:+919755665650';

    if (!accountSid || !authToken || !fromWhatsApp) {
      console.error('Missing Twilio credentials');
      throw new Error('Twilio credentials not configured');
    }

    // Create order summary
    const itemsList = items.map(item => 
      `• ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `🛒 *NEW ORDER RECEIVED!*

👤 *Customer:* ${customerName}
📞 *Phone:* ${customerPhone}
📍 *Address:* ${customerAddress}
📮 *Pincode:* ${customerPincode}

📦 *Items:*
${itemsList}

💰 *Total Amount:* ₹${totalAmount.toFixed(2)}

⏰ *Time:* ${new Date().toLocaleString('en-IN')}

Please check your admin panel for more details!`;

    // Send WhatsApp message via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('From', fromWhatsApp);
    formData.append('To', adminWhatsApp);
    formData.append('Body', message);

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!twilioResponse.ok) {
      const errorText = await twilioResponse.text();
      console.error('Twilio API error:', errorText);
      throw new Error(`Twilio API error: ${twilioResponse.status}`);
    }

    const result = await twilioResponse.json();
    console.log('WhatsApp message sent successfully:', result.sid);

    return new Response(
      JSON.stringify({ success: true, messageSid: result.sid }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send WhatsApp notification',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});
