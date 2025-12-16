import { useSSO } from "@clerk/clerk-expo";
import { Alert } from "react-native";
import { useState } from "react";

const useSocialAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const {startSSOFlow} = useSSO()
    const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
        setIsLoading(true);
        try {
            const { createdSessionId, setActive } = await startSSOFlow({strategy});
            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
            } 
        } catch (error) {
            console.log("💥Error in social auth: ", error);
            const provider = strategy === "oauth_apple" ? "Apple" : "Google";
            Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`)
        }finally{
            setIsLoading(false)
        }
    }
  return {isLoading, handleSocialAuth}
}

export default useSocialAuth