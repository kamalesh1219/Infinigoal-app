import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";


const categories = [
  {
    id: "1",
    title: "Organic Ghee",
    imageUrl:
      "https://www.canva.com/design/DAG-Y0O73Rs/Hu8UvvLWzvgVigTlfjx3tQ/edit?ui=eyJBIjp7Ik8iOnsiQiI6dHJ1ZX19LCJGIjp7fX0",
    bg: "bg-black", 
  },
  {
    id: "2",
    title: "Chekku Oil",
    imageUrl: "https://media.canva.com/v2/image-resize/format:PNG/height:1600/quality:100/uri:ifs%3A%2F%2FM%2F73c4cc8f-5ce9-401a-9616-8459893e0c2d/watermark:F/width:1261?csig=AAAAAAAAAAAAAAAAAAAAAP-5DsP3ayzLmU9YLvkkxoIy4LKie3NMlpByXySmC5au&exp=1768406073&osig=AAAAAAAAAAAAAAAAAAAAAJGY2jw_eJGkNKjQWksjLDP1RnOxS0AzPrGSsO3sTm3s&signer=media-rpc&x-canva-quality=screen_2x",
    bg: "bg-sky-200",
  },
  {
    id: "3",
    title: "Dry-Fruits",
    imageUrl: "https://infinigoal.in/wp-content/uploads/2025/08/Premium-Dry-Fruits.png",
    bg: "bg-blue-200",
  },
  {
    id: "4",
    title: "Brown-Sugar",
    imageUrl: "https://infinigoal.in/wp-content/uploads/2025/08/Organic-Brown-Sugar.png",
    bg: "bg-red-300", 
  },
  { 
    id: "5",
    title: "kerala spices",
    imageUrl: "https://infinigoal.in/wp-content/uploads/2025/08/Premium-Dry-Seeds-2.png",
    bg: "bg-blue-200",
  },
  {
    id: "6",
    title: "Organic-Brown",
    imageUrl: "https://infinigoal.in/wp-content/uploads/2025/08/Organic-Brown-Sugar.png",
    bg: "bg-sky-200",
  },
];

export default function Iphonecategories() {
  return (
    <View className="mt-4 mb-6">
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
            <View className="mr-4">

          {/* Outer Blue Border */}
          <View className="border-4 border-blue-500 rounded-[32px] p-1">

            {/* iPhone Body */}
            <View className={`w-36 h-48 rounded-[28px] ${item.bg} overflow-hidden`}>

              {/* Featured Badge */}
              <View className="bg-white px-3 py-1 rounded-t-sm rounded-xl self-center">
                <Text className="text-red-500 text-xs font-semibold">
                  Featured
                </Text>
              </View>

              {/* Content */}
              <View className="flex-1 items-center justify-center px-2">
                <Text className="text-white text-base font-bold text-center mb-3">
                  {item.title}
                </Text>

                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-28 h-28"
                  resizeMode="contain"
                />
              </View>

            </View>
          </View>

        </View>
        )}
      />
    </View>
  );
}
