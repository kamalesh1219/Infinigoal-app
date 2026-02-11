import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";


type Props = {
  products: any[];
  categories: any[];
  query: string;
};

export default function SearchResults({
  products,
  categories,
  query,
}: Props) {
  return (
    <View className="bg-white mx-4 rounded-2xl p-4 shadow-lg mt-2">

      {/* PRODUCTS */}
      {products.length > 0 && (
        <>
          <Text className="text-gray-500 font-semibold mb-2">
            Products
          </Text>

          {products.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(`/productdetails/${item.id}`)}
              className="flex-row items-center mb-3"
            >
              <Image
                source={{ uri: item.image_url }}
                className="w-12 h-12 rounded-lg mr-3"
              />

              <View className="flex-row items-center flex-1">
            {/* IMAGE */}
            <Image
              source={{ uri: item.image_url }}
              className="w-20 h-20 rounded-lg mr-3 bg-gray-100 py-2"
              resizeMode="cover"
            />

            {/* TEXT */}
            <View className="flex-1 ml-2">
              <Text
                className="font-semibold text-gray-900"
                numberOfLines={2}
              >
                {item.name}
              </Text>

              <Text className="text-green-700 font-bold mt-1">
                ₹{item.price}{" "}
                <Text className="line-through text-gray-400 text-xs">
                  ₹{item.mrp}
                </Text>
              </Text>
            </View>
          </View>

            </TouchableOpacity>
          ))}
        </>
      )}

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <>
          <Text className="text-gray-500 font-semibold mt-4 mb-2">
            Categories
          </Text>

          {categories.map((cat: any) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => router.push(`/categorie/${cat.slug}`)}
              className="py-2"
            >
              <Text className="font-semibold text-gray-800">
                📁 {cat.title}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* SEE ALL */}
      <TouchableOpacity
        onPress={() => router.push(`/search-results?query=${query}`)}
        className="mt-3"
      >
        <Text className="text-blue-600 font-semibold">
          See all results →
        </Text>
      </TouchableOpacity>
    </View>
  );
}
