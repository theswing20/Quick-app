import { useDeviceRegistration } from "@/features/notifications/use-device-registration";
import {
  useWarmUpBrowser,
  WebBrowser,
} from "@/shared/hooks/use-warm-up-browser";
import { Button } from "@/shared/ui/button";
import { Text } from "@/shared/ui/text";
import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Svg, { Path } from "react-native-svg";

WebBrowser.maybeCompleteAuthSession();

export const AppleSignInButton = () => {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { registerDevice } = useDeviceRegistration();

  const onPress = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_apple",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      console.log("createdSessionId", createdSessionId);

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            // Check for tasks and navigate to custom UI to help users resolve them
            // See https://clerk.com/docs/custom-flows/overview#session-tasks
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }

            const hasPhoneNumber =
              (session?.user?.phoneNumbers?.length ?? 0) > 0;

            if (!hasPhoneNumber) {
              router.replace("/phone-verification");
              return;
            }

            // Регистрируем устройство после успешной авторизации
            try {
              await registerDevice();
            } catch (error) {
              console.error("Failed to register device:", error);
            }

            router.replace("/");
          },
        });
      } else {
        console.log("no createdSessionId");

        // Check if signUp requires phone number
        if (signUp?.missingFields?.includes("phone_number")) {
          // signUp object is automatically available via useSignUp() hook
          // Redirect to phone verification where we'll use signUp.update() and signUp.create()
          router.replace("/phone-verification");
          return;
        }

        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
        console.log("Missing requirements:", {
          signUpMissingFields: signUp?.missingFields,
          signInError: signIn?.firstFactorVerification?.error,
        });
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      console.log("error");

      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, startSSOFlow, router, registerDevice]);

  return (
    <Button
      onPress={onPress}
      size="lg"
      className="w-full mb-4 bg-black rounded-lg"
      disabled={isLoading}
      style={{ backgroundColor: "#000000" }}
    >
      <View className="flex-row items-center justify-center gap-3">
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="white">
            <Path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </Svg>
        )}
        <Text className="text-base font-semibold text-white">
          {isLoading ? "Signing in..." : "Continue with Apple"}
        </Text>
      </View>
    </Button>
  );
};

export default AppleSignInButton;
