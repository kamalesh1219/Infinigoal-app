import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";

export default function NewAddress() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line: "",
    city: "",
    pincode: "",
    landmark: "",
  });

  async function saveAddress() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("addresses").insert({
      user_id: user.id, // 🔐 REQUIRED for RLS
      ...form,
      is_default: false,
    });

    if (!error) {
      router.back(); // go back to address list
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">
        Add New Address
      </Text>

      <TextInput
        placeholder="Name"
        className="border rounded-lg px-4 py-3 mb-3"
        onChangeText={(v) =>
          setForm({ ...form, name: v })
        }
      />

      <TextInput
        placeholder="Phone"
        keyboardType="number-pad"
        className="border rounded-lg px-4 py-3 mb-3"
        onChangeText={(v) =>
          setForm({ ...form, phone: v })
        }
      />

      <TextInput
        placeholder="Address"
        className="border rounded-lg px-4 py-3 mb-3"
        onChangeText={(v) =>
          setForm({ ...form, address_line: v })
        }
      />

      <TextInput
        placeholder="City"
        className="border rounded-lg px-4 py-3 mb-3"
        onChangeText={(v) =>
          setForm({ ...form, city: v })
        }
      />

      <TextInput
        placeholder="Pincode"
        keyboardType="number-pad"
        className="border rounded-lg px-4 py-3 mb-3"
        onChangeText={(v) =>
          setForm({ ...form, pincode: v })
        }
      />

      <TextInput
        placeholder="Landmark (optional)"
        className="border rounded-lg px-4 py-3 mb-4"
        onChangeText={(v) =>
          setForm({ ...form, landmark: v })
        }
      />

      <TouchableOpacity
        onPress={saveAddress}
        className="bg-pink-600 py-4 rounded-xl"
      >
        <Text className="text-white text-center font-bold">
          Save Address
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
