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
        name='index' // replace with actual route name and icons!
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
        name='explore' // replace with actual route name and icons!
      >
        <NativeTabs.Trigger.Label>
          Explore
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
