import type { SetupStepProps } from '@/components/setup/page';
import { SetupStepPlaceholder } from '@/components/setup/page';

export function Step3({ onNext }: SetupStepProps) {
  return (
    <SetupStepPlaceholder
      onNext={onNext}
      index={3}
    />
  );
}
