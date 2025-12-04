import { PaymentMethod, usePaymentMethodsService } from "@/app/api/payment-methods-service";
import PaymentMethodItem from "@/features/payment-methods/payment-method-item";
import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { Button } from "@/shared/ui/button";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { router } from "expo-router";
import { Alert, AlertButton, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentMethods() {
    const paymentMethods = usePaymentMethodsStore((state) => state.paymentMethods);
    const paymentMethodsService = usePaymentMethodsService();
    const setPaymentMethods = usePaymentMethodsStore(state => state.setPaymentMethods);

    const setDefaultPaymentMethod = async (method: PaymentMethod) => {
        try {
            const response = await paymentMethodsService.setDefaultPaymentMethod({ paymentMethodId: method.id });
            console.log('response', response);
            if (response.success) {
                updatePamentMethods();
            }
        } catch (error) {
            console.error(error);
            Alert.alert(
                "Sorry",
                "Something went wrong while setting the default payment method. Please try again later.",
                [
                    { text: "OK", style: "default", onPress: () => { } },
                ]
            );
        }
    }
    const confirmDeletePaymentMethod = async (method: PaymentMethod) => {
        Alert.alert(
            "Delete Payment Method",
            "Are you sure you want to delete this payment method?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deletePaymentMethod(method) },
            ]
        );
    }
    const deletePaymentMethod = async (method: PaymentMethod) => {
        if (!method.id) {
            return;
        }
        try {
            const response = await paymentMethodsService.deletePaymentMethod(method.id);
            console.log('response', response);
            if (response.success) {
                updatePamentMethods();
            }
        } catch (error) {
            console.error(error);
            Alert.alert(
                "Sorry",
                "Something went wrong while deleting the payment method. Please try again later.",
                [
                    { text: "OK", style: "default", onPress: () => { } },
                ]
            );
        }
    }
    const updatePamentMethods = async () => {
        try {
            const response = await paymentMethodsService.getAllPaymentMethods();
            if (response && response.length > 0) {
                setPaymentMethods(response);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const showOptions = (method: PaymentMethod) => {
        const actions = [
            {
                text: "Cancel",
                style: "cancel",
                onPress: () => { },
            },
        ];


        if (method.id) {
            actions.unshift({
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    confirmDeletePaymentMethod(method);
                },
            });
        };

        if (!method.isDefault) {
            actions.unshift({
                text: "Set as default",
                onPress: () => {
                    setDefaultPaymentMethod(method)
                },
                style: "default",
            })
        }

        Alert.alert(
            "Payment Method Options",
            "Choose an action",
            actions as AlertButton[],
        );
    };

    return (
        <SafeAreaView className="bg-white flex-1">
            <ScreenTitle title="Payment Methods" />
            <ScrollView>
                <View className="px-4">
                    {paymentMethods.map((method) => {
                        return <PaymentMethodItem
                            key={method.id}
                            method={method}
                            onTap={() => showOptions(method)}
                            isSelected={method.isDefault}
                        />
                    })}
                </View>
            </ScrollView>
            <View className="p-4">
                <Button onPress={() => router.push("/add-card")} className="rounded-3xl h-12">
                    <Text className="text-[18px]">Add Payment Method</Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}