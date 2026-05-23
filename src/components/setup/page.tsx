import { GlassButton } from '@/components/glass/button';
import { useColor } from '@/contexts/theme';
import { SafeAreaView, useSafeAreaFrame } from 'react-native-safe-area-context';
import type { IconName } from '../icon';
import { Icon } from '../icon';
import { Text } from '../text';

export type SetupStepProps = {
  onNext: () => void;
};

export type SetupStepPlaceholderProps = {
  onNext: () => void;
  index: number;
  icon?: IconName;
  nextText?: string;
};

export function SetupStepPlaceholder({ onNext, index, icon, nextText = 'Next' }: SetupStepPlaceholderProps) {
  const { width } = useSafeAreaFrame();
  const tint = useColor('primary');
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
      }}
    >
      {icon && <Icon
        name={icon}
        size={width * 0.75}
      />}
      <Text
        type='largeTitle'
        text={`Step ${index}`}
      />
      <Text
        type='title3'
        text={`This is a placeholder for step ${index}.`}
      />
      <GlassButton
        onPress={onNext}
        text={nextText}
        tintColor={tint}
        style={{
          minWidth: '50%',
        }}
      />
    </SafeAreaView>
  );
}
