import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { GOVERNMENT_SCHEMES, type Scheme } from '@/constants/schemes';

export default function SchemesScreen() {
  const colorScheme = useColorScheme();
  const schemeTheme = colorScheme === 'dark' ? 'dark' : 'light';
  const { t } = useLanguage();

  return (
    <ScrollView
      style={{ backgroundColor: Colors[schemeTheme].background }}
      contentContainerStyle={styles.list}>
      <Text style={[styles.header, { color: Colors[schemeTheme].text }]}>{t('schemesTitle')}</Text>
      {GOVERNMENT_SCHEMES.map((item) => (
        <SchemeCard key={item.name} scheme={item} schemeTheme={schemeTheme} />
      ))}
    </ScrollView>
  );
}

function SchemeCard({ scheme, schemeTheme }: { scheme: Scheme; schemeTheme: 'light' | 'dark' }) {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const title = lang === 'te' ? scheme.nameTe : scheme.name;
  const description = lang === 'te' ? scheme.descriptionTe : scheme.description;
  const eligibility = lang === 'te' ? scheme.eligibilityTe : scheme.eligibility;

  return (
    <Pressable
      onPress={() => setOpen(!open)}
      style={[styles.card, { backgroundColor: Colors[schemeTheme].card }]}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: scheme.color + '22' }]}>
          <Text style={styles.emoji}>{scheme.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: scheme.color }]}>{title}</Text>
          <Text
            style={[styles.preview, { color: Colors[schemeTheme].text }]}
            numberOfLines={open ? undefined : 2}>
            {description}
          </Text>
        </View>
        <Text style={styles.chev}>{open ? '▲' : '▼'}</Text>
      </View>
      {open ? (
        <View style={styles.detail}>
          <Text style={[styles.label, { color: Colors[schemeTheme].tabIconDefault }]}>
            {t('eligibility')}
          </Text>
          <Text style={[styles.body, { color: Colors[schemeTheme].text }]}>{eligibility}</Text>
          <Pressable
            style={[styles.linkBtn, { borderColor: scheme.color }]}
            onPress={() => void WebBrowser.openBrowserAsync(scheme.url)}>
            <Text style={[styles.linkText, { color: scheme.color }]}>{t('openWebsite')}</Text>
          </Pressable>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, paddingBottom: 32 },
  header: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 24 },
  name: { fontSize: 17, fontWeight: '800' },
  preview: { fontSize: 14, marginTop: 6, lineHeight: 20 },
  chev: { color: '#888', marginLeft: 4 },
  detail: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
  },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  body: { fontSize: 14, lineHeight: 20 },
  linkBtn: {
    marginTop: 14,
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  linkText: { fontWeight: '700' },
});
