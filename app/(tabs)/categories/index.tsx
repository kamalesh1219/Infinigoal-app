import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import TrySearchbar from "@/components/ui/TrySearchbar";
import Searchbar from "@/components/Searchbar";
import Offercategories from "@/components/ui/Offercategories";
import TryKitchencategories from "@/components/ui/TryKitchencategories";
import HomeCategories from "@/components/HomeCategories";
import TrySnacksCategories from "@/components/ui/TrySnacksCategories";
import { ArrowLeft } from "lucide-react-native";
import Iphonecategories from "@/components/ui/Iphonecategories";
import { useState } from "react";
import Searchscreen from "@/features/Searchscreen";


export default function Categories() {
   const [search, setSearch] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        stickyHeaderIndices={[0]} 
      >
       
    {/* 🔒 STICKY HEADER BLOCK */}
    <View className="bg-white z-50 mb-2">
 
     {/* HEADER */}
     <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-200 ">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold">
          Categories
        </Text>
        <View className="w-6" />
      </View>

       {/* SEARCH BAR */}
       <TrySearchbar value={search} onChange={setSearch} />
       <Searchscreen search={search} />
      </View>

    
      <Offercategories/>  
      <Iphonecategories/> 

      {/* Categories */}
      <TryKitchencategories />

      {/* Use same component with different title & data */}
      <HomeCategories groupName="Home & Care" />

      <HomeCategories groupName="Personal Care" />

      {/* SnacksCategories */}
      <TrySnacksCategories />
      </ScrollView>
    </SafeAreaView>
  );
}


