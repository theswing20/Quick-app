import { PaymentMethodSelectorButton } from "@/features/payment-methods";
import { PRICE } from "@/shared/lib/mocks";
import { useNewRentStore } from "@/shared/stores/new-rent-store";
import { useRentStore } from "@/shared/stores/rent-store";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardRow } from "@/shared/ui/card";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { useRouter } from "expo-router";
import { Clock, Home, QrCode, Zap } from "lucide-react-native";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PreRentInfo() {
  const router = useRouter();
  const cabinetInfo = useNewRentStore((state) => state.cabinetInfo);
  const activeRental = useRentStore((state) => state.rental);

  const startRent = () => {
    console.log("startRent");
    if (activeRental) {
      Alert.alert("You have an active rental", "Please finish the current rental before starting a new one", [
        { text: "OK", style: "default", onPress: () => { } },
      ]);
      return;
    }
    router.push("/(app)/rent/rent-request");
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
            <QrCode /><Text className="text-xl font-bold text-gray-900 mb-1">{cabinetInfo?.qrCode}</Text>
          </View>
        </View>

        <View className="px-4 py-2">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {cabinetInfo?.modelName}
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            {cabinetInfo?.address}
          </Text>
        </View>

        <View className="px-4 pb-4">
          <Card variant="elevated" className="bg-gray-50">
            <CardContent className="p-0">
              <CardRow withBorder>
                <View className="flex-row items-center gap-2">
                  <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                    <Text className="text-xs font-medium text-gray-900">1</Text>
                  </View>
                  <Text className="text-base font-medium text-gray-900">
                    First hour
                  </Text>
                </View>
                <Text className="text-sm font-medium text-gray-900">
                    {PRICE.firstHour} AED
                </Text>
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
                <Text className="text-sm font-medium text-gray-900">
                    {PRICE.remaining23Hours} AED
                </Text>
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
                <Text className="text-sm font-medium text-gray-900">
                    {PRICE.nextDay} AED
                </Text>
              </CardRow>
              <View className="px-4 pb-4 pt-2">
                <PaymentMethodSelectorButton />
              </View>
            </CardContent>
          </Card>
        </View>
        {/* Deposit information */}
        <View className="px-6 pb-6">
          <View className="flex-row flex-wrap items-center">
            <Text className="text-sm text-gray-600 leading-6">
              Initially{" "}
            </Text>
            <Text className="text-sm text-gray-600 leading-6">
                {PRICE.nextDay.toLocaleString()} AED
            </Text>
            <Text className="text-sm text-gray-600 leading-6">
              {" "}will be frozen — this is a deposit.
            </Text>
          </View>
          <Text className="text-sm text-gray-600 leading-6 mt-2">
            After returning the power bank, excess money will be returned.
          </Text>
        </View>

        <View className="px-4 pb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            How to return?
          </Text>

          <Card variant="default">
            <CardContent className="p-0">
              <View className="flex-row items-start gap-3 px-4 py-4 border-b border-gray-200">
                <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
                  <Zap size={20} color="#000000" />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-gray-700 leading-6">
                    Find any nearby station on the map - they're marked with special icons
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3 px-4 py-4 border-b border-gray-200">
                <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
                  <Clock size={20} color="#000000" />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-gray-700 leading-6">
                    Make sure the station is active and has available slots
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3 px-4 py-4">
                <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
                  <Home size={20} color="#000000" />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-gray-700 leading-6">
                    Insert the power bank into one of the empty slots
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
          <View className="mt-6">
            <Text className="text-gray-500 text-sm">
              By tapping "Take", you agree to the <Text className="underline">Terms of Use</Text> and the <Text className="underline">Adhesion Agreement</Text>.
            </Text>
          </View>
        </View>
        <View className="h-10"></View>
      </ScrollView>
      <View className="px-4 pb-4 absolute bottom-4 left-0 right-0">
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
