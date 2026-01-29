import { View, Text,ScrollView,TouchableOpacity, Image,Dimensions, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";

import HomeCategories from "@/components/HomeCategories";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import TryRegularneeds from "@/components/ui/TryRegularneeds";
import TryBannerSlider from "@/components/ui/TryBannerSlider";
import TryKitchencategories from "@/components/ui/TryKitchencategories";
import TrySnacksCategories from "@/components/ui/TrySnacksCategories";
import TrySignature from "@/components/ui/TrySignature";
import TryRecentlyAdded from "@/components/ui/TryRecentlyAdded";
import TrySliderProduct from "@/components/ui/TrySliderProduct";
import TryBestseller from "@/components/ui/TryBestseller";
import OffersZone from "@/components/OffersZone";
import Footer from "@/components/Footer";
import Searchbar from "@/components/ui/TrySearchbar";
import TrySearchbar from "@/components/ui/TrySearchbar";
import Iphonecategories from "@/components/ui/Iphonecategories";
import Offercategories from "@/components/ui/Offercategories";
import PhoneOffercategories from "@/components/ui/PhoneOffercategories";


export default function HomeScreen() {
    const { width: screenWidth } = Dimensions.get("window");

   type SignatureItem = {
    id: string;
    title: string;
    slug: string;
    image_url: string;
    display_order: number;
  };

  const [signatureCards, setSignatureCards] = useState<SignatureItem[]>([]);
   const [sigLoading, setSigLoading] = useState(true);
   const [search, setSearch] = useState("");

  const loadSignatureCards = async () => {
      setSigLoading(true);

      const { data, error } = await supabase
        .from("category_items")
        .select("id,title,slug,image_url,display_order")
        .eq("category_group_name", "InfiniGoal Signature")
        .eq("card_type", "signature")
        .order("display_order", { ascending: true });

      if (!error && data) {
        setSignatureCards(data);
      }

      setSigLoading(false);
    };

    useEffect(() => {
      loadSignatureCards();
    }, []);

  return (
    
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        stickyHeaderIndices={[0]} 
      >
      {/* 🔒 STICKY HEADER BLOCK */}
        <View className="bg-white ">
          {/* Header */} 
          <Header/>
          {/* Searchbar */} 
          <TrySearchbar value={search} onChange={setSearch} />
        </View>

      {/* SLIDER */}
      <TryBannerSlider />
     
     <PhoneOffercategories/>      
     
       

     {/* Categories */}
     <TryKitchencategories />

     {/* Use same component with different title & data */}
     <HomeCategories groupName="Home & Care" />

     <HomeCategories groupName="Personal Care" />

     {/* SnacksCategories */}
     <TrySnacksCategories />

    <TryRegularneeds/>

    <TrySignature />
    
    <TrySliderProduct/>

    <TryRecentlyAdded />

    <TryBestseller/>

    <OffersZone/>
    
    <Footer />
  </ScrollView> 
    </SafeAreaView>
  );
}
