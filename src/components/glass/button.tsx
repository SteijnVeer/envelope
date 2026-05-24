import type { ParamProp } from '@/contexts/translator';
import type { PressableProps } from '@/utils/pressable';
import { hapticPressStart } from '@/utils/pressable';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import type { GlassProps } from '.';
import { Glass } from '.';
import type { TextProps } from '../text';
import { Text } from '../text';

export type GlassButtonProps<K extends string | undefined = undefined> =
  & Omit<GlassProps, 'children' | 'isInteractive'>
  & PressableProps
  & (K extends string
    ? {
      text: K;
      textProps?: Omit<TextProps<K>, 'text' | 'params'>;
      children?: undefined;
    } & ParamProp<K>
    : {
      text?: undefined;
      textProps?: undefined;
      params?: undefined;
      children?: ReactNode;
    });

export function GlassButton<K extends string | undefined = undefined>({
  onPress, onPressCancel, onPressStart, onPressEnd, onLayout, onTouchStart, onTouchEnd,
  children, text, params, textProps, style,
  ...props
}: GlassButtonProps<K>) {
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
        hapticPressStart();
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
      {text !== undefined ? (
        <Text
          text={text as string}
          params={params as never}
          type='title3'
          {...(textProps as Omit<TextProps<string>, 'text' | 'params'>)}
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
