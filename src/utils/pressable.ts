import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import type { GestureResponderEvent } from 'react-native';

// --- Types ---

export type PressableProps<E = GestureResponderEvent, R = void | Promise<void>> = {
  onPressStart?: (e: E) => R;
  onPressEnd?: (e: E) => R;
  onPress?: (e: E) => R;
  onPressCancel?: (e: E) => R;
};

// --- Functions ---

export function hapticPressStart() {
  impactAsync(ImpactFeedbackStyle.Light);
}
