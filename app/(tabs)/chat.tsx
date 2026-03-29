import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { auth, db } from '@/services/firebaseApp';

type ChatMessage = {
  id: string;
  text: string;
  displayName: string;
  uid: string;
  createdAt: { seconds: number } | null;
};

const COLLECTION = 'farmer_chat_messages';

export default function ChatScreen() {
  const { t } = useLanguage();
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows: ChatMessage[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            text: String(data.text ?? ''),
            displayName: String(data.displayName ?? 'Farmer'),
            uid: String(data.uid ?? ''),
            createdAt: data.createdAt ?? null,
          };
        });
        setMessages(rows);
      },
      () => {
        setMessages([]);
      },
    );
    return unsub;
  }, []);

  async function send() {
    const u = auth.currentUser;
    if (!u || !text.trim()) return;
    setSending(true);
    try {
      await addDoc(collection(db, COLLECTION), {
        text: text.trim(),
        uid: u.uid,
        displayName: u.displayName || u.email?.split('@')[0] || 'Farmer',
        createdAt: serverTimestamp(),
      });
      setText('');
    } catch (e: unknown) {
      Alert.alert('Chat', e instanceof Error ? e.message : 'Could not send message');
    } finally {
      setSending(false);
    }
  }

  const userId = auth.currentUser?.uid;

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: Colors[scheme].background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={{ color: Colors[scheme].tabIconDefault, marginTop: 8 }}>
              {t('typeMessage')}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const mine = item.uid === userId;
          return (
            <View style={[styles.bubbleRow, mine && styles.bubbleRowMine]}>
              <View
                style={[
                  styles.bubble,
                  mine ? styles.bubbleMine : { backgroundColor: Colors[scheme].card },
                ]}>
                {!mine ? (
                  <Text style={styles.sender}>{item.displayName}</Text>
                ) : null}
                <Text style={[styles.msg, { color: mine ? '#fff' : Colors[scheme].text }]}>
                  {item.text}
                </Text>
              </View>
            </View>
          );
        }}
      />
      <View style={[styles.inputRow, { backgroundColor: Colors[scheme].card }]}>
        <TextInput
          style={[styles.input, { color: Colors[scheme].text }]}
          placeholder={t('typeMessage')}
          placeholderTextColor={Colors[scheme].tabIconDefault}
          value={text}
          onChangeText={setText}
          editable={!sending}
        />
        <Pressable
          style={[styles.send, sending && { opacity: 0.6 }]}
          onPress={() => void send()}
          disabled={sending}>
          <Text style={styles.sendText}>{t('send')}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { padding: 12, paddingBottom: 8 },
  empty: { padding: 24, alignItems: 'center' },
  bubbleRow: { alignItems: 'flex-start', marginBottom: 10 },
  bubbleRowMine: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '85%',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomLeftRadius: 4,
  },
  bubbleMine: {
    backgroundColor: '#2E7D32',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 4,
  },
  sender: { fontSize: 12, fontWeight: '700', color: '#2E7D32', marginBottom: 4 },
  msg: { fontSize: 16, lineHeight: 22 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
  },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 10 : 8 },
  send: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 8,
  },
  sendText: { color: '#fff', fontWeight: '700' },
});
