import { PayHeroPaymentRequest, PayHeroPaymentResponse, PayHeroWebhookPayload } from './types';

const PAYHERO_BASE_URL = process.env.PAYHERO_BASE_URL || 'https://api.payhero.co.ke';
const PAYHERO_BASIC_AUTH = process.env.PAYHERO_BASIC_AUTH || '';
const PAYHERO_ACCOUNT_ID = process.env.PAYHERO_ACCOUNT_ID;

export async function initiatePayment(
  paymentData: PayHeroPaymentRequest
): Promise<PayHeroPaymentResponse> {
  try {
    console.log('Initiating PayHero payment:', {
      amount: paymentData.amount,
      reference: paymentData.transaction_reference,
    });

    // Validate required fields
    if (!paymentData.amount || !paymentData.phone_number || !paymentData.transaction_reference) {
      throw new Error('Missing required payment fields');
    }

    const payload = {
      account_id: PAYHERO_ACCOUNT_ID,
      amount: paymentData.amount,
      currency: paymentData.currency || 'KES',
      email: paymentData.email,
      phone_number: paymentData.phone_number,
      transaction_reference: paymentData.transaction_reference,
      callback_url: paymentData.callback_url,
      redirect_url: paymentData.redirect_url,
      cancel_url: paymentData.cancel_url,
      metadata: paymentData.metadata || {},
      // Additional fields that PayHero might need
      first_name: paymentData.metadata?.customerName?.split(' ')[0] || 'Customer',
      last_name: paymentData.metadata?.customerName?.split(' ')[1] || '',
      description: `DeClut Order: ${paymentData.transaction_reference}`,
    };

    const response = await fetch(`${PAYHERO_BASE_URL}/api/v1/payments/request`, {
      method: 'POST',
      headers: {
        'Authorization': PAYHERO_BASIC_AUTH,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse PayHero response:', responseText);
      throw new Error('Invalid response from payment gateway');
    }

    if (!response.ok) {
      console.error('PayHero API error:', data);
      throw new Error(data.message || data.error || `Payment failed with status ${response.status}`);
    }

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    console.error('PayHero payment initiation error:', error);
    throw error;
  }
}

export async function verifyPayment(transactionId: string): Promise<PayHeroPaymentResponse> {
  try {
    const response = await fetch(`${PAYHERO_BASE_URL}/api/v1/payments/verify/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': PAYHERO_BASIC_AUTH,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Verification failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Implement HMAC SHA256 verification based on PayHero's documentation
  // This is a placeholder - check PayHero docs for exact implementation
  console.log('Webhook signature verification - implement based on PayHero docs');
  return true;
}