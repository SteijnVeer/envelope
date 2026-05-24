import { useStoreValue } from '@/contexts/store';
import { Redirect } from 'expo-router';

export function AppEntry() {
  const [hasCompletedOnboarding] = useStoreValue('hasCompletedOnboarding');

  return (
    <Redirect
      href={hasCompletedOnboarding ? '/(tabs)/home' : '/onboarding'}
    />
  );
}
