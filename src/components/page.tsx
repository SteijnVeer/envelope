import { BackgroundGradient } from '@/contexts/background';
import type { SpacingKey } from '@/contexts/theme';
import { useThemedStyle } from '@/contexts/theme';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';

export type PageProps = BasePageProps & {
  scrollable?: boolean;
};

export function Page({ scrollable = false, ...props }: PageProps) {
  return scrollable
    ? <ScrollablePage {...props} />
    : <StaticPage {...props} />;
}

Page.Scrollable = ScrollablePage;
Page.Static = StaticPage;

export type BasePageProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  padHorizontal?: boolean | SpacingKey;
  showBackground?: boolean;
};

const DEFUALT_HORIZONTAL_PADDING: SpacingKey = 'three';

export function StaticPage({ style, children, padHorizontal = true, showBackground = false }: BasePageProps) {
  const { top, bottom } = useSafeAreaInsets();
  const horizontalPaddingStyle = useThemedStyle({ paddingHorizontal: typeof padHorizontal === 'boolean' ? DEFUALT_HORIZONTAL_PADDING : padHorizontal });
  const insetStyle = {
    paddingTop: top,
    paddingBottom: bottom,
  };

  return (
    <View
      style={[
        styles.container,
        padHorizontal && horizontalPaddingStyle,
        insetStyle,
        style,
      ]}
    >
      {showBackground && <BackgroundGradient />}
      {children}
    </View>
  );
}

export function ScrollablePage({ style, children, padHorizontal = true, showBackground = false }: BasePageProps) {
  const { height } = useSafeAreaFrame();
  const horizontalPaddingStyle = useThemedStyle({ paddingHorizontal: typeof padHorizontal === 'boolean' ? DEFUALT_HORIZONTAL_PADDING : padHorizontal });
  const heightStyle = {
    minHeight: height - 150,
  };

  return (
    <View
      style={styles.container}
    >
      {showBackground && <BackgroundGradient />}
      <ScrollView
        contentInsetAdjustmentBehavior='scrollableAxes'
        contentContainerStyle={[
          styles.content,
          padHorizontal && horizontalPaddingStyle,
          heightStyle,
          style,
        ]}
        style={styles.container}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    width: '100%',
  },
});
