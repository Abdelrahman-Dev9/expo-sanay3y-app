import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  Scale,
  Settings,
  Shield,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactElement;
  onPress: () => void;
}

interface ProfileScreenProps {
  userName?: string;
  profileImage?: string;
  onBackPress?: () => void;
  onSettingsPress?: () => void;
  onMenuItemPress?: (menuId: string) => void;
  onLogoutPress?: () => void;
}

const DEFAULT_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop";

export default function ProfileScreen({
  userName = "Elena Vance",
  profileImage = DEFAULT_PROFILE_IMAGE,
  onBackPress,
  onSettingsPress,
  onMenuItemPress,
  onLogoutPress,
}: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const handlePress = (id: string) => {
    if (onMenuItemPress) {
      onMenuItemPress(id);
    } else {
      console.log(id);
    }
  };

  const accountManagementItems: MenuItem[] = [
    {
      id: "account-info",
      title: "Account Info",
      subtitle: "Personal details, address",
      icon: <User size={24} color="#0d6b6b" />,
      onPress: () => handlePress("account-info"),
    },
    {
      id: "security",
      title: "Security",
      subtitle: "Password, two-factor authentication",
      icon: <Shield size={24} color="#0d6b6b" />,
      onPress: () => handlePress("security"),
    },
    {
      id: "payment-methods",
      title: "Payment Methods",
      subtitle: "Saved cards, billing history",
      icon: <CreditCard size={24} color="#0d6b6b" />,
      onPress: () => handlePress("payment-methods"),
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Push, email preferences",
      icon: <Bell size={24} color="#0d6b6b" />,
      onPress: () => handlePress("notifications"),
    },
  ];

  const supportLegalItems: MenuItem[] = [
    {
      id: "help-center",
      title: "Help Center",
      icon: <HelpCircle size={24} color="#0d6b6b" />,
      onPress: () => handlePress("help-center"),
    },
    {
      id: "privacy-policy",
      title: "Privacy Policy",
      icon: <Scale size={24} color="#0d6b6b" />,
      onPress: () => handlePress("privacy-policy"),
    },
    {
      id: "terms-of-service",
      title: "Terms of Service",
      icon: <FileText size={24} color="#0d6b6b" />,
      onPress: () => handlePress("terms-of-service"),
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      onPress={item.onPress}
      className="flex-row items-center justify-between p-4 mb-3 bg-white border rounded-xl border-slate-100"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1 gap-3">
        <View className="items-center justify-center w-10 h-10 rounded-full bg-slate-100">
          {item.icon}
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-slate-900">
            {item.title}
          </Text>

          {item.subtitle ? (
            <Text className="mt-1 text-xs text-slate-600">{item.subtitle}</Text>
          ) : null}
        </View>
      </View>

      <ChevronRight size={20} color="#94a3b8" />
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    try {
      setLoading(true);
      await onLogoutPress?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-slate-200">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onBackPress} className="p-2 -ml-2">
              <ChevronLeft size={24} color="#64748b" />
            </TouchableOpacity>

            <Text className="flex-1 text-lg font-semibold text-center text-slate-900">
              Profile
            </Text>

            <TouchableOpacity onPress={onSettingsPress} className="p-2 -mr-2">
              <Settings size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 pt-8">
          {/* Profile */}
          <View className="items-center mb-8">
            <View className="relative mb-4">
              <View className="w-32 h-32 overflow-hidden border-4 rounded-full border-slate-200 bg-slate-200">
                <Image
                  source={{ uri: profileImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="absolute bottom-0 right-0 items-center justify-center w-10 h-10 bg-teal-700 border-4 border-white rounded-full">
                <Text className="text-lg text-white">✓</Text>
              </View>
            </View>

            <Text className="mb-2 text-2xl font-bold text-slate-900">
              {userName}
            </Text>

            <View className="px-4 py-2 bg-teal-100 rounded-full">
              <Text className="text-xs font-bold text-teal-700">
                PRO MEMBER
              </Text>
            </View>
          </View>

          {/* Account */}
          <View className="mb-8">
            <Text className="mb-4 text-xs font-bold tracking-wide text-slate-500">
              ACCOUNT MANAGEMENT
            </Text>
            {accountManagementItems.map(renderMenuItem)}
          </View>

          {/* Support */}
          <View className="mb-8">
            <Text className="mb-4 text-xs font-bold tracking-wide text-slate-500">
              SUPPORT & LEGAL
            </Text>
            {supportLegalItems.map(renderMenuItem)}
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            disabled={loading}
            className="flex-row items-center justify-center w-full gap-2 px-6 py-4 mb-6 rounded-full bg-slate-200"
          >
            <LogOut size={20} color="#dc2626" />
            <Text className="text-base font-semibold text-red-600">
              {loading ? "Logging out..." : "Log Out"}
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View className="items-center pb-4">
            <Text className="text-xs text-slate-500">
              ProLink Nexus v2.4.0 • Crafted with Precision
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
