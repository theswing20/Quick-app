import { LucideIcon } from "lucide-react-native";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

interface ItemProps {
  id: string;
  title: string;
  icon: LucideIcon;
  onPress: () => void,
}

export const BurgerMenuButton = (props: { item: ItemProps }) => {
  const { item } = props
  const screenWidth = Dimensions.get('window').width;
  const computedWidth = screenWidth * 0.5 - 30;
  const IconComponent = item.icon;

  return <TouchableOpacity
    key={item.id}
    activeOpacity={0.7}
    onPress={item.onPress}
    style={{ maxWidth: computedWidth }}
    className={"w-full justify-center rounded-2xl bg-white p-6 h-[160px] flex-col gap-6 shadow-sm"}
  >
    <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-primary">
      <IconComponent size={20} color="#000000" />
    </View>
    <Text className="text-lg font-semibold text-gray-900 text-start">
      {item.title}
    </Text>
  </TouchableOpacity>
}