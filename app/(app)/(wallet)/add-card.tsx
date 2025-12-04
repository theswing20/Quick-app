import { usePaymentMethodsService } from '@/app/api/payment-methods-service';
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
    const { createPaymentMethod, confirmSetupIntent } = stripe;
    const paymentMethodsService = usePaymentMethodsService();
    const router = useRouter();
    // Получаем SetupIntent при загрузке компонента
    useEffect(() => {
        fetchSetupIntent();
    }, []);

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
              console.log('response', response);
              if(response.success) {
                Alert.alert('Success', 'Card added successfully');
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
                    onPress={handleSaveCard}
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
    </SafeAreaView>);
}