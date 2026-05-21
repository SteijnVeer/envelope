import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import type { SharedValue } from 'react-native-reanimated';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AnimatedGlass } from '@/components/glass';
import { useStoreValue } from '@/contexts/store';
import { useColor } from '@/contexts/theme';

import { STEPS } from '@/components/setup';

// --- Constants ---

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
    <AnimatedGlass
      tintColor={color}
      themed={false}
      pill
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
  const [_, setHasCompletedSetup] = useStoreValue('hasCompletedSetup');
  const dotColor = useColor('text');
  const animatedPosition = useSharedValue(0);
  const pagerRef = useRef<PagerView>(null);
  const [maxVisitedPage, setMaxVisitedPage] = useState(0);

  const goNext = useCallback((currentStep: number) => {
    if (currentStep === MAX_STEP) {
      setHasCompletedSetup(true);
      router.replace('/');
    } else {
      const nextStep = currentStep + 1;
      if (nextStep === MAX_STEP)
        pagerRef.current?.setScrollEnabled(true);
      setMaxVisitedPage((prev) => Math.max(prev, nextStep));
      pagerRef.current?.setPage(nextStep);
    }
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
            style={styles.container}
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
    bottom: 60,
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
  },
});
