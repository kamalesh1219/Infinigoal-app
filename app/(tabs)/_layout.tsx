import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/providers/AuthProviders";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { View } from "react-native";

/* 🔹 Animated Icon Component */
function AnimatedTabIcon({
  name,
  color,
  focused,
  iconSize = 24,
}: {
  name: any;
  color: string;
  focused: boolean;
  iconSize?: number;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(focused ? -2 : 0, {
          damping: 14,
          stiffness: 160,
        }),
      },
    ],
    opacity: withTiming(focused ? 1 : 0.75, { duration: 150 }),
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        focused && {
          backgroundColor: "#FFF1E6",
          padding: 6,
          borderRadius: 20,
        },
      ]}
    >
      <Ionicons name={name} size={iconSize} color={color} />
    </Animated.View>
  );
}

export default function TabsLayout() {
  const { session } = useAuth();

  if (!session) {
    return <Redirect href={"/"} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4D7C0F",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 12,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="newhome"
        options={{
          title: "NewHome",
          tabBarIcon: ({ color,size, focused }) => (
              <View
            style={{
              backgroundColor: focused ? "#E6F0C9" : "transparent",
              padding: 8,
              borderRadius: 20,
              width: size + 12,
              height: size + 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          </View>
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size , focused }) => (
              <View
            style={{
              backgroundColor: focused ? "#E6F0C9" : "transparent",
              padding: 8,
              borderRadius: 20,
              width: size + 12,
              height: size + 12,
              justifyContent: "center",
              alignItems: "center",            
            }}
          >
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          </View>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color,size, focused }) => (
              <View
            style={{
              backgroundColor: focused ? "#E6F0C9" : "transparent",
              padding: 8,
              borderRadius: 20,
              width: size + 12,
              height: size + 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={22}
              color={color}
            />
          </View>
          ),
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color,size, focused }) => (
              <View
            style={{
              backgroundColor: focused ? "#E6F0C9" : "transparent",
              padding: 8,
              borderRadius: 20,
              width: size + 12,
              height: size + 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={focused ? "grid" : "grid-outline"}
              size={22}
              color={color}
            />
          </View>
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#E6F0C9" : "transparent",
                padding: 8,
                borderRadius: 20,
                width: size + 12,
                height: size + 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "cart" : "cart-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color,size, focused }) => (
          <View
            style={{
              backgroundColor: focused ? "#E6F0C9" : "transparent",
              padding: 8,
              borderRadius: 20,
              width: size + 12,
              height: size + 12,
              justifyContent: "center",
              alignItems: "center",
               
            }}
          >
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          </View>
            
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color,size, focused }) => (
          <View
            style={{
              backgroundColor: focused ? "#E6F0C9" : "transparent",
              padding: 8,
              borderRadius: 20,
              width: size + 12,
              height: size + 12,
              justifyContent: "center",
              alignItems: "center",
               
            }}
          >
            <Ionicons
              name={focused ? "bag" : "bag-outline"}
              size={22}
              color={color}
            />
          </View>
            
          ),
        }}
      />

    </Tabs>
  );
}

