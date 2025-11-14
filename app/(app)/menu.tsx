import { BurgerMenuButton } from "@/shared/ui/burger-menu-button";
import { ProfileButton } from "@/shared/ui/profile-button";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Menu() {
  const menuItems = [
    {
      id: "wallet",
      title: "Wallet",
      icon: "wallet-outline" as const,
      onPress: () => console.log("Wallet pressed"),
    },
    {
      id: "history",
      title: "History",
      icon: "time-outline" as const,
      onPress: () => console.log("History pressed"),
    },
    {
      id: "payment",
      title: "Payment Method",
      icon: "card-outline" as const,
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