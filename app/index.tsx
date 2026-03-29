import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import { auth } from '@/services/firebaseApp';

const SPLASH_MS = 3000;

export default function SplashScreen() {
  const { t } = useLanguage();
  const navigated = useRef(false);

  useEffect(() => {
    const started = Date.now();
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsub = onAuthStateChanged(auth, (user) => {
      if (timer) clearTimeout(timer);
      const wait = Math.max(0, SPLASH_MS - (Date.now() - started));
      timer = setTimeout(() => {
        if (navigated.current) return;
        navigated.current = true;
        if (user) {
          router.replace('/news');
        } else {
          router.replace('/login');
        }
      }, wait);
    });

    return () => {
      unsub();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌾</Text>
      <Text style={styles.titleTe}>రైతు సమాచార్</Text>
      <Text style={styles.title}>{t('appTitle')}</Text>
      <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B5E20',
    padding: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  titleTe: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 18,
    marginBottom: 24,
  },
  spinner: {
    marginTop: 16,
  },
});
