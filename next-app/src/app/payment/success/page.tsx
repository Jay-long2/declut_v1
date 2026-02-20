'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DbOrder } from '@/lib/types';

export default function SuccessPage() {
  const [orderDetails, setOrderDetails] = useState<DbOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderRef = searchParams.get('order');
  const transactionRef = searchParams.get('transaction');

  useEffect(() => {
    if (orderRef) {
      fetchOrderDetails(orderRef);
    } else {
      setLoading(false);
    }
  }, [orderRef]);

  const fetchOrderDetails = async (orderReference: string) => {
    try {
      const response = await fetch(`/api/orders/${orderReference}`);
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your eco-friendly purchase. You've offset <strong>12.4kg of CO2 emissions</strong>.
        </p>

        {orderDetails && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3">
            <div>
              <div className="text-sm text-gray-500">Order Reference</div>
              <div className="font-mono font-bold">{orderDetails.order_id}</div>
            </div>
            
            {transactionRef && (
              <div>
                <div className="text-sm text-gray-500">Transaction ID</div>
                <div className="font-mono text-sm break-all">{transactionRef}</div>
              </div>
            )}
            
            <div>
              <div className="text-sm text-gray-500">Total Paid</div>
              <div className="font-bold text-lg">${orderDetails.total?.toFixed(2)}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Payment Method</div>
              <div className="font-medium">{orderDetails.payment_method}</div>
            </div>
          </div>
        )}

        {/* Environmental Impact */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-bold mb-2">Your Environmental Impact</h3>
          <ul className="text-sm text-gray-600 text-left">
            <li className="flex items-center mb-1">
              <span className="mr-2">🌱</span>
              <span>12.4kg CO2 offset</span>
            </li>
            <li className="flex items-center mb-1">
              <span className="mr-2">💧</span>
              <span>3,000L water saved</span>
            </li>
            <li className="flex items-center mb-1">
              <span className="mr-2">🔄</span>
              <span>Item diverted from landfill</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">📦</span>
              <span>Plastic-free packaging</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition duration-300"
          >
            Continue Shopping
          </Link>
          
          <button
            onClick={() => window.print()}
            className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:border-black transition duration-300"
          >
            Print Receipt
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          A confirmation email and SMS have been sent to you.
        </p>
      </div>
    </div>
  );
}