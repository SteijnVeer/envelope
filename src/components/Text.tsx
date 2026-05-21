import { FontMargin, useLightDark, useThemedStyle } from '@/contexts/theme';
import type { TranslationKey } from '@/contexts/translator';
import { useTranslation } from '@/contexts/translator';
import type { TextProps as RNTextProps } from 'react-native';
import { Text as RNText, StyleSheet } from 'react-native';

export type TextTypes =
  | 'caption'
  | 'code'
  | 'label'
  | 'paragraph'
  | 'body'
  | 'subheading'
  | 'heading'
  | 'subtitle'
  | 'title'
  | 'display';

export type TextProps = RNTextProps & {
  text?: TranslationKey | string;
  type?: TextTypes;
  color?: string | {
    light?: string;
    dark?: string;
  };
  autoMargin?: 'top' | 'bottom' | 'both' | 'none' | boolean;
  centered?: boolean;
};

const __NO_TEXT_PROVIDED__ = '__NO_TEXT_PROVIDED__' as const;

export function Text({ text = __NO_TEXT_PROVIDED__, children, type = 'body', color, autoMargin = 'none', centered = false, style, ...props}: TextProps) {
  const translated = useTranslation(text);
  const themedStyle = useThemedStyle({ color: 'text', fontSize: type });
  const themedColor = useLightDark<string | undefined>(color);
  const colorStyle = themedColor ? { color: themedColor } : null;
  const marginValue = FontMargin[type];
  const marginStyle = autoMargin && autoMargin !== 'none' ? (
    autoMargin === true || autoMargin === 'both'
      ? { marginVertical: marginValue }
      : autoMargin === 'top'
        ? { marginTop: marginValue }
        : { marginBottom: marginValue }
  ) : null;

  return <RNText
    {...props}
    style={[
      textTypeStyles.base,
      centered && textTypeStyles.centered,
      themedStyle,
      colorStyle,
      marginStyle,
      style,
    ]}
  >
    {translated !== __NO_TEXT_PROVIDED__
      ? translated
      : children
    }
  </RNText>;
}

const textTypeStyles = StyleSheet.create({
  base: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  centered: {
    textAlign: 'center',
    width: '100%',
  },
});
