import { useRentalsService } from "@/app/api/rentals-service";
import { useRentStore } from "@/shared/stores/rent-store";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { useCallback, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ActiveRentButton() {
    const rental = useRentStore((state) => state.rental);
    const setRental = useRentStore((state) => state.setRental);
    const rentalsService = useRentalsService();

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
                            pathname: "/(app)/rental-info",
                            params: {
                                rentalId: rental.id
                            }
                        });
                        setRental(null);
                    }
                    return;
                }
            }
            console.error('Error checking active rental', error);
        }
    }, [rentalsService, setRental]);

    useEffect(() => {
        checkActiveRental();
    }, []);

    useEffect(() => {
        const interval = setInterval(checkActiveRental, 20000);
        return () => clearInterval(interval);
    }, [checkActiveRental]);

    const handlePress = () => {
        console.log('handlePress', rental);
        if (rental) {
            router.push({ pathname: `/(app)/rental-info`, params: { rentalId: rental.id } });
        }
    }

    if (!rental) {
        return null;
    }
    return (
        <TouchableOpacity onPress={handlePress}>
            <View className="bg-primary-foreground/70 text-primary p-4 rounded-2xl flex-row items-center justify-between">
                <Text className="opacity-100 text-primary font-bold">{rental.powerBankDeviceId}</Text>
            </View>
        </TouchableOpacity>
    )
}