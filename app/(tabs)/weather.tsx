import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { getWeather, getWeatherEmoji, type WeatherData } from '@/services/weatherService';

const DEFAULT_CITY = 'Hyderabad';

export default function WeatherScreen() {
  const { t, lang } = useLanguage();
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const [cityInput, setCityInput] = useState(DEFAULT_CITY);
  const [query, setQuery] = useState(DEFAULT_CITY);
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      const w = await getWeather(query);
      if (!cancelled) {
        setData(w);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <View style={[styles.wrap, { backgroundColor: Colors[scheme].background }]}>
      <View style={[styles.searchRow, { backgroundColor: Colors[scheme].card }]}>
        <TextInput
          style={[styles.input, { color: Colors[scheme].text }]}
          placeholder={t('searchCity')}
          placeholderTextColor={Colors[scheme].tabIconDefault}
          value={cityInput}
          onChangeText={setCityInput}
          onSubmitEditing={() => setQuery(cityInput.trim() || DEFAULT_CITY)}
        />
        <Pressable
          style={styles.searchBtn}
          onPress={() => setQuery(cityInput.trim() || DEFAULT_CITY)}>
          <Text style={styles.searchBtnText}>{t('search')}</Text>
        </Pressable>
      </View>

      {loading || !data ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <View style={[styles.card, { backgroundColor: Colors[scheme].card }]}>
          <Text style={styles.emoji}>{getWeatherEmoji(data.condition)}</Text>
          <Text style={[styles.city, { color: Colors[scheme].text }]}>{data.city}</Text>
          <Text style={styles.temp}>{Math.round(data.temperature)}°C</Text>
          <Text style={[styles.cond, { color: Colors[scheme].text }]}>{data.condition}</Text>
          <View style={styles.row}>
            <Metric
              label={lang === 'te' ? 'ఫీల్స్ లైక్' : 'Feels like'}
              value={`${Math.round(data.feelsLike)}°C`}
              scheme={scheme}
            />
            <Metric
              label={lang === 'te' ? 'తేమ' : 'Humidity'}
              value={`${data.humidity}%`}
              scheme={scheme}
            />
            <Metric
              label={lang === 'te' ? 'గాలి' : 'Wind'}
              value={`${data.windSpeed} m/s`}
              scheme={scheme}
            />
          </View>
        </View>
      )}
    </View>
  );
}

function Metric({
  label,
  value,
  scheme,
}: {
  label: string;
  value: string;
  scheme: 'light' | 'dark';
}) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricLabel, { color: Colors[scheme].tabIconDefault }]}>
        {label}
      </Text>
      <Text style={[styles.metricValue, { color: Colors[scheme].text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 8,
    gap: 8,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  searchBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchBtnText: { color: '#fff', fontWeight: '600' },
  card: {
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  emoji: { fontSize: 72, marginBottom: 8 },
  city: { fontSize: 22, fontWeight: '700' },
  temp: { fontSize: 48, fontWeight: '800', color: '#2E7D32', marginVertical: 8 },
  cond: { fontSize: 16, textTransform: 'capitalize' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 28,
  },
  metric: { alignItems: 'center', flex: 1 },
  metricLabel: { fontSize: 12, marginBottom: 4 },
  metricValue: { fontSize: 15, fontWeight: '700' },
});
