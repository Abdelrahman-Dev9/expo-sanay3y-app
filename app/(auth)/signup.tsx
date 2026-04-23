import { useSSO } from "@clerk/expo";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { z } from "zod";
import { useSignupMutation } from "../src/services/authApi";

// ✅ Schema
const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").trim(),
  email: z.string().email("Please enter a valid email").trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept terms",
  }),
});

type SignupFormData = z.infer<typeof signupSchema>;

// Error
const FormFieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <Text className="text-red-500 text-sm mt-1">{message}</Text>;
};

// Checkbox
const CustomCheckbox = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (val: boolean) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onChange(!value)}
      className={`w-6 h-6 rounded border-2 justify-center items-center ${
        value ? "bg-teal-700 border-teal-700" : "border-gray-300"
      }`}
    >
      {value && <Ionicons name="checkmark" size={16} color="white" />}
    </TouchableOpacity>
  );
};

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);

  const [signup, { isLoading }] = useSignupMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const res = await signup({
        name: data.fullName.trim(),
        email: data.email.trim(),
        password: data.password,
      }).unwrap();

      console.log(res);
      Alert.alert(res.message || "Signup successful");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Signup failed");
    }
  };

  const { startSSOFlow } = useSSO();

  const handleGoogle = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
      }
      router.push("/(tabs)/second");
    } catch (err) {
      console.log("Google error:", err);
    }
  };
  const handleApple = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_apple",
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
      }
      router.push("/(tabs)/second");
    } catch (err) {
      console.log("Apple error:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-100"
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {/* Header */}
          <View className="px-6 pt-8 pb-6">
            <Text className="text-4xl font-bold text-gray-900">
              Create your account
            </Text>
            <Text className="text-gray-600 mt-4 text-[16px]">
              Join an architectural marketplace where every connection is a
              masterpiece.
            </Text>
          </View>

          {/* Form */}
          <View className="mx-6 bg-white rounded-3xl p-4 py-10 ">
            {/* Full Name */}
            <View className="mb-6">
              <Text className="font-semibold mb-3">Full Name</Text>
              <Controller
                control={control}
                name="fullName"
                render={({ field }) => (
                  <>
                    <TextInput
                      placeholder="John Doe"
                      value={field.value}
                      onChangeText={field.onChange}
                      className={`border-2 rounded-xl px-4 py-3 ${
                        errors.fullName ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    <FormFieldError message={errors.fullName?.message} />
                  </>
                )}
              />
            </View>

            {/* Email */}
            <View className="mb-6">
              <Text className="font-semibold mb-3">Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <>
                    <TextInput
                      placeholder="example@email.com"
                      value={field.value}
                      onChangeText={field.onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className={`border-2 rounded-xl px-4 py-3 ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    <FormFieldError message={errors.email?.message} />
                  </>
                )}
              />
            </View>

            {/* Password */}
            <View className="mb-6">
              <Text className="font-semibold mb-3">Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <>
                    <View
                      className={`border-2 rounded-xl px-4 py-3 flex-row items-center ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      }`}
                    >
                      <TextInput
                        placeholder="Min 8 characters"
                        value={field.value}
                        onChangeText={field.onChange}
                        secureTextEntry={!showPassword}
                        className="flex-1"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons
                          name={showPassword ? "eye" : "eye-off"}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                    <FormFieldError message={errors.password?.message} />
                  </>
                )}
              />
            </View>

            {/* Terms */}
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <View className="flex-row items-center gap-2 mb-2">
                  <CustomCheckbox
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <Text>
                    I agree to the Terms of Service and Privacy Policy
                  </Text>
                </View>
              )}
            />
            <FormFieldError message={errors.terms?.message} />

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isLoading}
              className={`rounded-full py-4 mt-4 flex-row justify-center ${
                !isValid || isLoading ? "bg-teal-600 opacity-60" : "bg-teal-900"
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center justify-center mt-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-3 text-gray-500">or</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Buttons */}
            <View className="flex-row gap-4 mt-6">
              <TouchableOpacity
                onPress={handleGoogle}
                className="flex-1 flex-row items-center justify-center bg-white border border-gray-300 py-4 rounded-full"
              >
                <FontAwesome name="google" size={18} color="#EA4335" />
                <Text className="ml-2 font-semibold">Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleApple}
                className="flex-1 flex-row items-center justify-center bg-black py-4 rounded-full"
              >
                <Ionicons name="logo-apple" size={20} color="white" />
                <Text className="ml-2 font-semibold text-white">Apple</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between mt-10">
              <Text className="font-bold text-[16px]">
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/login")}
                className="text-teal-900"
              >
                <Text className="text-teal-900 text-[15px] font-semibold">
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
