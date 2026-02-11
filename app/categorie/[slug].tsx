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
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type Product = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  mrp: number;
  price_text?: string;
  subcategory_slug: string;
};

export default function CategoryPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    if (slug) loadProducts();
  }, [slug]);

  const loadProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("id,name,image_url,price,mrp,price_text,subcategory_slug")
      .eq("subcategory_slug", slug)   // ✅ FIX HERE
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView >

          {/* HEADER */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
               <View className="flex-row items-center gap-3">
                {/* BACK BUTTON */}
                <TouchableOpacity onPress={() => router.back()} className="rounded-full bg-gray-100 py-2 px-2">
                  <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                {/* TITLE */}
                <Text
                  className="text-xl font-semibold text-gray-900"
                  numberOfLines={1}
                >
                   Category: {slug?.toUpperCase()}
                </Text>   
               
              </View> 

                  {/* CART ICON */}
                    <TouchableOpacity
                      onPress={() => router.push("/cart")}
                      className="relative mr-2 "
                    >
                      <Ionicons name="cart-outline" size={26} color="#16A34A" />

                      {cartCount > 0 && (
                        <View className="absolute -top-2 -right-2 bg-pink-500 w-5 h-5 rounded-full items-center justify-center">
                          <Text className="text-white text-xs font-bold">
                            {cartCount}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
            </View>   

        {/* LOADING */}
        {loading && (
          <View className="mt-10">
            <ActivityIndicator size="large" />
          </View>
        )}

        {/* EMPTY */}
        {!loading && products.length === 0 && (
          <Text className="text-center text-gray-500 mt-20">
            No products found in this category
          </Text>
        )}

        {/* PRODUCTS */}
        <View className="flex-row flex-wrap justify-between mt-4 mx-2">
          {products.map((item) => (
            <View
              key={item.id}
              className="w-[48%] bg-white rounded-xl p-3 mb-5 border border-gray-100"
            >
              <Image
                source={{ uri: item.image_url }}
                className="w-full h-44 rounded-lg"
                resizeMode="contain"
              />

              <Text className="mt-4 font-semibold text-gray-800" numberOfLines={2}>
                {item.name}
              </Text>

              <View className="flex-row items-center mt-1">
                <Text className="text-green-700 font-bold mr-2">
                  ₹{item.price}
                </Text>
                <Text className="text-gray-400 line-through text-xs">
                  ₹{item.mrp}
                </Text>
              </View>
 
              

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
