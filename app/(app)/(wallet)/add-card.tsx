import { usePaymentMethodsService } from '@/app/api/payment-methods-service';
import { usePaymentMethodsStore } from '@/shared/stores/payment-methods-store';
import { Button } from "@/shared/ui/button";
import { ScreenSection } from '@/shared/ui/screen-section';
import { ScreenTitle } from '@/shared/ui/screen-title';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddPaymentMethodScreen() {
    const [cardDetails, setCardDetails] = useState<{
        complete: boolean;
        brand?: string;
        last4?: string;
    } | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [setupIntentClientSecret, setSetupIntentClientSecret] = useState('');
    const stripe = useStripe();
    const { confirmSetupIntent } = stripe;
    const paymentMethodsService = usePaymentMethodsService();
    const router = useRouter();
    const setPaymentMethods = usePaymentMethodsStore(state => state.setPaymentMethods);

    useEffect(() => {
        fetchSetupIntent();
    }, []);

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

    const fetchSetupIntent = async () => {
        try {
            setLoading(true);
            const { clientSecret } = await paymentMethodsService.setupPaymentMethod();
            setSetupIntentClientSecret(clientSecret);
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось подготовить добавление карты');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCard = async () => {
        if (!setupIntentClientSecret) {
          Alert.alert('Ошибка', 'Не удалось получить данные для сохранения карты');
          return;
        }
        
        if (!cardDetails?.complete) {
          Alert.alert('Ошибка', 'Пожалуйста, введите полные данные карты');
          return;
        }
    
        setLoading(true);
        try {
          // Подтверждаем SetupIntent
          const { setupIntent, error } = await confirmSetupIntent(
            setupIntentClientSecret,
            { 
              paymentMethodType: 'Card',
            }
          );
    
          if (error) {
            Alert.alert('Ошибка', error.message);
          } else if (setupIntent) {
            if(setupIntent.paymentMethod?.id) {
              const response =await paymentMethodsService.confirmPaymentMethod({
                paymentMethodId: setupIntent.paymentMethod.id,
              });
              if(response.success) {
                void updatePamentMethods();
                router.back();
              }
            }
          }
        } catch (error) {
          Alert.alert('Ошибка', 'Не удалось сохранить карту');
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    return (<SafeAreaView className="bg-white flex-1">
        <View className="px-4 pt-4 pb-4">
            <ScreenTitle title="Add Payment Method" />
        </View>
        <View className="bg-gray-50 flex-1">
            <ScreenSection roundedTop={false} className="mt-2 flex-1 flex-col justify-between">
                <View className="mb-6 px-4">
                    <Text className="text-base font-medium mb-4 text-gray-900">Card Information</Text>
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

                <View className="px-4 pb-6">
                    <Button
                        onPress={handleSaveCard}
                        disabled={!cardDetails?.complete || isLoading}
                        className="w-full h-14 rounded-2xl"
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-lg font-semibold text-primary-foreground">Add Card</Text>
                        )}
                    </Button>
                </View>
            </ScreenSection>
        </View>
    </SafeAreaView>);
}