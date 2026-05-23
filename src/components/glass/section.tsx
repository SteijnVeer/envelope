import type { IconName } from '@/components/icon';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import type { ThemeColor } from '@/contexts/theme';
import { useColor, useTheme, useThemedStyle } from '@/contexts/theme';
import { hapticPressStart } from '@/utils/pressable';
import { Children, isValidElement } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import type { GlassProps } from '.';
import { Glass } from '.';

// --- Types ---

type GlassFieldBase = {
  icon?: IconName;
  iconColor?: ThemeColor;
  iconBackground?: string;
  label: string;
  style?: object;
};

type GlassFieldToggle = GlassFieldBase & {
  toggle: { value: boolean; onChange: (value: boolean) => void };
  value?: never;
  onPress?: never;
};

type GlassFieldPress = GlassFieldBase & {
  onPress: () => void;
  value?: string;
  toggle?: never;
};

type GlassFieldValue = GlassFieldBase & {
  value: string;
  onPress?: never;
  toggle?: never;
};

type GlassFieldStatic = GlassFieldBase & {
  toggle?: never;
  value?: never;
  onPress?: never;
};

export type GlassFieldProps =
  | GlassFieldToggle
  | GlassFieldPress
  | GlassFieldValue
  | GlassFieldStatic;

export type GlassSectionProps = Omit<GlassProps, 'children' | 'themed'> & {
  children: React.ReactNode;
  label?: string;
};

// --- Components ---

export function GlassSection({ children, label, style, glassEffectStyle = 'regular', ...props }: GlassSectionProps) {
  const separatorColor = useColor('backgroundSelected');
  const childArray = Children.toArray(children).filter(isValidElement);
  const wrapperStyle = useThemedStyle({ xs: 'gap' });
  const labelStyle = useThemedStyle({ sm: 'paddingHorizontal' });
  const glassStyle = useThemedStyle({ lg: 'borderRadius' });
  const separatorStyle = useThemedStyle({ lg: 'marginHorizontal' });

  return (
    <View
      style={wrapperStyle}
    >
      {label && (
        <Text
          text={label}
          type='footnote'
          color='textSecondary'
          style={labelStyle}
        />
      )}
      <Glass
        {...props}
        glassEffectStyle={glassEffectStyle}
        themed={false}
        style={[
          styles.section,
          glassStyle,
          style,
        ]}
      >
        {childArray.map((child, i) => (
          <View
            key={i}
          >
            {i > 0 && (
              <View
                style={[
                  styles.separator,
                  separatorStyle,
                  { backgroundColor: separatorColor },
                ]}
              />
            )}
            {child}
          </View>
        ))}
      </Glass>
    </View>
  );
}

export function GlassField({ icon, iconColor = 'text', iconBackground, label, toggle, value, onPress, style }: GlassFieldProps) {
  const colors = useTheme();
  const fieldSpacing = useThemedStyle({ lg: 'paddingHorizontal', md: 'paddingVertical' });
  const fieldLeftStyle = useThemedStyle({ sm: 'gap' });
  const fieldRightStyle = useThemedStyle({ xs: 'gap' });
  const iconBadgeStyle = useThemedStyle({ sm: 'borderRadius' });

  const inner = (
    <View
      style={[
        styles.field,
        fieldSpacing,
        style,
      ]}
    >
      <View
        style={[
          styles.fieldLeft,
          fieldLeftStyle,
        ]}
      >
        {icon && (
          iconBackground ? (
            <View
              style={[
                styles.iconBadge,
                iconBadgeStyle,
                { backgroundColor: iconBackground },
              ]}
            >
              <Icon
                name={icon}
                tintColor='white'
                size='md'
              />
            </View>
          ) : (
            <View
              style={[
                styles.iconBadge,
                iconBadgeStyle,
              ]}
            >
              <Icon
                name={icon}
                color={iconColor}
                size='md'
              />
            </View>
          )
        )}
        <Text
          text={label}
          type='body'
        />
      </View>

      <View
        style={[
          styles.fieldRight,
          fieldRightStyle,
        ]}
      >
        {value != null && (
          <Text
            text={value}
            type='body'
            color='textSecondary'
          />
        )}
        {toggle && (
          <Switch
            value={toggle.value}
            onValueChange={toggle.onChange}
            trackColor={{ true: colors.primary }}
          />
        )}
        {onPress && (
          <Icon
            name='chevron.right'
            color='textSecondary'
            size='sm'
          />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPressIn={hapticPressStart}
        onPress={onPress}
        style={({ pressed }) => pressed && styles.fieldPressed}
      >
        {inner}
      </Pressable>
    );
  }

  return inner;
}

// --- Styles ---

const styles = StyleSheet.create({
  section: {
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldPressed: {
    opacity: 0.6,
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fieldRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
