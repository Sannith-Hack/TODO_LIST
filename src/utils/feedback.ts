import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Sound from 'react-native-sound';
import { Platform } from 'react-native';

// Enable playback in silence mode
Sound.setCategory('Playback');

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const triggerHaptic = (type: 'impactLight' | 'impactMedium' | 'impactHeavy' | 'notificationSuccess' | 'notificationWarning' | 'notificationError' = 'impactLight') => {
  ReactNativeHapticFeedback.trigger(type, hapticOptions);
};

// Sound Cache
const sounds: { [key: string]: Sound } = {};

const loadSound = (name: string) => {
  if (sounds[name]) return sounds[name];
  
  // Note: Sounds must be in android/app/src/main/res/raw/name.mp3
  // and for iOS in the project bundle
  const s = new Sound(name, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.warn(`Failed to load sound ${name}`, error);
      return;
    }
  });
  sounds[name] = s;
  return s;
};

export const playSound = (name: string, volume: number = 1.0) => {
  const s = loadSound(name);
  if (s) {
    s.setVolume(volume);
    s.play((success) => {
      if (!success) {
        console.warn('Sound playback failed');
      }
    });
  }
};

export const FEEDBACK_SOUNDS = {
  QUEST_COMPLETE: Platform.OS === 'android' ? 'quest_complete' : 'quest_complete.mp3',
  PENALTY_COMPLETE: Platform.OS === 'android' ? 'penalty_complete' : 'penalty_complete.mp3',
  LEVEL_UP: Platform.OS === 'android' ? 'level_up' : 'level_up.mp3',
  BUTTON_CLICK: Platform.OS === 'android' ? 'button_click' : 'button_click.mp3',
};
