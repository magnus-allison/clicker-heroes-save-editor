'use client';

import { useLayoutEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'theme';

/*
 * The theme lives in exactly one place — `data-theme` on <html> — and this
 * component writes to it directly rather than holding React state.
 *
 * That is not a shortcut. The server cannot read `localStorage`, so any
 * state-driven rendering here would have to choose between a hydration mismatch
 * and a visible flash of the wrong icon. Instead the inline script in the root
 * layout sets the attribute before first paint, CSS in `globals.css` resolves
 * both the palette and which icon shows from that same attribute, and this
 * button only has to flip it. Nothing needs to agree about anything.
 *
 * Each icon is labelled for the theme it appears in, and shows the theme you
 * would get by clicking: a sun while dark, a moon while light.
 */
export const ThemeToggle = () => {
	// React's Strict Mode remount in development resets the attributes on <html>
	// that React does not manage from JSX, discarding what the inline script set.
	// Re-applying restores it; in production this is a no-op.
	useLayoutEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);

			if (stored === 'light' || stored === 'dark') {
				document.documentElement.dataset.theme = stored;
			}
		} catch {
			// Storage is unavailable in some privacy modes. Falling back to the
			// default theme is a perfectly good outcome, so there is nothing to do.
		}
	}, []);

	const toggle = () => {
		const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
		document.documentElement.dataset.theme = next;

		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// Persistence is best-effort; the switch itself has already applied.
		}
	};

	return (
		<Button
			aria-label='Toggle light and dark theme'
			className='h-8 w-8 p-0'
			onClick={toggle}
			size='sm'
			title='Toggle light and dark theme'
			variant='subtle'
		>
			<Sun aria-hidden='true' className='theme-icon-when-dark h-4 w-4' />
			<Moon aria-hidden='true' className='theme-icon-when-light h-4 w-4' />
		</Button>
	);
};
