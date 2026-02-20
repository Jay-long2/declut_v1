// src/app/payment/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/contexts/CartContext';
// import { useUser } from '@/hooks/useUser'; // COMMENT OUT FOR TESTING
// import { useProfile } from '@/hooks/useProfile'; // COMMENT OUT FOR TESTING
import { supabase } from '@/lib/supabase'; 
import CartSummary from '@/components/ui/CartSummary';
import ShippingForm from '@/components/ui/ShippinForm';
import PaymentMethod from '@/components/ui/PaymentMethod';

export default function PaymentPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  
  // 🔴 REPLACE with MOCK USER DATA using the REAL USER ID from DB member
  const user = {
    id: '6eff28a2-c7f0-4277-a61c-28cae4c51de5', // ← THE REAL USER ID
    email: 'testuser@example.com' // You can use any email for testing
  };
  
  const profile = {
    first_name: 'Test',
    last_name: 'User',
    role: 'buyer'
  };
  
  const userLoading = false;
  const profileLoading = false;
  
  // Rest of your code remains the same...
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    street: '123 Test Street',
    city: 'Nairobi',
    zipCode: '00100',
    phone: '+254712345678',
    county: 'Nairobi'
  });

  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa' | 'paypal'>('mpesa');
  
  const shipping = 4.99;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  // Pre-fill form with profile data (will use mock data now)
  useEffect(() => {
    if (profile) {
      setShippingInfo(prev => ({
        ...prev,
        firstName: profile.first_name || '',
        lastName: profile.last_name || ''
      }));
    }
  }, [profile]);

  // Redirect if cart is empty (keep this)
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/buyer-dashboard');
    }
  }, [cart, router]);

  // 🚫 REMOVE or COMMENT OUT the auth redirect
  // useEffect(() => {
  //   if (!userLoading && !user) {
  //     router.push('/auth?redirect=payment');
  //   }
  // }, [user, userLoading, router]);

  const handlePayment = async () => {
    // Remove the user check since we have mock user
    // if (!user) {
    //   router.push('/auth?redirect=payment');
    //   return;
    // }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Format phone number
      const formattedPhone = shippingInfo.phone.startsWith('+') 
        ? shippingInfo.phone 
        : `+254${shippingInfo.phone.replace(/\D/g, '')}`;

      // Generate order reference for PayHero
      const orderReference = `DECLUT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      // 1. Create order in database with REAL USER ID
      console.log('Creating order with buyer_id:', user.id); // Debug log
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id, // ← USING THE REAL USER ID: 6eff28a2-c7f0-4277-a61c-28cae4c51de5
          total: total,
          status: 'pending',
          order_id: orderReference // Add this if your orders table has order_id column
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error('Failed to create order: ' + orderError.message);
      }

      console.log('Order created:', order);

      // 2. Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
        throw new Error('Failed to save order items');
      }

      // 3. Save shipping address
      const { error: addressError } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id, // ← USING THE REAL USER ID
          county: shippingInfo.county || 'Nairobi',
          town: shippingInfo.city,
          street: shippingInfo.street,
          phone: formattedPhone
        });

      if (addressError) {
        console.error('Address error:', addressError);
        // Non-critical, continue with payment
      }

      // 4. Prepare payment data for PayHero
      const paymentData = {
        amount: total,
        currency: 'KES',
        email: user.email,
        phone_number: formattedPhone,
        transaction_reference: orderReference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment-callback`,
        metadata: {
          orderId: order.id,
          userId: user.id,
          orderReference
        }
      };

      // 5. Call your orders API to initiate PayHero payment
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Payment initiation failed');
      }

      if (result.paymentUrl) {
        // Clear cart before redirect
        clearCart();
        // Redirect to PayHero
        window.location.href = result.paymentUrl;
      } else {
        throw new Error('No payment URL received');
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  // Remove the loading checks since we're using mock data
  // if (userLoading || profileLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
  //         <p className="mt-4">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (cart.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-sm underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Shipping Information</h2>
              <ShippingForm 
                data={shippingInfo} 
                onChange={(data) => setShippingInfo({ ...data, county: data.county || '' })} 
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              <PaymentMethod 
                method={paymentMethod}
                onChange={setPaymentMethod}
                cardDetails={cardDetails}
                onCardChange={setCardDetails}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Order Summary */}
            <CartSummary 
              items={cart}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
            
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full bg-black text-white py-3 rounded-lg font-bold mt-4 ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Complete Purchase'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By completing this purchase, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}