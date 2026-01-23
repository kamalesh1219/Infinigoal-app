import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";

type OfferCategory = {
  id: string;
  title: string;
  slug: string;
  image_url: string;
};

export default function Offercategories() {
  const [categories, setCategories] = useState<OfferCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOfferCategories();
  }, []);

   const loadOfferCategories = async () => {
    const { data, error } = await supabase
      .from("offer_categories")
      .select("id,title,slug,image_url")
      .order("display_order", { ascending: true });   

    if (error) {
      console.log("ERROR:", error);
    } else {
      setCategories(data ?? []);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View className="py-10 items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
     <View className="mb-4 bg-[#E6FFD8] rounded-3xl p-5">

      {/* HEADER */}
      <Text className="text-2xl font-bold text-gray-800">
        Essential Kitchen Categories
      </Text>
      <Text className="text-gray-500 text-base mt-1 mb-6">
        Daily cooking essentials for your home
      </Text>

      {/* HORIZONTAL SCROLL */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14 }}
      >
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/categorie/${item.slug}`)}
            className="w-32 items-center my-5"
            activeOpacity={0.8}
          >
            {/* ICON CARD */}
            <View className="bg-[#CFF5B8] rounded-2xl w-32 h-32 items-center justify-center shadow-sm">
              <Image
                source={{ uri: item.image_url }}
                className="w-28 h-28"
                resizeMode="contain"
              />
            </View>

            {/* TITLE */}
            <Text
              className="text-center text-xs font-semibold text-gray-800 mt-3"
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
    
  );
}
