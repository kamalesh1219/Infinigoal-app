import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import Animated, { useSharedValue } from "react-native-reanimated";
import { supabase } from "@/src/lib/supabase";
import { openProduct } from "@/src/utils/navigation";

const { width } = Dimensions.get("window");

type HotDeal = {
  id: string;
  name: string;
  price_text: string;
  image_url: string;
};

export default function TrySliderProduct() {
  const progress = useSharedValue(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const [items, setItems] = useState<HotDeal[]>([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // LOAD HOT DEALS (SAME LOGIC)
  // ================================
  async function loadHotDeals() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("tag", "hot-deals");

    if (error) {
      console.log("Supabase HotDeals Error:", error);
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadHotDeals();
  }, []);

  // ================================
  // LOADER
  // ================================
  if (loading) {
    return (
      <View className="mt-10 items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-gray-600">Loading Hot Deals...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="mt-10 items-center">
        <Text className="text-gray-500">No Hot Deals Available</Text>
      </View>
    );
  }

  // ================================
  // UI (DESIGN CHANGED)
  // ================================
  return (
    <View className="mt-8">
      {/* Title */}
      <View className="px-4 mb-4 flex-row justify-between items-center">
        <Text className="text-xl font-bold">Hot Deals 🔥</Text>

        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => carouselRef.current?.prev()}
            className="bg-gray-100 w-9 h-9 rounded-full items-center justify-center"
          >
            <Text className="text-xl font-bold">‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => carouselRef.current?.next()}
            className="bg-gray-100 w-9 h-9 rounded-full items-center justify-center"
          >
            <Text className="text-xl font-bold">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Carousel */}
      <Carousel
        ref={carouselRef}
        data={items}
        width={width * 0.95}
        height={350}
        loop
        autoPlay
        autoPlayInterval={3500}
        pagingEnabled
        onProgressChange={(_, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openProduct(item.id)}
            activeOpacity={0.9}
            className="bg-[#F9FAFB] rounded-3xl mx-3 p-4"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 4,
            }}
          >
            {/* Image */}
            <Image
              source={{ uri: item.image_url }}
              className="w-full h-48 mb-4"
              resizeMode="contain"
            />

            {/* Name */}
            <Text
              className="text-base font-semibold text-center mb-1"
              numberOfLines={2}
            >
              {item.name}
            </Text>

            {/* Price */}
            <View className="items-center mt-2">
              <View className="bg-green-600 px-6 py-2 rounded-2xl">
                 <Text className="text-white font-bold text-lg">
                  {item.price_text}
                 </Text>
                 
              </View>

              <Text className="text-xs text-gray-500 mt-2">
                Limited time hot deal
              </Text>
            </View>

            {/* CTA */}
            <View className="mt-4 bg-pink-500 rounded-full py-3">
              <Text className="text-white text-center font-bold">
                View Product
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Pagination */}
      <Pagination.Basic
        progress={progress}
        data={items}
        dotStyle={{
          backgroundColor: "rgba(0,0,0,0.2)",
          width: 7,
          height: 7,
          borderRadius: 50,
        }}
        activeDotStyle={{
          backgroundColor: "#000",
          width: 9,
          height: 9,
          borderRadius: 50,
        }}
        containerStyle={{
          gap: 6,
          alignSelf: "center",
          marginTop: 10,
        }}
      />
    </View>
  );
}
