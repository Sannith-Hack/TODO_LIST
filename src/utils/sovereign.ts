import Tts from 'react-native-tts';
import { UserStats } from './types';

// Configure TTS for "The Sovereign's Voice"
Tts.setDefaultPitch(0.7); // Deeper, more authoritative voice
Tts.setDefaultRate(0.45); // Slower, more deliberate pace

let isInitialized = false;

export const initSovereign = async () => {
  if (isInitialized) return;
  try {
    await Tts.getInitStatus();
    isInitialized = true;
  } catch (err: any) {
    if (err.code === 'no_engine') {
      Tts.requestInstallEngine();
    }
  }
};

export const announce = (text: string, stats: UserStats | null) => {
  if (!stats?.notificationSettings?.ttsEnabled) return;
  
  Tts.stop();
  Tts.speak(text);
};

export const announceSystemMessage = (message: string, stats: UserStats | null) => {
  if (!stats?.notificationSettings?.ttsEnabled) return;
  
  const formattedMessage = `System. ${message}`;
  Tts.speak(formattedMessage);
};

export const SYSTEM_VOICE = {
  LEVEL_UP: (level: number) => `Level up. Your current status is being recalculated. You have reached level ${level}.`,
  QUEST_ARRIVED: () => `A quest has arrived.`,
  PENALTY_ISSUED: () => `System Error. Daily protocols were incomplete. Penalty Quest has been issued.`,
  SHADOW_EXTRACTION: (name: string) => `Shadow extraction successful. You have extracted the shadow, ${name}.`,
  RANK_UP: (rank: string) => `Player rank has been adjusted. You are now a ${rank} rank hunter.`,
  QUEST_COMPLETE: () => `Quest complete.`,
};
