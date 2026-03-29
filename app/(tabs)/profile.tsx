import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { auth } from '@/services/firebaseApp';
import {
  requestNotificationPermission,
  showLocalNotification,
} from '@/services/notificationService';

const NOTIF_PREFS_KEY = 'rytu_samachar_notifications_on';

export default function ProfileScreen() {
  const { t, lang, toggleLanguage } = useLanguage();
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);
  const [notifOn, setNotifOn] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setEmail(u?.email ?? '');
      setName(u?.displayName ?? '');
    });
    return unsub;
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const v = await AsyncStorage.getItem(NOTIF_PREFS_KEY);
        if (v === '0') setNotifOn(false);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  async function saveName() {
    const u = auth.currentUser;
    if (!u) return;
    try {
      await updateProfile(u, { displayName: name.trim() });
      setEditing(false);
      Alert.alert('', lang === 'te' ? 'పేరు నవీకరించబడింది' : 'Name updated');
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    }
  }

  async function onNotifToggle(value: boolean) {
    setNotifOn(value);
    await AsyncStorage.setItem(NOTIF_PREFS_KEY, value ? '1' : '0');
    if (value) {
      const ok = await requestNotificationPermission();
      if (!ok) Alert.alert(t('notifications'), 'Permission denied');
    }
  }

  function logout() {
    const doLogout = async () => {
      try {
        await signOut(auth);
      } catch {
        /* ignore */
      }
      router.replace('/(auth)/login');
    };

    if (Platform.OS === 'web') {
      if (window.confirm(t('logoutConfirm'))) {
        void doLogout();
      }
    } else {
      Alert.alert(
        t('logout'),
        t('logoutConfirm'),
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('logout'), style: 'destructive', onPress: () => void doLogout() },
        ],
        { cancelable: true },
      );
    }
  }

  const initial = (name || email || '?').charAt(0).toUpperCase();

  return (
    <View style={[styles.wrap, { backgroundColor: Colors[scheme].background }]}>
      <View style={[styles.hero, { backgroundColor: Colors[scheme].card }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        {editing ? (
          <View style={styles.editRow}>
            <TextInput
              style={[styles.input, { color: Colors[scheme].text }]}
              value={name}
              onChangeText={setName}
              placeholder={t('fullName')}
            />
            <Pressable style={styles.saveBtn} onPress={() => void saveName()}>
              <Text style={styles.saveBtnText}>{t('save')}</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={[styles.name, { color: Colors[scheme].text }]}>
              {name || (lang === 'te' ? 'రైతు' : 'Farmer')}
            </Text>
            <Pressable onPress={() => setEditing(true)}>
              <Text style={styles.editLink}>{t('editName')}</Text>
            </Pressable>
          </>
        )}
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.status}>
          {lang === 'te' ? 'స్థితి: ' : 'Status: '}
          <Text style={{ color: '#2E7D32', fontWeight: '700' }}>{t('accountActive')}</Text>
        </Text>
      </View>

      <View style={[styles.row, { backgroundColor: Colors[scheme].card }]}>
        <Text style={[styles.rowLabel, { color: Colors[scheme].text }]}>
          {lang === 'te' ? 'EN — తె' : 'EN — తె'}
        </Text>
        <Switch
          value={lang === 'te'}
          onValueChange={() => toggleLanguage()}
          trackColor={{ true: '#81C784', false: '#ccc' }}
          thumbColor={lang === 'te' ? '#2E7D32' : '#f4f4f4'}
        />
      </View>

      <View style={[styles.row, { backgroundColor: Colors[scheme].card }]}>
        <Text style={[styles.rowLabel, { color: Colors[scheme].text }]}>{t('notifications')}</Text>
        <Switch value={notifOn} onValueChange={(v) => void onNotifToggle(v)} />
      </View>

      <Pressable
        style={[styles.testBtn, { borderColor: Colors.primary }]}
        onPress={async () => {
          if (!notifOn) {
            Alert.alert('', lang === 'te' ? 'నోటిఫికేషన్లను ఆన్ చేయండి' : 'Turn notifications on');
            return;
          }
          await showLocalNotification(
            lang === 'te' ? 'రైతు సమాచార్' : 'Rytu Samachar',
            lang === 'te' ? 'టెస్ట్ నోటిఫికేషన్ అందింది' : 'Test notification received',
            { screen: 'news' },
          );
        }}>
        <Text style={{ color: Colors.primary, fontWeight: '700' }}>{t('testNotification')}</Text>
      </Pressable>

      <TouchableOpacity style={styles.logout} onPress={logout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  hero: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '800' },
  editLink: { color: '#1565C0', marginTop: 6, fontWeight: '600' },
  email: { color: '#666', marginTop: 8 },
  status: { marginTop: 12, fontSize: 14 },
  editRow: { width: '100%', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  rowLabel: { fontSize: 16, fontWeight: '600' },
  testBtn: {
    borderWidth: 2,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  logout: {
    marginTop: 24,
    backgroundColor: '#C62828',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
