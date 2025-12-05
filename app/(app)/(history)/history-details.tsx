import { RentalHistoryItem, useRentalsService } from "@/app/api/rentals-service";
import { PRICE } from "@/shared/lib/mocks";
import { THEME } from "@/shared/lib/theme";
import { Button } from "@/shared/ui/button";
import { Loader } from "@/shared/ui/loader";
import { Image } from "expo-image";
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
                    <View className="mx-4 mt-4 mb-4 bg-white rounded-2xl p-4 shadow-sm"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
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
                            <View className="flex-row items-center ml-4">
                                <Text className="text-lg font-bold text-gray-900">
                                    {totalCost}
                                </Text>
                                <Image
                                    source={require('@/shared/assets/images/dirham-icon.png')}
                                    style={{ width: 14, height: 14, marginLeft: 4 }}
                                    contentFit="contain"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Detailed Breakdown Card */}
                    <View className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        {/* Start/Completion Times */}
                        <View className="mb-4 pb-4 border-b border-gray-200">
                            <View className="flex-row justify-between items-center py-2">
                                <Text className="text-base font-medium text-gray-700">
                                    Start
                                </Text>
                                <Text className="text-base font-medium text-gray-900">
                                    {startTime}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center py-2">
                                <Text className="text-base font-medium text-gray-700">
                                    Completion
                                </Text>
                                <Text className="text-base font-medium text-gray-900">
                                    {endTime}
                                </Text>
                            </View>
                        </View>

                        {/* Pricing Breakdown */}
                        <View className="mb-4 pb-4 border-b border-gray-200">
                            <View className="flex-row justify-between items-center py-2">
                                <Text className="text-base font-medium text-gray-700">
                                    First hour
                                </Text>
                                <View className="flex-row items-center">
                                    <Image
                                        source={require('@/shared/assets/images/dirham-icon.png')}
                                        style={{ width: 12, height: 12 }}
                                        contentFit="contain" />
                                    <Text className="text-base font-medium text-gray-900 ml-1">
                                        {firstHourCost}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex-row justify-between items-center py-2">
                                <Text className="text-base font-medium text-gray-700">
                                    Remaining 23 hours
                                </Text>
                                <View className="flex-row items-center">
                                    <Image
                                        source={require('@/shared/assets/images/dirham-icon.png')}
                                        style={{ width: 12, height: 12 }}
                                        contentFit="contain" />
                                    <Text className="text-base font-medium text-gray-900 ml-1">
                                        {remainingHoursCost}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Total */}
                        <View className="mb-4 pb-4 border-b border-gray-200">
                            <View className="flex-row justify-between items-center py-2">
                                <Text className="text-base font-bold text-gray-900">
                                    Total
                                </Text>
                                <View className="flex-row items-center">
                                    <Image
                                        source={require('@/shared/assets/images/dirham-icon.png')}
                                        style={{ width: 12, height: 12 }}
                                        contentFit="contain" />
                                    <Text className="text-lg font-bold text-gray-900 ml-1">
                                        {totalCost}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Payment Details */}
                        <View>
                            <View className="flex-row justify-between items-center py-2">
                                <Text className="text-base font-medium text-gray-700">
                                    Paid with bonuses
                                </Text>
                                <View className="flex-row items-center">
                                    <Image
                                        source={require('@/shared/assets/images/dirham-icon.png')}
                                        style={{ width: 12, height: 12 }}
                                        contentFit="contain" />
                                    <Text className="text-base font-medium text-gray-900 ml-1">
                                        {paidWithBonuses}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex-row justify-between items-center py-2">
                                <Text className="text-base font-medium text-gray-700">
                                    Paid with card
                                </Text>
                                <View className="flex-row items-center">
                                    <Image
                                        source={require('@/shared/assets/images/dirham-icon.png')}
                                        style={{ width: 12, height: 12 }}
                                        contentFit="contain" />
                                    <Text className="text-base font-medium text-gray-900 ml-1">
                                        {paidWithCard}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
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

