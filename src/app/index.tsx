import { useStoreValue } from '@/contexts/store';
import { Redirect } from 'expo-router';

export default function SelectAppOpenRoute() {
  const [hasCompletedSetup] = useStoreValue('hasCompletedSetup');

  return (
    <Redirect
      href={hasCompletedSetup ? '/(tabs)/home' : '/setup'}
    />
  );
}
