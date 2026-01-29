import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, CheckCircle, ChevronRight } from "lucide-react-native";
import { supabase } from "@/src/lib/supabase";
import { getCurrentUser } from "@/src/services/auth";
import { useCart } from "@/providers/CartProvider";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, clearCart } = useCart();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    const user = await getCurrentUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        total_amount,
        status,
        order_items (
          id,
          image_url
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }

    setLoading(false);
  };
  
  const handleOrderAgain = async (orderId: string) => {
    try {
      // 1️⃣ Fetch order items
      const { data: items, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

      if (error || !items) {
        alert("Failed to load order items");
        return;
      }

      // 2️⃣ Clear existing cart
      clearCart();

      // 3️⃣ Add each item back with qty
      items.forEach((item) => {
        for (let i = 0; i < item.qty; i++) {
          addToCart({
            id: item.product_id,   // ✅ must be UUID
            name: item.name,
            price: item.price,
            mrp: item.mrp,
            image_url: item.image_url,
          });
        }
      });

      // 4️⃣ Go to cart
      router.push("/cart");

    } catch (err) {
      console.log("Order again error:", err);
      alert("Something went wrong");
    }
  };


  
  return (
    <SafeAreaView className="flex-1 bg-gray-100">

      {/* HEADER */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold">
          Your Orders
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {!loading && orders.length === 0 ? (
          /* EMPTY */
          <View className="items-center mt-32 px-6">
            <Text className="text-xl font-semibold text-gray-800">
              No orders yet
            </Text>
            <Text className="text-gray-500 mt-2">
              Start shopping to see your orders here
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/newhome")}
              className="bg-pink-600 px-6 py-3 rounded-full mt-6"
            >
              <Text className="text-white font-bold">
                Start Shopping
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map((order) => (
            <View
              key={order.id}
              className="bg-white mx-4 mt-4 rounded-2xl border border-gray-200 overflow-hidden"
            >
              {/* TOP ROW */}
              <View className="flex-row items-center justify-between px-4 pt-4">
                <View className="flex-row items-center">
                  <CheckCircle size={18} color="#16a34a" />
                  <Text className="ml-2 font-semibold text-gray-900">
                    Order delivered
                  </Text>
                </View>

                <Text className="font-bold text-gray-900">
                  ₹{order.total_amount}
                </Text>
              </View>

              {/* DATE */}
              <Text className="text-gray-500 text-sm px-4 mt-1">
                Placed at{" "}
                {new Date(order.created_at).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>

              {/* PRODUCT IMAGES */}
              <View className="flex-row px-4 mt-3">
                {order.order_items?.slice(0, 4).map((item: any) => (
                  <Image
                    key={item.id}
                    source={{ uri: item.image_url }}
                    className="w-16 h-20 mr-2 rounded-lg border border-gray-200"
                    resizeMode="contain"
                  />
                ))}
              </View>

              {/* ACTIONS */}
              <View className="flex-row border-t border-gray-200 mt-4">
                <TouchableOpacity 
                  className="flex-1 py-4 items-center"
                  onPress={() => router.push("/newhome")}
                >
                  <Text className="font-semibold text-gray-800">
                   Shop Again
                  </Text>
                </TouchableOpacity>

                <View className="w-[1px] bg-gray-200" />

                <TouchableOpacity
                  className="flex-1 py-4 items-center"
                  onPress={() => handleOrderAgain(order.id)}
                >
                  <Text className="font-semibold text-pink-600">
                    Order Again
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
