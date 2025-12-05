import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useRentStore } from "@/shared/stores/rent-store";
import { useEffect, useState } from "react";
import { Rental, useRentalsService } from "@/app/api/rentals-service";
import { Loader } from "@/shared/ui/loader";

export default function RentalInfo() {
    const { rentalId } = useLocalSearchParams<{ rentalId: string }>();
    const rentalsService = useRentalsService();
    const [rental, setRental] = useState<Rental | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
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
    }, [rentalId]);



    if (isLoading) {
        return <Loader />;
    }
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View>
                <Text>Rental Info</Text>
            </View>
        </SafeAreaView>
    )
}