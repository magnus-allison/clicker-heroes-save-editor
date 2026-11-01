import type { FC, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

interface Props {
	href: string;
	children: ReactNode;
}

const linkClass =
	'font-medium text-fg-strong underline decoration-(--color-primary) decoration-1 underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)';

/**
 * Inline prose link. Internal paths route through the locale-aware `Link`;
 * same-page anchors stay plain; anything with a scheme opens in a new tab,
 * since guides lean on off-site references.
 */
export const GuideLink: FC<Props> = ({ children, href }) => {
	if (href.startsWith('#')) {
		return (
			<a className={linkClass} href={href}>
				{children}
			</a>
		);
	}

	if (href.startsWith('/')) {
		return (
			<Link className={linkClass} href={href}>
				{children}
			</Link>
		);
	}

	return (
		<a className={linkClass} href={href} rel='noreferrer' target='_blank'>
			{children}
		</a>
	);
};
