import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { router } from "expo-router";

export default function CartPage() {

    type CartItem = {
    id: string | number;
    title: string;
    price: string;
    image: string;
    qty: number;
    };
  
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = async () => {
    const data = await AsyncStorage.getItem("cart");
    if (data) setCart(JSON.parse(data));
  };

  useEffect(() => {
    loadCart();
  }, []);
  
  
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">My Cart</Text>

      {cart.length === 0 ? (
        <Text className="text-center text-gray-500 mt-20">
          Your cart is empty.
        </Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => (
            <View className="bg-white p-4 mb-3 rounded-xl">
              <View className="flex-row">
                <Image
                  source={{ uri: item.image }}
                  className="w-20 h-20 rounded-lg"
                />
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-semibold">{item.title}</Text>
                  <Text className="text-green-600 font-bold">
                    ₹{item.price}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
