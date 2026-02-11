import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

type Product = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  mrp: number;
};

type Category = {
  id: string;
  title: string;
  slug: string;
  image_url?: string;
};

export function useHomeSearch(search: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length < 2) {
      setProducts([]);
      setCategories([]);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      searchData();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const searchData = async () => {
    const { data: productData } = await supabase
      .from("products")
      .select("id,name,image_url,price,mrp")
      .ilike("name", `%${search}%`)
      .limit(6);

    const { data: categoryData } = await supabase
      .from("category_items")
      .select("id,title,slug,image_url")
      .ilike("title", `%${search}%`)
      .limit(4);

    setProducts(productData ?? []);
    setCategories(categoryData ?? []);
    setLoading(false);
  };

  return {
    products,
    categories,
    loading,
    isSearching: search.length >= 2,
  };
}
