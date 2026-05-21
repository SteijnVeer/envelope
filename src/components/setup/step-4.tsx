import type { SetupStepProps } from '@/components/setup/page';
import { SetupStepPlaceholder } from '@/components/setup/page';

export function Step4({ onNext }: SetupStepProps) {
  return (
    <SetupStepPlaceholder
      onNext={onNext}
      index={4}
      icon='checkmark'
      nextText='Finish Setup'
    />
  );
}
