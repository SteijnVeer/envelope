import type { SetupStepProps } from './page';
import { SetupStepPlaceholder } from './page';

export default function LanguageStep({ onNext }: SetupStepProps) {
  return (
    <SetupStepPlaceholder
      onNext={onNext}
      index={1}
    />
  );
}
