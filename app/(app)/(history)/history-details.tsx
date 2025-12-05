import { RentalHistoryItem, useRentalsService } from "@/app/api/rentals-service";
import { PRICE } from "@/shared/lib/mocks";
import { THEME } from "@/shared/lib/theme";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardRow } from "@/shared/ui/card";
import { CurrencyAmount } from "@/shared/ui/currency-amount";
import { Loader } from "@/shared/ui/loader";
import { router, useLocalSearchParams } from "expo-router";
import { Zap } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryDetails() {
    const { rentalId } = useLocalSearchParams<{ rentalId: string }>();
    const rentalsService = useRentalsService();
    const [rental, setRental] = useState<RentalHistoryItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (rentalId) {
            loadRentalDetails();
        }
    }, [rentalId]);

    const loadRentalDetails = async () => {
        try {
            setIsLoading(true);
            // Try to get from history first
            const historyResponse = await rentalsService.getRentalHistory({
                pageNumber: 1,
                pageSize: 100, // Get more items to find the one we need
            });

            const foundRental = historyResponse.items.find((item: RentalHistoryItem) => item.id === rentalId);
            if (foundRental) {
                setRental(foundRental);
            } else {
                // If not found in history, try to get by ID (might be active rental)
                try {
                    const rentalData = await rentalsService.getRentalById(rentalId);
                    if (rentalData) {
                        const historyItem: RentalHistoryItem = {
                            id: rentalData.id,
                            orderNumber: rentalData.orderNumber,
                            startTime: rentalData.startTime,
                            endTime: new Date().toISOString(),
                            durationMinutes: 0,
                            cost: rentalData.currentCost || 0,
                            powerBankDeviceId: rentalData.powerBankDeviceId,
                        };
                        setRental(historyItem);
                    }
                } catch (error) {
                    console.error('Error loading rental details', error);
                }
            }
        } catch (error) {
            console.error('Error loading rental details', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day} ${month}, ${hours}:${minutes}`;
    };

    const formatTime = (isoDate: string): string => {
        const date = new Date(isoDate);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleClose = () => {
        router.back();
    };

    if (isLoading || !rental) {
        return (
            <View className="flex-1 items-center justify-center bg-transparent">
                <Loader />
            </View>
        );
    }

    // Calculate pricing breakdown
    const firstHourCost = PRICE.firstHour;
    const remainingHoursCost = PRICE.remaining23Hours;
    const totalCost = rental.cost || (firstHourCost + remainingHoursCost);

    // For now, assume paid with bonuses (you can get this from API)
    const paidWithBonuses = totalCost;
    const paidWithCard = 0;

    const displayDate = formatDate(rental.endTime || rental.startTime);
    const identifier = rental.orderNumber || `# ${rental.powerBankDeviceId}`;
    const startTime = formatTime(rental.startTime);
    const endTime = formatTime(rental.endTime || rental.startTime);

    return (
        <View className="flex-1 bg-transparent">
            <SafeAreaView className="flex-1">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    className="flex-1"
                >
                    {/* Summary Card */}
                    <Card variant="elevated" className="mx-4 mt-4 mb-4">
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
                                        <Text className="text-sm text-gray-500">
                                            {identifier}
                                        </Text>
                                    </View>
                                </View>

                                {/* Amount */}
                                <CurrencyAmount
                                    amount={totalCost}
                                    size="md"
                                    variant="bold"
                                    className="ml-4"
                                />
                            </View>
                        </CardContent>
                    </Card>

                    {/* Detailed Breakdown Card */}
                    <Card variant="elevated" className="mx-4 mb-4">
                        <CardContent className="p-0">
                            {/* Start/Completion Times */}
                            <View className="px-4 pt-4 pb-4 border-b border-gray-200">
                                <CardRow className="py-2 px-0">
                                    <Text className="text-base font-medium text-gray-700">
                                        Start
                                    </Text>
                                    <Text className="text-base font-medium text-gray-900">
                                        {startTime}
                                    </Text>
                                </CardRow>
                                <CardRow className="py-2 px-0 border-0">
                                    <Text className="text-base font-medium text-gray-700">
                                        Completion
                                    </Text>
                                    <Text className="text-base font-medium text-gray-900">
                                        {endTime}
                                    </Text>
                                </CardRow>
                            </View>

                            {/* Pricing Breakdown */}
                            <View className="px-4 py-4 border-b border-gray-200">
                                <CardRow className="py-2 px-0">
                                    <Text className="text-base font-medium text-gray-700">
                                        First hour
                                    </Text>
                                    <CurrencyAmount amount={firstHourCost} size="sm" />
                                </CardRow>
                                <CardRow className="py-2 px-0 border-0">
                                    <Text className="text-base font-medium text-gray-700">
                                        Remaining 23 hours
                                    </Text>
                                    <CurrencyAmount amount={remainingHoursCost} size="sm" />
                                </CardRow>
                            </View>

                            {/* Total */}
                            <View className="px-4 py-4 border-b border-gray-200">
                                <CardRow className="py-2 px-0 border-0">
                                    <Text className="text-base font-bold text-gray-900">
                                        Total
                                    </Text>
                                    <CurrencyAmount amount={totalCost} size="md" variant="bold" />
                                </CardRow>
                            </View>

                            {/* Payment Details */}
                            <View className="px-4 pt-4 pb-4">
                                <CardRow className="py-2 px-0">
                                    <Text className="text-base font-medium text-gray-700">
                                        Paid with bonuses
                                    </Text>
                                    <CurrencyAmount amount={paidWithBonuses} size="sm" />
                                </CardRow>
                                <CardRow className="py-2 px-0 border-0">
                                    <Text className="text-base font-medium text-gray-700">
                                        Paid with card
                                    </Text>
                                    <CurrencyAmount amount={paidWithCard} size="sm" />
                                </CardRow>
                            </View>
                        </CardContent>
                    </Card>
                </ScrollView>

                {/* Close Button */}
                <View className="px-4 pb-6">
                    <Button
                        className="w-full h-14 rounded-2xl bg-primary"
                        onPress={handleClose}
                    >
                        <Text className="text-lg font-semibold text-primary-foreground">
                            Close
                        </Text>
                    </Button>
                </View>
            </SafeAreaView>
        </View>
    );
}

