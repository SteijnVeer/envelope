import { themesProviderProps } from '@/themes';
import { translationsProviderProps } from '@/translations';
import { createLayouts } from '@steijnveer/expo-app-root';
import { RootProvider } from '@steijnveer/expo-commons/providers';

export const _dev_isAuthenticated = false;

export const { RootLayout: _RootLayout, TabsLayout, AuthenticatedLayout, UnauthenticatedLayout } = createLayouts({
  _dev_isAuthenticated,
  tabs: [
    {
      name: 'home',
      icon: 'house',
      fillIcon: true,
    },
    {
      name: 'schedule',
      icon: 'calendar',
    },
    {
      name: 'record',
      icon: 'clock',
      fillIcon: true,
    },
    {
      separate: true,
      name: 'action',
      label: 'Create new',
      icon: 'plus.app',
      fillIcon: true,
      onSelect: () => {
        alert('Create action selected');
      },
    },
  ],
  externalLinks: [
    {
      label: 'Google',
      url: 'https://www.google.com',
    },
    {
      label: 'GitHub',
      url: 'https://www.github.com',
    },
  ],
} as const);

export function RootLayout() {

  return (
    <RootProvider
      {...themesProviderProps}
      {...translationsProviderProps}
    >
      <_RootLayout />
    </RootProvider>
  );
}
