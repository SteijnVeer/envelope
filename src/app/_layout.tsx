import { AppBackgroundProvider } from '@/contexts/background';
import { ThemeProvider } from '@/contexts/theme';
import { TranslatorProvider } from '@/contexts/translator';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TranslatorProvider>
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
              name='setup'
            />
            <Stack.Screen
              name='(tabs)'
            />
            <Stack.Screen
              name='open'
            />
          </Stack>
        </AppBackgroundProvider>
      </TranslatorProvider>
    </ThemeProvider>
  );
}
