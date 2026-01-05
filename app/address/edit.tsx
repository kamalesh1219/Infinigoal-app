import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/src/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";

export default function EditAddress() {
  const { id } = useLocalSearchParams(); // address id
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line: "",
    city: "",
    pincode: "",
    landmark: "",
  });

  // 🔹 Load existing address
  useEffect(() => {
    if (id) loadAddress();
  }, [id]);

  async function loadAddress() {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        address_line: data.address_line || "",
        city: data.city || "",
        pincode: data.pincode || "",
        landmark: data.landmark || "",
      });
    }

    setLoading(false);
  }

  // 🔹 Update address
  async function updateAddress() {
    setLoading(true);

    const { error } = await supabase
      .from("addresses")
      .update(form)
      .eq("id", id);

    setLoading(false);

    if (!error) {
      router.back(); // go back to address list
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">
        Edit Address
      </Text>

      <TextInput
        value={form.name}
        placeholder="Name"
        className="border rounded-lg px-4 py-3 mb-3"
        onChangeText={(v) => setForm({ ...form, name: v })}
      />

      <TextInput
        value={form.phone}
        placeholder="Phone"
        keyboardType="number-pad"
        className="border rounded-lg px-4 py-3 mb-3"
        onChangeText={(v) => setForm({ ...form, phone: v })}
      />

      <TextInput
        value={form.address_line}
        placeholder="Address"
        className="border rounded-lg px-4 py-3 mb-3"
        onChangeText={(v) =>
          setForm({ ...form, address_line: v })
        }
      />

      <TextInput
        value={form.city}
        placeholder="City"
        className="border rounded-lg px-4 py-3 mb-3"
        onChangeText={(v) => setForm({ ...form, city: v })}
      />

      <TextInput
        value={form.pincode}
        placeholder="Pincode"
        keyboardType="number-pad"
        className="border rounded-lg px-4 py-3 mb-3"
        onChangeText={(v) => setForm({ ...form, pincode: v })}
      />

      <TextInput
        value={form.landmark}
        placeholder="Landmark (optional)"
        className="border rounded-lg px-4 py-3 mb-4"
        onChangeText={(v) =>
          setForm({ ...form, landmark: v })
        }
      />

      <TouchableOpacity
        onPress={updateAddress}
        className="bg-pink-600 py-4 rounded-xl"
      >
        <Text className="text-white text-center font-bold">
          Update Address
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
