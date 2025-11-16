import { ProfileLegal, ProfileNotificationsToggle, ProfilePersonal } from "@/shared/ui/profile";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
  };

  return (
    <SafeAreaView
      className="bg-white flex-1"
    >
      <ScreenTitle title="Profile" />
      <View className="relative flex-1">
        {scrollY > 0 && (
          <View className="absolute top-0 left-0 right-0 h-[1px] bg-gray-300 z-10" />
        )}
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className="bg-gray-100">
            <ProfilePersonal />
            <ProfileNotificationsToggle />
            <ProfileLegal />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}