/**
 * Copy to .env or set EXPO_PUBLIC_* in your environment.
 * See .env.example in this folder.
 */
export const OPENWEATHER_API_KEY =
  process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? 'YOUR_OPENWEATHER_API_KEY';

export const NEWS_API_KEY =
  process.env.EXPO_PUBLIC_NEWS_API_KEY ?? 'YOUR_NEWSAPI_KEY';

export const DATA_GOV_IN_API_KEY =
  process.env.EXPO_PUBLIC_DATA_GOV_IN_API_KEY ?? 'YOUR_DATA_GOV_IN_API_KEY';

/** Firebase Web SDK config (Console → Project settings → Your apps → Web) */
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? 'mock_api_key_for_build_purposes_only',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'rytu-samachar-mock.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'rytu-samachar-mock',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'rytu-samachar-mock.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '123456789012',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '1:123456789012:web:placeholder',
};
