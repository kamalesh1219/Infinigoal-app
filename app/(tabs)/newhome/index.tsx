import Header from "@/components/Header";
import { Dimensions, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Footer from "@/components/Footer";
import HomeCategories from "@/components/HomeCategories";
import OffersZone from "@/components/OffersZone";
import PhoneOffercategories from "@/components/ui/PhoneOffercategories";
import TryBannerSlider from "@/components/ui/TryBannerSlider";
import TryBestseller from "@/components/ui/TryBestseller";
import TryKitchencategories from "@/components/ui/TryKitchencategories";
import TryRecentlyAdded from "@/components/ui/TryRecentlyAdded";
import TryRegularneeds from "@/components/ui/TryRegularneeds";
import TrySearchbar from "@/components/ui/TrySearchbar";
import TrySignature from "@/components/ui/TrySignature";
import TrySliderProduct from "@/components/ui/TrySliderProduct";
import TrySnacksCategories from "@/components/ui/TrySnacksCategories";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import Searchscreen from "@/features/Searchscreen";
import SearchResults from "@/features/SearchResults";


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
  <>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >

      {/* 🟡 YELLOW SAFE AREA SECTION */}
      <SafeAreaView className="bg-[#F6E6B8] mb-2">
        <View className="bg-[#F6E6B8]">
          <Header />
          <TrySearchbar value={search} onChange={setSearch} />
           <Searchscreen search={search} />
          <TryBannerSlider />
          
        </View>
      </SafeAreaView>
       
      {/* ⚪ NORMAL CONTENT (WHITE BG) */}
      <View className="bg-white">

        <PhoneOffercategories />

        <TryKitchencategories />

        <HomeCategories groupName="Home & Care" />
        <HomeCategories groupName="Personal Care" />

        <TrySnacksCategories />

        <TryRegularneeds />

        <TrySignature />

        <TrySliderProduct />

        <TryRecentlyAdded />

        <TryBestseller />

        <OffersZone />

        <Footer />

      </View>

    </ScrollView>
  </>
);

}
