import Step1 from './language';
import type { SetupStepProps } from './page';
import { Step2 } from './step-2';
import { Step3 } from './step-3';
import { Step4 } from './step-4';

export const STEPS: React.ComponentType<SetupStepProps>[] = [Step1, Step2, Step3, Step4];
