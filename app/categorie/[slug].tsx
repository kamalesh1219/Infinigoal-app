import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/src/lib/supabase";
import { useCart } from "@/providers/CartProvider";

type Product = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  mrp: number;
  price_text?: string;
  category_slug: string;
};

export default function CategoryPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) loadProducts();
  }, [slug]);

  const loadProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("id,name,image_url,price,mrp,price_text,category_slug")
      .eq("category_slug", slug)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* HEADER */}
        <Text className="text-3xl font-bold text-gray-900">
          Category: {slug?.toUpperCase()}
        </Text>

        <Text className="text-gray-500 mt-1">
          Home / {slug}
        </Text>

        {/* FILTER / SORT */}
        <View className="flex-row justify-between mt-5 mb-4">
          <TouchableOpacity className="border px-4 py-2 rounded-xl">
            <Text className="font-semibold">Filter</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border px-4 py-2 rounded-xl">
            <Text className="font-semibold">Default sorting</Text>
          </TouchableOpacity>
        </View>

        {/* LOADING */}
        {loading && (
          <View className="mt-10">
            <ActivityIndicator size="large" />
          </View>
        )}

        {/* EMPTY STATE */}
        {!loading && products.length === 0 && (
          <Text className="text-center text-gray-500 mt-20">
            No products found in this category
          </Text>
        )}

        {/* PRODUCT GRID */}
        <View className="flex-row flex-wrap justify-between mt-2">
          {products.map((item) => (
            <View
              key={item.id}
              className="w-[48%] bg-white rounded-xl p-3 mb-5 shadow-sm border border-gray-100"
            >
              <Image
                source={{ uri: item.image_url }}
                className="w-full h-40 rounded-lg"
                resizeMode="contain"
              />

              <Text className="mt-2 font-semibold text-gray-800" numberOfLines={2}>
                {item.name}
              </Text>

              {/* PRICE */}
              <View className="flex-row items-center mt-1">
                <Text className="text-green-700 font-bold mr-2">
                  ₹{item.price}
                </Text>
                <Text className="text-gray-400 line-through text-xs">
                  ₹{item.mrp}
                </Text>
              </View>

              {item.price_text && (
                <Text className="text-xs text-gray-500 mt-1">
                  {item.price_text}
                </Text>
              )}

              {/* ADD TO CART */}
              <TouchableOpacity
                onPress={() =>
                  addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image_url: item.image_url,
                    mrp: item.mrp,
                  })
                }
                className="bg-pink-600 mt-3 py-2 rounded-full"
              >
                <Text className="text-center text-white font-bold">
                  ADD
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
