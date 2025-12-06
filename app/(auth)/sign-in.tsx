import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/src/lib/supabase";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      router.replace("/(tabs)/home");
    }
  }

  async function SignInwithEmail() {
    if (!email || !password) {
      Alert.alert("Error", "Enter both email and password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error.message);
      return;
    }

    router.replace("/(tabs)/home");
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white justify-center px-6"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text className="text-3xl font-bold text-center text-black mb-2">
        Welcome Back 👋
      </Text>

      <Text className="text-center text-gray-600 mb-10">
        Login to continue shopping with InfiniGoal
      </Text>

      {/* Email */}
      <Text className="text-gray-700 mb-1">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 rounded-xl p-3 mb-4 bg-white"
        placeholder="example@gmail.com"
        autoCapitalize="none"
      />

      {/* Password */}
      <Text className="text-gray-700 mb-1">Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        className="border border-gray-300 rounded-xl p-3 mb-4 bg-white"
        placeholder="Enter password"
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity
        onPress={SignInwithEmail}
        disabled={loading}
        className="bg-orange-500 rounded-full py-4 mt-2"
      >
        <Text className="text-center text-white font-bold text-lg">
          {loading ? "Logging in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <View className="mt-6 flex-row justify-center">
        <Text className="text-gray-600">New user? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
          <Text className="text-orange-600 font-semibold">
            Create an account
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
