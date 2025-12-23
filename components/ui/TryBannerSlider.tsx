import React from "react";
import { View, Image, Dimensions,Text } from "react-native";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");

export default function TryBannerSlider () {
  const banners = [
    require("../../assets/banners/banner1.png"), // Mega Sale
    require("../../assets/banners/banner1.png"), // Kerala Spices
    require("../../assets/banners/banner1.png"), // Sakthi Masala
  ];

  return (
    <>
    <View className="h-80 bg-orange-300 justify-center">
       <Text className="text-white font-semibold text-3xl text-center">BannerSlider</Text>   
    </View>
     <View className="bg-red-500 items-center">
       
      </View>
    </>  
  );
}
