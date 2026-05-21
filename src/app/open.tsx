import { Page } from '@/components/page';
import { StatusBar } from 'expo-status-bar';

import { GlassLink } from '@/components/glass/link';

export default function OpenPage() {
  return (
    <Page
      scrollable
    >
      <GlassLink
        href='/'
        replace
        text='Go Home'
      />
      <StatusBar
        hidden
      />
    </Page>
  );
}
