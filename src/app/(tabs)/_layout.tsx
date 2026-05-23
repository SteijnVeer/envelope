import type { FillableIconName, IconName } from '@/components/icon';
import { useTheme } from '@/contexts/theme';
import { useTranslations } from '@/contexts/translator';
import { hapticPressStart } from '@/utils/pressable';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

function fillableTriggerIcon(name: FillableIconName): { default: IconName; selected: IconName } {
  return {
    default: name,
    selected: `${name}.fill`,
  };
}

export default function TabLayout() {
  const colors = useTheme();
  const t = useTranslations();

  return (
    <NativeTabs
      screenListeners={{
        tabPress: () => hapticPressStart(),
      }}
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{
        default: {
          color: colors.text,
        },
        selected: {
          color: colors.primary,
        },
      }}
    >
      <NativeTabs.Trigger
        name='home'
      >
        <NativeTabs.Trigger.Label>
          {t('TABS.HOME')}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={fillableTriggerIcon('house')}
          renderingMode='template'
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger
        name='write'
      >
        <NativeTabs.Trigger.Label>
          {t('TABS.WRITE')}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={fillableTriggerIcon('books.vertical')}
          renderingMode='template'
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger
        name='saved'
      >
        <NativeTabs.Trigger.Label>
          {t('TABS.SAVED')}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={fillableTriggerIcon('bookmark')}
          renderingMode='template'
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger
        name='settings'
      >
        <NativeTabs.Trigger.Label>
          {t('TABS.SETTINGS')}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={fillableTriggerIcon('gearshape')}
          renderingMode='template'
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger
        name='recent'
      >
        <NativeTabs.Trigger.Label>
          {t('TABS.RECENT')}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={fillableTriggerIcon('clock')}
          renderingMode='template'
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
