import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import TrySearchbar from "@/components/ui/TrySearchbar";
import Searchbar from "@/components/Searchbar";
import Offercategories from "@/components/ui/Offercategories";
import TryKitchencategories from "@/components/ui/TryKitchencategories";
import HomeCategories from "@/components/HomeCategories";
import TrySnacksCategories from "@/components/ui/TrySnacksCategories";


export default function Categories() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        stickyHeaderIndices={[0]} 
      >
       
       <View className="bg-white ">
          {/* Header */} 
          <Header/>
          {/* Searchbar */} 
          <Searchbar/>
      </View>

      <Offercategories/>      
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


