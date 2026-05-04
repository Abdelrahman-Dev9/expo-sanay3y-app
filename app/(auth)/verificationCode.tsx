import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Mail } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { z } from "zod";
import { useVerifyCodeMutation } from "../src/services/authApi";
import { RootState } from "../src/store/store";

// ✅ Validation
const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

const VerifyCodeScreen = ({ onBackPress, onVerifySuccess }: any) => {
  const insets = useSafeAreaInsets();

  const token = useSelector((state: RootState) => state.auth.resetToken); // ✅ جاي من forgot-password

  const [resendTimer, setResendTimer] = useState(0);
  const inputRef = useRef<TextInput | null>(null);

  // ✅ RTK Query
  const [verifyCode, { isLoading }] = useVerifyCodeMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: "" },
  });

  const codeValue = watch("code");

  // ⏱ resend timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendTimer]);

  // ✅ VERIFY API CALL
  const onSubmit = async (data: VerifyEmailFormData) => {
    if (!token) {
      Alert.alert("Error", "Token is missing. Please try again.");
      return;
    }

    try {
      const res = await verifyCode({
        token: token, // now guaranteed string
        code: data.code,
      }).unwrap();

      Alert.alert("Success", res.message);
      onVerifySuccess?.();
    } catch (error: any) {
      Alert.alert(
        "Verification Failed",
        error?.data?.message || "Invalid code"
      );
    }
  };

  // 🔁 resend (optional API later)
  const handleResendCode = async () => {
    try {
      Alert.alert("Success", "Verification code sent again");
      setResendTimer(60);
      setValue("code", "");
      inputRef.current?.focus();
    } catch {
      Alert.alert("Error", "Failed to resend code");
    }
  };

  const handleCodeChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9]/g, "").slice(0, 6);
    setValue("code", cleanedText);

    if (cleanedText.length === 6) {
      Keyboard.dismiss();
    }
  };

  const renderDigitCircles = () => (
    <View className="flex-row justify-center gap-3 mb-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <View
          key={index}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            codeValue[index] ? "bg-slate-900" : "bg-slate-200"
          }`}
        >
          {codeValue[index] && (
            <Text className="text-lg font-semibold text-white">
              {codeValue[index]}
            </Text>
          )}
        </View>
      ))}
    </View>
  );

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
      >
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity onPress={onBackPress}>
              <Text className="text-2xl text-slate-600">‹</Text>
            </TouchableOpacity>

            <Text className="text-lg font-semibold text-teal-700">
              Security
            </Text>

            <View className="w-6" />
          </View>

          {/* Title */}
          <View className="mb-8">
            <Text className="mb-4 text-3xl font-bold text-teal-800">
              Verify Email
            </Text>
            <Text className="text-base text-slate-600">
              Enter the 6-digit code sent to your email.
            </Text>
          </View>

          {/* Hidden Input */}
          <Controller
            control={control}
            name="code"
            render={({ field: { onBlur, value } }) => (
              <TextInput
                ref={inputRef}
                value={value}
                onChangeText={handleCodeChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                maxLength={6}
                editable={!isLoading}
                style={{ width: 0, height: 0, opacity: 0 }}
              />
            )}
          />

          {/* Circles */}
          <TouchableOpacity onPress={() => inputRef.current?.focus()}>
            {renderDigitCircles()}
          </TouchableOpacity>

          {/* Status */}
          <View className="items-center p-6 mb-8 bg-slate-100 rounded-xl">
            <View className="items-center justify-center mb-4 bg-teal-100 rounded-full w-14 h-14">
              <Mail size={28} color="#0d6b6b" />
            </View>
            <Text className="text-sm text-slate-400">AWAITING INPUT</Text>
          </View>

          {/* Error */}
          {errors.code && (
            <Text className="mb-4 text-sm text-red-600">
              ⚠ {errors.code.message}
            </Text>
          )}

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading || codeValue.length < 6}
            className="items-center py-3 mb-4 bg-teal-700 rounded-full"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-semibold text-white">Verify</Text>
            )}
          </TouchableOpacity>

          {/* Resend */}
          <View className="items-center mb-8">
            <Text className="mb-2 text-sm text-slate-600">
              Did not receive the code?
            </Text>

            <TouchableOpacity
              onPress={handleResendCode}
              disabled={resendTimer > 0}
            >
              <Text
                className={`font-semibold ${
                  resendTimer > 0 ? "text-slate-400" : "text-teal-700"
                }`}
              >
                {resendTimer > 0
                  ? `Resend Code (${resendTimer}s)`
                  : "Resend Code"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Help */}
          <TouchableOpacity className="flex-row justify-between p-4 rounded-lg bg-slate-100">
            <View className="flex-row items-center gap-3">
              <View className="items-center justify-center w-8 h-8 bg-teal-700 rounded-full">
                <Text className="text-white">?</Text>
              </View>
              <View>
                <Text className="font-semibold text-slate-900">Need help?</Text>
                <Text className="text-xs text-slate-600">Contact support</Text>
              </View>
            </View>

            <ChevronRight size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyCodeScreen;
