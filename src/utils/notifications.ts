import notifee, { TriggerType, TimestampTrigger, RepeatFrequency } from '@notifee/react-native';
import { Task, UserStats } from './types';

export const cancelAllNotifications = async () => {
  await notifee.cancelAllNotifications();
};

export const schedulePenaltyNotification = async (intervalMinutes: number) => {
  // Cancel existing notifications to avoid duplicates
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
    repeatFrequency: RepeatFrequency.HOURLY, // Repeat every hour if interval is 60, or just repeat frequently
  };
  
  // Note: Notifee RepeatFrequency only supports HOURLY, DAILY, WEEKLY.
  // For custom intervals like 15, 30 min, we'd need a different approach or just stick to HOURLY/DAILY.
  // Given the "Solo Leveling" theme, "Harassment" should be persistent.
  
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

export const updateSystemNotifications = async (tasks: Task[], stats: UserStats) => {
  if (!stats.notificationSettings?.enabled) {
    await notifee.cancelAllNotifications();
    return;
  }

  const hasIncompleteDailies = tasks.some(t => t.category === 'Regular' && !t.completed);

  if (hasIncompleteDailies) {
    // Only schedule if not already scheduled (or just refresh)
    await schedulePenaltyNotification(stats.notificationSettings.interval);
  } else {
    await notifee.cancelAllNotifications();
  }
};
