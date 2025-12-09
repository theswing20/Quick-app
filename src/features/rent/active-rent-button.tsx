import { Rental, useRentalsService } from "@/app/api/rentals-service";
import { useRentStore } from "@/shared/stores/rent-store";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const RENTAL_CHECK_INTERVAL = 20 * 1000;

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
                            pathname: "/(app)/rental-finished",
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
    }, [rentalsService, setRental, rental]);

    useEffect(() => {
        checkActiveRental();
    }, []);

    useEffect(() => {
        const interval = setInterval(checkActiveRental, RENTAL_CHECK_INTERVAL);
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
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <View className="bg-primary-foreground/70 text-primary p-4 rounded-2xl flex-row items-center justify-between">
                <Text className="opacity-100 text-primary font-semibold text-base">{rental.powerBankDeviceId}</Text>
            </View>
        </TouchableOpacity>
    )
}