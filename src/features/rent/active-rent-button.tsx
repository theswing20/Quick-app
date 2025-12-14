import { useRentalsService } from "@/app/api/rentals-service";
import { useRentStore } from "@/shared/stores/rent-store";
import { AxiosError } from "axios";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const RENTAL_CHECK_INTERVAL = 20 * 1000;

export default function ActiveRentButton() {
  const rental = useRentStore((state) => state.rental);
  const setRental = useRentStore((state) => state.setRental);
  const rentalsService = useRentalsService();
  const [elapsedTime, setElapsedTime] = useState({ minutes: 0, seconds: 0 });

  // Calculate elapsed time from startTime
  useEffect(() => {
    if (!rental?.startTime) return;

    const updateElapsedTime = () => {
      const start = new Date(rental.startTime);
      const now = new Date();
      const diff = now.getTime() - start.getTime();

      const totalMinutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime({ minutes: totalMinutes, seconds });
    };

    updateElapsedTime();
    const interval = setInterval(updateElapsedTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, [rental?.startTime]);

  const checkActiveRental = useCallback(async () => {
    try {
      const activeRental = await rentalsService.getActiveRental();
      if (activeRental?.id) {
        setRental(activeRental);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          if (rental) {
            router.push({
              pathname: "/(app)/rental-finished",
              params: {
                rentalId: rental.id,
              },
            });
            setRental(null);
          }
          return;
        }
      }
      console.error("Error checking active rental", error);
    }
  }, [rentalsService, setRental, rental]);

  useEffect(() => {
    checkActiveRental();
  }, []);

  useEffect(() => {
    const interval = setInterval(checkActiveRental, RENTAL_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [checkActiveRental]);

  const handlePress = () => {
    console.log("handlePress", rental);
    if (rental) {
      router.push({
        pathname: `/(app)/rental-info`,
        params: { rentalId: rental.id },
      });
    }
  };

  if (!rental) {
    return null;
  }

  const formatTime = (minutes: number, seconds: number) => {
    const m = minutes.toString().padStart(2, "0");
    const s = seconds.toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View className="flex-row items-center justify-between p-2.5 gap-2 text-black bg-white rounded-2xl">
        <View className="p-2 rounded-2xl bg-amber-200/40">
          <Image
            source={require("@/shared/assets/icons/lightning.svg")}
            style={{ width: 24, height: 24, tintColor: "#FACA16" }}
            contentFit="contain"
          />
        </View>
        <View className="flex flex-col">
          <Text className="text-sm font-semibold text-center text-black opacity-100">
            Powerbank
          </Text>
          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-sm text-center text-black/50">
              {rental.currentCost} AED
            </Text>
            <Text className="text-sm text-center text-black/50">•</Text>
            <Text className="text-sm text-center text-black/50">
              {formatTime(elapsedTime.minutes, elapsedTime.seconds)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
