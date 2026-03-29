import { type Href, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { subscribeNotificationResponses } from '@/services/notificationService';

/** Deep-link from notification `data.screen` to a tab route. */
export function useNotificationNavigation(): void {
  const router = useRouter();

  useEffect(() => {
    return subscribeNotificationResponses((href) => {
      router.push(href as Href);
    });
  }, [router]);
}
