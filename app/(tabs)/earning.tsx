import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import {
  Search,
  TrendingUp,
  ChevronRight,
  Calendar,
  AlertCircle,
  Star,
  LogOut,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Project {
  id: string;
  title: string;
  date: string;
  projectId: string;
  amount: number;
  image: string;
  status: "COMPLETED" | "IN_PROGRESS";
}

interface EarningsDashboardScreenProps {
  onWithdrawPress?: () => void;
  onStatementPress?: () => void;
  onProjectPress?: (project: Project) => void;
  onProfilePress?: () => void;
  onSearchPress?: () => void;
}

const RECENT_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Curated Interior Photography",
    date: "Oct 12, 2023",
    projectId: "Project #0264",
    amount: 850.0,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    status: "COMPLETED",
  },
  {
    id: "2",
    title: "Brand Strategy Workshop",
    date: "Oct 10, 2023",
    projectId: "Project #0277",
    amount: 1200.0,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    status: "COMPLETED",
  },
  {
    id: "3",
    title: "Bespoke Living Room Layout",
    date: "Oct 08, 2023",
    projectId: "Project #0251",
    amount: 420.5,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    status: "COMPLETED",
  },
];

// Weekly summary data
const WEEKLY_DATA = [
  { day: "MON", value: 45 },
  { day: "TUE", value: 52 },
  { day: "WED", value: 48 },
  { day: "THU", value: 65 },
  { day: "FRI", value: 55 },
  { day: "SAT", value: 60 },
  { day: "SUN", value: 95 },
];

const maxValue = Math.max(...WEEKLY_DATA.map((d) => d.value));

export default function EarningsDashboardScreen({
  onWithdrawPress,
  onStatementPress,
  onProjectPress,
  onProfilePress,
  onSearchPress,
}: EarningsDashboardScreenProps) {
  const insets = useSafeAreaInsets();

  const renderBarChart = () => {
    return (
      <View className="flex-row items-end justify-between h-32 gap-2">
        {WEEKLY_DATA.map((item, index) => {
          const heightPercent = (item.value / maxValue) * 100;
          const isHighlight = index === WEEKLY_DATA.length - 1;

          return (
            <View key={item.day} className="items-center flex-1">
              <View
                className={`w-full rounded-t-lg ${
                  isHighlight ? "bg-teal-700" : "bg-slate-200"
                }`}
                style={{ height: `${heightPercent}%` }}
              />
              <Text className="mt-2 text-xs font-semibold text-slate-500">
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderProjectItem = (project: Project) => {
    const isCompleted = project.status === "COMPLETED";
    return (
      <TouchableOpacity
        key={project.id}
        onPress={() => onProjectPress?.(project)}
        className="flex-row items-center gap-3 pb-4 mb-4 border-b border-slate-200"
        activeOpacity={0.7}
      >
        {/* Project Image */}
        <Image
          source={{ uri: project.image }}
          className="w-16 h-16 rounded-lg"
          resizeMode="cover"
        />

        {/* Project Info */}
        <View className="flex-1">
          <Text className="mb-1 text-sm font-bold text-slate-900">
            {project.title}
          </Text>
          <Text className="mb-2 text-xs text-slate-600">
            {project.date} • {project.projectId}
          </Text>
          {isCompleted && (
            <View className="self-start px-2 py-1 rounded bg-teal-50">
              <Text className="text-xs font-semibold text-teal-700">
                COMPLETED
              </Text>
            </View>
          )}
        </View>

        {/* Amount */}
        <View className="items-end">
          <Text className="text-base font-bold text-teal-700">
            ${project.amount.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 bg-white"
    >
      {/* Header */}
      <View className="px-6 py-4 border-b border-slate-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <View className="items-center justify-center w-5 h-5 bg-teal-700 rounded-sm">
              <Text className="text-xs font-bold text-white">EA</Text>
            </View>
            <Text className="text-sm italic font-semibold text-slate-900">
              The Editorial Artisan
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={onSearchPress}>
              <Search size={20} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onProfilePress}
              className="items-center justify-center w-8 h-8 rounded-full bg-slate-900"
            >
              <Text className="text-xs font-bold text-white">JT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 pt-6">
          {/* Available Funds Section */}
          <View className="mb-8">
            <Text className="mb-2 text-xs font-semibold tracking-wide text-slate-500">
              AVAILABLE FUNDS
            </Text>
            <View className="flex-row items-baseline gap-1 mb-4">
              <Text className="text-5xl font-bold text-teal-900">$4,280</Text>
              <Text className="text-2xl font-semibold text-slate-400">.50</Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onWithdrawPress}
                className="flex-row items-center justify-center flex-1 gap-2 px-4 py-3 bg-teal-700 rounded-full"
                activeOpacity={0.8}
              >
                <Text className="font-semibold text-white">
                  Withdraw Earnings
                </Text>
                <TrendingUp size={16} color="#ffffff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onStatementPress}
                className="items-center flex-1 px-4 py-3 rounded-full bg-teal-50"
                activeOpacity={0.8}
              >
                <Text className="font-semibold text-teal-700">Statement</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Weekly Summary Section */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-lg font-bold text-slate-900">
                  Weekly Summary
                </Text>
                <Text className="text-sm text-slate-600">
                  +12% vs last week
                </Text>
              </View>
              <TrendingUp size={20} color="#0d6b6b" />
            </View>

            {/* Bar Chart */}
            {renderBarChart()}
          </View>

          {/* Recent Projects Section */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-slate-900">
                Recent Projects
              </Text>
              <TouchableOpacity className="flex-row items-center gap-1">
                <Text className="text-sm font-semibold text-teal-700">
                  View All History
                </Text>
                <ChevronRight size={16} color="#0d6b6b" />
              </TouchableOpacity>
            </View>

            {RECENT_PROJECTS.map((project) => renderProjectItem(project))}
          </View>

          {/* Rating Card */}
          <View className="p-6 mb-8 overflow-hidden bg-blue-600 bg-gradient-to-r rounded-2xl">
            {/* Background decoration */}
            <View className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16 bg-blue-600 rounded-full opacity-10" />

            <View className="flex-row items-center gap-2 mb-4">
              <View className="items-center justify-center w-10 h-10 bg-white rounded-full bg-opacity-20">
                <Star size={20} color="#ffffff" fill="#ffffff" />
              </View>
              <Text className="text-xs font-bold text-white">
                Top 2% Artisan
              </Text>
            </View>

            <Text className="mb-2 text-2xl font-bold text-white">
              Your rating is higher than average.
            </Text>
            <Text className="text-sm text-blue-100">
              Maintain a 4.9+ score to unlock express withdrawals.
            </Text>
          </View>

          {/* Next Payout Section */}
          <View className="p-4 mb-6 bg-slate-100 rounded-xl">
            <View className="flex-row items-center gap-3 mb-3">
              <Calendar size={20} color="#0d6b6b" />
              <Text className="text-base font-bold text-slate-900">
                Next Payout
              </Text>
            </View>

            <Text className="mb-2 text-lg font-bold text-slate-900">
              October 15, 2023
            </Text>

            <View className="flex-row items-start gap-2">
              <AlertCircle size={16} color="#64748b" style={{ marginTop: 2 }} />
              <Text className="flex-1 text-xs text-slate-600">
                Automatic transfer scheduled to your primary account (Bank
                ****4282).
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
