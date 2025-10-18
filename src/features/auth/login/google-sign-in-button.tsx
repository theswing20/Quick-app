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

WebBrowser.maybeCompleteAuthSession();

export const GoogleSignInButton = () => {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onPress = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri(),
      });

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

            console.log("hasPhoneNumber", hasPhoneNumber);
            if (hasPhoneNumber) {
              router.replace("/");
            } else {
              router.replace("/(auth)/add-phone-number");
            }
          },
        });
      } else {
        console.log("no createdSessionId");

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
  }, [isLoading, startSSOFlow, router]);

  return (
    <Button
      onPress={onPress}
      size="lg"
      className="w-full mb-4 bg-blue-600"
      disabled={isLoading}
    >
      <View className="flex-row items-center justify-center gap-2">
        {isLoading && <ActivityIndicator size="small" color="white" />}
        <Text className="font-semibold text-white">
          {isLoading ? "Signing in..." : "Continue with Google"}
        </Text>
      </View>
    </Button>
  );
};

export default GoogleSignInButton;
