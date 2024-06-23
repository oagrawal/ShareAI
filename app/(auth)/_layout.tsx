import { Stack, router } from "expo-router";
import { useAuth } from "../../provider/AuthProvider";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

// Simple stack layout within the authenticated area
const StackLayout = () => {
  const { signOut } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0f0f0f",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="list"
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.navigate("./profile")}>
              <FontAwesome6 name="face-laugh" size={30} color={"#fff"} />
            </TouchableOpacity>
          ),
          headerTitle: "My Files",
          headerRight: () => (
            <TouchableOpacity onPress={signOut}>
              <Ionicons name="log-out-outline" size={30} color={"#fff"} />
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
    </Stack>
  );
};

export default StackLayout;
