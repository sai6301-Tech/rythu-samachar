import { firebaseConfig } from '@/constants/config';

/** True when using the placeholder keys from the repo (login will fail until .env is set). */
export function isPlaceholderFirebaseConfig(): boolean {
  const k = firebaseConfig.apiKey;
  return (
    !k ||
    k === 'mock_api_key_for_build_purposes_only' ||
    k.startsWith('YOUR_')
  );
}
