import React from "react";
import { View, TextInput, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View className="bg-[#fef9e2]">

      {/* Top Row */}
      <View className="flex-row justify-between items-center px-4 py-2">
        
        {/* Menu Icon */}
        <TouchableOpacity>
          <Ionicons name="menu" size={34} color="#1F2937" />
        </TouchableOpacity>

        {/* Logo */}
        <Image
          source={require("../assets/images/InfiniGoal.png")}
          className="w-32 h-20 object-contain"
          resizeMode="contain"
        />

        {/* Heart Icon */}
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={34} color="#1F2937" />
        </TouchableOpacity>

      </View>
    </View>
  );
}
