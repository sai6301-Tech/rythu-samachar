import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';

import { LanguageProvider } from '@/context/LanguageContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useNotificationNavigation } from '@/hooks/useNotificationNavigation';
import { initializeNotifications } from '@/services/notificationService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebaseApp';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      void initializeNotifications();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <LanguageProvider>
      <RootLayoutNav />
    </LanguageProvider>
  );
}

function RootLayoutNav() {
  useNotificationNavigation();
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const primary = scheme === 'dark' ? Colors.dark.tint : Colors.primary;
  const initialLoad = useRef(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      // Skip the very first emission — index.tsx handles initial routing
      if (initialLoad.current) {
        initialLoad.current = false;
        return;
      }
      if (!user) {
        router.replace('/(auth)/login');
      }
    });
    return unsub;
  }, []);

  const theme = {
    ...base,
    colors: {
      ...base.colors,
      primary,
      card: Colors[scheme].card,
      background: Colors[scheme].background,
      text: Colors[scheme].text,
    },
  };

  return (
    <ThemeProvider value={theme}>
      <Stack screenOptions={{ headerTintColor: primary }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
