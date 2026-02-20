import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const callbackData = await request.json();
    
    console.log('Payment callback received:', callbackData);
    
    const transactionRef = callbackData.transaction_ref || callbackData.transaction_id;
    const status = callbackData.status;
    const orderReference = callbackData.transaction_reference;
    const metadata = callbackData.metadata || {};

    if (!transactionRef || !orderReference) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the order using the orderReference (this is your DECLUT-XXXXXX ID)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id')
      .eq('order_id', orderReference) // or use metadata.orderId if that's what you stored
      .single();

    if (orderError || !order) {
      console.error('Order not found:', orderReference);
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (status === 'successful' || status === 'completed') {
      
      // 1. Save payment transaction (your existing code)
      await supabase
        .from('payment_transactions')
        .insert({
          order_id: order.id,
          transaction_ref: transactionRef,
          amount: callbackData.amount,
          currency: callbackData.currency || 'KES',
          status: 'completed',
          payhero_response: callbackData
        });

      // 2. USE THE DATABASE FUNCTION to finalize the order
      const { error: fnError } = await supabase
        .rpc('finalize_order', {  // rpc = Remote Procedure Call
          p_order_id: order.id,
          p_transaction_ref: transactionRef
        });

      if (fnError) {
        console.error('Error calling finalize_order:', fnError);
        throw fnError;
      }

      console.log(`Order ${order.id} finalized with transaction ${transactionRef}`);

      // Redirect to success page
      const redirectUrl = new URL('/payment/success', process.env.NEXT_PUBLIC_APP_URL);
      redirectUrl.searchParams.set('order', orderReference);
      redirectUrl.searchParams.set('transaction', transactionRef);
      
      return NextResponse.redirect(redirectUrl.toString());
      
    } else if (status === 'failed') {
      
      // Save failed transaction
      await supabase
        .from('payment_transactions')
        .insert({
          order_id: order.id,
          transaction_ref: transactionRef,
          amount: callbackData.amount,
          currency: callbackData.currency || 'KES',
          status: 'failed',
          payhero_response: callbackData
        });

      // Update order status to failed
      await supabase
        .from('orders')
        .update({ 
          status: 'failed',
          payment_status: 'failed' 
        })
        .eq('id', order.id);

      const redirectUrl = new URL('/payment', process.env.NEXT_PUBLIC_APP_URL);
      redirectUrl.searchParams.set('error', 'payment_failed');
      
      return NextResponse.redirect(redirectUrl.toString());
    }

    return NextResponse.json({ success: true, message: 'Webhook received' });

  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { success: false, message: 'Callback processing failed' },
      { status: 200 } // Return 200 to acknowledge receipt
    );
  }
}

// Handle GET requests (for testing)
export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const orderRef = searchParams.get('order');
  const status = searchParams.get('status');
  
  return NextResponse.json({
    success: true,
    message: 'Payment callback endpoint is working',
    orderRef,
    status
  });
}