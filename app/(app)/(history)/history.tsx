import { RentalHistoryItem, useRentalsService } from "@/app/api/rentals-service";
import { RentalHistoryComponent } from "@/features/rent";
import { Loader } from "@/shared/ui/loader";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 20;

export default function History() {
    const rentalsService = useRentalsService();
    const [history, setHistory] = useState<RentalHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            const historyResponse = await rentalsService.getRentalHistory({
                pageNumber: 1,
                pageSize: PAGE_SIZE,
            });
            setHistory(historyResponse.items);
            setHasNextPage(historyResponse.hasNextPage);
            setPageNumber(1);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = useCallback(async () => {
        if (!hasNextPage || isLoadingMore || isLoading) {
            return;
        }

        setIsLoadingMore(true);
        try {
            const nextPage = pageNumber + 1;
            const historyResponse = await rentalsService.getRentalHistory({
                pageNumber: nextPage,
                pageSize: PAGE_SIZE,
            });

            setHistory(prev => [...prev, ...historyResponse.items]);
            setHasNextPage(historyResponse.hasNextPage);
            setPageNumber(nextPage);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [hasNextPage, isLoadingMore, isLoading, pageNumber, rentalsService]);

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        );
    };

    const renderEmpty = () => {
        if (isLoading) return null;
        return (
            <View className="flex-1 items-center justify-center py-8">
                <Text className="text-gray-500">No history found</Text>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white pt-4 items-center justify-start">
            <ScreenTitle title="History" />
            {isLoading && history.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                    <Loader />
                </View>
            ) : (
                <View className="w-full h-full p-4">
                    <FlatList
                        data={history}
                        renderItem={({ item }) => <RentalHistoryComponent item={item} />}
                        keyExtractor={(item) => item.id}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                        ListEmptyComponent={renderEmpty}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        initialNumToRender={10}
                        contentContainerStyle={history.length === 0 ? { flex: 1 } : undefined}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}