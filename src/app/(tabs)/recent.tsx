// import { Page } from '@/components/page';
import { Redirect } from 'expo-router';

export default function Recent() {
  return (
    <Redirect
      href='/_sitemap'
    />
  );
  // return (
  //   <Page
  //     scrollable
  //     showBackground
  //   />
  // );
}
