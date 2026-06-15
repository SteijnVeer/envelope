import { View } from 'react-native';
import { Page } from './schedule';

export default function Record() {
  return (
    <Page>
      <View
        style={{
          width: 200,
          height: 200,
          backgroundColor: 'red',
          borderRadius: 100,
        }}
      />
    </Page>
  );
}
