import { Redirect, router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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

export default function SignUpScreen() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
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
      console.warn('[signup]', msg);
    } else {
      Alert.alert('Sign up', msg);
    }
  }

  async function handleSignUp() {
    if (!name.trim() || !email.trim() || !password) {
      notifyError('Fill all fields');
      return;
    }
    if (password.length < 6) {
      notifyError('Password must be at least 6 characters');
      return;
    }
    if (needsFirebaseEnv) {
      notifyError(
        'Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* from Firebase Console to .env and restart Expo.',
      );
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: name.trim() });
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
          <Text style={styles.title}>{t('signUp')}</Text>

          {needsFirebaseEnv ? (
            <Text style={styles.banner}>
              Add Firebase Web keys to <Text style={styles.bannerMono}>.env</Text> and restart Expo
              before signing up.
            </Text>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>{t('fullName')}</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#9e9e9e"
            value={name}
            onChangeText={setName}
          />

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
            onPress={() => void handleSignUp()}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('signUp')}</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.linkWrap}>
            <Text style={styles.link}>{t('haveAccount')}</Text>
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
    backgroundColor: '#2E7D32',
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1B5E20',
    marginBottom: 20,
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
