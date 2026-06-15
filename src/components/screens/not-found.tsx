import { Icon } from '@/components/ui/icon';
import { GlassButton, GlassLink, T, VStack } from '@steijnveer/expo-commons/components';
import { Rounded, Spacing } from '@steijnveer/expo-commons/constants';
import { useColor } from '@steijnveer/expo-commons/hooks';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export function NotFoundScreen() {
  const router = useRouter();
  const tintColor = useColor('primary');

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
      }}
    >
      <VStack
        centered
        spacing='lg'
        style={{
          padding: Spacing.lg,
        }}
      >
        <T
          type='largeTitle'
          text='NOT.FOUND.404'
          color='primary'
        />
        <T
          type='title1'
          text='NOT.FOUND.MESSAGE'
          color='text'
        />
      </VStack>
      
      <Icon
        name='exclamationmark.magnifyingglass'
        tintColor={tintColor}
        style={{
          width: '100%',
          height: 'auto',
          aspectRatio: 1,
        }}
      />

      <VStack
        spacing={0}
        style={{
          paddingTop: Spacing.lg,
        }}
      >
        <GlassButton
          onPress={() => router.back()}
          disabledOpacity={0}
          disabled={!router.canGoBack()}
          glassEffectStyle='clear'
          style={Rounded.pill}
          text='NOT.FOUND.GO.BACK'
        />
        <GlassLink
          href='/'
          replace
          tintOpacity={null}
          tintColor={tintColor}
          glassEffectStyle='clear'
          style={Rounded.pill}
          text='NOT.FOUND.GO.HOME'
        />
      </VStack>
    </View>
  );
}
