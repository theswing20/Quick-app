import { Rental, useRentalsService } from "@/app/api/rentals-service";
import { PRICE } from "@/shared/lib/mocks";
import { useRentStore } from "@/shared/stores/rent-store";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardRow } from "@/shared/ui/card";
import { Loader } from "@/shared/ui/loader";
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
  const [elapsedTime, setElapsedTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
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
    if (activeRental?.id === rentalId) {
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
        console.error("Error getting rental", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [rentalId, activeRental]);

  const formatTime = (hours: number, minutes: number, seconds: number) => {
    const h = hours.toString().padStart(2, "0");
    const m = minutes.toString().padStart(2, "0");
    const s = seconds.toString().padStart(2, "0");
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
      <View className="items-center justify-center flex-1 bg-white">
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
        <View className="items-center w-full pt-2 pb-4">
          <View className="w-12 h-1 bg-gray-300 rounded-full" />
        </View>

        {/* Header with logo and close button */}
        <View className="flex-row items-center justify-between px-6 pb-6">
          <View className="flex-1" />
          <Text className="text-2xl font-bold text-center flex-2 text-primary">
            Quick-app
          </Text>
          <View className="items-end flex-1">
            <TouchableOpacity
              onPress={handleClose}
              className="items-center justify-center w-8 h-8 rounded-full"
            >
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Current status/time */}
        <View className="flex-row items-center justify-between px-6 pb-6">
          <View className="flex-row items-center gap-2">
            <Text className="text-3xl font-bold text-gray-900">
              {rental.currentCost || 0} AED
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-3xl font-bold text-gray-900">
              {formatTime(
                elapsedTime.hours,
                elapsedTime.minutes,
                elapsedTime.seconds
              )}
            </Text>
          </View>
        </View>

        {/* Pricing details */}
        <View className="px-6 pb-6">
          <Card variant="elevated" className="bg-gray-50">
            <CardContent className="p-0 px-2.5">
              <CardRow withBorder>
                <View className="flex-row items-center gap-2">
                  <View className="items-center justify-center w-6 h-6 rounded-full bg-primary">
                    <Text className="text-xs font-medium text-gray-900">1</Text>
                  </View>
                  <Text className="text-base font-medium text-gray-900">
                    First hour
                  </Text>
                </View>
                <Text className="text-sm font-medium text-gray-900">
                  {PRICE.firstHour} AED
                </Text>
              </CardRow>
              <CardRow withBorder>
                <View className="flex-row items-center gap-2">
                  <View className="items-center justify-center w-6 h-6 rounded-full bg-primary">
                    <Text className="text-xs font-medium text-gray-900">2</Text>
                  </View>
                  <Text className="text-base font-medium text-gray-900">
                    Remaining 23 hours
                  </Text>
                </View>
                <Text className="text-sm font-medium text-gray-900">
                  {PRICE.remaining23Hours} AED
                </Text>
              </CardRow>
              <CardRow>
                <View className="flex-row items-center gap-2">
                  <View className="items-center justify-center w-6 h-6 rounded-full bg-primary">
                    <Text className="text-xs font-medium text-gray-900">3</Text>
                  </View>
                  <Text className="text-base font-medium text-gray-900">
                    Next day
                  </Text>
                </View>
                <Text className="text-sm font-medium text-gray-900">
                  {PRICE.nextDay} AED
                </Text>
              </CardRow>
            </CardContent>
          </Card>
        </View>

        {/* Deposit information */}
        <View className="px-6 pb-6">
          <View className="flex-row flex-wrap items-center">
            <Text className="text-sm leading-6 text-gray-600">Initially </Text>
            <Text className="text-sm leading-6 text-gray-600">
              {depositAmount.toLocaleString()} AED
            </Text>
            <Text className="text-sm leading-6 text-gray-600">
              {" "}
              will be frozen — this is a deposit.
            </Text>
          </View>
          <Text className="mt-2 text-sm leading-6 text-gray-600">
            After returning the power bank, excess money will be returned.
          </Text>
        </View>

        {/* Power bank ID */}
        {rental.powerBankDeviceId && (
          <View className="px-6 pb-6">
            <View className="p-4 bg-gray-50 rounded-xl">
              <Text className="mb-1 text-sm text-gray-500">Power Bank ID</Text>
              <Text className="text-lg font-semibold text-gray-900">
                {rental.powerBankDeviceId}
              </Text>
            </View>
          </View>
        )}

        <View className="h-4" />
      </ScrollView>

      {/* Bottom button */}
      <View className="px-6 pt-4 pb-6 bg-white border-t border-gray-100">
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
