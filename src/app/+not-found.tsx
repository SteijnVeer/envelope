import { GlassButton } from '@/components/glass/button';
import { GlassLink } from '@/components/glass/link';
import { Icon } from '@/components/icon';
import { Page } from '@/components/page';
import { Text } from '@/components/text';
import { useColor } from '@/contexts/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function NotFound() {
  const router = useRouter();
  const tintColor = useColor('primary');
  return (
    <Page>
      <View
        style={styles.fullWidth}
      >
        <Text
          type='display'
          text='NOT.FOUND.404'
          color={tintColor}
          centered
          autoMargin='top'
        />
        <Text
          type='largeTitle'
          text='NOT.FOUND.MESSAGE'
          centered
          autoMargin
        />
      </View>

      <View
        style={styles.iconContainer}
      >
        <Icon
          name='exclamationmark.magnifyingglass'
          tintColor={tintColor}
          size='100%'
        />
      </View>

      <View
        style={styles.fullWidth}
      >
        <GlassLink
          text='NOT.FOUND.GO.HOME'
          href='/'
          replace
          tintColor={tintColor}
          style={styles.fullWidth}
          glassEffectStyle='regular'
          pill
        />
        {router.canGoBack() && (
          <GlassButton
            text='NOT.FOUND.GO.BACK'
            onPress={() => router.back()}
            style={[styles.fullWidth, styles.noMarginVertical]}
            glassEffectStyle='regular'
            pill
          />
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  iconContainer: {
    flex: 1,
    maxWidth: '100%',
  },
  noMarginVertical: {
    marginVertical: 0,
  },
});
