import { SignOutButton } from "@/features/auth/login";
import { MapView } from "@/features/maps/map";
import { View } from "react-native";

function Home() {
  return (
    <View className="flex-1">
      <View className="mt-10">
        <SignOutButton />
      </View>
      <MapView />
    </View>
  );
}

export default Home;
