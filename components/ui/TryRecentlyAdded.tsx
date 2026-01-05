import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { supabase } from "@/src/lib/supabase"; // make sure supabase client exists
import { openProduct } from "@/src/utils/navigation";
import { Heart, Plus } from "lucide-react-native";
import { useCart } from "@/providers/CartProvider";

type Product = {
  id: string;
  name: string;
  price_text: string;
  image_url: string;
  mrp: number;
  price:number;
};

export default function TryRecentlyAdded() {
  const screenWidth = Dimensions.get("window").width;
  const SLIDE_WIDTH = screenWidth * 0.9; 

   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);
   const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

   const { addToCart: addItemToCart } = useCart();

   useEffect(() => {
     fetchProducts();
   }, []);
 
   async function fetchProducts() {
     const { data, error } = await supabase
       .from("products")
       .select("id,name,image_url,price,mrp,price_text")
       .eq("tag", "recently-added")
       .order("created_at", { ascending: false });
 
     if (!error && data) setProducts(data);
     setLoading(false);
   }

  const handleAddToCart = (item: Product) => {
    addItemToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      mrp: item.mrp,
    });

     setQtyMap((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };
   
  const handleMinus = (item: Product) => {
    setQtyMap((prev) => {
      const current = prev[item.id] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      }
      return { ...prev, [item.id]: current - 1 };
    });
  };


  // ==========================================
  // LOADER
  // ==========================================
  if (loading) {
    return (
      <View className="mt-14 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-3 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="mt-10">
      
        <Text className="text-xl font-semibold mb-5 mx-4">
          Your Recently Added
        </Text>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item }: { item: Product }) => {
          const discount = item.mrp - item.price;

          return (
            <TouchableOpacity
              onPress={() => openProduct(item.id)}
              className="bg-slate-100 rounded-2xl p-2 mr-4 w-56"
            >
              {/* IMAGE */}
              <View className="relative">
                <Image
                  source={{ uri: item.image_url }}
                  className="w-full h-40 rounded-xl mt-2"
                  resizeMode="contain"
                />

                {/* Heart */}
                <View className="absolute top-2 right-2 bg-white p-1 rounded-full">
                  <Heart size={20} color="#ec4899" />
                </View>

                {/* Plus Button */}
                <View className="absolute bottom-2 right-2">
                    {!qtyMap[item.id] ? (
                      /* ADD BUTTON */
                      <TouchableOpacity
                        onPress={() => handleAddToCart(item)}
                        className="border-2 border-pink-500 bg-white rounded-xl px-3 py-2"
                      >
                        <Plus size={20} color="#ec4899" />
                      </TouchableOpacity>
                    ) : (
                      /* COUNTER */
                      <View className="flex-row items-center border-2 border-pink-500 bg-white rounded-xl px-2 py-1">
                        <TouchableOpacity onPress={() => handleMinus(item)}>
                          <Text className="text-pink-600 text-xl font-bold px-2">−</Text>
                        </TouchableOpacity>

                        <Text className="font-bold px-2">
                          {qtyMap[item.id]}
                        </Text>

                        <TouchableOpacity onPress={() => handleAddToCart(item)}>
                          <Text className="text-pink-600 text-xl font-bold px-2">+</Text>
                        </TouchableOpacity>
                    </View>
                    )}
                 </View>
              </View>

              {/* PRICE */}
              <View className="flex-row items-center mt-4 space-x-2">
                <View className="bg-green-600 px-3 py-2 rounded-lg">
                  <Text className="text-white font-bold text-lg">
                    ₹{item.price}
                  </Text>
                </View>

                <Text className="text-gray-400 line-through text-base ml-2">
                  ₹{item.mrp}
                </Text>
              </View>

              <Text className="text-green-700 text-base mt-4">
                ₹{discount} OFF
              </Text>

              {/* NAME */}
              <Text className="font-semibold text-lg mt-1" numberOfLines={2}>
                {item.name}
              </Text>

              {/* PACK INFO */}
              <Text className="text-sm text-gray-500 mt-1">
                {item.price_text}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
