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
import Svg, { G, Path } from "react-native-svg";

WebBrowser.maybeCompleteAuthSession();

export const GoogleSignInButton = () => {
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
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri(),
        });
      console.log("signIn:", signIn);
      console.log("signUp:", signUp);

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/custom-flows/overview#session-tasks
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
        console.log("no createdSessionId", signUp);

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
      variant="outline"
      className="w-full mb-4 bg-white rounded-lg border border-gray-300"
      disabled={isLoading}
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#DADCE0",
        borderWidth: 1,
      }}
    >
      <View className="flex-row items-center justify-center gap-3">
        {isLoading ? (
          <ActivityIndicator size="small" color="#3c4043" />
        ) : (
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <G>
              <Path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <Path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <Path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <Path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </G>
          </Svg>
        )}
        <Text className="font-medium text-base" style={{ color: "#3c4043" }}>
          {isLoading ? "Signing in..." : "Continue with Google"}
        </Text>
      </View>
    </Button>
  );
};

export default GoogleSignInButton;
