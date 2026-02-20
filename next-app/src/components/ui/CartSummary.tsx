import React from 'react';
import { CartItem } from '@/lib/types';

interface CartSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function CartSummary({ items, subtotal, shipping, tax, total }: CartSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-bold text-lg mb-4">Order Summary</h3>
      
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.map((item, index) => (
          <div key={item.id || index} className="flex justify-between items-center border-b pb-3">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                {item.size && `Size: ${item.size} `}
                {item.color && `| Color: ${item.color} `}
                | Qty: {item.quantity || 1}
              </p>
            </div>
            <p className="font-bold">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Eco Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-4 border-t">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}