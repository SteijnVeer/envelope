import type { LinkProps } from 'expo-router';
import { Link } from 'expo-router';
import type { GlassButtonProps } from './button';
import { GlassButton } from './button';

type LinkNavigationProps = Pick<LinkProps,
  | 'href'
  | 'push'
  | 'replace'
  | 'dismissTo'
  | 'relativeToDirectory'
  | 'withAnchor'
  | 'prefetch'
  | 'dangerouslySingular'
>;

function LinkableGlassButton({
  onPress: injectedOnPress,
  onPressChain,
  ...props
}: GlassButtonProps & { onPressChain?: GlassButtonProps['onPress'] }) {
  return (
    <GlassButton
      {...props}
      onPress={(e) => {
        onPressChain?.(e);
        injectedOnPress?.(e);
      }}
    />
  );
}

export type GlassLinkProps = GlassButtonProps & LinkNavigationProps;

export function GlassLink({
  href,
  onPress,
  push,
  replace,
  dismissTo,
  relativeToDirectory,
  withAnchor,
  prefetch,
  dangerouslySingular,
  ...props
}: GlassLinkProps) {
  return (
    <Link
      asChild
      href={href}
      push={push}
      replace={replace}
      dismissTo={dismissTo}
      relativeToDirectory={relativeToDirectory}
      withAnchor={withAnchor}
      prefetch={prefetch}
      dangerouslySingular={dangerouslySingular}
    >
      <LinkableGlassButton
        {...props}
        onPressChain={onPress}
      />
    </Link>
  );
}
