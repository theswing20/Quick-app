import { usePaymentMethodsService } from "@/app/api/payment-methods-service";
import { Button } from "@/shared/ui/button";
import { ScreenSection } from "@/shared/ui/screen-section";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddPaymentMethod() {
    const stripe = useStripe();
    const paymentMethodsService = usePaymentMethodsService();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState<{
        complete: boolean;
        brand?: string;
        last4?: string;
    } | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

const getSetupIntent = async () => {
    const setupIntent = await paymentMethodsService.setupPaymentMethod();
    console.log('setupIntent', setupIntent);
    return setupIntent?.clientSecret;
}

    
    useEffect(() => {
        getSetupIntent().then((clientSecret) => {
            setClientSecret(clientSecret);
        });
    }, []);

    const { createPaymentMethod, confirmSetupIntent } = stripe;

    const handleAddCard = async () => {
        if (!cardDetails?.complete) {
            Alert.alert("Error", "Please enter a valid card");
            return;
        }

        setIsLoading(true);
        try {
            // Получаем setup intent от бэкенда

            if (!clientSecret) {
                Alert.alert("Error", "Failed to get setup intent");
                setIsLoading(false);
                return;
            }

            // Создаем PaymentMethod через Stripe
            const { paymentMethod, error: createError } = await createPaymentMethod({
                paymentMethodType: "Card",
            });

            if (createError || !paymentMethod) {
                Alert.alert("Error", createError?.message || "Failed to create payment method");
                setIsLoading(false);
                return;
            }

            // Подтверждаем SetupIntent
            const { error: confirmError } = await confirmSetupIntent(
                clientSecret,
                {
                    paymentMethodType: "Card",
                    paymentMethodData: {
                        token: paymentMethod.id,
                    },
                }
            );

            if (confirmError) {
                Alert.alert("Error", confirmError.message);
                setIsLoading(false);
                return;
            }

            // Подтверждаем на бэкенде
            await paymentMethodsService.confirmPaymentMethod({
                paymentMethodId: paymentMethod.id,
            });

            Alert.alert("Success", "Payment method added successfully", [
                {
                    text: "OK",
                    onPress: () => router.back(),
                },
            ]);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to add payment method");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="bg-white flex-1">
            <View className="px-5 pt-4 pb-4">
                <ScreenTitle title="Add Payment Method" />
            </View>
            <View className="bg-gray-50 flex-1">
                <ScreenSection roundedTop={false} className="mt-2">
                    <View className="mb-6">
                        <Text className="text-base font-medium mb-4">Card Information</Text>
                        <View className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                            <CardField
                                postalCodeEnabled={false}
                                placeholders={{
                                    number: "4242 4242 4242 4242",
                                }}
                                cardStyle={{
                                    backgroundColor: "#FFFFFF",
                                    textColor: "#000000",
                                    borderWidth: 0,
                                }}
                                style={{
                                    width: "100%",
                                    height: 50,
                                    marginVertical: 30,
                                }}
                                onCardChange={(cardDetails) => {
                                    setCardDetails(cardDetails);
                                }}
                            />
                        </View>
                    </View>

                    <Button
                        onPress={handleAddCard}
                        disabled={!cardDetails?.complete || isLoading}
                        className="w-full"
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-medium">Add Card</Text>
                        )}
                    </Button>
                </ScreenSection>
            </View>
        </SafeAreaView>
    );
}

