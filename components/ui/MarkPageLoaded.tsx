'use client';

import { useEffect } from 'react';

/** Comfortably longer than the slowest staggered `fade-in-on-load` card. */
const SETTLE_MS = 2000;

/**
 * Sets `data-loaded` on `<html>` once the first page load has settled, which
 * switches off the `fade-in-on-load` entrance (see globals.css). It lives in
 * the layout, which stays mounted across client-side navigation, so the
 * attribute sticks: the cards fade in on a fresh load or reload, but not when
 * the visitor comes back to the home page from another page on the site.
 */
export const MarkPageLoaded = () => {
	useEffect(() => {
		const timer = window.setTimeout(() => {
			document.documentElement.dataset.loaded = '';
		}, SETTLE_MS);

		return () => window.clearTimeout(timer);
	}, []);

	return null;
};
