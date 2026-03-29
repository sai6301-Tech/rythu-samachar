import { FirebaseError } from 'firebase/app';

export function formatAuthError(e: unknown): string {
  if (e instanceof FirebaseError) {
    const map: Record<string, string> = {
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/wrong-password': 'Invalid email or password.',
      'auth/user-not-found': 'No account found for this email.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/email-already-in-use': 'An account already exists with this email.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-api-key':
        'Firebase API key is invalid or missing. Add Web app keys from Firebase Console to your .env as EXPO_PUBLIC_FIREBASE_* and restart Expo.',
      'auth/network-request-failed': 'Network error. Check your connection and try again.',
      'auth/too-many-requests': 'Too many attempts. Try again later.',
    };
    return map[e.code] ?? e.message;
  }
  if (e instanceof Error) return e.message;
  return 'Something went wrong. Please try again.';
}
