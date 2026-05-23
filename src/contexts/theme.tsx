import { useStoreValue } from '@/contexts/store';
import type { Theme as NavTheme } from 'expo-router/react-navigation';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { DimensionValue, TextStyle, ViewStyle } from 'react-native';
import { useColorScheme, useWindowDimensions } from 'react-native';

// --- Types ---

export type ThemeMode = 'light' | 'dark';

export type ThemeSetting = ThemeMode | 'auto';

export type ThemeColor = keyof typeof COLORS.light;

export type UIScaleSetting = number | 'auto';

export type FontKey = keyof typeof Fonts;

export type SpacingKey = keyof typeof Spacing;

export type FontSizeKey = keyof typeof FontSizes;

export type IconSizeKey = keyof typeof IconSizes;

// --- Constants ---

const Fonts = Object.freeze({
  sans:    'system-ui',
  serif:   'ui-serif',
  rounded: 'ui-rounded',
  mono:    'ui-monospace',
});

const Spacing = Object.freeze({
  xs:    4,
  sm:    8,
  md:   12,
  lg:   16,
  xl:   24,
  xxl:  32,
  xxxl: 64,
});

const FontSizes = Object.freeze({
  caption:    12,
  footnote:   13,
  code:       14,
  callout:    16,
  body:       17,
  headline:   17,
  title3:     20,
  title2:     22,
  title1:     28,
  largeTitle: 34,
  display:    64,
});

const FontMargin: Readonly<Record<FontSizeKey, typeof Spacing[SpacingKey]>> = Object.freeze({
  caption:    Spacing.xs,
  footnote:   Spacing.xs,
  code:       Spacing.sm,
  callout:    Spacing.sm,
  body:       Spacing.lg,
  headline:   Spacing.lg,
  title3:     Spacing.xl,
  title2:     Spacing.xl,
  title1:     Spacing.xxl,
  largeTitle: Spacing.xxl,
  display:    Spacing.xxxl,
});

const FontWeights: Readonly<Record<FontSizeKey, NonNullable<TextStyle['fontWeight']>>> = Object.freeze({
  caption:    '400',
  footnote:   '400',
  code:       '400',
  callout:    '400',
  body:       '400',
  headline:   '600',
  title3:     '400',
  title2:     '500',
  title1:     '600',
  largeTitle: '700',
  display:    '800',
});

const FontFamilies: Readonly<Record<FontSizeKey, FontKey>> = Object.freeze({
  caption:    'sans',
  footnote:   'sans',
  code:       'mono',
  callout:    'sans',
  body:       'sans',
  headline:   'sans',
  title3:     'sans',
  title2:     'rounded',
  title1:     'rounded',
  largeTitle: 'rounded',
  display:    'rounded',
});

const FontLineHeights: Readonly<Record<FontSizeKey, number>> = Object.freeze({
  caption:    16,
  footnote:   18,
  code:       20,
  callout:    21,
  body:       22,
  headline:   22,
  title3:     24,
  title2:     28,
  title1:     34,
  largeTitle: 41,
  display:    72,
});

export const BottomTabInset = 50;

const IconSizes = Object.freeze({
  xs:    12,
  sm:    16,
  md:    20,
  lg:    24,
  xl:    32,
  xxl:   48,
  xxxl:  96,
});

// --- Internal ---

const DEFAULT_THEME: ThemeSetting = 'auto';

const DEFAULT_UI_SCALE: UIScaleSetting = 'auto';

function resolveFontScale(fontScale: number): number {
  if (fontScale < 0.9)  return 0.85;
  if (fontScale < 1.15) return 1.0;
  if (fontScale < 1.5)  return 1.15;
  return 1.35;
}

const COLORS = {
  light: {
    text:               DefaultTheme.colors.text,
    background:         DefaultTheme.colors.background,
    primary:            DefaultTheme.colors.primary,
    notification:       DefaultTheme.colors.notification,
    backgroundElement:  '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary:      '#60646C',
  },
  dark: {
    text:               DarkTheme.colors.text,
    background:         DarkTheme.colors.background,
    primary:            DarkTheme.colors.primary,
    notification:       DarkTheme.colors.notification,
    backgroundElement:  '#212225',
    backgroundSelected: '#2E3135',
    textSecondary:      '#B0B4BA',
  },
} as const;

