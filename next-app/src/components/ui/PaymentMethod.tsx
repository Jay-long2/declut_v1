import React from 'react';
import { CardDetails } from '@/lib/types';

interface PaymentMethodProps {
  method: 'card' | 'mpesa' | 'paypal';
  onChange: (method: 'card' | 'mpesa' | 'paypal') => void;
  cardDetails: CardDetails;
  onCardChange: (details: CardDetails) => void;
}

export default function PaymentMethod({ 
  method, 
  onChange, 
  cardDetails, 
  onCardChange 
}: PaymentMethodProps) {
  
  const handleCardChange = (field: keyof CardDetails, value: string) => {
    onCardChange({ ...cardDetails, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="flex space-x-4">
        <button
          onClick={() => onChange('card')}
          className={`px-6 py-3 border rounded-lg font-medium ${
            method === 'card' ? 'border-black bg-black text-white' : 'border-gray-300'
          }`}
        >
          Card
        </button>
        <button
          onClick={() => onChange('mpesa')}
          className={`px-6 py-3 border rounded-lg font-medium ${
            method === 'mpesa' ? 'border-black bg-black text-white' : 'border-gray-300'
          }`}
        >
          M-Pesa
        </button>
        <button
          onClick={() => onChange('paypal')}
          className={`px-6 py-3 border rounded-lg font-medium ${
            method === 'paypal' ? 'border-black bg-black text-white' : 'border-gray-300'
          }`}
        >
          PayPal
        </button>
      </div>

      {/* Card Details Form */}
      {method === 'card' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => handleCardChange('number', e.target.value)}
              placeholder="0000 0000 0000 0000"
              className="w-full p-3 border rounded-lg font-mono"
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => handleCardChange('expiry', e.target.value)}
                placeholder="MM/YY"
                className="w-full p-3 border rounded-lg"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                value={cardDetails.cvv}
                onChange={(e) => handleCardChange('cvv', e.target.value)}
                placeholder="123"
                className="w-full p-3 border rounded-lg"
                maxLength={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* M-Pesa Instructions */}
      {method === 'mpesa' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="font-medium text-green-800 mb-2">M-Pesa Payment</p>
          <p className="text-sm text-gray-600 mb-3">
            You will receive an STK push prompt on your phone to complete payment.
          </p>
          <div className="bg-white p-3 rounded border text-sm">
            <p className="font-medium">Phone number for payment:</p>
            <p className="text-gray-600">The number you entered in shipping form will be used</p>
          </div>
        </div>
      )}

      {/* PayPal Message */}
      {method === 'paypal' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm">
            You will be redirected to PayPal to complete your payment securely.
          </p>
        </div>
      )}
    </div>
  );
}