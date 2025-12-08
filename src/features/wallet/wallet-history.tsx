import { useWalletService, WalletHistory, WalletHistoryItem } from "@/app/api/wallet-service";
import { cn } from "@/shared/lib/utils";
import { useWalletStore } from "@/shared/stores/wallet-store";
import { Button } from "@/shared/ui/button";
import HistoryItem from "@/shared/ui/wallet/history-item";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SectionList, Text, View } from "react-native";

interface FilterType {
    replenishment: boolean;
    writeOff: boolean;
}

interface GroupedHistorySection {
    title: string; // дата в формате dd.mm.yyyy
    data: WalletHistoryItem[];
}

const PAGE_SIZE = 20;

export default function WalletHistoryComponent() {
    const [history, setHistory] = useState<WalletHistory | null>(null);
    const [allItems, setAllItems] = useState<WalletHistoryItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState<FilterType>({
        replenishment: false,
        writeOff: false,
    });
    const balance = useWalletStore((state) => state.balance);
    const walletService = useWalletService();
    const isLoadingRef = useRef(false);

    // Форматирование даты в dd.mm.yyyy
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Группировка элементов по дате
    const groupedSections = useMemo<GroupedHistorySection[]>(() => {
        if (!allItems.length) return [];

        const grouped = allItems.reduce((acc, item) => {
            const dateKey = formatDate(item.createdAt);
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(item);
            return acc;
        }, {} as Record<string, WalletHistoryItem[]>);

        // Сортируем по дате (новые сначала)
        return Object.entries(grouped)
            .sort(([dateA], [dateB]) => {
                const [dayA, monthA, yearA] = dateA.split('.').map(Number);
                const [dayB, monthB, yearB] = dateB.split('.').map(Number);
                const dateObjA = new Date(yearA, monthA - 1, dayA);
                const dateObjB = new Date(yearB, monthB - 1, dayB);
                return dateObjB.getTime() - dateObjA.getTime();
            })
            .map(([title, data]) => ({
                title,
                data: data.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ),
            }));
    }, [allItems]);

    const getHistory = useCallback(async (
        direction: 'All' | 'Credit' | 'Debit',
        pageNumber: number = 1,
        append: boolean = false
    ): Promise<void> => {
        // Защита от множественных одновременных запросов
        if (isLoadingRef.current) return;

        try {
            isLoadingRef.current = true;
            setIsLoading(true);
            const historyResponse = await walletService.getHistory({
                pageNumber,
                pageSize: PAGE_SIZE,
                direction,
            });

            if (append) {
                setAllItems(prev => [...prev, ...historyResponse.items]);
            } else {
                setAllItems(historyResponse.items);
            }

            setHistory(historyResponse);
            setCurrentPage(pageNumber);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
            isLoadingRef.current = false;
        }
    }, []);

    const loadMore = useCallback(() => {
        if (!history?.hasNextPage || isLoading || isLoadingRef.current) return;

        let direction: "All" | "Credit" | "Debit" = "All";
        if ((filter.replenishment && !filter.writeOff)) {
            direction = "Credit";
        }
        if ((!filter.replenishment && filter.writeOff)) {
            direction = "Debit";
        }

        void getHistory(direction, currentPage + 1, true);
    }, [history?.hasNextPage, isLoading, currentPage, filter, getHistory, balance]);

    const changeFilter = (filterButton: 'replenishment' | 'writeOff') => {
        setFilter((prev) => {
            return { ...prev, [filterButton]: !prev[filterButton] }
        })
    }

    useEffect(() => {
        setAllItems([]);
        setCurrentPage(1);
        setHistory(null);

        let direction: "All" | "Credit" | "Debit" = "All";
        if ((filter.replenishment && !filter.writeOff)) {
            direction = "Credit";
        }
        if ((!filter.replenishment && filter.writeOff)) {
            direction = "Debit";
        }

        const fetchHistory = async () => {
            if (isLoadingRef.current) return;

            try {
                isLoadingRef.current = true;
                setIsLoading(true);
                const historyResponse = await walletService.getHistory({
                    pageNumber: 1,
                    pageSize: PAGE_SIZE,
                    direction,
                });

                setAllItems(historyResponse.items);
                setHistory(historyResponse);
                setCurrentPage(1);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
                isLoadingRef.current = false;
            }
        };

        void fetchHistory();
    }, [filter, walletService]);

    const renderSectionHeader = ({ section }: { section: GroupedHistorySection }) => (
        <View className="bg-gray-50 px-4 py-2">
            <Text className="text-sm font-semibold text-gray-700">{section.title}</Text>
        </View>
    );

    const renderItem = ({ item }: { item: WalletHistoryItem }) => (
        <HistoryItem item={item} />
    );

    return (
        <View className={cn("flex-col flex-1", !allItems.length && 'items-center justify-center')}>

            <View className="w-full flex-row mb-4 px-4 gap-3">
                <Button className={cn('flex-1 h-12 rounded-2xl bg-primary/25', filter.replenishment && 'bg-primary')} onPress={() => {
                    changeFilter('replenishment')
                }}>
                    <Text className={cn('text-base font-semibold', filter.replenishment ? 'text-primary-foreground' : 'text-gray-900')}>Replenishment</Text>
                </Button>
                <Button className={cn('flex-1 h-12 rounded-2xl bg-primary/25', filter.writeOff && 'bg-primary')} onPress={() => {
                    changeFilter('writeOff')
                }}>
                    <Text className={cn('text-base font-semibold', filter.writeOff ? 'text-primary-foreground' : 'text-gray-900')}>Write-off</Text>
                </Button>
            </View>

            <View className="w-full flex-1">
                {!allItems.length && !isLoading && (
                    <View className="flex-1 items-center justify-center px-4">
                        <Text className="text-base text-gray-500 text-center">
                            Here you will find the history of deposits and withdrawals.
                        </Text>
                    </View>
                )}
                {!!allItems.length && !isLoading && <SectionList
                    sections={groupedSections}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    keyExtractor={(item) => item.id}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        isLoading ? (
                            <View className="py-8">
                                <Text className="text-center text-gray-500">Loading...</Text>
                            </View>
                        ) : <Text></Text>
                    }
                />}
            </View>
        </View>
    )
}