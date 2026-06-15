import { useColor } from '@steijnveer/expo-commons/hooks';
import type { Color } from '@steijnveer/expo-commons/types';
import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import type { DimensionValue, ViewProps } from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';

export type IconName = SFSymbol;

export type FillableIconName = keyof {
  [K in IconName as `${K}.fill` extends IconName ? K : never]: `${K}.fill`;
};

export type NonFillableIconName = keyof {
  [K in IconName as `${K}.fill` extends IconName ? never : K]: K;
};

export type IconProps = Omit<ViewProps, 'children'> & {
  name: IconName;
  tintColor?: SymbolViewProps['tintColor'];
  color?: Color;
  size?: DimensionValue;
};

export function Icon({ name, color = 'text', tintColor, size = 24, style, ...props }: IconProps) {
  const themedColor = useColor(color);
  return (
    <SymbolView
      {...props}
      name={name}
      tintColor={tintColor || themedColor}
      weight='semibold'
      resizeMode='scaleAspectFit'
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
