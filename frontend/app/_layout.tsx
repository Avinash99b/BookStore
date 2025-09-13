import React, { useEffect } from "react";
import { Alert } from "react-native";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/src/context/AuthContext";

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <Stack screenOptions={{headerShown: false}}/>
            </QueryClientProvider>
        </AuthProvider>
    );
}
