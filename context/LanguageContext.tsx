import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'rytu_samachar_lang';

export type LangCode = 'en' | 'te';

type Dict = Record<string, { en: string; te: string }>;

/** Keys used across screens; extend as needed. */
export const STRINGS: Dict = {
  appTitle: { en: 'Rytu Samachar', te: 'రైతు సమాచార్' },
  tabNews: { en: 'News', te: 'సమాచారం' },
  tabWeather: { en: 'Weather', te: 'వాతావరణం' },
  tabMarket: { en: 'Market', te: 'మార్కెట్' },
  tabChat: { en: 'Chat', te: 'చాట్' },
  tabSchemes: { en: 'Schemes', te: 'పథకాలు' },
  tabProfile: { en: 'Profile', te: 'ప్రొఫైల్' },
  login: { en: 'Login', te: 'లాగిన్' },
  signUp: { en: 'Sign Up', te: 'నమోదు' },
  email: { en: 'Email', te: 'ఇమెయిల్' },
  password: { en: 'Password', te: 'పాస్వర్డ్' },
  fullName: { en: 'Full Name', te: 'పూర్తి పేరు' },
  haveAccount: { en: 'Already have an account? Login', te: 'ఖాతా ఉందా? లాగిన్' },
  noAccount: { en: 'New user? Create account', te: 'కొత్త వాడా? నమోదు' },
  logout: { en: 'Logout', te: 'లాగ్అవుట్' },
  logoutConfirm: {
    en: 'Are you sure you want to logout?',
    te: 'మీరు ఖచ్చితంగా లాగ్అవుట్ చేయాలనుకుంటున్నారా?',
  },
  cancel: { en: 'Cancel', te: 'రద్దు' },
  save: { en: 'Save', te: 'సేవ్' },
  editName: { en: 'Edit name', te: 'పేరు మార్చు' },
  language: { en: 'Language', te: 'భాష' },
  notifications: { en: 'Notifications', te: 'నోటిఫికేషన్లు' },
  testNotification: { en: 'Test notification', te: 'టెస్ట్ నోటిఫికేషన్' },
  accountActive: { en: 'Active', te: 'సక్రియం' },
  searchCity: { en: 'Search city', te: 'నగరం వెతకండి' },
  search: { en: 'Search', te: 'వెతుకు' },
  pullRefresh: { en: 'Pull to refresh', te: 'రిఫ్రెష్ కోసం లాగండి' },
  refreshNews: { en: 'Refresh', te: 'రిఫ్రెష్' },
  send: { en: 'Send', te: 'పంపు' },
  typeMessage: { en: 'Type a message...', te: 'సందేశం టైప్ చేయండి...' },
  state: { en: 'State', te: 'రాష్ట్రం' },
  eligibility: { en: 'Eligibility', te: 'అర్హత' },
  openWebsite: { en: 'Official website', te: 'అధికారిక వెబ్‌సైట్' },
  schemesTitle: { en: '🏛️ Government Schemes', te: '🏛️ ప్రభుత్వ పథకాలు' },
};

type LanguageContextValue = {
  lang: LangCode;
  t: (key: keyof typeof STRINGS) => string;
  setLang: (code: LangCode) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'te' || stored === 'en') setLangState(stored);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const setLang = useCallback(async (code: LangCode) => {
    setLangState(code);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    void setLang(lang === 'en' ? 'te' : 'en');
  }, [lang, setLang]);

  const t = useCallback(
    (key: keyof typeof STRINGS) => STRINGS[key][lang],
    [lang],
  );

  const value = useMemo(
    () => ({ lang, t, setLang, toggleLanguage }),
    [lang, t, setLang, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
