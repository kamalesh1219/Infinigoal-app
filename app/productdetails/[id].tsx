import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import { Heart, Minus, Plus, Maximize2, ShoppingCart } from "lucide-react-native";
import Header from "@/components/Header";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "@/providers/CartProvider";


export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [related, setRelated] = useState<any[]>([]);
  const { cart, addToCart, decrementQty, removeFromCart } = useCart();

  
  // ======================================================
  // LOAD PRODUCT BY ID FROM SUPABASE
  // ======================================================
  async function loadProduct() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log("Product Load Error:", error);
      setLoading(false);
      return;
    }

    const p = data;
    setProduct(p);

    // Load related products (same tag)

      const { data: relatedData } = await supabase
        .from("products")
        .select("*")
        .eq("tag", p.tag)
        .neq("id", p.id)
        .limit(10);

      setRelated(relatedData || []);

    setLoading(false);
  }

  useEffect(() => {
    loadProduct();
  }, [id]);


  const getQty = (productId: string) => {
    const item = cart.find((c) => c.id === productId);
    return item ? item.qty : 0;
  };

  // ======================================================
  // LOADING UI
  // ======================================================
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
        <Text className="mt-2 text-gray-600">Loading Product...</Text>
      </View>
    );
  }

  // ======================================================
  // NOT FOUND
  // ======================================================
  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-semibold">Product Not Found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: product.name || product.name,
          headerBackTitle: "Back",
        }}
      />

      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex bg-white">

          {/* HEADER */}
          <Header />

          {/* PRODUCT IMAGE BLOCK */}
          <View className="relative bg-white">
            <Image
              source={{ uri: product.image_url }}
              className="w-full h-96 bg-white"
              resizeMode="contain"
            />
           {/* Discount Badge */} 
            <View className="absolute top-5 left-5 bg-red-600 px-3 py-1 rounded-md">
              <Text className="text-white font-bold text-xs">4% OFFER</Text>
            </View>

            <TouchableOpacity className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow">
              <Maximize2 size={20} color="black" />
            </TouchableOpacity>
          </View>

          {/* ============================
              PRODUCT TITLE & PRICE
          ============================ */}
          <View className="px-4 mt-4">
            <Text className="text-2xl font-bold text-gray-900">
              {product.title  || product.name}
            </Text>

            <View className="flex-row items-center gap-2 mt-2">             
              <Text className="text-white text-xl font-semibold bg-green-600 rounded-md px-2 py-2 ">
                ₹{product.price}
              </Text>             
            </View>

             <Text className="text-gray-500 line-through text-lg mt-2">
                MRP  ₹{product.mrp}
              </Text>

            {/* Short Description */}
            <Text className="text-gray-700 mt-5 mb-2">
              {product.description || "Product description coming soon."}
            </Text>
          </View>

          {/* ============================
              QUANTITY + ADD TO CART
          ============================ */}
          <View className="px-4 mt-6 flex-row items-center gap-3">
            {getQty(product.id) === 0 ? (
              <TouchableOpacity
                onPress={() =>
                  addToCart({
                    id: product.id,
                    name: product.name ?? product.title,
                    price: product.price,
                    mrp: product.mrp,
                    image_url: product.image_url,
                  })
                }
                className="flex bg-lime-400 py-3 rounded-full items-center justify-center w-56"
                activeOpacity={0.85}
              >
                <Text className="text-black font-bold text-sm">
                  ADD TO CART
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                {/* QTY CONTROLLER */}
                <View className="flex-row items-center bg-green-100 rounded-full px-4 py-2 gap-3">
                  <TouchableOpacity
                    onPress={() =>
                      getQty(product.id) === 1
                        ? removeFromCart(product.id)
                        : decrementQty(product.id)
                    }
                    className="p-1 border border-green-900 rounded-full"
                    activeOpacity={0.85}
                  >
                    <Minus size={18} color="black" />
                  </TouchableOpacity>

                  <Text className="text-lg font-semibold mx-3">
                    {getQty(product.id)}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      addToCart({
                        id: product.id,
                        name: product.name ?? product.title,
                        price: product.price,
                        mrp: product.mrp,
                        image_url: product.image_url,
                      })
                    }
                    className="p-1 border border-green-900 rounded-full"
                    activeOpacity={0.85}
                  >
                    <Plus size={18} color="black" />
                  </TouchableOpacity>
                </View>

                {/* GO TO CART BUTTON */}
                <TouchableOpacity
                  onPress={() => router.push("/cart")}
                  className="bg-lime-400 px-5 py-3 rounded-full"
                  activeOpacity={0.85}
                >
                  <Text className="text-black font-bold text-sm">
                    VIEW CART
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
         

          {/* ADD TO WISHLIST */}
        <TouchableOpacity className="flex-row items-center gap-2 px-4 mt-4">
          <Heart size={20} color="red" />
          <Text className="text-blue-400 text-base">Add to wishlist </Text>
        </TouchableOpacity>


          {/* CATEGORY */}
          <View className="px-4 mt-6 mb-12">
            <Text className="text-gray-500">
              Category:{" "}
              <Text className="text-blue-400">
                {product.tag || "General"}
              </Text>
            </Text>
          </View>

          {/* ============================
              PRODUCT INFO TABS
          ============================ */}
          <View className="px-4 mb-10">

            <View className="flex-col w-64 gap-3 px-4 mb-5">
              {/* DESCRIPTION */}
              <Pressable
                onPress={() => setActiveTab("description")}
                className="border px-4 py-2 rounded-md"
              >
                <Text
                  className={
                    activeTab === "description"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  }
                >
                  Description
                </Text>
              </Pressable>

              {/* ADDITIONAL */}
              <Pressable
                onPress={() => setActiveTab("additional")}
                className="border px-4 py-2 rounded-md"
              >
                <Text
                  className={
                    activeTab === "additional"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  }
                >
                  Additional information
                </Text>
              </Pressable>

              {/* REVIEWS */}
              <Pressable
                onPress={() => setActiveTab("reviews")}
                className="border px-4 py-2 rounded-md"
              >
                <Text
                  className={
                    activeTab === "reviews"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  }
                >
                  Reviews (0)
                </Text>
              </Pressable>
            </View>

            {/* TAB CONTENT */}
            <Text className="text-gray-700 mt-4">
              {activeTab === "description"
                ? product.description || "No information available."
                : activeTab === "additional"
                ? "Weight: 1kg\nBrand: InfiniGoal\nDelivery: 24 Hours"
                : "No reviews yet."}
            </Text>

           {/* Description text */}
            <Text className="text-gray-700 mt-4">
             {product.title || product.description || "Product description coming soon."}
            </Text>
          </View>


          {/* Divider */}
          <View className="my-8 h-[1px] bg-gray-300 mx-4" />

         {/* ======================================= */}
          {/* RELATED PRODUCTS (SUPABASE) */}
          {/* ======================================= */}

          <Text className="text-xl font-semibold text-center mb-4">
            Related Products
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4 mb-10 mr-8 mt-5"
          >
            {related.length === 0 ? (
              <Text className="text-gray-500 text-center">No related products found.</Text>
            ) : (
              related.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => router.push(`/productdetails/${item.id}`)}
                  className="w-60 mr-4 bg-white rounded-lg border p-3 shadow-sm"
                >
                  {/* Discount Badge */}
                  <View className="absolute top-2 left-2 bg-red-500 px-2 py-[1px] rounded-sm">
                      <Text className="text-white font-bold text-xs">5% OFF</Text>
                  </View>

                  {/* Product Image */}
                  <Image
                    source={{ uri: item.image_url }}
                    className="w-full h-44 mb-2"
                    resizeMode="contain"
                  />

                  {/* Title */}
                  <Text className="text-sm font-semibold mb-1 h-12 my-4" numberOfLines={2}>
                    {item.name}
                  </Text>

                  {/* Price */}
                  <View className="flex-row items-center gap-2 mb-2">
                    {item.price && (
                      <Text className="text-gray-400 line-through text-sm">
                        ₹{item.price}
                      </Text>
                    )}

                    <Text className="text-red-600 font-bold text-sm">
                      {item.price_text}
                    </Text>
                  </View>

                  {/* Qty Selector */}
                  <View className="flex-row items-center justify-between border rounded-full px-3 py-1 mb-2 w-32">
                    <TouchableOpacity
                     onPress={() =>
                      getQty(item.id) === 1
                        ? removeFromCart(item.id)
                        : decrementQty(item.id)
                    }
                    >
                      <Text className="text-lg">−</Text>
                    </TouchableOpacity>

                    <Text className="text-lg">
                      {getQty(item.id) === 0 ? 0 : getQty(item.id)}
                    </Text>

                    <TouchableOpacity
                     onPress={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        mrp: item.mrp,
                        image_url: item.image_url,
                      })
                    }
                    >
                      <Text className="text-lg">+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Add to cart */}
                  <TouchableOpacity 
                   onPress={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        mrp: item.mrp,
                        image_url: item.image_url,
                      })
                    }
                   className="bg-yellow-300 rounded-full py-2 items-center w-36 mb-4"
                  >
                    <Text className="font-semibold text-black">Add to cart</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>



        </ScrollView>
      </SafeAreaView>
    </>
  );
}
