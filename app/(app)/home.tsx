import { MapView, type MapViewRef } from "@/features/maps/map";
import { router } from "expo-router";
import { LocateFixed, MapPin, Menu, QrCode } from "lucide-react-native";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Home() {
  const mapViewRef = useRef<MapViewRef>(null);

  const openMenu = () => {
    router.push("/(app)/menu");
  };

  const handleScanQr = () => {
    router.push("/(app)/qr-scanner");
  };

  const handleLocate = () => {
    mapViewRef.current?.centerOnUserLocation();
  };

  return (
    <View className="flex-1">
      <MapView ref={mapViewRef} />

      <SafeAreaView className="absolute inset-x-0 bottom-0 px-4 pb-4">
        <View className="flex-row items-center justify-between gap-3">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openMenu}
            className="h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg"
          >
            <Menu size={22} color="#101828" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleScanQr}
            className="flex-1 flex-row items-center justify-center rounded-3xl bg-primary px-4 py-4 shadow-lg text-primary"
          >
            <QrCode
              size={22}
              color="#101828"
              style={{ marginRight: 8 }}
            />
            <Text className="text-base font-semibold text-[#101828]">
              Scan QR-code
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLocate}
            className="h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg"
          >
            <LocateFixed size={22} color="#101828" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default Home;
