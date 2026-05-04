import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ArrowRight, CheckCircle, HelpCircle, Mail } from "lucide-react-native";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import { useForgetPasswordMutation } from "../src/services/authApi";
import { useDispatch } from "react-redux";
import { setResetToken } from "../src/store/authSlice";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();

  // ❗ use RTK loading instead of manual state
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const res = await forgetPassword({
        email: data.email.trim(),
      }).unwrap();
      dispatch(setResetToken(res.token));

      Alert.alert(res?.message || "If this email exists, a code was sent");

      // optional navigation (keep or remove)
      router.push("/(auth)/verificationCode");
    } catch (err: any) {
      console.log(err);

      Alert.alert("Error", err?.data?.message || "Something went wrong");
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
        className="flex-1 bg-gray-100"
      >
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="flex-row items-center justify-between p-1 px-6 mb-8 bg-white rounded-full">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 -ml-2"
            >
              <View className="items-center justify-center ">
                <Text className="text-2xl text-slate-600">‹</Text>
              </View>
            </TouchableOpacity>

            <Text className="text-lg font-semibold text-teal-700">
              Security
            </Text>

            <View className="w-6" />
          </View>

          {/* Title */}
          <View className="mt-8 mb-8">
            <Text className="mb-4 text-3xl font-bold text-slate-900">
              Forgot{"\n"}Password?
            </Text>

            <Text className="text-base leading-relaxed text-slate-600">
              Enter the email address associated with your{"\n"}account and we
              will send you a link to reset your{"\n"}password.
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6">
            <View>
              <Text className="mb-3 text-[16px] font-semibold text-slate-900">
                Email Address
              </Text>

              <View
                className={`flex-row items-center px-4 py-3 rounded-lg border ${
                  errors.email
                    ? "border-white bg-white"
                    : "border-slate-200 bg-white"
                }`}
              >
                <Mail
                  size={20}
                  color={errors.email ? "#ef4444" : "#94a3b8"}
                  style={{ marginRight: 12 }}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="name@example.com"
                      placeholderTextColor="#cbd5e1"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!isLoading}
                      className="flex-1 p-3 text-base rounded-lg text-slate-900"
                    />
                  )}
                />
              </View>

              {errors.email && (
                <View className="flex-row items-center mt-2">
                  <Text className="ml-0 text-sm text-red-600">
                    {errors.email.message}
                  </Text>
                </View>
              )}
            </View>

            {/* Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className={`flex-row items-center justify-center py-3 px-6 rounded-full mt-8 ${
                isLoading ? "bg-teal-600" : "bg-teal-700"
              }`}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text className="ml-2 font-semibold text-white">
                    Sending...
                  </Text>
                </>
              ) : (
                <>
                  <Text className="p-2 font-semibold text-white">
                    Send Reset Link
                  </Text>
                  <ArrowRight
                    size={20}
                    color="#ffffff"
                    style={{ marginLeft: 8 }}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Support */}
          <View className="items-center p-6 mt-8 bg-gray-200 rounded-lg ">
            <Text className="mb-3 text-sm text-slate-700">
              Still having trouble?
            </Text>

            <TouchableOpacity
              className="flex-row items-center justify-center"
              activeOpacity={0.7}
            >
              <HelpCircle size={18} color="#0d6b6b" />
              <Text className="ml-2 font-semibold text-teal-700">
                Contact Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
