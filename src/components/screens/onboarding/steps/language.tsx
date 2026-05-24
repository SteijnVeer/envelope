import { GlassButton } from '@/components/glass/button';
import { Page } from '@/components/page';
import { useColor } from '@/contexts/theme';
import type { OnboardingStepProps } from './types';

export function LanguageStep({ goToNextStep }: OnboardingStepProps) {
  const tintColor = useColor('primary');

  return (
    <Page
      style={{
        justifyContent: 'flex-end',
        paddingBottom: 80,
      }}
    >
      <GlassButton
        onPress={goToNextStep}
        text='Next'
        tintColor={tintColor}
      />
    </Page>
  );
}
