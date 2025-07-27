import {
    DefaultTheme,
    ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from 'react-native';
import "react-native-reanimated";

import { SharedStyles } from "@/constants/SharedStyles";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "@ant-design/react-native";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    if (!loaded) {
        return null;
    }

    const customTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: 'transparent',
        },
    };

    return (
        <View style={SharedStyles.safeArea}>
            <ThemeProvider value={customTheme}>
                <Provider>
                    <AuthProvider>
                        <CartProvider>
                            <Stack
                                screenOptions={{
                                    contentStyle: { 
                                        flex: 1,
                                        backgroundColor: 'transparent'
                                    },
                                }}
                            >
                                <Stack.Screen
                                    name="index"
                                    options={{ 
                                        headerShown: false,
                                        contentStyle: { 
                                            flex: 1,
                                            backgroundColor: 'transparent'
                                        }
                                    }}
                                />
                                <Stack.Screen
                                    name="login"
                                    options={{ 
                                        headerShown: false,
                                        contentStyle: { 
                                            flex: 1,
                                            backgroundColor: 'transparent'
                                        }
                                    }}
                                />
                                <Stack.Screen
                                    name="register"
                                    options={{ 
                                        headerShown: false,
                                        contentStyle: { 
                                            flex: 1,
                                            backgroundColor: 'transparent'
                                        }
                                    }}
                                />
                                <Stack.Screen
                                    name="(tabs)"
                                    options={{ 
                                        headerShown: false,
                                        contentStyle: { 
                                            flex: 1,
                                            backgroundColor: 'transparent'
                                        }
                                    }}
                                />
                                <Stack.Screen name="+not-found" />
                            </Stack>
                            <StatusBar style="light" backgroundColor="transparent" translucent />
                        </CartProvider>
                    </AuthProvider>
                </Provider>
            </ThemeProvider>
        </View>
    );
}
    