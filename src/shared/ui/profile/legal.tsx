import { useDeviceRegistration } from "@/features/notifications/use-device-registration";
import { useAuth } from "@clerk/clerk-expo";
import { ChevronRight, LogOut, Trash2 } from "lucide-react-native";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { ScreenSection } from "../screen-section";

export const ProfileLegal = () => {
  const { sessionId, signOut } = useAuth();
  const { unregisterDevice } = useDeviceRegistration();

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            // Удаляем устройство перед выходом
            try {
              await unregisterDevice();
            } catch (error) {
              console.error("Failed to unregister device:", error);
            }

            if (sessionId) {
              await signOut({ sessionId });
            }
          }
        }
      ]
    );
  };

  return (
    <ScreenSection roundedBottom={false}>
      <Text className="text-xl font-medium flex-1 mb-4 text-gray-900">Legal</Text>
      <View className="flex-col items-start justify-between bg-gray-50 rounded-2xl overflow-hidden mb-4">
        <TouchableOpacity className="w-full flex-row items-center justify-between border-b border-gray-200 p-4" activeOpacity={0.7}>
          <Text className="text-base font-medium text-gray-900">Terms of Service</Text>
          <View className="w-8 h-8 flex items-center justify-center rounded-full">
            <ChevronRight size={20} color="#000000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="w-full flex-row items-center justify-between p-4" activeOpacity={0.7}>
          <Text className="text-base font-medium text-gray-900">Privacy Policy</Text>
          <View className="w-8 h-8 flex items-center justify-center rounded-full">
            <ChevronRight size={20} color="#000000" />
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="w-full flex-row items-center justify-between border border-gray-200 p-4 bg-gray-50 mb-4 rounded-2xl" activeOpacity={0.7}>
        <Text className="text-base font-medium text-[#FF0000]">Delete Account</Text>
        <View className="w-8 h-8 flex items-center justify-center rounded-full">
          <Trash2 size={20} color="#FF0000" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full flex-row items-center justify-between border border-gray-200 p-4 bg-gray-50 rounded-2xl"
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Text className="text-base font-medium text-gray-900">Sign Out</Text>
        <View className="w-8 h-8 flex items-center justify-center rounded-full">
          <LogOut size={20} color="#000000" />
        </View>
      </TouchableOpacity>
    </ScreenSection>
  )
}