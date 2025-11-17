import { ClerkProviderWrapper } from "@/app/providers";
import { registerForPushNotificationsAsync } from "@/features/notifications";
import { NAV_THEME } from "@/shared/lib/theme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost } from "@rn-primitives/portal";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  console.log("Sending push notification to", expoPushToken);
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export default function RootLayout() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        sendPushNotification(expoPushToken);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ClerkProviderWrapper>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: NAV_THEME.light.colors.background,
                },
                headerShown: false,
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen
                name="phone-verification"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(auth)"
                options={{
                  presentation: "modal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(app)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(profile)"
                options={{
                  headerShown: false,
                  gestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="(wallet)"
                options={{
                  headerShown: false,
                  gestureEnabled: true,
                }}
              />
            </Stack>
            <PortalHost />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ClerkProviderWrapper>
    </SafeAreaProvider>
  );
}
