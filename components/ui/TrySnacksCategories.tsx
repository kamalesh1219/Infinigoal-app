import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity,Dimensions, ActivityIndicator } from "react-native";
import { openCategory } from "@/src/utils/navigation";
import { supabase } from "@/src/lib/supabase"; 

type CategoryItem = {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  card_type: "big" | "row1" | "row2";
  display_order: number;
};

export default function TrySnacksCategories() {

  const screenWidth = Dimensions.get("window").width;

   const [bigCard, setBigCard] = useState<CategoryItem | null>(null);
   const [row1, setRow1] = useState<CategoryItem[]>([]);
   const [row2, setRow2] = useState<CategoryItem[]>([]);
   const [loading, setLoading] = useState(true);

    const loadSnacks = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("category_items")
      .select("id,title,slug,image_url,card_type,display_order")
      .eq("category_group_name", "Snacks & Drinks")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setBigCard(data.find((x) => x.card_type === "big") || null);
      setRow1(data.filter((x) => x.card_type === "row1"));
      setRow2(data.filter((x) => x.card_type === "row2"));
    }

    setLoading(false);
  };
  
   useEffect(() => {
    loadSnacks();
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
      <Text className="text-xl italic font-semibold text-center mb-10">
        Snacks & Drinks
      </Text>

      {/* ROW 1 — Big Card + 4 Small Cards */}
      <View className="flex-row justify-between">

        {/* BIG CARD */}
         {bigCard && (
        <TouchableOpacity 
         onPress={() => openCategory(bigCard.slug)}
         className="bg-[#FEFFEC] w-[48%] rounded-2xl p-4 shadow-lg shadow-black items-center">
          <Image
            source={{uri: bigCard.image_url}}
            className="w-full h-72"
            resizeMode="contain"
          />
        </TouchableOpacity>
         )}

        {/* RIGHT SIDE SMALL CARDS */}
        <View className="w-[48%]">
          {/* FIRST ROW – 2 CARDS */}
          <View className="flex-row justify-between mb-3">
            {row1.slice(0, 2).map((item) => (
              <TouchableOpacity
                onPress={() => openCategory(item.slug)}
                key={item.id}
                className="bg-[#FEFFEC] w-[48%] rounded-xl p-2 shadow-lg shadow-black items-center"
              >
                <Image
                  source={{ uri: item.image_url }}
                   style={{
                      width: screenWidth * 0.20,   // 20% of screen width
                      height: screenWidth * 0.34,  // 36% of screen width
                    }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* SECOND ROW – 2 CARDS */}
          <View className="flex-row justify-between">
            {row1.slice(2, 4).map((item) => (
              <TouchableOpacity
                onPress={() => openCategory(item.slug)}
                key={item.id}
                className="bg-[#FEFFEC] w-[48%] rounded-xl p-2 shadow-lg shadow-black items-center"
              >
                <Image
                  source={{ uri: item.image_url }}
                  style={{
                      width: screenWidth * 0.20,   // 20% of screen width
                      height: screenWidth * 0.34,  // 36% of screen width
                    }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* ROW 2 — 4 SMALL CARDS */}
      <View className="flex-row justify-between mt-4">
        {row2.map((item)  => (
          <TouchableOpacity
            onPress={() => openCategory(item.slug)}
            key={item.id}
            className="bg-[#FEFFEC] w-[23%] rounded-xl p-3 shadow-lg shadow-black items-center"
          >
            <Image
              source={{ uri: item.image_url }}
               style={{
                    width: "100%",
                    height: screenWidth * 0.30,  // 25% of screen width
                  }}
              resizeMode="contain"
            />

          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}
