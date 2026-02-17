import { useCart } from "@/providers/CartProvider";
import { supabase } from "@/src/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Heart, Maximize2, Minus, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [related, setRelated] = useState<any[]>([]);
  const { cart, addToCart, decrementQty, removeFromCart } = useCart();
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);



  // ======================================================
  // LOAD PRODUCT BY ID FROM SUPABASE
  // ======================================================
  async function loadProduct() {
    setLoading(true);

    // 1️⃣ Load product
    const { data: productData, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setProduct(productData);

    // 2️⃣ Load variants for this product
    const { data: variantData } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productData.id)
      .order("price", { ascending: true });

    setVariants(variantData || []);

    // 3️⃣ Auto select default variant
    const defaultVariant =
      variantData?.find((v) => v.is_default) || variantData?.[0];

    setSelectedVariant(defaultVariant);


    // RELATED PRODUCTS (SAME TAG)
    const { data: relatedData } = await supabase
      .from("products")
      .select("id,name,image_url,price,mrp,price_text")
      .eq("tag", productData.tag)
      .neq("id", productData.id)
      .limit(10);

    setRelated(relatedData ?? []);
    
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
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">

                {/* BACK BUTTON */}
                <TouchableOpacity onPress={() => router.back()} className="rounded-full bg-slate-200 py-2 px-2">
                  <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                {/* TITLE */}
                <Text
                  className="text-xl font-semibold text-gray-900"
                  numberOfLines={1}
                >
                  {product.name}
                </Text>   

                  {/* CART ICON */}
                    <TouchableOpacity
                      onPress={() => router.push("/cart")}
                      className="relative mr-2"
                    >
                      <Ionicons name="cart-outline" size={26} color="#16A34A" />

                      {cartCount > 0 && (
                        <View className="absolute -top-2 -right-2 bg-pink-500 w-5 h-5 rounded-full items-center justify-center">
                          <Text className="text-white text-xs font-bold">
                            {cartCount}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
            </View>                

          {/* PRODUCT IMAGE BLOCK */}
          <View className="relative bg-white my-3">
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

            {/* Short Description */}
            <Text className="text-gray-700 mt-5 mb-2">
              {product.description || "Product description coming soon."}
            </Text>

            {/* Price */}
            <View className="flex-row items-center gap-2 mb-1 mt-2">
            <View className="">             
              <Text className="text-white text-xl font-semibold bg-green-600 rounded-md px-2 py-2 ">
                ₹{selectedVariant?.price ?? product.price}
              </Text>             
            </View>

             <Text className="text-gray-500 line-through text-lg mt-2 ">
               MRP ₹{selectedVariant?.mrp ?? product.mrp}
              </Text>
            </View>

            {/* VARIANTS */}
              {variants.length > 0 && (
                <View className="mt-4 mb-2">
                  <Text className="text-base font-semibold text-gray-800 mb-3">
                    Select Pack Size
                  </Text>

                  <View className="flex-row flex-wrap gap-3">
                    {variants.map((variant) => {
                      const isActive = selectedVariant?.id === variant.id;

                      return (
                        <TouchableOpacity
                          key={variant.id}
                          onPress={() => setSelectedVariant(variant)}
                          className={`px-6 py-4 rounded-full border
                            ${isActive
                              ? "bg-green-600 border-green-600"
                              : "bg-white border-gray-300"}
                          `}
                        >
                          <Text
                            className={`font-semibold
                              ${isActive ? "text-white" : "text-gray-700"}
                            `}
                          >
                            {variant.label}
                          </Text>
                            
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

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
              <Text className="text-gray-500 text-center">No related products found...</Text>
            ) : (
              related.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => router.push(`/productdetails/${item.id}`)}
                  className="w-52 mr-3 bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
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
                  <Text className="text-md font-semibold mb-1 my-2" numberOfLines={2}>
                    {item.name}
                  </Text>

                  {/* Price */}
                  <View className="flex-row items-center gap-2 mb-2">
                    
                      <Text className="text-red-600 font-semibold text-base">
                        ₹{item.price}
                      </Text>
                    

                    <Text className="text-gray-500 line-through font-bold text-sm">
                      MRP ₹{item.mrp}
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
                   className="bg-yellow-300 rounded-full py-2 items-center w-36"
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
