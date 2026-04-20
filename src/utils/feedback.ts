import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Sound from 'react-native-sound';
import { Platform } from 'react-native';

// Enable playback in silence mode
try {
  Sound.setCategory('Playback');
} catch (e) {
  console.warn('Sound.setCategory failed', e);
}

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const triggerHaptic = (type: 'impactLight' | 'impactMedium' | 'impactHeavy' | 'notificationSuccess' | 'notificationWarning' | 'notificationError' = 'impactLight') => {
  try {
    // Check if the native module exists before calling
    if (ReactNativeHapticFeedback && typeof ReactNativeHapticFeedback.trigger === 'function') {
      ReactNativeHapticFeedback.trigger(type, hapticOptions);
    }
  } catch (error) {
    console.warn('Haptic feedback not available', error);
  }
};

// Sound Cache
const sounds: { [key: string]: Sound } = {};

const loadSound = (name: string) => {
  if (sounds[name]) return sounds[name];
  
  try {
    const s = new Sound(name, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn(`Failed to load sound ${name}`, error);
      }
    });
    sounds[name] = s;
    return s;
  } catch (e) {
    console.warn(`Sound module not linked for ${name}`);
    return null;
  }
};

export const playSound = (name: string, volume: number = 1.0) => {
  try {
    const s = loadSound(name);
    if (s && typeof s.play === 'function') {
      s.setVolume(volume);
      s.play((success) => {
        if (!success) {
          console.warn('Sound playback failed');
        }
      });
    }
  } catch (error) {
    console.warn('Sound playback not available', error);
  }
};

export const FEEDBACK_SOUNDS = {
  QUEST_COMPLETE: Platform.OS === 'android' ? 'quest_complete' : 'quest_complete.mp3',
  PENALTY_COMPLETE: Platform.OS === 'android' ? 'penalty_complete' : 'penalty_complete.mp3',
  LEVEL_UP: Platform.OS === 'android' ? 'level_up' : 'level_up.mp3',
  BUTTON_CLICK: Platform.OS === 'android' ? 'button_click' : 'button_click.mp3',
};
