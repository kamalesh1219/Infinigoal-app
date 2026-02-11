import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Download, Gauge, List, LogOut, Signpost, User } from "lucide-react-native";
import { login, register, logout, getCurrentUser } from "@/src/services/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { router } from "expo-router";
import {
  Star,
  Bell,
  Info,
  ChevronRight,
} from "lucide-react-native";

export default function AccountScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const u = await getCurrentUser();
    setUser(u);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  // ======================================================
  //                IF USER LOGGED IN
  // ======================================================
  if (user) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        
       <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 40 }}
       >
      {/* =========================
        TOP ACCOUNT HEADER
        ========================= */}
        <View className="bg-gradient-to-b from-yellow-300 to-white pt-6 pb-10 rounded-b-3xl">

            {/* AVATAR */}
            <View className="items-center mt-4">
              <View className="w-24 h-24 bg-white rounded-full items-center justify-center shadow">
                <User size={42} color="#111827" />
              </View>

              <Text className="mt-4 text-xl font-bold text-gray-900">
                Your account
              </Text>

              <Text className="text-gray-600 mt-1">
                {user.phone || user.email}
              </Text>
            </View>
        </View>

        {/* Menu Box */}
        <View className="bg-white mx-5 p-5 rounded-xl shadow-sm border border-gray-200">

          <TouchableOpacity className="flex-row items-center py-4" onPress={() => router.push("/home")}>
            <Gauge size={22} color="#2563EB" />
            <Text className="text-lg ml-3 text-blue-600 font-semibold flex-1">Dashboard</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
           <View className="h-[1px] bg-gray-100 mx-4" />

          <TouchableOpacity className="flex-row items-center py-4" onPress={() => router.push("/orders")}>
            <List size={22} color="#2563EB" />
            <Text className="text-lg ml-3 text-blue-600 flex-1">Orders</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

            <View className="h-[1px] bg-gray-100 mx-4" />

          <TouchableOpacity className="flex-row items-center py-4" onPress={() => router.push("/address")}>
            <Signpost size={22} color="#2563EB" />
            <Text className="text-lg ml-3 text-blue-600 flex-1">Addresses</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

           <View className="h-[1px] bg-gray-100 mx-4" />

          <TouchableOpacity className="flex-row items-center py-4" onPress={() => router.push("/cart")}>
            <User size={22} color="#2563EB" />
            <Text className="text-lg ml-3 text-blue-600 flex-1">Cart</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

            <View className="h-[1px] bg-gray-100 mx-4" />

          {/* LOGOUT */}
          <TouchableOpacity
            className="flex-row items-center py-4"
            onPress={handleLogout}
          >
            <LogOut size={22} color="#2563EB" />
            <Text className="text-lg ml-3 text-blue-600 flex-1">Log out</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

        </View>

        {/* =========================
          OTHER INFORMATION
        ========================= */}
         <View className="mx-5 mt-6">

              <Text className="text-lg font-bold text-gray-800 mb-3">
                Other Information
              </Text>

              {/* CARD */}
              <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

                {/* ITEM */}
                <TouchableOpacity className="flex-row items-center px-4 py-5">
                  <Star size={22} color="#2563EB" />
                  <Text className="flex-1 ml-4 text-base font-semibold text-blue-600">
                    Suggest Products
                  </Text>
                  <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <View className="h-[1px] bg-gray-100 mx-4" />

                {/* ITEM */}
                <TouchableOpacity className="flex-row items-center px-4 py-5">
                  <Bell size={22} color="#2563EB" />
                  <Text className="flex-1 ml-4 text-base font-semibold text-blue-600">
                    Notifications
                  </Text>
                  <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <View className="h-[1px] bg-gray-100 mx-4" />

                {/* ITEM */}
                <TouchableOpacity className="flex-row items-center px-4 py-5">
                  <Info size={22} color="#2563EB" />
                  <Text className="flex-1 ml-4 text-base font-semibold text-blue-600">
                    General Info
                  </Text>
                  <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>

              </View>

              {/* LOGOUT BUTTON */}
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-white border border-gray-300 rounded-2xl py-4 mt-6 items-center"
              >
                <Text className="text-lg font-semibold text-gray-900">
                  Log Out
                </Text>
              </TouchableOpacity>

              {/* APP VERSION */}
              <View className="items-center mt-6 mb-4">
                <Text className="text-gray-500 text-base">
                  InfiniGoal version 26.1.3
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  v120-8
                </Text>
              </View>

        </View>
      </ScrollView>
    </SafeAreaView>
    );
  }

}
