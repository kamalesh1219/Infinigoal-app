import { supabase } from "@/src/lib/supabase";
import { openCategory } from "@/src/utils/navigation";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SignatureItem = {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  display_order: number;
};

export default function TrySignature() {
  const { width: screenWidth } = Dimensions.get("window");
  const CARD_SIZE = screenWidth / 3 - 24;

  const [signatureCards, setSignatureCards] = useState<SignatureItem[]>([]);
  const [sigLoading, setSigLoading] = useState(true);

  const loadSignatureCards = async () => {
    setSigLoading(true);

    const { data, error } = await supabase
      .from("category_items")
      .select("id,title,slug,image_url,display_order")
      .eq("category_group_name", "InfiniGoal Signature")
      .eq("card_type", "signature")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setSignatureCards(data);
    }

    setSigLoading(false);
  };

  useEffect(() => {
    loadSignatureCards();
  }, []);

  return (
    <View className="mt-10 px-4">
      {/* Title */}
      <Text className="text-xl font-semibold mb-4 mx-4"> 
        InfiniGoal Signatures 
      </Text>

      {sigLoading ? (
        <View className="py-10 items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View className="flex-row flex-wrap justify-between">
          {signatureCards.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => openCategory(item.slug)}
              activeOpacity={0.85}
              style={{ width: CARD_SIZE }}
              className="mb-6 items-center"
            >
              {/* Card */}
              <View
                className="bg-[#FFFDF5] rounded-2xl items-center justify-center"
                style={{
                  width: CARD_SIZE,
                  height: CARD_SIZE,
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 3,
                }}
              >
                <Image
                  source={{ uri: item.image_url }}
                  style={{
                    width: CARD_SIZE * 0.85,
                    height: CARD_SIZE * 0.85,
                  }}
                  resizeMode="contain"
                />
              </View>

              {/* Label */}
              <Text
                className="text-center text-base font-semibold mt-2"
                numberOfLines={2}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
