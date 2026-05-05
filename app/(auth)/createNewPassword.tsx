import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Check, Eye, EyeOff, Lock } from "lucide-react-native";
import React, { useMemo, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

// Zod validation schema
const createPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CreatePasswordFormData = z.infer<typeof createPasswordSchema>;

interface PasswordStrengthChecks {
  minLength: boolean;
  specialChar: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
}

interface CreateNewPasswordScreenProps {
  onBackPress?: () => void;
  onPasswordUpdated?: () => void;
}
const CreateNewPasswordScreen = ({
  onBackPress,
  onPasswordUpdated,
}: CreateNewPasswordScreenProps) => {
  const insets = useSafeAreaInsets();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreatePasswordFormData>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  // Calculate password strength requirements
  const passwordChecks = useMemo<PasswordStrengthChecks>(() => {
    return {
      minLength: newPassword.length >= 8,
      specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
    };
  }, [newPassword]);

  const onSubmit = async (data: CreatePasswordFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Success", "Your password has been updated successfully");
      onPasswordUpdated?.();
      router.push("/(auth)/login");
    } catch (error) {
      Alert.alert("Error", "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="flex-1 px-6 py-8">
          {/* Header with back button */}
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity
              onPress={onBackPress}
              className="p-2 -ml-2"
              accessibilityLabel="Go back"
            >
              <View className="items-center justify-center w-6 h-6">
                <Text className="text-2xl text-slate-600">‹</Text>
              </View>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-teal-700">
              Security
            </Text>
            <View className="w-6" />
          </View>

          {/* Title and Description */}
          <View className="mb-8">
            <Text className="mb-4 text-3xl font-bold text-teal-900">
              Create New Password
            </Text>
            <Text className="text-base leading-relaxed text-slate-600">
              Your new password must be different from your previous password.
            </Text>
          </View>

          {/* Password Form Card */}
          <View className="p-6 mb-6 bg-white border rounded-2xl border-slate-200">
            {/* New Password Field */}
            <View className="mb-6">
              <Text className="mb-3 text-base font-semibold text-slate-900">
                New Password
              </Text>
              <View className="flex-row items-center px-4 py-3 border rounded-lg bg-slate-100 border-slate-200">
                <Lock size={20} color="#94a3b8" style={{ marginRight: 12 }} />
                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="••••••••"
                      placeholderTextColor="#cbd5e1"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      secureTextEntry={!showNewPassword}
                      editable={!isLoading}
                      className="flex-1 text-base text-slate-900"
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  className="p-2 -mr-2"
                  accessibilityLabel="Toggle password visibility"
                >
                  {showNewPassword ? (
                    <Eye size={20} color="#64748b" />
                  ) : (
                    <EyeOff size={20} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <Text className="mt-2 text-sm text-red-600">
                  ⚠ {errors.newPassword.message}
                </Text>
              )}
            </View>

            {/* Confirm Password Field */}
            <View>
              <Text className="mb-3 text-base font-semibold text-slate-900">
                Confirm New Password
              </Text>
              <View className="flex-row items-center px-4 py-3 border rounded-lg bg-slate-100 border-slate-200">
                <Lock size={20} color="#94a3b8" style={{ marginRight: 12 }} />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="••••••••"
                      placeholderTextColor="#cbd5e1"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      secureTextEntry={!showConfirmPassword}
                      editable={!isLoading}
                      className="flex-1 text-base text-slate-900"
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-2 -mr-2"
                  accessibilityLabel="Toggle password visibility"
                >
                  {showConfirmPassword ? (
                    <Eye size={20} color="#64748b" />
                  ) : (
                    <EyeOff size={20} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text className="mt-2 text-sm text-red-600">
                  ⚠ {errors.confirmPassword.message}
                </Text>
              )}
            </View>
          </View>

          {/* Password Requirements */}
          <View className="flex-row flex-wrap gap-4 mb-8">
            {/* Min 8 characters */}
            <View className="flex-1 min-w-[45%] flex-row items-center gap-2">
              <View
                className={`w-5 h-5 rounded-full items-center justify-center ${
                  passwordChecks.minLength ? "bg-teal-600" : "bg-slate-300"
                }`}
              >
                {passwordChecks.minLength && (
                  <Check size={14} color="#ffffff" />
                )}
              </View>
              <Text
                className={`text-sm font-medium ${
                  passwordChecks.minLength ? "text-slate-900" : "text-slate-600"
                }`}
              >
                Min. 8 characters
              </Text>
            </View>

            {/* One special char */}
            <View className="flex-1 min-w-[45%] flex-row items-center gap-2">
              <View
                className={`w-5 h-5 rounded-full items-center justify-center ${
                  passwordChecks.specialChar ? "bg-teal-600" : "bg-slate-300"
                }`}
              >
                {passwordChecks.specialChar && (
                  <Check size={14} color="#ffffff" />
                )}
              </View>
              <Text
                className={`text-sm font-medium ${
                  passwordChecks.specialChar
                    ? "text-slate-900"
                    : "text-slate-600"
                }`}
              >
                One special char
              </Text>
            </View>

            {/* Uppercase */}
            <View className="flex-1 min-w-[45%] flex-row items-center gap-2">
              <View
                className={`w-5 h-5 rounded-full items-center justify-center ${
                  passwordChecks.uppercase ? "bg-teal-600" : "bg-slate-300"
                }`}
              >
                {passwordChecks.uppercase && (
                  <Check size={14} color="#ffffff" />
                )}
              </View>
              <Text
                className={`text-sm font-medium ${
                  passwordChecks.uppercase ? "text-slate-900" : "text-slate-600"
                }`}
              >
                Uppercase letter
              </Text>
            </View>

            {/* Lowercase */}
            <View className="flex-1 min-w-[45%] flex-row items-center gap-2">
              <View
                className={`w-5 h-5 rounded-full items-center justify-center ${
                  passwordChecks.lowercase ? "bg-teal-600" : "bg-slate-300"
                }`}
              >
                {passwordChecks.lowercase && (
                  <Check size={14} color="#ffffff" />
                )}
              </View>
              <Text
                className={`text-sm font-medium ${
                  passwordChecks.lowercase ? "text-slate-900" : "text-slate-600"
                }`}
              >
                Lowercase letter
              </Text>
            </View>

            {/* Number */}
            <View className="flex-1 min-w-[45%] flex-row items-center gap-2">
              <View
                className={`w-5 h-5 rounded-full items-center justify-center ${
                  passwordChecks.number ? "bg-teal-600" : "bg-slate-300"
                }`}
              >
                {passwordChecks.number && <Check size={14} color="#ffffff" />}
              </View>
              <Text
                className={`text-sm font-medium ${
                  passwordChecks.number ? "text-slate-900" : "text-slate-600"
                }`}
              >
                Number
              </Text>
            </View>
          </View>

          {/* Update Password Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`py-3 px-6 rounded-full items-center justify-center mb-8 ${
              isLoading ? "bg-teal-600" : "bg-teal-700"
            }`}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="#ffffff" size="small" />
                <Text className="font-semibold text-white">Updating...</Text>
              </View>
            ) : (
              <Text className="text-base font-semibold text-white">
                Update Password
              </Text>
            )}
          </TouchableOpacity>

          {/* Security Info */}
          <View className="flex-row items-center gap-3 p-4 bg-gray-200 border border-teal-100 rounded-3xl">
            <View className="items-center justify-center flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full">
              <Check size={20} color="#0d6b6b" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-900">
                ProLink Nexus Security
              </Text>
              <Text className="mt-1 text-xs text-slate-600">
                END-TO-END ENCRYPTION ENABLED
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateNewPasswordScreen;
