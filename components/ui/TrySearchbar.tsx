import { useCart } from "@/providers/CartProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ShoppingCart } from "lucide-react-native";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
};

export default function TrySearchbar({ value, onChange }: Props) {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <View className="px-4 my-3 flex-row items-center">
       <View className="flex-row items-center bg-white rounded-full px-4 py-2 flex-1"> 
        <Ionicons name="search" size={20} color="#6B7280" /> 
        <TextInput
         placeholder="What’s on your list?" 
         value={value} 
         onChangeText={onChange}
         className="ml-2 flex-1 text-gray-700" /> 
        </View> 

        <TouchableOpacity
         onPress={() => router.push("/cart")}
         className="ml-3 bg-gray-100 p-4 rounded-full" >
           <ShoppingCart size={24} color="#16A34A"  /> 
           {cartCount > 0 && (
             <View className="absolute -top-1 -right-1 bg-pink-600 w-6 h-6 rounded-full items-center justify-center">
               <Text className="text-white text-xs font-bold"> 
                {cartCount} </Text>
                 </View> )}
        </TouchableOpacity> 
              </View>
  );
}
