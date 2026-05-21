import { Glass } from '@/components/glass';
import { GlassButton } from '@/components/glass/button';
import { Page } from '@/components/page';
import { Text } from '@/components/text';
import { useStoreValue } from '@/contexts/store';

export default function Settings() {
  const [, setHasCompletedSetup] = useStoreValue('hasCompletedSetup');
  return (
    <Page
      scrollable
      showBackground
    >
      <Text
        type='heading'
        text='Settings'
        centered
      />
      <Text
        type='subheading'
        text='General'
        autoMargin='top'
      />
      <Glass
        glassEffectStyle='regular'
        pill
      >
        <Text
          text='This is a placeholder for the settings page. You can add your settings options here.'
        />
      </Glass>
      <Text
        type='subheading'
        text='DEV OPTIONS'
        color='red'
        autoMargin='top'
      />
      <GlassButton
        tintColor='red'
        pill
        text='Reset onboarding'
        onPress={() => {
          setHasCompletedSetup(false);
        }}
      />
    </Page>
  );
}
