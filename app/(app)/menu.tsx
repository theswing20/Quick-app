import { BurgerMenuButton } from "@/shared/ui/burger-menu-button";
import { ProfileButton } from "@/shared/ui/profile-button";
import { useRouter } from "expo-router";
import { Clock, CreditCard, WalletMinimal } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Menu() {
  const router = useRouter();
  const menuItems = [
    {
      id: "wallet",
      title: "Wallet",
      icon: WalletMinimal,
      onPress: () => {
        router.dismiss(1);
        setTimeout(() => {
          router.push("/(app)/(wallet)/wallet");
        }, 100);
      },
    },
    {
      id: "history",
      title: "History",
      icon: Clock,
      onPress: () => {
        router.dismiss(1);
        setTimeout(() => {
          router.push("/(app)/(history)/history");
        }, 100);
      },
    },
    {
      id: "payment",
      title: "Payment Method",
      icon: CreditCard,
      onPress: () => {
        router.dismiss(1);
        setTimeout(() => {
          router.push("/(app)/(wallet)/payment-methods");
        }, 100);
      },
    },
  ];


  return (
    <SafeAreaView className="bg-gray-50 px-5 pt-8 pb-10 h-full flex-col ">
      <View className="flex-row flex-wrap gap-4 w-full justify-between">
        <ProfileButton />
        {menuItems.map((item) => (
          <BurgerMenuButton item={item} key={item.id} />
        ))}
      </View>
    </SafeAreaView>
  );
}