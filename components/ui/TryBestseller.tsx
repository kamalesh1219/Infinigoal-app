import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { openProduct } from "@/src/utils/navigation";
import { supabase } from "@/src/lib/supabase";
import { Heart } from "lucide-react-native";
import { router } from "expo-router";
import { useCart } from "@/providers/CartProvider"; 



// Supabase Product Type
type Product = {
  id: string;
  name: string;
  price_text: string;
  image_url: string;
  price: number;
  mrp: number;
};

export default function TryBestseller() {
  const screenWidth = Dimensions.get("window").width;
  const SLIDE_WIDTH = screenWidth * 0.9;
  const CARD_WIDTH = SLIDE_WIDTH * 0.45;

  const flatListRef = useRef<FlatList>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart: addItemToCart } = useCart();

  // Fetch from Supabase
  async function loadBestProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("tag", "best-products")

    if (!error && data) setProducts(data as Product[]);
    setLoading(false);
  }

  useEffect(() => {
    loadBestProducts();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center mt-10">
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  // GROUP INTO PAIRS
  const slides: Product[][] = [];
  for (let i = 0; i < products.length; i += 2) {
    slides.push(products.slice(i, i + 2));
  }

   // ✅ SAVE IT HERE (inside component)
  const handleAddToCart = (prod: Product) => {
    addItemToCart({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image_url: prod.image_url,
      mrp: prod.mrp,
    });

    router.push("/cart");
  };

  return (
    <View className="mt-14">
     <View className="bg-[#def3e2] rounded-3xl p-4 ">

        {/* HEADER (like screenshot) */}
        <View className="mb-8 mt-2">
            <Text className="text-3xl font-bold text-green-800 mb-1">
                Big pack,
            </Text>
            <Text className="text-2xl font-bold text-green-800">
                BestSeller products
            </Text>
            <Text className="text-sm text-green-700 mt-1">
                Stock more, spend less
            </Text>
        </View>


        {/* PRODUCT SLIDER */}
        <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
            <View
            style={{ width: SLIDE_WIDTH }}
            className="flex-row justify-around px-1"
            >
            {item.map((prod: Product) => {
                const discount = prod.mrp - prod.price;

                return (
                <TouchableOpacity
                    key={prod.id}
                    onPress={() => openProduct(prod.id)}
                    style={{ width: CARD_WIDTH }}
                    className="bg-[#def3e2] rounded-2xl p-3 mx-1 mb-4"
                >
                  <View className="bg-white px-2 py-5 rounded-2xl relative">
                    {/* IMAGE */}
                    <Image
                    source={{ uri: prod.image_url }}
                    className="w-full h-40"
                    resizeMode="contain"
                    />

                    {/* Heart */}
                    <View className="absolute top-2 right-2 bg-white p-1 rounded-full">
                    <Heart size={20} color="#ec4899" />
                    </View>

                    {/* ADD BUTTON */}
                    <TouchableOpacity
                     onPress={() => handleAddToCart(prod)}
                     className="absolute bottom-4 right-2 border border-pink-500 rounded-lg py-2 px-5 mt-2 bg-white">
                    <Text className="text-pink-600 font-bold text-center">
                        ADD
                    </Text>
                    </TouchableOpacity>
                  </View>  
                  
                    {/* PRICE */}
                    <View className="flex-row items-center mt-3 space-x-2">
                    <View className="bg-green-600 px-3 py-1 rounded-md">
                        <Text className="text-white font-extrabold">
                        ₹{prod.price}
                        </Text>
                    </View>

                    <Text className="text-gray-400 line-through ml-2">
                        ₹{prod.mrp}
                    </Text>
                    </View>

                    <Text className="text-green-700 text-sm mt-2">
                    ₹{discount} OFF
                    </Text>

                    {/* NAME */}
                    <Text
                    className="font-semibold text-base mt-1"
                    numberOfLines={2}
                    >
                    {prod.name}
                    </Text>

                    {/* PACK INFO */}
                    <Text className="text-xs text-gray-500 mt-0.5">
                    {prod.price_text}
                    </Text>
                </TouchableOpacity>
                );
            })}

            {/* filler for odd count */}
            {item.length === 1 && <View style={{ width: CARD_WIDTH }} />}
            </View>
        )}
        />
    </View>
    </View>

  );
}
