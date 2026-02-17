import TrySearchbar from "@/components/ui/TrySearchbar"
import Searchscreen from "@/features/Searchscreen"
import { supabase } from "@/src/lib/supabase"
import { openProduct } from "@/src/utils/navigation"
import { router } from "expo-router"
import { ArrowLeft, Heart } from "lucide-react-native"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface Category {
  id: string
  title: string
  slug: string
  image_url: string
}

interface Product {
  id: string
  name: string
  image_url: string
  price: number
  mrp: number
  category_slug: string
}

export default function CategoryProductScreen() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("category_items")
      .select("*")
      .order("display_order", { ascending: true })

    if (data) {
      setCategories(data)
      setSelectedSlug(data[0]?.slug)
      fetchProducts(data[0]?.slug)
    }
  }

  const fetchProducts = async (slug: string) => {
    setLoading(true)

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("subcategory_slug", slug)

    setProducts(data || [])
    setSelectedSlug(slug)
    setLoading(false)
  }

  const renderProduct = ({ item }: { item: Product }) => {
    const discount = item.mrp - item.price

    return (
      <View className="flex-1 m-2 bg-white rounded-2xl shadow-sm p-3 border border-gray-100">
       <TouchableOpacity
       onPress={() => openProduct(item.id)} 
       >
        {/* Wishlist */}
        <View className="absolute top-2 right-2 z-10">
          <Heart size={18} color="#f43f5e" />
        </View>

        <Image
          source={{ uri: item.image_url }}
          className="h-28 w-full"
          resizeMode="contain"
        />

        {/* ADD BUTTON */}
        <TouchableOpacity className="absolute bottom-28 right-4 bg-white border border-pink-500 px-4 py-1 rounded-lg">
          <Text className="text-pink-500 font-bold text-sm">
            ADD
          </Text>
        </TouchableOpacity>

        {/* PRICE */}
        <View className="mt-2 flex-row items-center">
          <Text className="bg-green-600 text-white px-2 py-1 rounded-md text-sm font-bold">
            ₹{item.price}
          </Text>

          <Text className="line-through text-gray-400 ml-2 text-xs">
            ₹{item.mrp}
          </Text>
        </View>

        <Text className="text-green-600 text-xs mt-1">
          ₹{discount} OFF
        </Text>

        <Text className="mt-1 text-sm font-medium">
          {item.name}
        </Text>

        <Text className="text-xs text-gray-500 mt-1">
          ⭐ 4.8 
        </Text>
      </TouchableOpacity>
      </View>
    )
  }

  if (!selectedSlug) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <>
    <SafeAreaView className="flex-1 bg-white">

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
        <Heart size={22} color="black" />
        <View className="w-6" />
      </View>

       {/* SEARCH BAR */}
       <TrySearchbar value={search} onChange={setSearch} />
       <Searchscreen search={search} />
      </View>


      <View className="flex-row flex-1">

        {/* LEFT SIDEBAR */}
        <View className="w-32 bg-gray-50 border-r border-gray-200">
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => fetchProducts(item.slug)}
                className={`items-center py-4 px-2 ${
                  selectedSlug === item.slug
                    ? "bg-purple-100"
                    : ""
                }`}
              >
                <Image
                  source={{ uri: item.image_url }}
                  className="w-14 h-14 mb-1"
                  resizeMode="contain"
                />
                <Text className="text-xs text-center">
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* RIGHT PRODUCT GRID */}
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
          renderItem={renderProduct}
        />

      </View>

      {/* BOTTOM OFFER BAR */}
      <View className="absolute bottom-0 w-full bg-gray-900 px-4 py-4 rounded-t-2xl">
        <Text className="text-white text-center font-semibold">
          Unlock extra ₹50 OFF • Shop for ₹599 more
        </Text>
      </View>

    </SafeAreaView>
    </>
  )
}