type ColorSet = Readonly<{ [K in ThemeColor]: string }>;

type ThemeContextValue = {
  colors: ColorSet;
  mode: ThemeMode;
  setMode: (setting: ThemeSetting) => void;
  uiScale: number;
  setUIScale: (setting: UIScaleSetting) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: COLORS.light as ColorSet,
  mode: 'light',
  setMode: () => {},
  uiScale: 1,
  setUIScale: () => {},
});

const NAV_THEMES: Record<ThemeMode, NavTheme> = {
  light: {
    dark: false,
    colors: {
      primary:      COLORS.light.primary,
      notification: COLORS.light.notification,
      background:   '#0000',
      card:         COLORS.light.backgroundElement,
      text:         COLORS.light.text,
      border:       COLORS.light.backgroundSelected,
    },
    fonts: DefaultTheme.fonts,
  },
  dark: {
    dark: true,
    colors: {
      primary:      COLORS.dark.primary,
      notification: COLORS.dark.notification,
      background:   '#0000',
      card:         COLORS.dark.backgroundElement,
      text:         COLORS.dark.text,
      border:       COLORS.dark.backgroundSelected,
    },
    fonts: DarkTheme.fonts,
  },
};

// --- Provider ---

export type ThemeProviderProps = {
  children?: ReactNode;
  theme?: ThemeSetting;
  uiScale?: UIScaleSetting;
};

export function ThemeProvider({ children, theme: initialTheme = DEFAULT_THEME, uiScale: initialUIScale = DEFAULT_UI_SCALE }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const { fontScale } = useWindowDimensions();
  const [storedTheme, setStoredTheme] = useStoreValue('theme');
  const [storedUIScale, setStoredUIScale] = useStoreValue('uiScale');

  const setting: ThemeSetting = (storedTheme as ThemeSetting | null) ?? initialTheme;
  const uiScaleSetting: UIScaleSetting = (storedUIScale as UIScaleSetting | null) ?? initialUIScale;

  const resolvedMode: ThemeMode = setting === 'auto'
    ? (systemScheme === 'dark' ? 'dark' : 'light')
    : setting;

  const resolvedUIScale: number = uiScaleSetting === 'auto'
    ? resolveFontScale(fontScale)
    : uiScaleSetting;

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: COLORS[resolvedMode] as ColorSet,
      mode: resolvedMode,
      setMode: setStoredTheme as (setting: ThemeSetting) => void,
      uiScale: resolvedUIScale,
      setUIScale: setStoredUIScale as (setting: UIScaleSetting) => void,
    }),
    [resolvedMode, resolvedUIScale, setStoredTheme, setStoredUIScale],
  );

  return (
    <ThemeContext.Provider
      value={value}
    >
      <NavThemeProvider
        value={NAV_THEMES[resolvedMode]}
      >
        <StatusBar
          style={resolvedMode === 'dark' ? 'light' : 'dark'}
          hideTransitionAnimation='fade'
          hidden={false}
          animated
        />
        {children}
      </NavThemeProvider>
    </ThemeContext.Provider>
  );
}

// --- Hooks ---

export function useTheme() {
  return useContext(ThemeContext).colors;
}

export function useColor(key: ThemeColor) {
  return useTheme()[key];
}

export function useThemeMode(): [ThemeMode, (setting: ThemeSetting) => void] {
  const { mode, setMode } = useContext(ThemeContext);
  return [mode, setMode];
}

export function useUIScale(): [number, (setting: UIScaleSetting) => void] {
  const { uiScale, setUIScale } = useContext(ThemeContext);
  return [uiScale, setUIScale];
}

export function useUIScaleFactor(): number {
  const [scale] = useUIScale();
  return scale;
}

export function useLightDark<T>(value: T | { light?: T; dark?: T }): T {
  const [theme] = useThemeMode();
  return typeof value === 'object' && value !== null && ('light' in value || 'dark' in value)
    ? value[theme] ?? value.light ?? value.dark as T
    : value as T;
}

export function useIconSize(size: DimensionValue | IconSizeKey): DimensionValue {
  const scaleFactor = useUIScaleFactor();
  if (typeof size === 'string' && size in IconSizes)
    return Math.round(IconSizes[size as IconSizeKey] * scaleFactor);
  if (typeof size === 'number')
    return Math.round(size * scaleFactor);
  return size as DimensionValue;
}

