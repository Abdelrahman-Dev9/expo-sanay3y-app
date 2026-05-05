import { useClerk } from "@clerk/expo";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const ProfileScreen = () => {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("Logged out successfully");
      router.push("/(auth)/login");
      // optionally navigate to login screen
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <>
      <View>
        <Text>welcome user</Text>
      </View>
      <View className="items-center justify-center flex-1">
        <TouchableOpacity
          onPress={handleLogout}
          className="px-6 py-3 bg-red-500 rounded-full"
        >
          <Text className="font-bold text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ProfileScreen;
