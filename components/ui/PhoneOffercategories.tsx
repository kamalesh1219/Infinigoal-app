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

export default function PhoneOffercategories() {
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
     <View className="mb-8 mt-2 bg-[#FBEBDD] rounded-3xl p-5">

      {/* HEADER */}
      <Text className="text-2xl font-bold text-gray-900">
        Get minimum 30% OFF
      </Text>
      <Text className="text-gray-500 text-base mt-1 mb-6">
        Stock up on organic and healthy picks
      </Text>

      {/* HORIZONTAL SCROLL */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
      >
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/categorie/${item.slug}`)}
            className="w-36 items-center my-5"
            activeOpacity={0.8}
          >
          {/* Outer Blue Border */}
          <View className="border-4 border-blue-500 rounded-[32px] p-1 bg-white">
            {/* iPhone Body */}
            <View className={`bg-[#F6D9B8] w-32 h-40 rounded-[28px] overflow-hidden`}>
               {/* Featured Badge */}
              <View className="bg-white px-3 py-1 rounded-t-sm rounded-xl self-center">
                <Text className="text-red-500 text-xs font-semibold">
                  Featured
                </Text>
              </View>

              {/* Content */}
              <View className="flex-1 items-center justify-center px-2">    

                <Image
                  source={{ uri: item.image_url }}
                  className="w-28 h-28"
                  resizeMode="contain"
                />
             </View>
            </View>
           </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
    
  );
}
