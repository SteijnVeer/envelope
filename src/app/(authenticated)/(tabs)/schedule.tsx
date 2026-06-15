import type { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';

export default function Schedule() {
  return (
    <Page>
      <View
        style={{
          width: 200,
          height: 2000,
          backgroundColor: 'red',
          borderRadius: 24,
        }}
      />
    </Page>
  );
}

export function Page({ children }: PropsWithChildren) {
  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      contentInsetAdjustmentBehavior='always'
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}    
    >
      {children}
    </ScrollView>
  );
}
