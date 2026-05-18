import type { StepProps } from '@/components/setup/types';
import { ThemedText } from '@/components/themed-text';

export function Step1({ onNext }: StepProps) {
  return (
    <>
      <ThemedText type="title">Step 1</ThemedText>
    </>
  );
}
