import { Rental, useRentalsService } from "@/app/api/rentals-service";
import { PRICE } from "@/shared/lib/mocks";
import { useRentStore } from "@/shared/stores/rent-store";
import { Button } from "@/shared/ui/button";
import { Loader } from "@/shared/ui/loader";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RentalInfo() {
    const { rentalId } = useLocalSearchParams<{ rentalId: string }>();
    const rentalsService = useRentalsService();
    const [rental, setRental] = useState<Rental | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [elapsedTime, setElapsedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const activeRental = useRentStore((state) => state.rental);

    // Calculate elapsed time from startTime
    useEffect(() => {
        if (!rental?.startTime) return;

        const updateElapsedTime = () => {
            const start = new Date(rental.startTime);
            const now = new Date();
            const diff = now.getTime() - start.getTime();

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setElapsedTime({ hours, minutes, seconds });
        };

        updateElapsedTime();
        const interval = setInterval(updateElapsedTime, 1000);

        return () => clearInterval(interval);
    }, [rental?.startTime]);

    useEffect(() => {
        if (activeRental) {
            setRental(activeRental);
            setIsLoading(false);
            return;
        }
        if (rentalId) {
            try {
                setIsLoading(true);
                rentalsService.getRentalById(rentalId).then((rental) => {
                    setRental(rental);
                    setIsLoading(false);
                });
            } catch (error) {
                console.error('Error getting rental', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [rentalId, activeRental]);

    const formatTime = (hours: number, minutes: number, seconds: number) => {
        const h = hours.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');
        const s = seconds.toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const handleClose = () => {
        router.back();
    };

    const handleHowToReturn = () => {
        router.push("/(app)/how-to-return");
    };

    if (isLoading || !rental) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Loader />
            </View>
        );
    }

    const depositAmount = PRICE.nextDay;

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

                {/* Header with logo and close button */}
                <View className="flex-row items-center justify-between px-6 pb-6">
                    <View className="flex-1" />
                    <Text className="text-2xl font-bold text-primary flex-1 text-center">
                        Quick-app
                    </Text>
                    <View className="flex-1 items-end">
                        <TouchableOpacity
                            onPress={handleClose}
                            className="w-8 h-8 items-center justify-center rounded-full"
                        >
                            <X size={24} color="#000000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Current status/time */}
                <View className="flex-row items-center justify-between px-6 pb-6">
                    <View className="flex-row items-center gap-2 justify-center">
                        <Text className="text-3xl font-bold text-gray-900">
                            <Image
                                source={require('@/shared/assets/images/dirham-icon.png')}
                                style={{ width: 24, height: 24 }}
                                contentFit="contain" />
                            &nbsp;{rental.currentCost || 0}
                        </Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-3xl font-bold text-gray-900">
                            {formatTime(elapsedTime.hours, elapsedTime.minutes, elapsedTime.seconds)}
                        </Text>
                    </View>
                </View>

                {/* Pricing details */}
                <View className="px-6 pb-6">
                    <View className="bg-gray-50 rounded-2xl p-4">
                        <View className="flex-row justify-between items-center py-4 pt-2 border-b border-gray-200">
                            <View className="flex-row items-center gap-2">
                                <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                                    <Text className="text-xs font-medium text-gray-900">1</Text>
                                </View>
                                <Text className="text-base font-medium text-gray-900">
                                    First hour
                                </Text>
                            </View>
                            <Text className="text-base font-semibold text-gray-900">
                                <Image
                                    source={require('@/shared/assets/images/dirham-icon.png')}
                                    style={{ width: 12, height: 12 }}
                                    contentFit="contain" />
                                &nbsp;{PRICE.firstHour}
                            </Text>
                        </View>
                        <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
                            <View className="flex-row items-center gap-2">
                                <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                                    <Text className="text-xs font-medium text-gray-900">2</Text>
                                </View>
                                <Text className="text-base font-medium text-gray-900">
                                    Remaining 23 hours
                                </Text>
                            </View>
                            <Text className="text-base font-semibold text-gray-900">
                                <Image
                                    source={require('@/shared/assets/images/dirham-icon.png')}
                                    style={{ width: 12, height: 12 }}
                                    contentFit="contain" />
                                &nbsp;{PRICE.remaining23Hours}
                            </Text>
                        </View>
                        <View className="flex-row justify-between items-center py-4 border-gray-200">
                            <View className="flex-row items-center gap-2">
                                <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                                    <Text className="text-xs font-medium text-gray-900">3</Text>
                                </View>
                                <Text className="text-base font-medium text-gray-900">
                                    Next day
                                </Text>
                            </View>
                            <Text className="text-base font-semibold text-gray-900">
                                <Image
                                    source={require('@/shared/assets/images/dirham-icon.png')}
                                    style={{ width: 12, height: 12 }}
                                    contentFit="contain" />
                                &nbsp;{PRICE.nextDay}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Deposit information */}
                <View className="px-6 pb-6">
                    <Text className="text-sm text-gray-600 leading-6">
                        Initially <Image
                            source={require('@/shared/assets/images/dirham-icon.png')}
                            style={{ width: 12, height: 12 }}
                            contentFit="contain" />
                        &nbsp;{depositAmount.toLocaleString()} will be frozen — this is a deposit.
                    </Text>
                    <Text className="text-sm text-gray-600 leading-6 mt-2">
                        After returning the power bank, excess money will be returned.
                    </Text>
                </View>

                {/* Power bank ID */}
                {rental.powerBankDeviceId && (
                    <View className="px-6 pb-6">
                        <View className="bg-gray-50 rounded-xl p-4">
                            <Text className="text-sm text-gray-500 mb-1">Power Bank ID</Text>
                            <Text className="text-lg font-semibold text-gray-900">
                                {rental.powerBankDeviceId}
                            </Text>
                        </View>
                    </View>
                )}

                <View className="h-4" />
            </ScrollView>

            {/* Bottom button */}
            <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
                <Button
                    className="w-full h-14 rounded-2xl bg-primary"
                    onPress={handleHowToReturn}
                >
                    <Text className="text-lg font-semibold text-primary-foreground">
                        How to return?
                    </Text>
                </Button>
            </View>

        </SafeAreaView>
    );
}
