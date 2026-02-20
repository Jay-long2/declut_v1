"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface Product {
  id: string;
  title: string;
  price: number;
  status: string;
  created_at: string;
  product_images: { image_url: string }[];
}

export default function ListingsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_images ( image_url )
      `
      )
      .eq("seller_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Listings</h1>

      {products.map((product) => (
        <div key={product.id} className="mb-4 p-4 flex justify-between">
          <Card>
            <div>
              <h2 className="font-semibold">{product.title}</h2>
              <p>Status: {product.status}</p>
              <p>Price: ${product.price}</p>
              <p>
                Listed:{" "}
                {new Date(product.created_at).toLocaleDateString()}
              </p>

              {product.product_images?.[0] && (
                <img
                  src={product.product_images[0].image_url}
                  className="w-24 mt-2"
                />
              )}
            </div>

            <Button
              onClick={() => handleDelete(product.id)}
              className="bg-red-500"
            >
              Delete
            </Button>
          </Card>
        </div>
      ))}
    </div>
  );
}
