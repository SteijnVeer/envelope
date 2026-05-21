import type { ThemeMode } from '@/contexts/theme';
import { useThemeMode } from '@/contexts/theme';
import type { ImageProps } from 'expo-image';
import { Image } from 'expo-image';
import { MeshGradientView } from 'expo-mesh-gradient';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect } from 'react';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { createAnimatedComponent, Easing, useAnimatedProps, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

// --- Types ---

export type AppBackgroundProviderProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

type BackgroundAnimValues = Record<'tx' | 'ly' | 'cx' | 'cy' | 'bx', SharedValue<number>>;

// --- Constants ---

const AnimatedMeshGradient = createAnimatedComponent(MeshGradientView);

const GRADIENT_COLORS: Record<ThemeMode, ColorValue[]> = {
  light: [
    '#E2EBFA', '#EBEBF2', '#FAE8E2',
    '#E5EEF8', '#F0F0F5', '#EEE5F8',
    '#F8E5DF', '#E0F8EE', '#DDF0F8',
  ],
  dark: [
    '#08070D', '#060608', '#0D0807',
    '#060609', '#030303', '#09060A',
    '#0D0807', '#060609', '#07090D',
  ],
} as const;

// --- Context ---

const BackgroundAnimContext = createContext<BackgroundAnimValues | null>(null);

// --- Components ---

export function BackgroundImage({ style, ...props }: ImageProps) {
  return (
    <Image
      contentFit='cover'
      {...props}
      style={[
        styles.background,
        style
      ]}
    />
  );
}

export function BackgroundGradient() {
  const [mode] = useThemeMode();
  const anim = useContext(BackgroundAnimContext);

  const localTx = useSharedValue(0.5);
  const localLy = useSharedValue(0.5);
  const localCx = useSharedValue(0.5);
  const localCy = useSharedValue(0.5);
  const localBx = useSharedValue(0.5);

  const tx = anim?.tx ?? localTx;
  const ly = anim?.ly ?? localLy;
  const cx = anim?.cx ?? localCx;
  const cy = anim?.cy ?? localCy;
  const bx = anim?.bx ?? localBx;

  const animatedProps = useAnimatedProps(() => ({
    points: [
      [0.0,      0.0     ], [tx.value, 0.0     ], [1.0, 0.0],
      [0.0,      ly.value], [cx.value, cy.value], [1.0, 0.5],
      [0.0,      1.0     ], [bx.value, 1.0     ], [1.0, 1.0],
    ] as [number, number][],
  }));

  return (
    <AnimatedMeshGradient
      style={styles.background}
      columns={3}
      rows={3}
      colors={GRADIENT_COLORS[mode]}
      animatedProps={animatedProps}
    />
  );
}

export function AppBackgroundProvider({ children, style }: AppBackgroundProviderProps) {
  const parentAnim = useContext(BackgroundAnimContext);

  const localTx = useSharedValue(0.35 + Math.random() * 0.30);
  const localLy = useSharedValue(0.35 + Math.random() * 0.25);
  const localCx = useSharedValue(0.30 + Math.random() * 0.40);
  const localCy = useSharedValue(0.35 + Math.random() * 0.35);
  const localBx = useSharedValue(0.40 + Math.random() * 0.25);

  useEffect(() => {
    if (parentAnim)
      return;
    const ease = Easing.inOut(Easing.sin);
    localTx.value = withRepeat(withSequence(
      withTiming(0.65, { duration: 9500,  easing: ease }),
      withTiming(0.35, { duration: 9500,  easing: ease }),
    ), -1);
    localLy.value = withRepeat(withSequence(
      withTiming(0.6,  { duration: 7500,  easing: ease }),
      withTiming(0.35, { duration: 7500,  easing: ease }),
    ), -1);
    localCx.value = withRepeat(withSequence(
      withTiming(0.3,  { duration: 8000,  easing: ease }),
      withTiming(0.7,  { duration: 8000,  easing: ease }),
    ), -1);
    localCy.value = withRepeat(withSequence(
      withTiming(0.35, { duration: 11000, easing: ease }),
      withTiming(0.7,  { duration: 11000, easing: ease }),
    ), -1);
    localBx.value = withRepeat(withSequence(
      withTiming(0.4,  { duration: 10500, easing: ease }),
      withTiming(0.65, { duration: 10500, easing: ease }),
    ), -1);
  }, [parentAnim]);

  const anim: BackgroundAnimValues = parentAnim ?? {
    tx: localTx,
    ly: localLy,
    cx: localCx,
    cy: localCy,
    bx: localBx,
  };

  return (
    <BackgroundAnimContext.Provider
      value={anim}
    >
      <View
        style={[
          styles.backgroundProvider,
          style,
        ]}
      >
        <BackgroundGradient />
        {children}
      </View>
    </BackgroundAnimContext.Provider>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFill,
  },
  backgroundProvider: {
    flex: 1,
  },
});
