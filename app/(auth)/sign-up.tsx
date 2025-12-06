import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/src/lib/supabase";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      Alert.alert("Register Error", error.message);
      return;
    }

    Alert.alert(
      "Success",
      "Account created! Please check your email for verification."
    );
    router.replace("/(auth)/sign-in");
  }

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-3xl font-bold text-center mb-3">
        Create Account 🌟
      </Text>

      <Text className="text-gray-600 mb-10 text-center">
        Register to start your shopping journey
      </Text>

      <Text className="text-gray-700 mb-1">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="example@gmail.com"
        className="border border-gray-300 p-3 rounded-xl mb-4"
      />

      <Text className="text-gray-700 mb-1">Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="******"
        secureTextEntry
        className="border border-gray-300 p-3 rounded-xl mb-4"
      />

      <TouchableOpacity
        onPress={handleRegister}
        className="bg-orange-500 py-4 rounded-full"
      >
        <Text className="text-white text-center font-bold text-lg">
          Sign Up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/sign-in")}
        className="mt-6"
      >
        <Text className="text-center text-gray-600">
          Already have an account?{" "}
          <Text className="text-orange-600 font-semibold">Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
