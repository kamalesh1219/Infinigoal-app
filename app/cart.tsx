import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { useCart } from "@/providers/CartProvider"
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-500">Your cart is empty 🛒</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#EEF5EF] px-4 pt-6">
      <Text className="text-2xl font-bold mb-4">My Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-3 mb-3 flex-row items-center">
            <Image
              source={{ uri: item.image_url }}
              className="w-16 h-16"
              resizeMode="contain"
            />

            <View className="flex-1 ml-3">
              <Text className="font-semibold">{item.name}</Text>
              <Text className="text-gray-600">
                ₹{item.price} × {item.qty}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => removeFromCart(item.id)}
            >
              <Text className="text-red-500 font-bold">Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={clearCart}
        className="bg-red-500 py-3 rounded-xl mt-4"
      >
        <Text className="text-white text-center font-bold">
          Clear Cart
        </Text>
      </TouchableOpacity>
    </SafeAreaView >
  );
}
