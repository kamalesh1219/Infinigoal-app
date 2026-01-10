import { Link } from "expo-router";
import { View, Text, TouchableOpacity, TextInput} from "react-native";
 
export default function Footer() {
    return(
      <View className="bg-black mt-20 px-8">
        <View className="mb-8 mt-14"> 
           <Text className="text-white font-medium text-lg ">Grocery Items</Text> 
           <Text className="text-white mt-4">This is the Grocery items super store </Text>      
        </View>
        
        <View className="mb-8">
         <Text className="text-white font-medium text-lg mb-5">Shop</Text> 
          <Link href={'/'} className="py-2 hover:text-blue-600">
             <Text className="text-white text-sm pb-5 ">About Us</Text>
           </Link> 
           <Link href={'/'} className="py-2 hover:text-blue-600">
             <Text className="text-white text-sm  hover:text-blue-600">Privacy policy</Text>
           </Link> 
           <Link href={'/'} className="py-2 hover:text-blue-600">
             <Text className="text-white text-sm hover:text-blue-600">Refund and Return policy</Text>
           </Link> 
           <TouchableOpacity className="py-2 hover:text-blue-600">
              <Text className="text-white text-sm ">Contact Us</Text>
            </TouchableOpacity>
        </View>

         <View className="mb-8">
            <Text className="text-white font-medium text-lg mb-5">My Account</Text>            
            <TouchableOpacity className="py-2 hover:text-blue-600">
                <Text className="text-white text-sm ">my account</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-2 hover:text-blue-600">
                <Text className="text-white text-sm ">Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-2 hover:text-blue-600">
                <Text className="text-white text-sm ">Last Password</Text>
            </TouchableOpacity>
        </View>

        <View className="mb-8">
            <Text className="text-white font-medium text-lg ">NewsLetter</Text>  
            <TextInput
            className="bg-white w-[70%] h-[10%] mb-4 mt-5"
            placeholder="Your email address"
            />
            <TextInput
            className="bg-white w-[70%] h-[10%]"
            placeholder="sign up"
            />
        </View>
      </View>
    );
} 