
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Twilio } from 'npm:twilio';

const twilioClient = new Twilio(
  Deno.env.get('TWILIO_ACCOUNT_SID')!,
  Deno.env.get('TWILIO_AUTH_TOKEN')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber } = await req.json();

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send SMS using Twilio
    await twilioClient.messages.create({
      body: `Your MedSync verification code is: ${otp}`,
      to: `+94${phoneNumber}`, // Add Sri Lanka country code
      from: '+17622488324', // Replace with your Twilio phone number
    });

    return new Response(
      JSON.stringify({ success: true, otp }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
