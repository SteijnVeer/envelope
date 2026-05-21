import { useThemeMode, useThemedStyle } from '@/contexts/theme';
import type { GlassViewProps } from 'expo-glass-effect';
import { GlassView } from 'expo-glass-effect';
import { StyleSheet } from 'react-native';
import { createAnimatedComponent } from 'react-native-reanimated';
import tinycolor from 'tinycolor2';

export type GlassProps = Omit<GlassViewProps, 'colorScheme'> & {
  pill?: boolean;
  themed?: boolean;
  tintOpacity?: number;
};

export function Glass({ glassEffectStyle = 'clear', tintColor: tint, tintOpacity = 0.6, pill, themed = true, style, ...props }: GlassProps) {
  const [theme] = useThemeMode();
  const themedStyle = useThemedStyle({ paddingHorizontal: 'four', three: ['paddingVertical', 'marginVertical', 'borderRadius'] });
  const tintColor = glassEffectStyle === 'clear'
    ? tinycolor(tint).setAlpha(tintOpacity).toRgbString()
    : tint;

  return (
    <GlassView
      {...props}
      glassEffectStyle={glassEffectStyle}
      tintColor={tintColor}
      colorScheme={theme}
      style={[
        styles.glass,
        themed && themedStyle,
        pill && styles.pill,
        style,
      ]}
    />
  );
}

export const AnimatedGlass = createAnimatedComponent(Glass);

const styles = StyleSheet.create({
  glass: {
    borderCurve: 'continuous',
  },
  pill: {
    borderCurve: 'circular',
    borderRadius: 9999,
  },
});
