import { GlassView } from 'expo-glass-effect';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import type { SharedValue } from 'react-native-reanimated';
import { createAnimatedComponent, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Step1 } from '@/components/setup/step-1';
import { Step2 } from '@/components/setup/step-2';
import { Step3 } from '@/components/setup/step-3';
import type { StepProps } from '@/components/setup/types';
import { useColor } from '@/contexts/theme';

const AnimatedGlassView = createAnimatedComponent(GlassView);

const STEPS: React.ComponentType<StepProps>[] = [Step1, Step2, Step3];
const MAX_STEP = STEPS.length - 1;

const DOT_SIZE_BASE = 8;
const DOT_WIDTH_ACTIVE = 24;
const DOT_WIDTH_INCREASE = DOT_WIDTH_ACTIVE - DOT_SIZE_BASE;
const DOT_OPACITY_BASE = 0.3;
const DOT_OPACITY_ACTIVE = 1;
const DOT_OPACITY_INCREASE = DOT_OPACITY_ACTIVE - DOT_OPACITY_BASE;

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
      visibleProgress.value = withTiming(1, { duration: 300 });
  }, [visited]);

  if (!visited)
    return null;

  const animatedStyle = useAnimatedStyle(() => {
    const activation = Math.max(0, 1 - Math.abs(animatedPosition.value - index));
    const width = DOT_SIZE_BASE + DOT_WIDTH_INCREASE * activation;
    const opacity = Math.min(
      DOT_OPACITY_BASE + DOT_OPACITY_INCREASE * activation,
      visibleProgress.value
    );
    const transform = [{ scale: visibleProgress.value }];
    return { width, opacity, transform };
  });

  return (
    <AnimatedGlassView
      tintColor={color}
      style={[
        styles.dot,
        animatedStyle,
      ]}
    />
  );
}

export default function SetupScreen() {
  const dotColor = useColor('text');
  const animatedPosition = useSharedValue(0);
  const pagerRef = useRef<PagerView>(null);
  const [maxVisitedPage, setMaxVisitedPage] = useState(0);

  const goNext = useCallback((currentStep: number) => {
    if (currentStep < MAX_STEP) {
      const nextStep = currentStep + 1;
      setMaxVisitedPage((prev) => Math.max(prev, nextStep));
      pagerRef.current?.setPage(nextStep);
    }
  }, []);

  return (
    <View
      style={styles.container}
    >
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => {
          const page = e.nativeEvent.position;
          if (page > maxVisitedPage)
            pagerRef.current?.setPage(maxVisitedPage);
        }}
        onPageScroll={(e) => {
          animatedPosition.value = e.nativeEvent.position + e.nativeEvent.offset;
        }}
      >
        {STEPS.map((Step, i) => (
          <View
            key={i}
            style={styles.page}
          >
            <Step
              onNext={() => goNext(i)}
            />
          </View>
        ))}
      </PagerView>

      <View
        style={styles.indicator}
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
  pager: {
    flex: 1,
  },
  page: {
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
    gap: DOT_SIZE_BASE * 3/4,
  },
  dot: {
    height: DOT_SIZE_BASE,
    minWidth: DOT_SIZE_BASE,
    maxWidth: DOT_WIDTH_ACTIVE,
    borderCurve: 'circular',
    borderRadius: 9999,
  },
});
