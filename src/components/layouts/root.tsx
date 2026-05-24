import { AppBackgroundProvider } from '@/contexts/background';
import { ThemeProvider } from '@/contexts/theme';
import { TranslatorProvider } from '@/contexts/translator';
import languageProps from '@/language';
import { Stack } from 'expo-router';

export function RootLayout() {
  return (
    <ThemeProvider>
      <TranslatorProvider
        {...languageProps}
      >
        <AppBackgroundProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              animationDuration: 200,
            }}
          >
            <Stack.Screen
              name='index'
            />
            <Stack.Screen
              name='onboarding'
            />
            <Stack.Screen
              name='(tabs)'
            />
          </Stack>
        </AppBackgroundProvider>
      </TranslatorProvider>
    </ThemeProvider>
  );
}
