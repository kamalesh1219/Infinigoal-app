import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { allProducts } from "@/src/data/allProducts"; // merged products

export default function CategoryPage() {
  const { slug } = useLocalSearchParams(); // e.g., oils, rice, spices

  // Filter products by category slug
  const filteredProducts = allProducts.filter((p: any) =>
    p.category === slug
  );

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* ===== Header Title ===== */}
      <Text className="text-3xl font-bold text-gray-900">
        Category: {slug?.toString().toUpperCase()}
      </Text>

      {/* Breadcrumb */}
      <Text className="text-gray-500 mt-1">
        Home / {slug}
      </Text>

      {/* Filter + Sort Row */}
      <View className="flex-row justify-between mt-5 mb-3">
        <TouchableOpacity className="border px-4 py-2 rounded-xl flex-row items-center">
          <Text className="text-gray-900 font-semibold">Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity className="border px-4 py-2 rounded-xl">
          <Text className="text-gray-900 font-semibold">Default sorting</Text>
        </TouchableOpacity>
      </View>

      {/* ===== Product Grid ===== */}
      <View className="flex-row flex-wrap justify-between">
        {filteredProducts.map((item: any) => (
          <TouchableOpacity
            key={item.id}
            className="w-[48%] bg-white rounded-xl p-3 mb-5 shadow"
          >
            <Image
              source={{ uri: item.image }}
              className="w-full h-44 rounded-lg"
              resizeMode="contain"
            />

            <Text className="mt-3 font-semibold text-gray-800">
              {item.name}
            </Text>

            {/* Price */}
            <Text className="text-red-600 font-bold mt-1">
              {item.price}
            </Text>

            <TouchableOpacity className="bg-yellow-400 mt-3 py-2 rounded-full">
              <Text className="text-center font-bold text-black">
                Add to Cart
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View className="h-14" />
    </ScrollView>
  );
}
