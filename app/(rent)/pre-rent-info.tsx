import { markerDetails } from "@/shared/lib/mocks";
import { Button } from "@/shared/ui/button";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { useRouter } from "expo-router";
import { Clock, Home, QrCode, Smartphone, SmartphoneCharging, X, Zap } from "lucide-react-native";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PaymentMethodSelector from "@/features/payment-methods/payment-method-selector";

export default function PreRentInfo() {
  const router = useRouter();


  const details = markerDetails[0];
  const startRent = () => {
    console.log("startRent");
    router.push("/(rent)/rent-request");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <ScreenTitle title="Check station number" />
        <View className="w-full items-center justify-center">
          <View className="w-[75%] items-center justify-center border-[1px] border-gray-200 rounded-3xl p-2 flex-row gap-2 my-4">
            <QrCode /><Text className="text-xl font-bold text-gray-900 mb-1">{details?.serialNumber}</Text>
          </View>
        </View>
        {/* Название места */}
        <View className="px-5 py-2">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {details?.name}
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            {details?.address}
          </Text>
        </View>

        {/* Таблица цен */}
        <View className="px-5 pb-4">
          <View className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row justify-between items-center py-4 pt-2 border-b border-gray-200">
              <View className="flex-row items-center justify-center gap-2">
                <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                  <Text className="font-medium text-gray-900">
                    1
                  </Text>
                </View>
                <Text className="text-base font-medium text-gray-900">
                  First hour
                </Text>
              </View>
              <Text className="text-base font-semibold text-gray-900">
                {details?.price.firstHour} 〒
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
              <View className="flex-row items-center justify-center gap-2">
                <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                  <Text className="font-medium text-gray-900">
                    2
                  </Text>
                </View>
                <Text className="text-base font-medium text-gray-900">
                  Remaining 23 hours
                </Text>
              </View>
              <Text className="text-base font-semibold text-gray-900">
                {details?.price.remaining23Hours} 〒
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-4 pb-2 border-gray-200">
              <View className="flex-row items-center justify-center gap-2">
                <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                  <Text className="font-medium text-gray-900">
                    3
                  </Text>
                </View>
                <Text className="text-base font-medium text-gray-900">
                  Next day
                </Text>
              </View>
              <Text className="text-base font-semibold text-gray-900">
                {details?.price.nextDay} 〒
              </Text>
            </View>
           <PaymentMethodSelector />
          </View>
        </View>

        {/* Как это работает */}
        <View className="px-5 pb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            How to return?
          </Text>

          <View className="flex-row items-start gap-3 mb-4">
            <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
              <Zap size={20} color="#000000" />
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-700 leading-6">
                Find any nearby station on the map - they're marked with special icons
              </Text>
            </View>
          </View>

          <View className="flex-row items-start gap-3 mb-4">
            <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
              <Clock size={20} color="#000000" />
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-700 leading-6">
                Make sure the station is active and has available slots
              </Text>
            </View>
          </View>

          <View className="flex-row items-start gap-3">
            <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
              <Home size={20} color="#000000" />
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-700 leading-6">
                Insert the power bank into one of the empty slots
              </Text>
            </View>
          </View>
          <View className="mt-6"><Text className="text-gray-400 text-sm">By tapping “Take”, you agree to the <Text className="underline">Terms of Use</Text> and the <Text className="underline">Adhesion Agreement</Text>.</Text></View>
        </View>
        <View className="h-10"></View>
      </ScrollView>
      <View className="px-5 pb-4 absolute bottom-4 left-0 right-0">
        <Button
          className="w-full h-14 rounded-2xl bg-primary"
          onPress={startRent}
        >
          <Text className="text-lg font-semibold text-secondary-foreground">
            Take
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
