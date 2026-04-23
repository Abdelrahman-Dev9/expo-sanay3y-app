import { useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
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
  StatusBar,
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
import { useLoginMutation } from "../src/services/authApi";

// Zod Schema
const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Email or phone number is required")
    .refine((value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }, "Please enter a valid email or phone number"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface FormFieldErrorProps {
  message?: string;
}

const FormFieldError: React.FC<FormFieldErrorProps> = ({ message }) => {
  if (!message) return null;
  return <Text className="text-red-500 text-sm mt-1.5">{message}</Text>;
};

const Login = () => {
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const { startSSOFlow } = useSSO();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await login({
        email: data.emailOrPhone.trim(),
        password: data.password,
      }).unwrap();

      router.push("/(tabs)/second");

      console.log(res);
      Alert.alert(res.message || "Login successful");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Signup failed");
    }
  };

  const handleGoogle = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
      }
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
    } catch (err) {
      console.log("Apple error:", err);
    }
  };

  const handleForgotPassword = () => {
    console.log("Navigate to forgot password screen");
    // router.push('/forgot-password');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <SafeAreaView>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {/* Header */}
          <View className="px-6 pt-6 pb-8">
            <View className="flex-row items-center gap-2">
              <View className="w-10 h-10 bg-teal-700 rounded-lg justify-center items-center">
                <Text className="text-white font-bold text-lg">↑</Text>
              </View>
              <Text className="text-xl font-bold">
                <Text className="text-gray-900">ProLink</Text>
                <Text className="text-teal-700">Nexus</Text>
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <View className="mx-4 bg-white rounded-3xl px-6 py-8 mb-6">
            {/* Welcome Section */}
            <View className="mb-8">
              <Text className="text-4xl font-bold text-gray-900 mb-3">
                Welcome Back
              </Text>
              <Text className="text-gray-600 text-base leading-6">
                Please enter your details to access the marketplace.
              </Text>
            </View>

            {/* Email or Phone Input */}
            <View className="mb-6">
              <Text className="text-gray-900 font-semibold mb-3">
                Email or Phone
              </Text>
              <Controller
                control={control}
                name="emailOrPhone"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <TextInput
                      placeholder="artisan@prolink.com"
                      placeholderTextColor="#d1d5db"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      editable={!loading}
                      className={`bg-gray-100 border-2 rounded-2xl px-4 py-3.5 text-gray-900 text-base ${
                        errors.emailOrPhone
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                    />
                    <FormFieldError message={errors.emailOrPhone?.message} />
                  </>
                )}
              />
            </View>

            {/* Password Input with Forgot Password Link */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-900 font-semibold">Password</Text>
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  disabled={loading}
                >
                  <Text className="text-teal-700 font-semibold text-sm">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <View
                      className={`bg-gray-100 border-2 rounded-2xl px-4 py-3.5 flex-row justify-between items-center ${
                        errors.password
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                    >
                      <TextInput
                        placeholder="••••••••"
                        placeholderTextColor="#9ca3af"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showPassword}
                        editable={!loading}
                        className="flex-1 text-gray-900 text-base"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons
                          name={showPassword ? "eye" : "eye-off"}
                          size={20}
                          color="#6b7280"
                        />
                      </TouchableOpacity>
                    </View>
                    <FormFieldError message={errors.password?.message} />
                  </>
                )}
              />
            </View>

            {/* Log In Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={loading || !isDirty}
              className={`rounded-full py-4 mb-6 flex-row justify-center items-center ${
                loading || !isDirty ? "bg-teal-600 opacity-70" : "bg-teal-700"
              }`}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-bold text-lg">Log In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center gap-3 mb-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="text-gray-500 text-xs font-semibold tracking-wider uppercase">
                OR CONTINUE WITH
              </Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Login Buttons */}
            <View className="flex-row gap-3 mb-8">
              {/* Google Button */}
              <TouchableOpacity
                onPress={() => handleGoogle()}
                disabled={loading}
                className="flex-1 bg-gray-100 rounded-full py-3.5 flex-row justify-center items-center gap-2 border border-gray-200"
                activeOpacity={0.7}
              >
                <Ionicons name="logo-google" size={18} color="#1f2937" />
                <Text className="text-gray-900 font-semibold text-sm">
                  Google
                </Text>
              </TouchableOpacity>

              {/* Apple Button */}
              <TouchableOpacity
                onPress={() => handleApple()}
                disabled={loading}
                className="flex-1 bg-gray-100 rounded-full py-3.5 flex-row justify-center items-center gap-2 border border-gray-200"
                activeOpacity={0.7}
              >
                <Ionicons name="logo-apple" size={18} color="#1f2937" />
                <Text className="text-gray-900 font-semibold text-sm">
                  Apple
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center gap-1">
              <Text className="text-gray-700 text-center">
                New to ProLink?{" "}
              </Text>
              <TouchableOpacity
                disabled={loading}
                onPress={() => router.push("/(auth)/signup")}
              >
                <Text className="text-teal-700 font-bold">
                  Create an account
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Security Notice */}
          <View className="mx-4 mb-6">
            <View className="flex-row gap-3">
              <Ionicons name="shield-checkmark" size={20} color="#6b7280" />
              <Text className="flex-1 text-gray-600 text-xs leading-5">
                Secured by architectural-grade encryption. Your professional
                data is managed with the highest curation standards.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View className="px-6 py-4 border-t border-gray-200">
            <Text className="text-center text-gray-500 text-xs tracking-wide uppercase">
              © 2024 THE ARTISAN MARKETPLACE ARCHITECTURE
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Login;
