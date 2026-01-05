import { View, Text,ScrollView,TouchableOpacity, Image,Dimensions, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import Searchbar from "@/components/ui/TrySearchbar";
import BannerSlider from "@/components/BannerSlider";
import KitchenCategories from "@/components/KitchenCategories";
import HomeCategories from "@/components/HomeCategories";
import SnacksCategories from "@/components/SnacksCategories";
import SliderProduct from "@/components/SliderProduct";
import RegularNeeds from "@/components/RegularNeeds";
import Bestseller from "@/components/Bestseller";
import OffersZone from "@/components/OffersZone";
import RecentlyAdded from "@/components/RecentlyAdded";
import Footer from "@/components/Footer";
import TopBrands from "@/components/TopBrands";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";
import { openCategory } from "@/src/utils/navigation";
import TrySearchbar from "@/components/ui/TrySearchbar";


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
      >
      {/* Header */} 
      <Header/>

     <TrySearchbar value={search} onChange={setSearch} />

      {/* SLIDER */}
      <BannerSlider />

     {/* Categories */}
     <KitchenCategories />

     {/* Use same component with different title & data */}
     <HomeCategories groupName="Home & Care" />

     <HomeCategories groupName="Personal Care" />

     {/* SnacksCategories */}
     <SnacksCategories />

     <RegularNeeds />

     {/* Signature product */}
    <View className="mx-4 px-4 mt-10 bg-yellow-300 rounded-lg">
      <Text className="italic font-bold text-2xl text-center mt-4 mb-8">
        InfiniGoal Signatures
      </Text>

    {sigLoading ? (
      <View className="items-center pb-6">
        <ActivityIndicator size="large" />
      </View>
       ) : (
        <View className="flex-row flex-wrap justify-between">
          {signatureCards.map((item) => (
            <TouchableOpacity
              onPress={() => openCategory(item.slug)}
              key={item.id}
              className="bg-[#FEFFEC] w-[32%] rounded-md p-4 shadow-md mb-4 items-center"
              // optional: navigate if you want
              // onPress={() => openCategory(item.slug)}
            >
              <Image
                source={{ uri: item.image_url }}
                style={{
                  width: screenWidth * 0.26,
                  height: screenWidth * 0.40,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
    
      <SliderProduct/>

      <Bestseller />
      
      <OffersZone />

      <RecentlyAdded />

      {/* Assures  */}
      <View className="mt-14 bg-white">
          <View className="flex-row  justify-between px-2">
              <View className="w-[49%] bg-gray-200  rounded-2xl pb-2">
               <Image 
                 source={{ uri:"https://infinigoal.in/wp-content/uploads/2025/01/1000200847.png"}}
                 className="w-full h-48 mt-4"
                 resizeMode="contain"
               /> 
              <Text className="font-bold text-lg text-center mt-5">Monthly Delivery</Text>
              <Text className="font-normal text-sm text-center mt-2">Your Monthly Grocery will be delivered in Best Price</Text>
              </View> 
              <View className="w-[49%] bg-gray-200 rounded-2xl pb-2">
                <Image 
                 source={{ uri:" https://infinigoal.in/wp-content/uploads/2025/01/1000200663.png"}}             
                 className="w-full h-48 mt-4"
                 resizeMode="contain"
               /> 
                <Text className="font-bold text-lg text-center mt-5">Quality Assured</Text>
                <Text className="font-normal text-sm text-center mt-2">We Ensure our Quality is Gaurantied.</Text>
              </View> 
         </View>

           <View className="flex-row justify-between mt-2 px-2">
              <View className="w-[49%] bg-gray-200 rounded-2xl pb-2">
                <Image 
                 source={{ uri:"https://infinigoal.in/wp-content/uploads/2025/01/1000200853.png"}}
                 className="w-full h-48 mt-4"
                 resizeMode="contain"
               /> 
              <Text className="font-bold text-lg text-center mt-5">Cash On Delivery</Text>
              <Text className="font-normal text-sm text-center mt-2">We Offer a Cash On Delivery every month</Text>
              </View> 
              <View className="w-[49%] bg-gray-200  rounded-2xl pb-2">
                <Image 
                 source={{ uri:"https://infinigoal.in/wp-content/uploads/2025/01/1000200856.png"}}
                 className="w-full h-48 mt-4"
                 resizeMode="contain"
               /> 
                <Text className="font-bold text-lg text-center mt-5">Return Policy</Text>
                <Text className="font-normal text-sm text-center mt-2">If you are not satisfied we will offer 10 Days return Policy</Text>
              </View> 
         </View>

      </View>

      <TopBrands />

      {/* Footer  */}
       <Footer />
  </ScrollView> 
    </SafeAreaView>
  );
}
