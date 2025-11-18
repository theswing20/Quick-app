import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Edit() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [value, setValue] = useState("");
    const { user } = useUser();
    const router = useRouter();
    const initValue = id === "name" ? user?.fullName : id === "email" ? user?.emailAddresses[0].emailAddress : "";

    const handleSave = async () => {
        if (id === "name") {
            const splittedName = value.split(" ");
            const firstName = splittedName[0];
            const lastName = splittedName.slice(1).join(" ");
            try {
                await user?.update({ firstName, lastName });
                router.back();
            } catch (error) {
                console.log("error", error);
            }
        } else if (id === "email") {
            console.log("email save pressed", value);
        }
    }

    useEffect(() => {
        setValue(initValue ?? "");
    }, [initValue]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScreenTitle title={id} />
            <View className="flex-1 flex-col items-center justify-center px-6">
                <Input
                    placeholder="Enter your name"
                    className="border-0 shadow-none text-center text-2xl font-bold"
                    style={{ textAlign: 'center' }}
                    value={value}
                    onChangeText={setValue}
                />
            </View>
            <View className="flex p-6">
                <Button className="h-14 rounded-xl" onPress={handleSave}>
                    <Text className="text-xl font-semibold text-primary-foreground">Save</Text>
                </Button>
            </View>
        </SafeAreaView>
    )
}