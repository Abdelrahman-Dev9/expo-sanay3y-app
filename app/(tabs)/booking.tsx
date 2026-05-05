import { ChevronLeft, Lock } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CONSULTATION_DETAILS = {
  title: "Interior Consultation with Julian Thorne",
  service: "BESPOKE CURATION",
  artisan: "Julian Thorne",
  fee: 185.0,
  duration: 90,
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCzAOBRUfaGJHG_WTG8lgr2ng8CtrEHJNcBzhWz9QrNQK9Yvlu-m5_tw_kTU9OUESKTUJBhQiw_uaEjW1m1XA3Ms___BFE3Qjkc-wy9TtLMwzXmxq1ByQ7UUVXi7hc3Cnoq8ZCVXbpHadEbJIPZDlpapI-rSbC3-EjRIRyuQT3rJ9p9jzdrHBYv77tfDeyIIpuGXkmoGNAYhHjwr__2HnVd_BNKIQUBjS4ksDs51i55DZjc3r2JrJXAa7PoWw2mGOhIplyGBEHgE8s",
};

const TIME_SLOTS = [
  { id: "1", time: "09:00 AM", available: true },
  { id: "2", time: "11:00 AM", available: true },
  { id: "3", time: "01:30 PM", available: false },
  { id: "4", time: "02:00 PM", available: true },
  { id: "5", time: "04:00 PM", available: false },
  { id: "6", time: "05:30 PM", available: true },
];

export default function BookingScreen({ onBackPress, onConfirmBooking }: any) {
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const bookedDates: any = {
    "2026-05-10": { disabled: true, disableTouchEvent: true },
    "2026-05-12": { disabled: true, disableTouchEvent: true },
  };

  const onSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Error", "Please select both date and time");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 1500));
      onConfirmBooking?.(selectedDate, selectedTime);
    } catch (err) {
      Alert.alert("Error", "Booking failed");
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate =
    selectedDate && selectedTime
      ? `${selectedDate} - ${selectedTime}`
      : "Not selected";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 px-2 bg-white"
    >
      {/* HEADER */}
      <View className="flex-row items-center mt-20 border-b border-slate-200">
        <TouchableOpacity onPress={onBackPress}>
          <ChevronLeft size={24} color="#64748b" />
        </TouchableOpacity>

        <Text className="flex-1 font-semibold text-center text-slate-700">
          Booking
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 ">
          <Text className="mb-2 text-2xl font-bold">
            {CONSULTATION_DETAILS.title}
          </Text>

          {/* 📅 CALENDAR */}
          <View className="mb-6">
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
              }}
              markedDates={{
                ...bookedDates,
                [selectedDate || ""]: {
                  selected: true,
                  selectedColor: "#0f766e",
                },
              }}
              theme={{
                todayTextColor: "#0f766e",
                arrowColor: "#0f766e",
                selectedDayBackgroundColor: "#0f766e",
                selectedDayTextColor: "#fff",
              }}
            />
          </View>

          {/* TIME SLOTS */}
          <Text className="mb-3 text-lg font-bold">Available Slots</Text>

          <View className="flex-row flex-wrap gap-3 mb-6">
            {TIME_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                disabled={!slot.available}
                onPress={() =>
                  setSelectedTime(selectedTime === slot.time ? null : slot.time)
                }
                className={`px-4 py-3 rounded-lg min-w-[45%] items-center ${
                  !slot.available
                    ? "bg-slate-100"
                    : selectedTime === slot.time
                      ? "bg-teal-700"
                      : "bg-slate-100"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    !slot.available
                      ? "text-slate-400"
                      : selectedTime === slot.time
                        ? "text-white"
                        : "text-slate-700"
                  }`}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* IMAGE */}
          <Image
            source={{ uri: CONSULTATION_DETAILS.image }}
            className="w-full h-48 mb-6 rounded-2xl"
          />

          {/* SUMMARY */}
          <View className="mb-6">
            <Text className="mb-2">Fee: £{CONSULTATION_DETAILS.fee}</Text>
            <Text className="mb-2">
              Duration: {CONSULTATION_DETAILS.duration} min
            </Text>
            <Text className="font-semibold">Selected: {formattedDate}</Text>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            onPress={onSubmit}
            disabled={isLoading || !selectedDate || !selectedTime}
            className="items-center py-4 bg-teal-700 rounded-full"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-semibold text-white">Confirm Booking</Text>
            )}
          </TouchableOpacity>

          {/* FOOTER */}
          <View className="flex-row items-center justify-center gap-2 mt-4">
            <Lock size={14} color="#94a3b8" />
            <Text className="text-xs text-slate-500">
              SECURED BOOKING SYSTEM
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
