import { useRentalsService } from "@/app/api/rentals-service";
import { useNewRentStore } from "@/shared/stores/new-rent-store";
import { Loader } from "@/shared/ui/loader";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaymentIntent, useStripe } from "@stripe/stripe-react-native";
import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { useRentStore } from "@/shared/stores/rent-store";
import { useRouter } from "expo-router";

export default function RentRequest() {
    const { cabinetInfo, reset } = useNewRentStore();
    const paymentMethodId = usePaymentMethodsStore((state) => state.selectedPaymentMethod?.id);
    const [isLoading, setIsLoading] = useState(false);
    const rentalsService = useRentalsService();
    const stripe = useStripe();
    const { confirmPayment } = stripe;
    const setRental = useRentStore(state => state.setRental);
    const router = useRouter();

    const startRent = async () => {
        if (!cabinetInfo?.qrCode) {
            router.back();
            return;
        }
        try {
            setIsLoading(true);
            const rentalResponse = await rentalsService.startRental({
                cabinetQRCode: cabinetInfo?.qrCode,
                paymentMethodId: paymentMethodId,
            });
            if (rentalResponse.requiresPaymentConfirmation && rentalResponse.clientSecret) {
                const confirmResult = await confirmPayment(rentalResponse.clientSecret);
                if (confirmResult.paymentIntent?.status === PaymentIntent.Status.Succeeded) {
                    setRental(rentalResponse.rental);
                    if (router.canDismiss()) {
                        router.dismissAll();
                    }
                    router.push({
                        pathname: `/(app)/rental-info`,
                        params: { rentalId: rentalResponse.rental.id }
                    });
                    return;
                }
                if (confirmResult.error) {
                    Alert.alert("Error", confirmResult.error.message);
                }
            }
            if (rentalResponse.rental.status === "Active") {
                setRental(rentalResponse.rental);
                if (router.canDismiss()) {
                    router.dismissAll();
                }
                router.push({
                    pathname: `/(app)/rental-info`,
                    params: { rentalId: rentalResponse.rental.id }
                });

            }
        } catch (error) {
            console.log("error", error);
            Alert.alert("Error", "Something went wrong while starting the rental. Please try again later.", [
                { text: "OK", style: "default", onPress: () => { } },
            ]);
            router.back();
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        startRent();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 flex-col items-center justify-center px-4">
                {isLoading && <Loader />}
                <Text className="text-lg font-semibold text-gray-900 mt-10">Connecting to station</Text>
            </View>
        </SafeAreaView>
    )
}