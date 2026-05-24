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

function LinkableGlassButton({ onPress: injectedOnPress, onPressChain, ...props }: Record<string, any>) {
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

export type GlassLinkProps<K extends string | undefined = undefined> = GlassButtonProps<K> & LinkNavigationProps;

export function GlassLink<K extends string | undefined = undefined>({ href, onPress, push, replace, dismissTo, relativeToDirectory, withAnchor, prefetch, dangerouslySingular, ...props }: GlassLinkProps<K>) {
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
