import { Button } from "@/shared/ui/button";
import { ScreenSection } from "@/shared/ui/screen-section";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { Text } from "@/shared/ui/text";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddCard() {
  const router = useRouter();
  const stripe = useStripe();
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCard = async () => {
    if (!cardDetails?.complete) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все данные карты");
      return;
    }

    // Check if Stripe is properly initialized
    if (!stripe || !stripe.createPaymentMethod) {
      Alert.alert("Ошибка", "Stripe не инициализирован. Проверьте настройки.");
      return;
    }

    setIsLoading(true);
    try {
      // Создаем платежный метод
      // CardField автоматически предоставляет данные карты
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        paymentMethodType: "Card",
      });

      if (error) {
        Alert.alert("Ошибка", error.message || "Не удалось добавить карту");
        return;
      }

      if (paymentMethod) {
        // Здесь можно отправить paymentMethod.id на ваш бэкенд для сохранения
        // Например: await savePaymentMethodToBackend(paymentMethod.id);
        console.log("Payment method created:", paymentMethod.id);

        Alert.alert(
          "Успешно",
          "Карта успешно добавлена",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert("Ошибка", error.message || "Произошла ошибка при добавлении карты");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenTitle title="Добавить карту" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-gray-50 flex-1">
            <ScreenSection roundedTop={false} className="flex-1">
              <View className="mb-6">
                <Text className="mb-4 text-lg font-semibold text-gray-900">
                  Данные карты
                </Text>
                <View className="mb-4 overflow-hidden rounded-xl bg-white border border-gray-200">
                  <CardField
                    postalCodeEnabled={false}
                    placeholders={{
                      number: "4242 4242 4242 4242",
                    }}
                    cardStyle={{
                      backgroundColor: "#FFFFFF",
                      textColor: "#000000",
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                      borderRadius: 12,
                      fontSize: 16,
                      placeholderColor: "#9CA3AF",
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
                <Text className="text-sm text-gray-500">
                  Ваши данные карты защищены и обрабатываются безопасно
                </Text>
              </View>

              <View className="mt-auto pt-4">
                <Button
                  onPress={handleAddCard}
                  disabled={!cardDetails?.complete || isLoading}
                  className="h-auto rounded-2xl p-4"
                >
                  <Text className="text-xl font-medium text-primary-foreground">
                    {isLoading ? "Добавление..." : "Добавить карту"}
                  </Text>
                </Button>
              </View>
            </ScreenSection>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

