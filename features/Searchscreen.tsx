import { Text, View } from "react-native";
import SearchResults from "@/features/SearchResults";
import { useHomeSearch } from "@/hooks/useHomeSearch";

type Props = {
  search: string;
};

export default function Searchscreen({ search }: Props) {
  const {
    products,
    categories,
    loading,
    isSearching,
  } = useHomeSearch(search);

  if (!isSearching) return null;

  return (
    <View>
      {loading && (
        <Text className="text-gray-400 px-4 mt-2">
          Searching...
        </Text>
      )}

      {!loading && (products.length > 0 || categories.length > 0) && (
        <SearchResults
          products={products}
          categories={categories}
          query={search}
        />
      )}

      {!loading &&
        products.length === 0 &&
        categories.length === 0 && (
          <Text className="text-gray-400 px-4 mt-3">
            No results found
          </Text>
        )}
    </View>
  );
}
