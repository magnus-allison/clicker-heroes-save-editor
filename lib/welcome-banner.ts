/*
 * Shared between the root layout (a server component) and `WelcomeBanner` (a
 * client component). It lives outside the `'use client'` module because a
 * server component importing a plain value from one gets a client reference,
 * not the value.
 */

export const WELCOME_BANNER_STORAGE_KEY = 'welcome-banner-dismissed';

/** Set on `<html>` as `data-welcome-dismissed` once the banner is dismissed. */
export const WELCOME_BANNER_ATTRIBUTE = 'welcomeDismissed';

/**
 * Runs before first paint so a returning visitor who dismissed the banner
 * never sees it flash in. The server cannot read `localStorage`, so the banner
 * is always rendered — which also keeps its `<h1>` in the HTML crawlers see —
 * and CSS hides it from the `<html>` attribute this sets.
 */
export const welcomeBannerScript = `try{if(localStorage.getItem('${WELCOME_BANNER_STORAGE_KEY}')==='1')document.documentElement.dataset.${WELCOME_BANNER_ATTRIBUTE}=''}catch(e){}`;
