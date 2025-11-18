import { ChevronRight, Trash2, LogOut } from "lucide-react-native"
import { Alert, Text, TouchableOpacity, View } from "react-native"
import { ScreenSection } from "../screen-section"
import { useAuth } from "@clerk/clerk-expo";

export const ProfileLegal = () => {
    const { sessionId, signOut } = useAuth();

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
            <Text className="text-xl font-medium flex-1 mb-4">Legal</Text>
            <View className="flex-col items-start justify-between bg-gray-50 rounded-3xl overflow-hidden mb-4">
                <TouchableOpacity className="w-full flex-row items-center justify-between border-solid border-[1px] border-gray-50 p-4">
                    <Text className="text-base ">Terms of Service</Text>
                    <View className="w-10 h-10 flex items-center justify-center rounded-full">
                        <ChevronRight size={24} color="#000000" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity className="w-full flex-row items-center justify-between border-solid border-[1px] border-gray-50 p-4">
                    <Text className="text-base ">Privacy Policy</Text>
                    <View className="w-10 h-10 flex items-center justify-center rounded-full">
                        <ChevronRight size={24} color="#000000" />
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity className="w-full flex-row items-center justify-between border-solid border-[1px] border-gray-50 p-4 bg-gray-50 mb-4 rounded-3xl">
                <Text className="text-base text-[#FF0000]">Delete Account</Text>
                <View className="w-10 h-10 flex items-center justify-center rounded-full">
                    <Trash2 size={24} color="#FF0000" />
                </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="w-full flex-row items-center justify-between border-solid border-[1px] border-gray-50 p-4 bg-gray-50 rounded-3xl"
              onPress={handleLogout}
            >
                <Text className="text-base ">Sign Out</Text>
                <View className="w-10 h-10 flex items-center justify-center rounded-full">
                    <LogOut size={24} color="#000000" />
                </View>
            </TouchableOpacity>
        </ScreenSection>
    )
}