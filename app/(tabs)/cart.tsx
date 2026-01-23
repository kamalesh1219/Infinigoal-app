import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Book, Bookmark, ListOrdered, LucideListOrdered, ShipIcon, ShoppingBasket, ShoppingBasketIcon, ShoppingCart } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { useCart } from "@/providers/CartProvider";
import { supabase } from "@/src/lib/supabase";
import { getCurrentUser } from "@/src/services/auth";



export default function CartPage() {
  const { cart, addToCart, decrementQty ,removeFromCart, clearCart, } = useCart();
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const itemTotal = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const mrpTotal = cart.reduce(
    (sum, i) => sum + i.mrp * i.qty, 0);
    console.log("MRP TOTAL:", mrpTotal);

  const savings = mrpTotal - itemTotal;

  cart.forEach((i) => {
  console.log("CART ITEM:", i.name, "MRP:", i.mrp);
  });
  
  /* ================= ADDRESS ================= */
  async function loadSelectedAddress() {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("is_default", true)
      .single();

    if (!error) {
      setSelectedAddress(data);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadSelectedAddress();
    }, [])
  );

  /* ================= PLACE ORDER ================= */
   const placeOrder = async () => {
    try{
      const user = await getCurrentUser();
        if (!user){
          Alert.alert("Login required", "Please login to place order");
          return;
        }
        if (!selectedAddress) {
          Alert.alert("Select Address", "Please select delivery address");
          return;
      }

    if (cart.length === 0) {
        Alert.alert("Cart empty");
        return;
      }

   setPlacingOrder(true);
   
  /* 1️⃣ CREATE ORDER */
  const { data:order ,error:orderError } = await supabase 
   .from("orders")
   .insert([
    {
      user_id: user.id,
      total_amount: itemTotal,
      status: "placed",
    },
   ])
   .select()
   .single();
   
   if (orderError) {
      console.log(orderError);
      Alert.alert("Order failed");
      setPlacingOrder(false);
    return;
   }
   
   /* 2️⃣ ORDER ITEMS */
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        mrp: item.mrp,
        qty: item.qty,
        image_url: item.image_url,
      }));
     
    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.log(itemsError);
        Alert.alert("Failed to save order items");
        setPlacingOrder(false);
        return;
      }


   /* 3️⃣ CLEAR CART */
    clearCart();

   /* 4️⃣ GO TO ORDERS */
    router.replace("/orders");
  } catch (err) {
      console.log(err);
      Alert.alert("Something went wrong");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-gray-800 text-center">
          Your cart is empty 🛒
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Add groceries now and enjoy  
          exclusive offers only on InfiniGoal.
        </Text>
         <TouchableOpacity
            onPress={() => router.push("/newhome")}
            className="bg-pink-600 px-6 py-3 rounded-full mt-6"
          >
            <Text className="text-white font-bold">
              Shop with InfiniGoal 🛍️
            </Text>
          </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F3F7F4]">
      {/* HEADER */}
      <View className="flex-row items-center px-4 py-3 ">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={26} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-2xl font-bold">
          Cart
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* SAVINGS BAR */}
        <View className="bg-green-100 mx-4 mt-4 rounded-xl px-4 py-3">
          <Text className="text-green-700 font-semibold">
            Yay! You saved ₹{savings} on this order
          </Text>
        </View>

        {/* CART ITEMS */}
        <View className="bg-white mx-4 mt-4 rounded-xl">
          {cart.map((prod) => (
            <View
              key={prod.id}
              className="flex-row items-center px-4 py-4 border-b border-gray-100"
            >
              <Image
                source={{ uri: prod.image_url }}
                className="w-20 h-20"
                resizeMode="contain"
              />

              <View className="flex-1 ml-3">
                <Text className="font-semibold">
                  {prod.name}
                </Text>
                <Text className="text-xs text-gray-500">
                  1 pack
                </Text>

                <View className="flex-row items-center mt-1">
                  <Text className="text-green-700 font-bold mr-2">
                    ₹{prod.price}
                  </Text>
                  <Text className="text-gray-400 line-through text-xs">
                    ₹{prod.mrp}  
                  </Text>
                </View>
              </View>

              {/* QTY CONTROLLER */}
              <View className="flex-row items-center border border-pink-300 rounded-lg">
                <TouchableOpacity
                  onPress={() =>
                    prod.qty === 1
                      ? removeFromCart(prod.id)
                      : decrementQty(prod.id) 
                  }
                  className="px-3 py-1"
                >
                  <Text className="text-pink-600 text-lg">−</Text>
                </TouchableOpacity>

                <Text className="px-2 font-bold">
                  {prod.qty}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    addToCart({
                      id: prod.id,
                      name: prod.name,
                      price: prod.price,
                      mrp: prod.mrp,       
                      image_url: prod.image_url,
                    })
                  }
                  className="px-3 py-1"
                >
                  <Text className="text-pink-600 text-lg">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* BILL SUMMARY */}
        <View className="bg-white mx-4 mt-4 rounded-xl px-4 py-4">
          <View className="flex-row  mb-3">
            <View className="border border-gray-200 px-2 py-2 rounded-md"><Bookmark size={24} color="black"/></View>
            <Text className="font-extrabold mb-3 mt-2 ml-3">Bill Summary</Text>
          </View>

          <View className="flex-row justify-between mb-2 mt-3">
            <Text className="text-gray-500 font-medium">Item Total </Text>
             <View className="flex-row items-center">
              <Text className="text-gray-400 line-through mr-4">₹{mrpTotal}</Text>
              <Text className="font-semibold">₹{itemTotal}</Text>
             </View>
          </View>

          <View className="flex-row justify-between mb-2 mt-4">
            <Text className="text-gray-500">Delivery Fee </Text>
            <View className="flex-row items-center">
             <Text className="text-gray-400 line-through mr-4">₹10</Text>
             <Text className="text-green-600 font-semibold">
               FREE
             </Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-2 mt-4">
            <Text className="text-gray-500">Handling Fee </Text>
            <View className="flex-row items-center">
              <Text className="text-gray-400 line-through mr-4">₹30</Text>
              <Text className="text-green-600 font-semibold">
                FREE
              </Text>
            </View>
          </View>

          <View className="border-t border-gray-200 my-3" />

          <View className="flex-row justify-between my-2">
            <Text className="font-bold text-lg">To Pay </Text>
            <Text className="font-bold text-lg">
              ₹{itemTotal}
            </Text>
          </View>
 
          {/* SAVINGS */}
        <View className="bg-green-100  mt-2 rounded-xl px-4 py-4">
          <View className="flex-row justify-between">
            <Text className="font-semibold">
              Savings on this order
            </Text>
            <Text className="font-bold text-green-700">
              ₹{savings}
            </Text>
          </View>
        </View>

        </View>

       

        {/* SELECTED ADDRESS */}
        {selectedAddress && (
          <View className="bg-white mx-4 mt-4 rounded-xl p-4 border border-green-300">
            <View className="flex-row justify-between items-center">
              <View className="flex-row mb-2">
                <View className="border border-gray-200 px-2 py-2 rounded-md"><ShoppingCart size={24} color="black"/></View>
                <Text className="font-extrabold mb-3 mt-2 ml-3">Deliver To</Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/address")}
              >
                <Text className="text-pink-600 font-semibold">
                  Change
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="mt-2 font-semibold">
              {selectedAddress.name}
            </Text>

            <Text className="text-gray-700 mt-2">
              {selectedAddress.address_line}, {selectedAddress.city} – {selectedAddress.pincode}
            </Text>

            <Text className="text-gray-500 mt-2">
              📞 {selectedAddress.phone}
            </Text>
          </View>
        )}
      </ScrollView>

     {/* BOTTOM CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4 border-t border-gray-200">

        {!selectedAddress ? (
          <TouchableOpacity
            onPress={() => router.push("/address")}
            className="bg-pink-600 py-4 rounded-xl"
          >
            <Text className="text-white text-center font-bold text-lg">
              Select Address
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={placeOrder}
            disabled={placingOrder}
            className="bg-pink-600 py-4 rounded-xl"
          >
            <Text className="text-white text-center font-bold text-lg">
              {placingOrder ? "Placing Order..." : "Place Order"}
            </Text>
          </TouchableOpacity>
        )}

      </View>  

    </SafeAreaView>
  );
}