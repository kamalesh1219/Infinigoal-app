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
  bg_color: string; 
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
      .select("id,title,slug,image_url,bg_color")
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
     <View className="mb-8 bg-[#FBEBDD] rounded-3xl p-5">

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
            className="w-36 my-5"
            activeOpacity={0.8}
          >
          {/* Outer Blue Border */}
          <View className="border-[3px] border-blue-500 rounded-[30px] p-1 bg-white">

            {/* iPhone Body */}
            <View
             style={{ backgroundColor: item.bg_color || "#F6D9B8" }}
             className={`w-32 h-40 rounded-[22px] overflow-hidden `}
            >

               {/* Featured Badge */}
              <View className="bg-white px-3 py-0.5 rounded-full absolute top-1 left-1/2 -translate-x-1/2">
                <Text className="text-red-500 text-xs font-semibold">
                  Featured
                </Text>
              </View>

            {/* 🏷 TITLE */}
            <Text
              className="text-[#1F2937] text-base font-semibold text-center mt-8  px-1"
              numberOfLines={2}
            >
              {item.title}
            </Text>

              {/* Content */}
              <View className="overflow-hidden items-center justify-end">    
               <Image
                  source={{ uri: item.image_url }}
                  className="w-32 h-40 -mb-6"
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