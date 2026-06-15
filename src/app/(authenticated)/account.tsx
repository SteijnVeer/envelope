import { Image, useImage } from 'expo-image';
import { Page } from './(tabs)/schedule';

export default function Account() {
  const image = useImage(require('../../../assets/images/envelope-app-icon.png'));

  return (
    <Page>
      <Image
        source={image}
        style={{
          width: 200,
          height: 200,
          borderRadius: 32,
        }}
      />
    </Page>
  );
}
