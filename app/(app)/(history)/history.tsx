import { RentalHistoryItem, useRentalsService } from "@/app/api/rentals-service";
import { THEME } from "@/shared/lib/theme";
import { Loader } from "@/shared/ui/loader";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { Card, CardContent } from "@/shared/ui/card";
import { router } from "expo-router";
import { QrCode, Zap } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 20;

interface GroupedHistorySection {
    month: string;
    year: number;
    data: RentalHistoryItem[];
}

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

    // Group history by month
    const groupedHistory = useMemo(() => {
        const groups: { [key: string]: RentalHistoryItem[] } = {};

        history.forEach(item => {
            const date = new Date(item.endTime || item.startTime);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

            if (!groups[monthKey]) {
                groups[monthKey] = [];
            }
            groups[monthKey].push(item);
        });

        // Convert to array and sort by date (newest first)
        const sections: GroupedHistorySection[] = Object.entries(groups)
            .map(([key, items]) => {
                const [year, month] = key.split('-').map(Number);
                return {
                    month: new Date(year, month).toLocaleString('en-US', { month: 'long' }),
                    year,
                    data: items.sort((a, b) => {
                        const dateA = new Date(b.endTime || b.startTime);
                        const dateB = new Date(a.endTime || a.startTime);
                        return dateA.getTime() - dateB.getTime();
                    })
                };
            })
            .sort((a, b) => {
                if (a.year !== b.year) return b.year - a.year;
                const monthA = new Date(a.year, new Date(`${a.month} 1, ${a.year}`).getMonth());
                const monthB = new Date(b.year, new Date(`${b.month} 1, ${b.year}`).getMonth());
                return monthB.getTime() - monthA.getTime();
            });

        return sections;
    }, [history]);

    const formatHistoryDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day} ${month}, ${hours}:${minutes}`;
    };

    const handleItemPress = (item: RentalHistoryItem) => {
        router.push({
            pathname: "/(app)/(history)/history-details",
            params: { rentalId: item.id }
        });
    };

    const renderHistoryItem = ({ item }: { item: RentalHistoryItem }) => {
        const displayDate = formatHistoryDate(item.endTime || item.startTime);
        const identifier = item.orderNumber || `# ${item.powerBankDeviceId}`;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleItemPress(item)}
                className="mb-3"
            >
                <Card variant="elevated" className="mx-1">
                    <CardContent>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center flex-1">
                                {/* Icon */}
                                <View className="mr-4">
                                    <Zap
                                        size={24}
                                        color={THEME.light.primary}
                                    />
                                </View>

                                {/* Date and Identifier */}
                                <View className="flex-1">
                                    <Text className="text-base font-medium text-gray-900 mb-1">
                                        {displayDate}
                                    </Text>
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-sm text-gray-500">
                                            {identifier}
                                        </Text>
                                        {item.powerBankDeviceId && (
                                            <QrCode size={12} color="#9CA3AF" />
                                        )}
                                    </View>
                                </View>
                            </View>

                            {/* Amount */}
                            <Text className="text-sm font-medium text-gray-900 ml-4">
                                {item.cost} AED
                            </Text>
                        </View>
                    </CardContent>
                </Card>
            </TouchableOpacity>
        );
    };

    const renderSectionHeader = ({ section }: { section: GroupedHistorySection }) => {
        const capitalizedMonth = section.month.charAt(0).toUpperCase() + section.month.slice(1);
        return (
            <View className="px-4 py-3 bg-white">
                <Text className="text-sm font-medium text-gray-500">
                    {capitalizedMonth}
                </Text>
            </View>
        );
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color={THEME.light.primary} />
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

    // Flatten grouped data for FlatList
    const flatData = useMemo(() => {
        const result: Array<{ type: 'header' | 'item'; section?: GroupedHistorySection; item?: RentalHistoryItem }> = [];

        groupedHistory.forEach(section => {
            result.push({ type: 'header', section });
            section.data.forEach(item => {
                result.push({ type: 'item', section, item });
            });
        });

        return result;
    }, [groupedHistory]);

    const renderItem = ({ item }: { item: typeof flatData[0] }) => {
        if (item.type === 'header' && item.section) {
            const capitalizedMonth = item.section.month.charAt(0).toUpperCase() + item.section.month.slice(1);
            return (
                <View className="px-4 py-3 bg-white">
                    <Text className="text-sm font-medium text-gray-500">
                        {capitalizedMonth}
                    </Text>
                </View>
            );
        }

        if (item.type === 'item' && item.item) {
            return renderHistoryItem({ item: item.item });
        }

        return null;
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 pt-4">
                <ScreenTitle title="History" />
            </View>

            {isLoading && history.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                    <Loader />
                </View>
            ) : (
                <View className="flex-1 px-4">
                    <FlatList
                        data={flatData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => {
                            if (item.type === 'header') {
                                return `header-${item.section?.month}-${item.section?.year}`;
                            }
                            return `item-${item.item?.id}-${index}`;
                        }}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                        ListEmptyComponent={renderEmpty}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        initialNumToRender={10}
                        contentContainerStyle={history.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}
