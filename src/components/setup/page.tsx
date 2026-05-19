import { Button } from 'react-native';
import { Text } from '../text';

export type SetupStepProps = {
  onNext: () => void;
};

export type SetupStepPlaceholderProps = {
  onNext: () => void;
  index: number;
};

export function SetupStepPlaceholder({ onNext, index }: SetupStepPlaceholderProps) {
  return (
    <>
      <Text type="header" text={`Step ${index}`} />
      <Text type="subheader" text={`This is a placeholder for step ${index}.`} />
      <Button onPress={onNext} title="Next" />
    </>
  );
}