export function useFontMargin(key: FontSizeKey): number {
  const scaleFactor = useUIScaleFactor();
  return Math.round(FontMargin[key] * scaleFactor);
}

export function useFontTypeStyle(
  type: FontSizeKey,
  fontFamilyOverride?: FontKey,
): Pick<TextStyle, 'fontSize' | 'fontWeight' | 'fontFamily' | 'lineHeight'> {
  const scaleFactor = useUIScaleFactor();
  return {
    fontSize:   Math.round(FontSizes[type]       * scaleFactor),
    fontWeight: FontWeights[type],
    fontFamily: Fonts[fontFamilyOverride ?? FontFamilies[type]],
    lineHeight: Math.round(FontLineHeights[type] * scaleFactor),
  };
}

// --- Themed Style Hook ---

type ColorStyleProp = 'color' | 'backgroundColor' | 'borderColor' | 'shadowColor';
type SpacingStyleProp =
  | 'margin' | 'marginTop' | 'marginBottom' | 'marginLeft' | 'marginRight'
  | 'marginVertical' | 'marginHorizontal'
  | 'padding' | 'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight'
  | 'paddingVertical' | 'paddingHorizontal'
  | 'gap' | 'rowGap' | 'columnGap'
  | 'width' | 'height' | 'minWidth' | 'minHeight' | 'maxWidth' | 'maxHeight'
  | 'borderRadius' | 'borderTopLeftRadius' | 'borderTopRightRadius'
  | 'borderBottomLeftRadius' | 'borderBottomRightRadius'
  | 'top' | 'bottom' | 'left' | 'right';
type FontStyleProp = 'fontFamily';
type FontSizeStyleProp = 'fontSize' | 'lineHeight';

export type ThemedStyleInput =
  & { [K in ThemeColor]?:        ColorStyleProp    | ColorStyleProp[]    }
  & { [K in SpacingKey]?:        SpacingStyleProp  | SpacingStyleProp[]  }
  & { [K in FontKey]?:           FontStyleProp     | FontStyleProp[]     }
  & { [K in FontSizeKey]?:       FontSizeStyleProp | FontSizeStyleProp[] }
  & { [K in ColorStyleProp]?:    ThemeColor                              }
  & { [K in SpacingStyleProp]?:  SpacingKey                              }
  & { [K in FontStyleProp]?:     FontKey                                 }
  & { [K in FontSizeStyleProp]?: FontSizeKey                             };

export function useThemedStyle(input: ThemedStyleInput): ViewStyle & TextStyle {
  const colors = useTheme();
  const scaleFactor = useUIScaleFactor();
  const scaled = (n: number) => Math.round(n * scaleFactor);
  const style: Record<string, string | number> = {};

  const setProps = (props: string | string[], value: string | number) => {
    const propsArray = Array.isArray(props) ? props : [props];
    for (const prop of propsArray)
      style[prop] = value;
  };

  for (const [key, value] of Object.entries(input))
    if (value === undefined)
      continue;
    else if (key in COLORS.light)
      // ThemeColor → CSS prop(s)
      setProps(value, colors[key as ThemeColor]);
    else if (key in Spacing)
      // SpacingKey → CSS prop(s)
      setProps(value, scaled(Spacing[key as SpacingKey]));
    else if (key in Fonts)
      // FontKey → CSS prop(s)
      setProps(value, Fonts[key as FontKey]);
    else if (key in FontSizes)
      // FontSizeKey → CSS prop(s)
      setProps(value, scaled(FontSizes[key as FontSizeKey]));
    else if (typeof value === 'string')
      // CSS prop → source key
      if (value in COLORS.light)
        style[key] = colors[value as ThemeColor];
      else if (value in Spacing)
        style[key] = scaled(Spacing[value as SpacingKey]);
      else if (value in Fonts)
        style[key] = Fonts[value as FontKey];
      else if (value in FontSizes)
        style[key] = scaled(FontSizes[value as FontSizeKey]);
      else
        console.warn(`Invalid themed style value for key "${key}":`, value);
    else
      console.warn(`Invalid themed style value for key "${key}":`, value);

  return style as ViewStyle & TextStyle;
}
