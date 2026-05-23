import { Page } from '@/components/page';
import { Button, Host } from '@expo/ui/swift-ui';
import { StyleSheet } from 'react-native';

export default function Home() {
  return (
    <Page
      scrollable
      showBackground
    >
      <Host
        style={styles.host}
      >
        <Button
          label='test'
        />
      </Host>
    </Page>
  );
}

const styles = StyleSheet.create({
  host: {
    backgroundColor: 'red',
    width: '80%',
    height: 200,
  },
});
