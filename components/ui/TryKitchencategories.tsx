import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { supabase } from "@/src/lib/supabase";
import { openCategory } from "@/src/utils/navigation";

type CategoryItem = {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  card_type: "big" | "small";
};

export default function TryKitchencategories() {
  const screenWidth = Dimensions.get("window").width;

  const [bigCards, setBigCards] = useState<CategoryItem[]>([]);
  const [smallCards, setSmallCards] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch from Supabase
  const loadKitchenCategories = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("category_items")
      .select("id,title,slug,image_url,card_type,display_order")
      .eq("category_group_name", "Kitchen & Cooking")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setBigCards(data.filter((item) => item.card_type === "big"));
      setSmallCards(data.filter((item) => item.card_type === "small"));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadKitchenCategories();
  }, []);

  if (loading) {
    return (
      <View className="mt-10 items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="px-4 mt-4">
      {/* Heading */}
      <Text className="text-2xl italic font-bold text-gray-800 mb-7 text-center">
        Kitchen & Cooking
      </Text>

      {/* BIG CARDS */}
      <View className="flex-row justify-around">
        {bigCards.map((item) => (
          <TouchableOpacity
            onPress={() => openCategory(item.slug)}
            key={item.id}
            className="bg-[#FEFFEC] w-[48%] rounded-2xl shadow-lg shadow-black items-center"
          >
            <Image
              source={{ uri: item.image_url }}
              className="w-full h-56 mb-2"
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* SMALL CARDS */}
      <View className="flex-row justify-around mt-2">
        {smallCards.map((item) => (
          <TouchableOpacity
            onPress={() => openCategory(item.slug)}
            key={item.id}
            className="w-[23%] bg-[#FEFFEC] rounded-2xl p-3 shadow-md shadow-black/70 items-center"
          >
            <Image
              source={{ uri: item.image_url }}
              style={{
                width: "100%",
                height: screenWidth * 0.30,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
