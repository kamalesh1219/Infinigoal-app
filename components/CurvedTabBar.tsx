import React from "react";
import { View, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export default function CurvedTabBar({ state, navigation }: any) {
  const iconMap: Record<string, IoniconName> = {
    newhome: "home-outline",
    account: "person-outline",
    search: "search-outline",
    categories: "grid-outline",
    hotdeals: "flame-outline",
    home: "home-outline",
  };

  return (
    <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
      {/* CURVED BACKGROUND */}
      <Svg width="100%" height={80} viewBox="0 0 375 80">
        <Path
          d="
            M0 0 
            H140 
            C155 0 160 30 187.5 30 
            C215 30 220 0 235 0 
            H375 
            V80 
            H0 
            Z
          "
          fill="#61C96F"
        />
      </Svg>

      {/* TAB ICONS */}
      <View
        style={{
          position: "absolute",
          bottom: 18,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;

          // 🔥 CENTER TAB (Search as floating button)
          if (route.name === "search") {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                style={{
                  backgroundColor: "#F59E0B",
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 30,
                }}
              >
                <Ionicons name="search" size={26} color="#fff" />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
            >
              <Ionicons
                name={iconMap[route.name]}
                size={22}
                color={focused ? "#14532D" : "#E5FBE8"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
