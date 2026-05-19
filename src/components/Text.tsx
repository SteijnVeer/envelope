import type { TranslationKey } from '@/contexts/translator';
import { useTranslation } from '@/contexts/translator';
import type { TextProps as RNTextProps } from 'react-native';
import { Text as RNText, StyleSheet } from 'react-native';

export type TextTypes = 'title' | 'header'  | 'subheader'  | 'paragraph'  | 'label';

export type TextProps = Omit<RNTextProps, 'children'> & {
  text: TranslationKey | string;
  type?: TextTypes;
};

export function Text({ text, type, ...props}: TextProps) {
  const translated = useTranslation(text);
  return <RNText
    {...props}
    style={[
      textTypeStyles.base,
      type
        ? textTypeStyles[type]
        : undefined,
      props.style,
    ]}
  >
    {translated}
  </RNText>;
}

const textTypeStyles = StyleSheet.create({
  base: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'heavy',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    color: 'gray',
  },
});
