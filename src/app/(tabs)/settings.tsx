import { Glass } from '@/components/glass';
import { GlassButton } from '@/components/glass/button';
import { GlassField, GlassSection } from '@/components/glass/section';
import { Page } from '@/components/page';
import { Text } from '@/components/text';
import { useStore, useStoreValue } from '@/contexts/store';
import { useThemeMode } from '@/contexts/theme';
import { useLanguage } from '@/contexts/translator';

export default function Settings() {
  const [, setHasCompletedSetup] = useStoreValue('hasCompletedSetup');
  const { setLang, langs } = useLanguage();
  const [, setThemeMode] = useThemeMode();
  const store = useStore();
  return (
    <Page scrollable showBackground>
      <Text type='largeTitle' text='Settings' centered />
      <Text type='title3' text='General' autoMargin='top' />
      <Glass glassEffectStyle='regular'>
        <Text text='This is a placeholder for the settings page. You can add your settings options here.' />
      </Glass>
      <GlassSection label='Verbinding'>
        <GlassField
          icon='wifi'
          iconBackground='#34C759'
          label='Wifi'
          value='VRV95176CA98A_EXT'
          onPress={() => {}}
        />
        <GlassField
          icon='airplane'
          iconBackground='#FF9500'
          label='Vliegtuigmodus'
          toggle={{ value: false, onChange: () => {} }}
        />
        <GlassField icon='gear' label='Account' onPress={() => {}} />
        <GlassField icon='battery.100' label='Batterij' value='84%' />
      </GlassSection>
      <Text type='title3' text='DEV OPTIONS RESET' color='red' autoMargin='top' />
      <GlassButton
        tintColor='red'
        pill
        text='Reset onboarding'
        onPress={() => {
          setHasCompletedSetup(false);
        }}
      />
      <GlassButton
        tintColor='red'
        pill
        text='Reset KV store'
        onPress={() => {
          store.clear();
        }}
      />
      <Text type='title3' text='DEV OPTIONS THEME' color='blue' autoMargin='top' />
      <GlassButton
        tintColor='darkblue'
        pill
        text='Set theme to dark'
        onPress={() => {
          setThemeMode('dark');
        }}
      />
      <GlassButton
        tintColor='lightblue'
        pill
        text='Set theme to light'
        onPress={() => {
          setThemeMode('light');
        }}
      />
      <GlassButton
        tintColor='blue'
        pill
        text='Set theme to auto'
        onPress={() => {
          setThemeMode('auto');
        }}
      />
      <Text type='title3' text='DEV OPTIONS LANGUAGE' color='orange' autoMargin='top' />
      {langs.map((lang) => (
        <GlassButton
          key={lang}
          tintColor='green'
          pill
          text={`Set language to ${lang}`}
          onPress={() => {
            setLang(lang);
          }}
        />
      ))}
      <GlassButton
        tintColor='orange'
        pill
        text='Set language to auto'
        onPress={() => {
          setLang('auto');
        }}
      />
      <GlassButton
        tintColor='red'
        pill
        text='Set language to default'
        onPress={() => {
          setLang('default');
        }}
      />
    </Page>
  );
}
