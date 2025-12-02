import { useRentalsService } from "@/app/api/rentals-service";
import { useNewRentStore } from "@/shared/stores/new-rent-store";
import { Loader } from "@/shared/ui/loader";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaymentIntent, useStripe } from "@stripe/stripe-react-native";

export default function RentRequest() {
    const { paymentMethodId, cabinetQRCode, reset } = useNewRentStore();
    const [isLoading, setIsLoading] = useState(false);
    const rentalsService = useRentalsService();
    const stripe = useStripe();
    const {confirmPayment } = stripe;

    const startRent = async () => {
        if (!paymentMethodId || !cabinetQRCode) {
            return;
        }
        try{
        setIsLoading(true);
        console.log("startRent");
        const rentalResponse = await rentalsService.startRental({
            cabinetQRCode: cabinetQRCode,
            paymentMethodId: paymentMethodId,
        });
        console.log("rentalResponse", rentalResponse);
        if (rentalResponse.requiresPaymentConfirmation && rentalResponse.clientSecret) {
            const confirmResult = await confirmPayment(rentalResponse.clientSecret);
            console.log("confirmResult", confirmResult);
            if(confirmResult.paymentIntent?.status === PaymentIntent.Status.Succeeded) {
                // router.push("/(rent)/rent-success");
                Alert.alert("Success", "Payment confirmed successfully");
            }
            if(confirmResult.error){
                Alert.alert("Error", confirmResult.error.message);
            }
        }
        setIsLoading(false);
    } catch (error) {
        console.log("error", error);
    } finally {
        setIsLoading(false);
    }
    }

    useEffect(() => {
        startRent();
        return () => {
            // reset();
        }
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 flex-col items-center justify-center">
                <Loader />
                <Text className="text-lg font-bold text-primary-foreground mt-10">Connecting to station</Text>
            </View>
        </SafeAreaView>
    )
}