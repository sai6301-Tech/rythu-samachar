import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const notificationsSupported = Platform.OS === 'ios' || Platform.OS === 'android';

if (notificationsSupported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export type NotificationData = {
  screen?: 'market' | 'news';
};

export async function initializeNotifications(): Promise<void> {
  if (!notificationsSupported) return;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!notificationsSupported) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function showLocalNotification(
  title: string,
  body: string,
  data?: NotificationData,
): Promise<void> {
  if (!notificationsSupported) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: (data ?? {}) as Record<string, unknown>,
    },
    trigger: null,
  });
}

/** Call when market data refreshes (local alert; FCM is configured separately in EAS). */
export async function notifyMarketPricesUpdated(regionLabel: string): Promise<void> {
  await showLocalNotification(
    'Market Prices Updated 📈',
    `Latest ${regionLabel} market prices are now available.`,
    { screen: 'market' },
  );
}

function routeForNotificationData(data: Record<string, unknown> | undefined): string | null {
  const screen = data?.screen;
  if (screen === 'market') return '/market';
  if (screen === 'news') return '/news';
  return null;
}

/**
 * Opens the right tab when the user taps a local notification (foreground, background, or cold start).
 * No-op on web — expo-notifications response APIs are not available there.
 */
export function subscribeNotificationResponses(navigate: (href: string) => void): () => void {
  if (!notificationsSupported) {
    return () => {};
  }

  function handle(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content
      .data as Record<string, unknown> | undefined;
    const href = routeForNotificationData(data);
    if (href) navigate(href);
  }

  void Notifications.getLastNotificationResponseAsync().then((last) => {
    if (last) handle(last);
  });

  const sub = Notifications.addNotificationResponseReceivedListener(handle);
  return () => sub.remove();
}
