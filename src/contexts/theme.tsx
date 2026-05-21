import type { Theme as NavTheme } from '@react-navigation/native';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import { useColorScheme } from 'react-native';

// --- Types ---

export type ThemeMode = 'light' | 'dark';

export type ThemeSetting = ThemeMode | 'auto';

export type ThemeColor = keyof typeof COLORS.light;

// --- Constants ---

export const Fonts = Object.freeze({
  sans:    'system-ui',
  serif:   'ui-serif',
  rounded: 'ui-rounded',
  mono:    'ui-monospace',
});

export type FontKey = keyof typeof Fonts;

export const Spacing = Object.freeze({
  half:  2,
  one:   4,
  two:   8,
  three: 16,
  four:  24,
  five:  32,
  six:   64,
});

export type SpacingKey = keyof typeof Spacing;

export const FontSizes = Object.freeze({
  xs:  10,
  sm:  12,
  md:  14,
  lg:  16,
  xl:  20,
  xxl: 24,
  caption:    10,
  code:       14,
  label:      14,
  paragraph:  16,
  body:       16,
  subheading: 20,
  heading:    32,
  subtitle:   28,
  title:      40,
  display:    64,
});

export type FontSizeKey = keyof typeof FontSizes;

export const FontMargin: Readonly<Record<FontSizeKey, typeof Spacing[SpacingKey]>> = Object.freeze({
  xs:  Spacing.half,
  sm:  Spacing.one,
  md:  Spacing.two,
  lg:  Spacing.three,
  xl:  Spacing.four,
  xxl: Spacing.five,
  caption:    Spacing.half,
  code:       Spacing.two,
  label:      Spacing.two,
  paragraph:  Spacing.three,
  body:       Spacing.three,
  subheading: Spacing.four,
  heading:    Spacing.five,
  subtitle:   Spacing.five,
  title:      Spacing.six,
  display:    Spacing.six,
});

export const BottomTabInset = 50;

// --- Internal ---

const DEFAULT_THEME: ThemeSetting = 'auto';

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

type ColorSet = { readonly [K in ThemeColor]: string };

type ThemeContextValue = {
  colors: ColorSet;
  mode: ThemeMode;
  setMode: (setting: ThemeSetting) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: COLORS.light,
  mode: 'light',
  setMode: () => {},
});

const NAV_THEMES: Record<ThemeMode, NavTheme> = {
  light: {
    dark: false,
    colors: {
      primary:      COLORS.light.primary,
      notification: COLORS.light.notification,
      background:   '#00000000',
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
      background:   '#00000000',
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
};

export function ThemeProvider({ children, theme: initialTheme = DEFAULT_THEME }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [setting, setSetting] = useState<ThemeSetting>(initialTheme);

  const resolvedMode: ThemeMode = setting === 'auto'
    ? (systemScheme === 'dark' ? 'dark' : 'light')
    : setting;

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: COLORS[resolvedMode],
      mode: resolvedMode,
      setMode: setSetting,
    }),
    [resolvedMode],
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

export function useLightDark<T>(value: T | { light?: T; dark?: T }): T {
  const [theme] = useThemeMode();
  return typeof value === 'object' && value !== null && ('light' in value || 'dark' in value)
    ? value[theme] ?? value.light ?? value.dark as T
    : value as T;
}

// --- Themed Style Hook ---

type ColorStyleProp = 'color' | 'backgroundColor' | 'borderColor' | 'shadowColor';
type SpacingStyleProp =
  | 'margin' | 'marginTop' | 'marginBottom' | 'marginLeft' | 'marginRight'
  | 'marginVertical' | 'marginHorizontal'
  | 'padding' | 'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight'
  | 'paddingVertical' | 'paddingHorizontal'
  | 'gap' | 'rowGap' | 'columnGap'
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
      setProps(value, Spacing[key as SpacingKey]);
    else if (key in Fonts)
      // FontKey → CSS prop(s)
      setProps(value, Fonts[key as FontKey]);
    else if (key in FontSizes)
      // FontSizeKey → CSS prop(s)
      setProps(value, FontSizes[key as FontSizeKey]);
    else if (typeof value === 'string')
      // CSS prop → source key
      if (value in COLORS.light)
        style[key] = colors[value as ThemeColor];
      else if (value in Spacing)
        style[key] = Spacing[value as SpacingKey];
      else if (value in Fonts)
        style[key] = Fonts[value as FontKey];
      else if (value in FontSizes)
        style[key] = FontSizes[value as FontSizeKey];
      else
        console.warn(`Invalid themed style value for key "${key}":`, value);
    else
      console.warn(`Invalid themed style value for key "${key}":`, value);

  return style as ViewStyle & TextStyle;
}
