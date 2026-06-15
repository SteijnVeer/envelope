import { Image, useImage } from 'expo-image';
import { useIsFocused, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

export default function Hero() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const image = useImage(require('../../../assets/images/splash-screen.png'));

  useEffect(() => {
    if (isFocused)
      router.push('/login');
  }, [router, isFocused]);

  return (
    <Image
      source={image}
      style={StyleSheet.absoluteFill}
    />
  );
}
