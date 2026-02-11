import { supabase } from "@/src/lib/supabase";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, View } from "react-native";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");

export default function TryBannerSlider() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    setLoading(true);

    const { data, error } = await supabase
      .from("home_banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
     console.log("Banner data:", data);
  
    if (error) {
      console.log("Banner error:", error);
      setLoading(false);
      return;
    }

    setBanners(data ?? []);
    setLoading(false);
  }

  if (loading) {
    return (
      <View className="h-64 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <View className="h-72 mb-2">
      <Swiper
        autoplay
        autoplayTimeout={3}
        showsPagination={true}
        dotColor="#ccc"
        activeDotColor="#FF7B00"
        loop
        paginationStyle={{
           bottom: 10, // move dots lower
         }}
      >
        {banners.map((banner) => {
          const imageUrl = supabase.storage
            .from("banners")
            .getPublicUrl(banner.image_path).data.publicUrl;

          return (
            <Image
              key={banner.id}
              source={{ uri: imageUrl }}
              style={{
                width: width,
                height: 265,
                resizeMode: "contain",
                borderRadius: 12,
              }}
            />
          );
        })}
      </Swiper>
    </View>
  );
}
