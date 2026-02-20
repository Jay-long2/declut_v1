import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { initiatePayment } from '@/lib/payhero';
import { OrderData, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Parse and validate request body
    const orderData: OrderData = await request.json();
    
    // Validate required fields
    if (!orderData.shippingInfo || !orderData.items || !orderData.total) {
      return NextResponse.json(
        { success: false, message: 'Missing required order data' },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!orderData.shippingInfo.phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required for payment' },
        { status: 400 }
      );
    }

    // Generate unique order reference for PayHero
    const orderReference = `DECLUT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Format phone number
    const formattedPhone = orderData.shippingInfo.phone.startsWith('+') 
      ? orderData.shippingInfo.phone 
      : `+254${orderData.shippingInfo.phone.replace(/\D/g, '')}`;

    // ✅ FIXED: Only insert fields that exist in the database schema
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          buyer_id: orderData.userId, // ← THIS MUST BE PASSED FROM FRONTEND
          total: orderData.total,
          status: 'pending'
          // No other fields - they don't exist in the schema!
        }
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Database error:', orderError);
      return NextResponse.json(
        { success: false, message: 'Failed to create order in database' },
        { status: 500 }
      );
    }

    // ✅ Insert order items into order_items table
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', itemsError);
      // Continue anyway - payment can still proceed
    }

    // ✅ Store ALL other data in metadata for PayHero
    const paymentData = {
      amount: orderData.total,
      currency: 'KES',
      email: orderData.shippingInfo.email || `${orderData.shippingInfo.firstName.toLowerCase()}.${orderData.shippingInfo.lastName.toLowerCase()}@example.com`,
      phone_number: formattedPhone,
      transaction_reference: orderReference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment-callback`,
      metadata: {
        orderId: order.id,
        userId: orderData.userId,
        orderReference,
        customerName: `${orderData.shippingInfo.firstName} ${orderData.shippingInfo.lastName}`,
        customerEmail: orderData.shippingInfo.email,
        shippingInfo: JSON.stringify(orderData.shippingInfo),
        items: JSON.stringify(orderData.items),
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        tax: orderData.tax,
        paymentMethod: orderData.paymentMethod
      }
    };

    // Initiate payment with PayHero
    const paymentResponse = await initiatePayment(paymentData);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderReference,
      paymentUrl: paymentResponse.checkout_url || paymentResponse.redirect_url,
      message: 'Order created. Redirect to payment...'
    });

  } catch (error) {
    console.error('Order creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}