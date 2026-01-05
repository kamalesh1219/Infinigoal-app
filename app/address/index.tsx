import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Address = {
  id: string;
  name: string;
  phone: string;
  address_line: string;
  city: string;
  pincode: string;
  landmark: string;
  is_default: boolean;
};

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .order("created_at", { ascending: false });

    setAddresses(data || []);
    setLoading(false);
  }

  async function selectAddress(id: string) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .neq("id", id);

    await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id);

    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F3F7F4]">
      {/* HEADER */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold">
          Select Address
        </Text>
      </View>

      <ScrollView className="px-4">
        {addresses.map((addr) => (
          <TouchableOpacity
            key={addr.id}
            onPress={() => selectAddress(addr.id)}
            className={`bg-white rounded-xl p-4 mb-4 border ${
              addr.is_default
                ? "border-green-500"
                : "border-gray-200"
            }`}
          >
            <View className="flex-row justify-between">
              <Text className="font-semibold">{addr.name}</Text>
              {addr.is_default && (
                <Text className="text-green-600 font-bold">
                  Selected
                </Text>
              )}
            </View>

            <Text className="text-gray-700 mt-1">
              {addr.address_line}, {addr.city} – {addr.pincode}
            </Text>

            <Text className="text-gray-500 mt-1">
              📞 {addr.phone}
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push(`/address/edit?id=${addr.id}`)
              }
              className="mt-2"
            >
              <Text className="text-pink-600 font-semibold">
                Edit
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ADD NEW */}
      <View className="p-4">
        <TouchableOpacity
          onPress={() => router.push("/address/new")}
          className="bg-pink-600 py-4 rounded-xl"
        >
          <Text className="text-white text-center font-bold">
            + Add New Address
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
