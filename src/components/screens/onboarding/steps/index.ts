import type { ComponentType } from 'react';
import type { OnboardingStepProps } from './types';

import { FinishStep } from './finish';
import { LanguageStep } from './language';

export const STEPS: ComponentType<OnboardingStepProps>[] = [
  LanguageStep,
  // ... other steps
  FinishStep,
];
