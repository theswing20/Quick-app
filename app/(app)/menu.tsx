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
        router.push("/(wallet)/wallet");
      },
    },
    {
      id: "history",
      title: "History",
      icon: Clock,
      onPress: () => console.log("History pressed"),
    },
    {
      id: "payment",
      title: "Payment Method",
      icon: CreditCard,
      onPress: () => console.log("Payment Method pressed"),
    },
  ];


  return (
    <SafeAreaView className="bg-gray-50 px-5 pt-8 pb-10 h-full flex-col ">
      <View className="flex-row flex-wrap gap-4 w-full justify-between">
        <ProfileButton/>
        {menuItems.map((item) => (
          <BurgerMenuButton item={item} key={item.id}/>
        ))}
      </View>
    </SafeAreaView>
  );
}