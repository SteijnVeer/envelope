import { GlassView } from 'expo-glass-effect';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import type { SharedValue } from 'react-native-reanimated';
import { createAnimatedComponent, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SetupStepProps } from '@/components/setup/page';
import { useColor } from '@/contexts/theme';

import Step1 from '@/components/setup/language';
import { Step2 } from '@/components/setup/step-2';
import { Step3 } from '@/components/setup/step-3';
import { Step4 } from '@/components/setup/step-4';

// --- Constants ---

const STEPS: React.ComponentType<SetupStepProps>[] = [Step1, Step2, Step3, Step4];
const MAX_STEP = STEPS.length - 1;

const DOT_SIZE_BASE = 8;
const DOT_WIDTH_ACTIVE = 24;
const DOT_WIDTH_INCREASE = DOT_WIDTH_ACTIVE - DOT_SIZE_BASE;

const DOT_SPACING = 6;

const DOT_OPACITY_BASE = 0.3;
const DOT_OPACITY_ACTIVE = 1;
const DOT_OPACITY_INCREASE = DOT_OPACITY_ACTIVE - DOT_OPACITY_BASE;

const DOT_ANIMATION_DURATION = 300;

// --- Internal ---

const AnimatedGlassView = createAnimatedComponent(GlassView);

type DotProps = {
  index: number;
  animatedPosition: SharedValue<number>;
  color: string;
  visited: boolean;
};

function Dot({ index, animatedPosition, color, visited }: DotProps) {
  const visibleProgress = useSharedValue(visited ? 1 : 0);

  useEffect(() => {
    if (visited)
      visibleProgress.value = withTiming(1, { duration: DOT_ANIMATION_DURATION });
  }, [visited]);

  const animatedStyle = useAnimatedStyle(() => {
    const activation = Math.max(0, 1 - Math.abs(animatedPosition.value - index));
    const width = DOT_SIZE_BASE + DOT_WIDTH_INCREASE * activation;
    const opacity = DOT_OPACITY_BASE + DOT_OPACITY_INCREASE * activation;
    const transform = [{ scale: visibleProgress.value }];
    return { width, opacity, transform };
  });

  return (
    <AnimatedGlassView
      tintColor={color}
      glassEffectStyle='clear'
      style={[
        styles.dot,
        animatedStyle,
      ]}
    />
  );
}

// --- Screen ---

export default function SetupScreen() {
  const router = useRouter();
  const dotColor = useColor('text');
  const animatedPosition = useSharedValue(0);
  const pagerRef = useRef<PagerView>(null);
  const [maxVisitedPage, setMaxVisitedPage] = useState(0);
  const insets = useSafeAreaInsets();
  const insetStyle = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  };
  const indicatorInsetStyle = {
    bottom: insets.bottom + styles.indicator.bottom,
  };

  const goNext = useCallback((currentStep: number) => {
    if (currentStep === MAX_STEP)
      return router.replace('/home');
    const nextStep = currentStep + 1;
    if (nextStep === MAX_STEP)
      pagerRef.current?.setScrollEnabled(true);
    setMaxVisitedPage((prev) => Math.max(prev, nextStep));
    pagerRef.current?.setPage(nextStep);
  }, [router]);

  return (
    <View
      style={styles.container}
    >
      <PagerView
        ref={pagerRef}
        style={styles.container}
        scrollEnabled={false}
        initialPage={0}
        onPageScroll={(e) => {
          animatedPosition.value = e.nativeEvent.position + e.nativeEvent.offset;
        }}
      >
        {STEPS.map((Step, i) => (
          <View
            key={i}
            style={[
              styles.container,
              insetStyle
            ]}
          >
            <Step
              onNext={() => goNext(i)}
            />
          </View>
        ))}
      </PagerView>

      <View
        style={[
          styles.indicator,
          indicatorInsetStyle,
        ]}
        pointerEvents='none'
      >
        {STEPS.map((_, i) => (
          <Dot
            key={i}
            index={i}
            animatedPosition={animatedPosition}
            color={dotColor}
            visited={i <= maxVisitedPage}
          />
        ))}
      </View>

      <StatusBar
        hidden
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: DOT_SPACING,
  },
  dot: {
    height: DOT_SIZE_BASE,
    minWidth: DOT_SIZE_BASE,
    maxWidth: DOT_WIDTH_ACTIVE,
    borderCurve: 'circular',
    borderRadius: 9999,
  },
});
