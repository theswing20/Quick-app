import { markerDetails } from "@/shared/lib/mocks";
import { Button } from "@/shared/ui/button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Home, QrCode, Smartphone, SmartphoneCharging, X, Zap } from "lucide-react-native";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MarkerDetails() {
  const router = useRouter();
  const { markerId } = useLocalSearchParams<{ markerId: string }>();

  const handleClose = () => {
    router.back();
  };
  const details = markerDetails.find(marker => marker.id === markerId);
  const handleScanQr = () => {
    router.push("/(app)/qr-scanner");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Заголовок с кнопкой закрытия */}
        <View className="flex-row items-center justify-between px-5 pt-5 pb-4">
          <View className="flex-row items-center gap-2">
            <QrCode size={20} color="#000000" />
            <Text className="text-base font-medium text-gray-900">
              {details?.serialNumber} • Powerbank Station
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            className="w-8 h-8 items-center justify-center"
          >
            <X size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Название места */}
        <View className="px-5 pb-2">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {details?.name}
          </Text>
          <Text className="text-base text-gray-600 mb-2">
            {details?.details}
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            {details?.address}
          </Text>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <Text className="text-base text-gray-700">Open</Text>
          </View>
        </View>

        {/* Блоки доступности */}
        <View className="flex-row gap-3 px-5 py-4">
          <View className="flex-1 bg-gray-50 rounded-2xl p-4 items-center">
            <View className="flex-row items-center justify-end mt-2">
              <Text className="text-4xl font-bold text-gray-900 baseline mb-2 h-full">{details?.availability.take}</Text>
              <View className="h-full">
                <SmartphoneCharging size={30} color="#FFCC00" />
              </View>
            </View>
            <Text className="text-base font-medium text-gray-700">Take</Text>
          </View>
          <View className="flex-1 bg-gray-50 rounded-2xl p-4 items-center">
            <View className="flex-row items-center justify-end mt-2">
              <Text className="text-4xl font-bold text-gray-900 baseline mb-2 h-full">{details?.availability.return}</Text>
              <View className="h-full">
                <Smartphone size={30} color="#000000" />
              </View>
            </View>
            <Text className="text-base font-medium text-gray-700">Return</Text>
          </View>
        </View>

        {/* Конкретное место */}
        <View className="px-5 pb-4">
          <Text className="text-base text-gray-600">{details?.powerbankPosition}</Text>
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
          </View>
        </View>

        {/* Как это работает */}
        <View className="px-5 pb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            How does it work?
          </Text>

          <View className="flex-row items-start gap-3 mb-4">
            <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
              <QrCode size={20} color="#000000" />
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-700 leading-6">
                You scan the station's QR code and take a powerbank
              </Text>
            </View>
          </View>

          <View className="flex-row items-start gap-3 mb-4">
            <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
              <Zap size={20} color="#000000" />
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-700 leading-6">
                Charge up — cables are built-in. There's Type-C, micro-USB and Lightning for iPhone
              </Text>
            </View>
          </View>

          <View className="flex-row items-start gap-3">
            <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
              <Home size={20} color="#000000" />
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-700 leading-6">
              Return the powerbank to any station — can be found on the map
              </Text>
            </View>
          </View>
        </View>
        <View className="h-10"></View>
      </ScrollView>
      <View className="px-5 pb-4 absolute bottom-4 left-0 right-0">
        <Button
          className="w-full h-14 rounded-2xl bg-primary"
          onPress={handleScanQr}
        >
          <Text className="text-lg font-semibold text-secondary-foreground">
            Take via QR
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
