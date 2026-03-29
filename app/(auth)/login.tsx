import { Redirect, router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import { isPlaceholderFirebaseConfig } from '@/constants/firebaseStatus';
import { auth } from '@/services/firebaseApp';
import { formatAuthError } from '@/utils/authErrors';

export default function LoginScreen() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [goHome, setGoHome] = useState(false);

  const needsFirebaseEnv = isPlaceholderFirebaseConfig();

  if (goHome) {
    return <Redirect href="/news" />;
  }

  function notifyError(msg: string) {
    setError(msg);
    if (Platform.OS === 'web') {
      console.warn('[login]', msg);
    } else {
      Alert.alert('Login', msg);
    }
  }

  async function handleLogin() {
    if (!email.trim() || !password) {
      notifyError('Enter email and password');
      return;
    }
    if (needsFirebaseEnv) {
      notifyError(
        'Firebase is not configured. Copy .env.example to .env, add your Web app EXPO_PUBLIC_FIREBASE_* values from Firebase Console, then restart Expo (npx expo start).',
      );
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setGoHome(true);
    } catch (e: unknown) {
      notifyError(formatAuthError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.gradient}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🌾</Text>
          <Text style={styles.titleTe}>రైతు సమాచార్</Text>
          <Text style={styles.title}>{t('appTitle')}</Text>

          {needsFirebaseEnv ? (
            <Text style={styles.banner}>
              Firebase keys are missing (using placeholders). Add a Web app config to{' '}
              <Text style={styles.bannerMono}>.env</Text> and restart the dev server.
            </Text>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>{t('email')}</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            placeholderTextColor="#9e9e9e"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>{t('password')}</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#9e9e9e"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => void handleLogin()}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('login')}</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.push('/signup')} style={styles.linkWrap}>
            <Text style={styles.link}>{t('noAccount')}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#1B5E20',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  banner: {
    backgroundColor: '#FFF3E0',
    color: '#E65100',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 13,
    lineHeight: 18,
  },
  bannerMono: { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  error: {
    color: '#C62828',
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  emoji: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  titleTe: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1B5E20',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 24,
  },
  label: { fontWeight: '600', marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  linkWrap: { marginTop: 20, alignItems: 'center' },
  link: { color: '#1565C0', fontSize: 15, fontWeight: '500' },
});
