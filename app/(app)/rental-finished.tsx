import { RentalHistoryItem, useRentalsService } from "@/app/api/rentals-service";
import { PRICE } from "@/shared/lib/mocks";
import { Button } from "@/shared/ui/button";
import { Loader } from "@/shared/ui/loader";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RentalFinished() {
    const { rentalId } = useLocalSearchParams<{ rentalId: string }>();
    const rentalsService = useRentalsService();
    const [rental, setRental] = useState<RentalHistoryItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (rentalId) {
            try {
                setIsLoading(true);
                // Get rental from history or by ID
                rentalsService.getRentalById(rentalId).then((rentalData) => {
                    // If it's a finished rental, convert to RentalHistoryItem format
                    // For now, we'll use the rental data and calculate costs
                    if (rentalData) {
                        const finishedRental: RentalHistoryItem = {
                            id: rentalData.id,
                            orderNumber: rentalData.orderNumber,
                            startTime: rentalData.startTime,
                            endTime: new Date().toISOString(), // This should come from API
                            durationMinutes: 0, // Calculate from startTime and endTime
                            cost: rentalData.currentCost || 0,
                            powerBankDeviceId: rentalData.powerBankDeviceId,
                        };
                        setRental(finishedRental);
                    }
                    setIsLoading(false);
                }).catch(() => {
                    // If not found, try to get from history
                    rentalsService.getRentalHistory().then((history) => {
                        const foundRental = history.items.find((item: RentalHistoryItem) => item.id === rentalId);
                        if (foundRental) {
                            setRental(foundRental);
                        }
                        setIsLoading(false);
                    });
                });
            } catch (error) {
                console.error('Error getting rental', error);
                setIsLoading(false);
            }
        }
    }, [rentalId]);

    const handleOkay = () => {
        router.replace("/(app)/home");
    };

    if (isLoading || !rental) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
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

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                className="flex-1"
            >
                {/* Draggable handle */}
                <View className="w-full items-center pt-2 pb-4">
                    <View className="w-12 h-1 bg-gray-300 rounded-full" />
                </View>

                {/* Title */}
                <View className="px-6 pb-6">
                    <Text className="text-2xl font-bold text-gray-900">
                        Power bank returned
                    </Text>
                </View>

                {/* Charge Summary */}
                <View className="px-6 pb-6">
                    <View className="bg-gray-50 rounded-2xl p-4">
                        {/* First hour */}
                        <View className="flex-row justify-between items-center py-4 pt-2 border-b border-gray-200">
                            <Text className="text-base font-medium text-gray-900">
                                First hour
                            </Text>
                            <View className="flex-row items-center">
                                <Image
                                    source={require('@/shared/assets/images/dirham-icon.png')}
                                    style={{ width: 12, height: 12 }}
                                    contentFit="contain" />
                                <Text className="text-base font-semibold text-gray-900 ml-1">
                                    {firstHourCost}
                                </Text>
                            </View>
                        </View>

                        {/* Remaining 23 hours */}
                        <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
                            <Text className="text-base font-medium text-gray-900">
                                Remaining 23 hours
                            </Text>
                            <View className="flex-row items-center">
                                <Image
                                    source={require('@/shared/assets/images/dirham-icon.png')}
                                    style={{ width: 12, height: 12 }}
                                    contentFit="contain" />
                                <Text className="text-base font-semibold text-gray-900 ml-1">
                                    {remainingHoursCost}
                                </Text>
                            </View>
                        </View>

                        {/* Total */}
                        <View className="flex-row justify-between items-center py-4 border-gray-200">
                            <Text className="text-base font-bold text-gray-900">
                                Total
                            </Text>
                            <View className="flex-row items-center">
                                <Image
                                    source={require('@/shared/assets/images/dirham-icon.png')}
                                    style={{ width: 12, height: 12 }}
                                    contentFit="contain" />
                                <Text className="text-base font-bold text-gray-900 ml-1">
                                    {totalCost}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Payment Details */}
                <View className="px-6 pb-6">
                    <View className="bg-gray-50 rounded-2xl p-4">
                        <View className="flex-row justify-between items-center py-4">
                            <Text className="text-base font-medium text-gray-900">
                                Paid with bonuses
                            </Text>
                            <View className="flex-row items-center">
                                <Image
                                    source={require('@/shared/assets/images/dirham-icon.png')}
                                    style={{ width: 12, height: 12 }}
                                    contentFit="contain" />
                                <Text className="text-base font-semibold text-gray-900 ml-1">
                                    {paidWithBonuses}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="h-4" />
            </ScrollView>

            {/* Bottom button */}
            <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
                <Button
                    className="w-full h-14 rounded-2xl bg-primary"
                    onPress={handleOkay}
                >
                    <Text className="text-lg font-semibold text-primary-foreground">
                        Okay
                    </Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}
