import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Search,
  MapPin,
  Zap,
  Wrench,
  ChevronRight,
  Star,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const searchSchema = z.object({
  searchQuery: z.string().optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface Guild {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface Artisan {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviewCount: number;
  price: number;
  image: string;
}

const GUILDS: Guild[] = [
  {
    id: "1",
    name: "Hydraulic Engineering",
    icon: <Zap size={24} color="#0d6b6b" />,
  },
  {
    id: "2",
    name: "Electrical Systems",
    icon: <Zap size={24} color="#0d6b6b" />,
  },
  {
    id: "3",
    name: "Diagnostics",
    icon: <Wrench size={24} color="#0d6b6b" />,
  },
];

const ARTISANS: Artisan[] = [
  {
    id: "1",
    name: "Julian Thorne",
    title: "5+ Years of Plumbing Excellence",
    rating: 4.7,
    reviewCount: 128,
    price: 85.0,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
  },
  {
    id: "2",
    name: "Elena Vance",
    title: "Smart Grid Integration Specialist",
    rating: 4.8,
    reviewCount: 94,
    price: 120.0,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop",
  },
  {
    id: "3",
    name: "Marcus Aris",
    title: "Specialist in Venetian Plaster",
    rating: 4.4,
    reviewCount: 67,
    price: 65.0,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
  },
];

interface ArtisanMarketplaceScreenProps {
  onArtisanPress?: (artisan: Artisan) => void;
  onGuildPress?: (guild: Guild) => void;
}

export default function ArtisanMarketplaceScreen({
  onArtisanPress,
  onGuildPress,
}: ArtisanMarketplaceScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const screenWidth = Dimensions.get("window").width;

  const { control, watch } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchQuery: "",
    },
  });

  const searchQuery = watch("searchQuery");

  const handleGuildPress = (guild: Guild) => {
    setSelectedGuild(selectedGuild === guild.id ? null : guild.id);
    onGuildPress?.(guild);
  };

  const renderGuildItem = ({ item }: { item: Guild }) => (
    <TouchableOpacity
      onPress={() => handleGuildPress(item)}
      className="items-center gap-2"
      activeOpacity={0.7}
    >
      <View
        className={`w-16 h-16 rounded-full items-center justify-center ${
          selectedGuild === item.id ? "bg-teal-100" : "bg-slate-100"
        }`}
      >
        {item.icon}
      </View>
      <Text
        className={`text-xs text-center font-medium ${
          selectedGuild === item.id ? "text-teal-700" : "text-slate-600"
        }`}
        numberOfLines={2}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderArtisanCard = ({ item }: { item: Artisan }) => (
    <TouchableOpacity
      onPress={() => onArtisanPress?.(item)}
      activeOpacity={0.8}
      className="mb-6"
    >
      {/* Artisan Image */}
      <View className="h-48 mb-3 overflow-hidden rounded-2xl bg-slate-200">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Artisan Info */}
      <View className="gap-1 mb-2">
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-lg font-bold text-slate-900">
            {item.name}
          </Text>
          <View className="flex-row items-center gap-1">
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
            <Text className="text-sm font-semibold text-slate-900">
              {item.rating}
            </Text>
          </View>
        </View>

        <Text className="text-xs text-slate-600">
          {item.reviewCount} Reviews
        </Text>
      </View>

      <Text className="mb-3 text-sm leading-relaxed text-slate-600">
        {item.title}
      </Text>

      {/* Price and Button */}
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs text-slate-500">STARTING AT</Text>
          <Text className="text-xl font-bold text-slate-900">
            £{item.price.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          className="flex-row items-center gap-2 px-6 py-2 bg-teal-700 rounded-full"
          activeOpacity={0.8}
        >
          <Text className="text-sm font-semibold text-white">
            Request Artisan
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 bg-white"
    >
      {/* Header Section */}
      <View className="px-6 pt-6 pb-4">
        {/* Location and Title */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-2">
            <MapPin size={16} color="#64748b" />
            <Text className="text-sm text-slate-600">London, UK</Text>
          </View>
          <Text className="text-sm font-semibold text-slate-900">
            The Editorial Artisan
          </Text>
          <TouchableOpacity>
            <Search size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center gap-3 mb-6">
          <View className="flex-row items-center flex-1 px-4 py-3 border rounded-lg bg-slate-100 border-slate-200">
            <Search size={18} color="#94a3b8" />
            <Controller
              control={control}
              name="searchQuery"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Search for an artisan"
                  placeholderTextColor="#cbd5e1"
                  onChangeText={onChange}
                  value={value}
                  className="flex-1 ml-2 text-base text-slate-900"
                />
              )}
            />
          </View>
          <TouchableOpacity className="px-4 py-3 bg-teal-700 rounded-lg">
            <Text className="text-sm font-semibold text-white">Find</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* The Guilds Section */}
      <View className="px-6 mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-slate-900">The Guilds</Text>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Text className="text-sm font-semibold text-teal-700">
              VIEW PORTFOLIO
            </Text>
            <ChevronRight size={16} color="#0d6b6b" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="gap-4"
          contentContainerStyle={{ gap: 16 }}
        >
          {GUILDS.map((guild) => (
            <View key={guild.id} className="items-center">
              {renderGuildItem({ item: guild })}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Selected Artisans Section */}
      <View className="px-6">
        <Text className="mb-6 text-lg font-bold text-slate-900">
          Selected Artisans
        </Text>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {ARTISANS.map((artisan) => (
            <View key={artisan.id} className="mr-4">
              {renderArtisanCard({ item: artisan })}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
