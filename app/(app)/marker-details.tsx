import { PRICE } from "@/shared/lib/mocks";
import { cn } from "@/shared/lib/utils";
import { useCabinetStore } from "@/shared/stores/cabinet-store";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardRow } from "@/shared/ui/card";
import { CurrencyAmount } from "@/shared/ui/currency-amount";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Home, QrCode, Smartphone, SmartphoneCharging, X, Zap } from "lucide-react-native";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MarkerDetails() {
  const router = useRouter();
  const { cabinetId } = useLocalSearchParams<{ cabinetId: string }>();
  const nearestCabinets = useCabinetStore((state) => state.nearestCabinets);

  const handleClose = () => {
    router.back();
  };
  const details = nearestCabinets.find(marker => marker.id === cabinetId);
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
        <View className="flex-row items-center justify-between px-4 pt-4 pb-4">
          <View className="flex-row items-center gap-2">
            
            <Text className="text-base font-medium text-gray-900">
              Powerbank Station
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
        <View className="px-4 pb-2">
          <View className="flex-row items-center gap-2">
          <QrCode size={20} color="#000000" />
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {details?.qrCode}
          </Text>
          </View>
          {/* <Text className="text-base text-gray-600 mb-2">
            *Coming soon*
          </Text> */}
          <Text className="text-base text-gray-700 mb-2">
            {details?.address}
          </Text>
          <View className="flex-row items-center">
            <View className={cn("w-2 h-2 rounded-full mr-2", details?.status === "Online" ? "bg-green-500" : "bg-red-500")}/>
            <Text className="text-base text-gray-700">{details?.status}</Text>
          </View>
        </View>

        {/* Блоки доступности */}
        <View className="flex-row gap-3 px-4 py-4">
          <View className="flex-1 bg-gray-50 rounded-2xl p-4 items-center">
            <View className="flex-row items-center justify-end mt-2">
              <Text className="text-4xl font-bold text-gray-900 baseline mb-2 h-full">{details?.occupiedSlots}</Text>
              <View className="h-full">
                <SmartphoneCharging size={30} color="#FFCC00" />
              </View>
            </View>
            <Text className="text-base font-medium text-gray-700">Take</Text>
          </View>
          <View className="flex-1 bg-gray-50 rounded-2xl p-4 items-center">
            <View className="flex-row items-center justify-end mt-2">
              <Text className="text-4xl font-bold text-gray-900 baseline mb-2 h-full">{details?.availableSlots}</Text>
              <View className="h-full">
                <Smartphone size={30} color="#000000" />
              </View>
            </View>
            <Text className="text-base font-medium text-gray-700">Return</Text>
          </View>
        </View>

        {/* Конкретное место */}
        {/* <View className="px-4 pb-4">
          <Text className="text-base text-gray-600">*Coming soon*</Text>
        </View> */}

        {/* Таблица цен */}
        <View className="px-4 pb-4">
          <Card variant="elevated" className="bg-gray-50">
            <CardContent>
              <CardRow withBorder>
                <View className="flex-row items-center gap-2">
                  <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                    <Text className="text-xs font-medium text-gray-900">1</Text>
                  </View>
                  <Text className="text-base font-medium text-gray-900">
                    First hour
                  </Text>
                </View>
                <CurrencyAmount amount={PRICE.firstHour} size="sm" />
              </CardRow>
              <CardRow withBorder>
                <View className="flex-row items-center gap-2">
                  <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                    <Text className="text-xs font-medium text-gray-900">2</Text>
                  </View>
                  <Text className="text-base font-medium text-gray-900">
                    Remaining 23 hours
                  </Text>
                </View>
                <CurrencyAmount amount={PRICE.remaining23Hours} size="sm" />
              </CardRow>
              <CardRow>
                <View className="flex-row items-center gap-2">
                  <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                    <Text className="text-xs font-medium text-gray-900">3</Text>
                  </View>
                  <Text className="text-base font-medium text-gray-900">
                    Next day
                  </Text>
                </View>
                <CurrencyAmount amount={PRICE.nextDay} size="sm" />
              </CardRow>
            </CardContent>
          </Card>
        </View>

        {/* Как это работает */}
        <View className="px-4 pb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            How does it work?
          </Text>

          <Card variant="default">
            <CardContent className="p-0">
              <View className="flex-row items-start gap-3 px-4 py-4 border-b border-gray-200">
                <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
                  <QrCode size={20} color="#000000" />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-gray-700 leading-6">
                    You scan the station's QR code and take a powerbank
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3 px-4 py-4 border-b border-gray-200">
                <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
                  <Zap size={20} color="#000000" />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-gray-700 leading-6">
                    Charge up — cables are built-in. There's Type-C, micro-USB and Lightning for iPhone
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3 px-4 py-4">
                <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
                  <Home size={20} color="#000000" />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-gray-700 leading-6">
                    Return the powerbank to any station — can be found on the map
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
        <View className="h-10"></View>
      </ScrollView>
      <View className="px-4 pb-4 absolute bottom-4 left-0 right-0">
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
