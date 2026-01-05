import React from "react";
import { View, Image, Dimensions,Text } from "react-native";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");

export default function TryBannerSlider() {
  const banners = [
    require("../../assets/banners/banner1.png"), // Mega Sale
    require("../../assets/banners/banner2.png"), // Kerala Spices
    require("../../assets/banners/banner3.png"), // Sakthi Masala
  ];

  return (
    <>
    <View className="h-80">
      <Swiper
        autoplay
        autoplayTimeout={3}
        showsPagination={true}
        dotColor="#ccc"
        activeDotColor="#FF7B00"
        loop={true}
      >
        {banners.map((img, index) => (
          <Image
            key={index}
            source={img}
            style={{
              width: width,
              height: 300,
              resizeMode: "contain",
              borderRadius: 12,
            }}
          />
        ))}
      </Swiper>    
    </View>
     
    </>  
  );
}
