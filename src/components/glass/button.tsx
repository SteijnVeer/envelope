import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { StyleSheet } from 'react-native';
import type { GlassProps } from '.';
import { Glass } from '.';
import type { TextProps } from '../text';
import { Text } from '../text';

type PressableProps<E = GestureResponderEvent, R = void | Promise<void>> = {
  onPressStart?: (e: E) => R;
  onPressEnd?: (e: E) => R;
  onPress?: (e: E) => R;
  onPressCancel?: (e: E) => R;
};

export type GlassButtonProps = Omit<GlassProps, 'children' | 'isInteractive'> & PressableProps & ({
  children?: undefined;
  text?: TextProps['text'];
  textProps?: Omit<TextProps, 'text'>;
} | {
  children?: TextProps['text'];
  text?: undefined;
  textProps?: Omit<TextProps, 'text'>;
} | {
  children?: ReactNode;
  text?: undefined;
  textProps?: undefined;
});

export function GlassButton({
  onPress, onPressCancel, onPressStart, onPressEnd, onLayout, onTouchStart, onTouchEnd,
  children, text, textProps, style,
  ...props
}: GlassButtonProps) {
  const sizeRef = useRef({ width: 0, height: 0 });

  return (
    <Glass
      {...props}
      style={[
        styles.button,
        style,
      ]}
      isInteractive
      onLayout={(e) => {
        sizeRef.current = {
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        };
        onLayout?.(e);
      }}
      onTouchStart={(e) => {
        impactAsync(ImpactFeedbackStyle.Light);
        onPressStart?.(e);
        onTouchStart?.(e);
      }}
      onTouchEnd={(e) => {
        const { locationX, locationY } = e.nativeEvent;
        const { width, height } = sizeRef.current;
        if (locationX >= 0 && locationX <= width && locationY >= 0 && locationY <= height)
          onPress?.(e);
        else
          onPressCancel?.(e);
        onPressEnd?.(e);
        onTouchEnd?.(e);
      }}
    >
      {typeof text === 'string' || typeof children === 'string' ? (
        <Text
          text={text ?? children as TextProps['text']}
          type='subheading'
          {...textProps}
        />
      ) : (
        children
      )}
    </Glass>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
