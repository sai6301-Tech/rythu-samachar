import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { getAgriNews, type NewsArticle } from '@/services/newsService';

export default function NewsScreen() {
  const navigation = useNavigation();
  const { t, lang } = useLanguage();
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await getAgriNews(lang);
    setItems(data);
  }, [lang]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [load]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => void onRefresh()}
          disabled={refreshing}
          accessibilityRole="button"
          accessibilityLabel={t('refreshNews')}
          style={{ marginRight: 16, opacity: refreshing ? 0.45 : 1 }}>
          <Ionicons name="refresh" size={26} color="#fff" />
        </Pressable>
      ),
    });
  }, [navigation, onRefresh, refreshing, t]);

  function openArticle(url: string) {
    if (url) void WebBrowser.openBrowserAsync(url);
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: Colors[scheme].background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 12, color: Colors[scheme].text }}>
          {lang === 'te' ? 'సమాచారం లోడ్ అవుతోంది...' : 'Loading news...'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(_, i) => `${lang}-${i}-${items[i]?.publishedAt ?? ''}`}
      contentContainerStyle={[
        styles.list,
        { backgroundColor: Colors[scheme].background },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
      }
      ListHeaderComponent={
        <Text style={[styles.hint, { color: Colors[scheme].tabIconDefault }]}>
          {t('pullRefresh')}
        </Text>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => openArticle(item.url)}
          style={[styles.card, { backgroundColor: Colors[scheme].card }]}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          ) : null}
          <Text style={[styles.title, { color: Colors[scheme].text }]}>{item.title}</Text>
          <Text style={styles.source}>{item.source}</Text>
          <Text style={[styles.desc, { color: Colors[scheme].text }]} numberOfLines={3}>
            {item.description}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 12, paddingBottom: 24 },
  hint: { fontSize: 12, marginBottom: 8, textAlign: 'center' },
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  image: { width: '100%', height: 160, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 17, fontWeight: '700' },
  source: { color: '#2E7D32', fontSize: 13, marginTop: 4, fontWeight: '600' },
  desc: { fontSize: 14, marginTop: 8, lineHeight: 20 },
});
