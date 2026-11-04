'use client';

import { useEffect, useRef } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { usePathname } from '@/i18n/navigation';
import { localizedPath, routing } from '@/i18n/routing';

/**
 * A dropdown of links to the current page in every language. It is a
 * `<details>` disclosure holding plain links rather than a `<select>`, so the
 * links stay in the server HTML for crawlers to follow between the language
 * versions, and it opens without JavaScript. The href is built here rather
 * than by next-intl's `Link`, which prefixes the default locale (`/en/...`)
 * and so would point crawlers at a redirect.
 */
export const LocaleSwitcher = () => {
	const t = useTranslations('common');
	const locale = useLocale();
	const pathname = usePathname();
	const detailsRef = useRef<HTMLDetailsElement>(null);

	// Close on a click outside or on Escape, as a menu would.
	useEffect(() => {
		const details = detailsRef.current;
		if (!details) {
			return;
		}

		const close = () => {
			details.open = false;
		};
		const onPointerDown = (event: PointerEvent) => {
			if (details.open && !details.contains(event.target as Node)) {
				close();
			}
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && details.open) {
				close();
				details.querySelector('summary')?.focus();
			}
		};

		document.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('keydown', onKeyDown);
		};
	}, []);

	return (
		<details className='group relative w-fit' ref={detailsRef}>
			<summary
				aria-label={`${t('footer.language')}: ${t(`localeNames.${locale}`)}`}
				className='flex h-8 cursor-pointer list-none items-center gap-2 rounded-(--radius-control) border border-line bg-(--color-surface) px-2.5 text-(--color-fg) transition-[border-color,background-color] duration-150 ease-snap select-none hover:border-(--color-line-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring [&::-webkit-details-marker]:hidden'
			>
				<Languages aria-hidden='true' className='h-3.5 w-3.5 text-(--color-fg-dim)' />
				<span lang={locale}>{t(`localeNames.${locale}`)}</span>
				<ChevronDown
					aria-hidden='true'
					className='h-3.5 w-3.5 text-(--color-fg-dim) transition-transform duration-150 ease-snap group-open:rotate-180'
				/>
			</summary>
			{/* Opens upwards: the switcher sits at the very bottom of the page. */}
			<ul className='absolute bottom-full left-0 z-20 mb-1.5 min-w-full overflow-hidden rounded-(--radius-control) border border-line bg-(--color-surface-raised) py-1 shadow-(--shadow-popover)'>
				{routing.locales.map((option) => {
					const isCurrent = option === locale;

					return (
						<li key={option}>
							<a
								aria-current={isCurrent ? 'true' : undefined}
								className={
									isCurrent
										? 'flex items-center justify-between gap-4 px-3 py-1.5 whitespace-nowrap text-fg-strong'
										: 'flex items-center justify-between gap-4 px-3 py-1.5 whitespace-nowrap text-(--color-fg) transition-colors hover:bg-(--color-surface-hover) hover:text-fg-strong focus-visible:bg-(--color-surface-hover) focus-visible:outline-none'
								}
								href={localizedPath(pathname, option)}
								hrefLang={option}
								lang={option}
							>
								{t(`localeNames.${option}`)}
								{isCurrent ? <Check aria-hidden='true' className='h-3.5 w-3.5' /> : null}
							</a>
						</li>
					);
				})}
			</ul>
		</details>
	);
};
