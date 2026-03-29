import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { getMarketPrices, MARKET_STATES, type MarketPrice } from '@/services/marketService';
import { notifyMarketPricesUpdated } from '@/services/notificationService';

export default function MarketScreen() {
  const { t, lang } = useLanguage();
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const [state, setState] = useState<string>(MARKET_STATES[0]);
  const [rows, setRows] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await getMarketPrices(state);
    setRows(data);
  }, [state]);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    await notifyMarketPricesUpdated(state);
    setRefreshing(false);
  }

  const unitLabel = lang === 'te' ? 'క్వింటాల్' : 'qt';

  return (
    <View style={[styles.wrap, { backgroundColor: Colors[scheme].background }]}>
      <Text style={[styles.section, { color: Colors[scheme].text }]}>{t('state')}</Text>
      <View style={styles.chips}>
        {MARKET_STATES.map((s) => (
          <Pressable
            key={s}
            onPress={() => setState(s)}
            style={[
              styles.chip,
              {
                backgroundColor: s === state ? Colors.primary : Colors[scheme].card,
                borderColor: s === state ? Colors.primary : '#e0e0e0',
              },
            ]}>
            <Text
              style={{
                color: s === state ? '#fff' : Colors[scheme].text,
                fontWeight: '600',
                fontSize: 12,
              }}>
              {s}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(_, i) => `${state}-${i}`}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
          }
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: Colors[scheme].card }]}>
              <View style={styles.cardTop}>
                <Text style={[styles.crop, { color: Colors[scheme].text }]}>
                  {lang === 'te' ? item.cropNameTelugu : item.cropName}
                </Text>
                <Text style={styles.trend}>{item.isTrendingUp ? '↑' : '↓'}</Text>
              </View>
              <Text style={styles.market}>{item.market}</Text>
              <Text style={[styles.price, { color: Colors.primary }]}>
                ₹{item.currentPrice.toFixed(0)}
                <Text style={styles.perUnit}> / {unitLabel}</Text>
              </Text>
              <Text style={[styles.mm, { color: Colors[scheme].tabIconDefault }]}>
                {lang === 'te' ? 'కనిష్ట' : 'Min'}: ₹{item.minPrice.toFixed(0)} ·{' '}
                {lang === 'te' ? 'గరిష్ట' : 'Max'}: ₹{item.maxPrice.toFixed(0)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  section: { fontWeight: '700', marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  list: { paddingBottom: 24 },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  crop: { fontSize: 17, fontWeight: '700', flex: 1 },
  trend: { fontSize: 22, color: '#2E7D32' },
  market: { color: '#666', marginTop: 4, fontSize: 14 },
  price: { fontSize: 22, fontWeight: '800', marginTop: 10 },
  perUnit: { fontSize: 14, fontWeight: '500', color: '#666' },
  mm: { marginTop: 8, fontSize: 13 },
});
