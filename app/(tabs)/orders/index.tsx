import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Package } from "lucide-react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { getCurrentUser } from "@/src/services/auth";

export default function OrdersPage() {
   const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    fetchOrders();
    }, []);

    const fetchOrders = async () => {
    setLoading(true);

    const user = await getCurrentUser();
    if (!user) return;

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (!error && data) {
        setOrders(data);
    }

    setLoading(false);
    };

  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      
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

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {!loading && orders.length === 0 ? (
        /* EMPTY STATE */
        <View className="flex-1 items-center justify-center mt-32 px-6">
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
            className="bg-white mx-4 mt-4 p-4 rounded-xl border border-gray-200"
            >
            <Text className="font-bold text-gray-800">
                Order #{order.id.slice(0, 8)}
            </Text>

            <Text className="text-gray-500 mt-1">
                Placed on {new Date(order.created_at).toDateString()}
            </Text>

            <View className="flex-row justify-between mt-3">
                <Text className="font-semibold">
                ₹{order.total_amount}
                </Text>

                <Text className="text-green-600 font-semibold capitalize">
                {order.status}
                </Text>
            </View>
            </View>
        ))
        )}


      </ScrollView>
    </SafeAreaView>
  );
}
