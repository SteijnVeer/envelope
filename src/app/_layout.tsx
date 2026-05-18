import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { ThemeProvider } from '@/contexts/theme';
import { TranslatorProvider } from '@/contexts/translator';
import { Stack } from 'expo-router';

// delete afterwards
export default function TabLayout() {
  return (
    <ThemeProvider>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

function RootLayout() {
  // add database provider in future here -> load resources in index.tsx and show splash screen until then
  // for db use expo-sqlite
  return (
    <ThemeProvider>
      <TranslatorProvider>
        <Stack
          screenOptions={{
            headerShown: false,
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
      </TranslatorProvider>
    </ThemeProvider>
  );
}

// Screen 'index': Navigate to appropriate page based on whether the app is opened for the first time or not (or if opened through a shared link/deep link)
// Screen 'setup': Setup screens for initial app configuration
// Screen '(tabs)': Main tab navigation screens
// Screen 'open': Screen for the app opened through a shared link or deep link
