import { Redirect } from 'expo-router';

export default function NotFound() {
  // display a 404 not found page for any undefined routes
  // provide links to navigate back to the main app or setup flow
  // (and for dev also _sitemap route to see all routes)
  return (
    <Redirect
      href='/'
    />
  );
}
