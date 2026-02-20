"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  seller_id: string;
  title: string;
  description: string;
  price: number;
  size: string;
  condition: string;
  status: string;
  listing_type: string;
}

export default function CreateListingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [listingType, setListingType] = useState<"sale" | "donation">("sale");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceFee, setServiceFee] = useState(0.25); // 25% service fee

  const categories = [
    "Tops & T-Shirts",
    "Bottoms",
    "Dresses",
    "Outerwear",
    "Shoes",
    "Accessories",
    "Vintage",
    "Sportswear"
  ];

  const sizes = [
    "XS", "S", "M", "L", "XL", "XXL",
    "26", "28", "30", "32", "34", "36",
    "One Size"
  ];

  const conditions = [
    "New with tags",
    "New without tags",
    "Like new",
    "Good",
    "Fair"
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check if adding these files would exceed the limit
    if (images.length + files.length > 5) {
      alert("You can only upload up to 5 images");
      return;
    }

    // Validate file types and size
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) alert(`${file.name} is not an image file`);
      if (!isValidSize) alert(`${file.name} is too large (max 5MB)`);
      
      return isValidType && isValidSize;
    });

    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setImages([...images, ...validFiles]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    // Clean up the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadImagesToStorage = async (productId: string) => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}_${i}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const calculateEarnings = () => {
    if (listingType === "donation") return 0;
    return price - (price * serviceFee);
  };

  const validateStep1 = () => {
    if (images.length === 0) {
      alert("Please upload at least one photo");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!title.trim()) {
      alert("Please enter a product title");
      return false;
    }
    if (!category) {
      alert("Please select a category");
      return false;
    }
    if (!size) {
      alert("Please select a size");
      return false;
    }
    if (!condition) {
      alert("Please select a condition");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in.");
        setLoading(false);
        setUploading(false);
        return;
      }

      // Insert product
      const { data: product, error } = await supabase
        .from("products")
        .insert([{
          seller_id: user.id,
          title,
          description,
          price: listingType === "donation" ? 0 : price,
          size,
          condition,
          category,
          lead_time: leadTime,
          listing_type: listingType,
          status: "available", // Change to "available" since we're completing the listing
        } as any])
        .select()
        .single();

      if (error) {
        console.error(error);
        alert("Error creating product");
        setLoading(false);
        setUploading(false);
        return;
      }

      // Upload images to storage and get URLs
      if (images.length > 0) {
        const imageUrls = await uploadImagesToStorage(product.id);
        
        // Insert image records
        const imageRows = imageUrls.map((url) => ({
          product_id: product.id,
          image_url: url,
        }));

        await supabase.from("product_images").insert(imageRows);
      }

      alert("Listing created successfully!");
      
      // Clean up preview URLs
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      
      router.push("/Seller-dashboard");
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Error creating listing. Please try again.");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setUploading(true);
    
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in.");
        setLoading(false);
        setUploading(false);
        return;
      }

      const { data: product, error } = await supabase
        .from("products")
        .insert([{
          seller_id: user.id,
          title: title || "Untitled Draft",
          description,
          price: listingType === "donation" ? 0 : price,
          size,
          condition,
          category,
          lead_time: leadTime,
          listing_type: listingType,
          status: "draft",
        } as any])
        .select()
        .single();

      if (error) throw error;

      if (images.length > 0) {
        const imageUrls = await uploadImagesToStorage(product.id);
        const imageRows = imageUrls.map((url) => ({
          product_id: product.id,
          image_url: url,
        }));
        await supabase.from("product_images").insert(imageRows);
      }

      alert("Draft saved!");
      
      // Clean up preview URLs
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      
      router.push("/Seller-dashboard");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Error saving draft. Please try again.");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">List an Item</h1>
          <p className="text-gray-600 mt-2">
            Share your pre-loved clothing and contribute to a circular economy.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= step 
                  ? "bg-black text-white" 
                  : "bg-gray-200 text-gray-600"
              }`}>
                {step}
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                currentStep > step ? "bg-black" : "bg-gray-200"
              }`} />
            </div>
          ))}
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep === 3 ? "bg-black text-white" : "bg-gray-200 text-gray-600"
          }`}>
            3
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          className="hidden"
        />

        {/* Step 1: Upload Photos */}
        {currentStep === 1 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Step 1: Upload Photos</h2>
            
            <div className="mb-4 text-sm text-gray-600">
              {images.length}/5 Uploaded
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={preview} 
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveImage(index)}
                    disabled={uploading}
                  >
                    ×
                  </Button>
                </div>
              ))}

              {images.length < 5 && (
                <div 
                  onClick={triggerFileInput}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors"
                >
                  <span className="text-3xl text-gray-400">+</span>
                  <span className="text-sm text-gray-500 mt-2">
                    {images.length === 0 ? "Upload Photo" : "Add More Photos"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Max 5MB per image
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleNextStep} disabled={uploading}>
                Continue to Details
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Item Details */}
        {currentStep === 2 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Step 2: Item Details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Product Title</label>
                <Input
                  placeholder="e.g. vintage 90s Cotton Oversized T-Shirt"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Describe your item..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                >
                  <option value="">Select size</option>
                  {sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                >
                  <option value="">Select condition</option>
                  {conditions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lead Time</label>
                <Input
                  placeholder="e.g. Ships in 2-3 business days"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Lead time agreed via email</p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handlePreviousStep}>
                Back
              </Button>
              <Button onClick={handleNextStep}>
                Continue to Pricing
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Listing Type & Pricing */}
        {currentStep === 3 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Step 3: Listing Type & Pricing</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">List For</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="listingType"
                      value="sale"
                      checked={listingType === "sale"}
                      onChange={(e) => setListingType(e.target.value as "sale")}
                      className="mr-2"
                    />
                    Sale
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="listingType"
                      value="donation"
                      checked={listingType === "donation"}
                      onChange={(e) => setListingType(e.target.value as "donation")}
                      className="mr-2"
                    />
                    Donation
                  </label>
                </div>
              </div>

              {listingType === "sale" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Set Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">KSH</span>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="pl-16"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Service Fee (25%)</span>
                      <span>KSH {(price * serviceFee).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Your Earnings</span>
                      <span>KSH {calculateEarnings().toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}

              {listingType === "donation" && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800">
                    Thank you for choosing to donate! Your item will be listed for free.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handlePreviousStep}>
                Back
              </Button>
              <div className="space-x-3">
                <Button variant="outline" onClick={handleSaveDraft} disabled={loading || uploading}>
                  {uploading ? "Uploading..." : "Save as Draft"}
                </Button>
                <Button onClick={handleSubmit} disabled={loading || uploading}>
                  {loading || uploading ? "Creating..." : "Complete Listing"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Back to Dashboard Link */}
        <div className="mt-6 text-center">
          <Link href="/Seller-dashboard" className="text-gray-600 hover:text-black transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 text-center text-gray-500 text-sm">
        © 2024 DeClut | All Rights Reserved
      </footer>
    </div>
  );
}