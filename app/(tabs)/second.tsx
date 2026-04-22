import { useClerk } from "@clerk/expo";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("Logged out successfully");
      router.push("/(auth)/signup");
      // optionally navigate to login screen
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 px-6 py-3 rounded-full"
      >
        <Text className="text-white font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
