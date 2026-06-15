import { _dev_isAuthenticated } from '@/components/layouts';
import { Redirect } from 'expo-router';

export function AppEntry() {
  return (
    <Redirect
      href={_dev_isAuthenticated ? '/(authenticated)/(tabs)/home' : '/(unauthenticated)/hero'}
    />
  );
}
