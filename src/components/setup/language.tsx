import type { SetupStepProps } from './page';
import { SetupStepPlaceholder } from './page';

export default function LanguageStep({ onNext }: SetupStepProps) {
  return (
    <SetupStepPlaceholder
      icon='globe'
      onNext={onNext}
      index={1}
      nextText='Confirm Language'
    />
  );
}
