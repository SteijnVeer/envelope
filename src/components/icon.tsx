import type { ThemeColor } from '@/contexts/theme';
import { FontSizes, useColor } from '@/contexts/theme';
import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import type { DimensionValue, ViewProps } from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';

export type IconName = SFSymbol;

export type FillableIconName = keyof {
  [K in IconName as `${K}.fill` extends IconName ? K : never]: `${K}.fill`;
};

export type IconProps = Omit<ViewProps, 'children'> & {
  name: IconName;
  tintColor?: SymbolViewProps['tintColor'];
  color?: ThemeColor;
  size?: DimensionValue | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
};

function isSizeKey(value: IconProps['size'] ): value is 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' {
  return typeof value === 'string' && value in FontSizes;
}

export function Icon({ name, color = 'text', tintColor, size = 'md', style, ...props }: IconProps) {
  const themedColor = useColor(color);
  const iconSize = isSizeKey(size) ? FontSizes[size] * 1.25 : size;
  return (
    <SymbolView
      {...props}
      name={name}
      tintColor={tintColor || themedColor}
      weight='semibold'
      resizeMode='scaleAspectFit'
      style={[
        {
          width: iconSize,
          height: iconSize,
        },
        style,
      ]}
    />
  );
}
