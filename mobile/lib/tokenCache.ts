import * as SecureStore from "expo-secure-store";
import { TokenCache } from "@clerk/clerk-expo";

export const tokenCache: TokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};
