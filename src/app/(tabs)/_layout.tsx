import { useTheme } from '@/contexts/theme';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  const colors = useTheme();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{
        selected: {
          color: colors.text,
        },
      }}
    >
      <NativeTabs.Trigger
        name='home'
      >
        <NativeTabs.Trigger.Label>
          Home
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: 'house',
            selected: 'house.fill',
          }}
          renderingMode='template'
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger
        name='write'
      >
        <NativeTabs.Trigger.Label>
          Write
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: 'books.vertical',
            selected: 'books.vertical.fill',
          }}
          renderingMode='template'
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
