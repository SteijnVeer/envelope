import type { FontKey, FontSizeKey } from '@/contexts/theme';
import { useFontMargin, useFontTypeStyle, useLightDark, useThemedStyle } from '@/contexts/theme';
import type { ParamProp, TranslationKey } from '@/contexts/translator';
import { useTranslation } from '@/contexts/translator';
import type { TextProps as RNTextProps } from 'react-native';
import { Text as RNText, StyleSheet } from 'react-native';

export type TextTypes = FontSizeKey;

export type TextProps<K extends TranslationKey | string> =
  & Omit<RNTextProps, 'children'>
  & ParamProp<K>
  & {
    text: K;
    type?: TextTypes;
    fontFamily?: FontKey;
    color?: string | {
      light?: string;
      dark?: string;
    };
    autoMargin?: 'top' | 'bottom' | 'both' | 'none' | boolean;
    centered?: boolean;
  };

export function Text<K extends TranslationKey | string>({ text, type = 'body', fontFamily, color, params, autoMargin = 'none', centered = false, style, ...props}: TextProps<K>) {
  const translated = useTranslation(text, params);
  const fontTypeStyle = useFontTypeStyle(type, fontFamily);
  const themeColorStyle = useThemedStyle({ color: 'text' });
  const themedColor = useLightDark<string | undefined>(color);
  const overrideColorStyle = themedColor ? { color: themedColor } : null;
  const marginValue = useFontMargin(type);
  const marginStyle = autoMargin && autoMargin !== 'none' ? (
    autoMargin === true || autoMargin === 'both'
      ? { marginVertical: marginValue }
      : autoMargin === 'top'
        ? { marginTop: marginValue }
        : { marginBottom: marginValue }
  ) : null;

  return (
    <RNText
      {...props}
      style={[
        fontTypeStyle,
        themeColorStyle,
        centered && textTypeStyles.centered,
        overrideColorStyle,
        marginStyle,
        style,
      ]}
    >
      {translated}
    </RNText>
  );
}

const textTypeStyles = StyleSheet.create({
  centered: {
    textAlign: 'center',
    width: '100%',
  },
});
