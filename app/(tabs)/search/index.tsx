import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";
import { Grid2X2, Package, Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ======================================
// TypeScript Types
// ======================================
type Product = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  mrp: number;
};

type Category = {
  id: string;
  title: string;
  slug: string;
  image_url?: string;
};

// ======================================
// Search Page Component
// ======================================
export default function SearchPage() {
  const [search, setSearch] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
  if (search.length < 2) {
    setProducts([]);
    setCategories([]);
    return;
  }

  searchData();
}, [search]);


  // 🔍 Fetch from Supabase
  const searchData = async () => {
    const { data: productData } = await supabase
      .from("products")
      .select("id,name,image_url,price,mrp")
      .ilike("name", `%${search}%`)
      .limit(6);

    const { data: categoryData } = await supabase
      .from("category_items")
      .select("id,title,slug,image_url")
      .ilike("title", `%${search}%`)
      .limit(4);

    setProducts(productData ?? []);
    setCategories(categoryData ?? []);
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      
      {/* HEADER */}
      <View className="p-4">
        <Text className="text-3xl font-bold text-gray-900">Search</Text>
      </View>

      {/* SEARCH BAR */}
      <View className="flex-row items-center mx-4 bg-gray-100 rounded-full px-4 py-3">
        <Search size={22} color="#6b7280" />
        <TextInput
          placeholder="Search products or categories..."
          className="flex-1 ml-3 text-lg"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={searchData}
        />
      </View>

      {loading && (
        <Text className="text-center mt-6 text-gray-500 text-lg">
          Searching...
        </Text>
      )}

      <ScrollView className="mt-4 px-4">

        {/* =======================
            CATEGORY RESULTS 
        ======================== */}
        {categories.length > 0 && (
          <>
            <Text className="text-xl font-semibold mt-4 mb-2">Categories</Text>

            <View className="flex-row flex-wrap justify-between">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => router.push(`/categorie/${cat.slug}`)}
                  className="bg-gray-100 w-[48%] rounded-xl p-4 mb-3 flex-row items-center"
                >
                  <Grid2X2 size={24} color="#2563EB" />
                  <Text className="ml-3 text-lg font-medium text-gray-900">
                    {cat.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* =======================
            PRODUCT RESULTS
        ======================== */}
        {products.length > 0 && (
          <>
            <Text className="text-xl font-semibold mt-6 mb-2">Products</Text>

            {products.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/productdetails/${item.id}`)}
                className="flex-row bg-gray-100 rounded-xl p-3 mb-3"
              >
                <Image
                  source={{ uri: item.image_url }}
                  className="w-20 h-20 rounded-lg"
                />

                <View className="ml-3 flex-1">
                  <Text className="text-lg font-semibold" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View className="flex">
                  <Text className="text-green-700 font-bold mt-1">
                    ₹{item.price}
                  </Text>
                  <Text className="line-through text-gray-400 text-sm">
                     ₹{item.mrp}
                  </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* =======================
            NO RESULTS UI
        ======================== */}
        {!loading &&
        search.length > 0 &&
          products.length === 0 &&
          categories.length === 0 && (
            <View className="items-center mt-20">
              <Package size={70} color="#9ca3af" />
              <Text className="text-gray-400 text-lg mt-4">
                No results found
              </Text>
            </View>
          )}

      </ScrollView>
    </SafeAreaView>
  );
}
