import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';

export const schedulePenaltyNotification = async (intervalMinutes: number) => {
  // Cancel existing notifications
  await notifee.cancelAllNotifications();

  // Create a channel
  const channelId = await notifee.createChannel({
    id: 'system-protocol',
    name: 'System Protocol',
    importance: 4, // High importance
  });

  // Calculate trigger time
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + intervalMinutes * 60 * 1000,
    repeatFrequency: 1, // Repeat until cancelled
  };

  await notifee.createTriggerNotification({
    title: 'SYSTEM WARNING',
    body: 'Daily protocols are incomplete. Penalty Quest remains active.',
    android: {
      channelId,
      pressAction: { id: 'default' },
      importance: 4,
    },
  }, trigger);
};
