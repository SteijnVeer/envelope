import type { IconSizeKey, ThemeColor } from '@/contexts/theme';
import { useColor, useIconSize } from '@/contexts/theme';
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
  size?: DimensionValue | IconSizeKey;
};

export function Icon({ name, color = 'text', tintColor, size = 'md', style, ...props }: IconProps) {
  const themedColor = useColor(color);
  const iconSize = useIconSize(size);
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
