import React from 'react';
import { ShippingInfo } from '@/lib/types';

interface ShippingFormProps {
  data: ShippingInfo;
  onChange: (data: ShippingInfo) => void;
}

export default function ShippingForm({ data, onChange }: ShippingFormProps) {
  const handleChange = (field: keyof ShippingInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address
        </label>
        <input
          type="text"
          value={data.street}
          onChange={(e) => handleChange('street', e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            County
          </label>
          <input
            type="text"
            value={data.county || ''}
            onChange={(e) => handleChange('county', e.target.value)}
            placeholder="e.g., Nakuru"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City/Town
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zip Code
          </label>
          <input
            type="text"
            value={data.zipCode}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (for M-Pesa)
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+254712345678"
            className="w-full p-2 border rounded"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Required for M-Pesa payments. Include country code.
          </p>
        </div>
      </div>
    </div>
  );
}