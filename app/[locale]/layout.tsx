import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { ToastProvider } from '@/components/ui/ToastProvider';
import { initLocale, type LocaleParams } from '@/i18n/page';
import { routing } from '@/i18n/routing';
import { SITE_CONFIG, siteDescription, siteTitle } from '@/lib/seo';
import { clientNamespaces, messages } from '@/messages';

import '../globals.css';
import { PageBanner } from '@/components/home/PageBanner';
import { welcomeBannerScript } from '@/lib/welcome-banner';
import { PageShell } from '@/components/ui/PageShell';
import { SiteFooter } from '@/components/ui/SiteFooter';

const ibmPlexMono = IBM_Plex_Mono({
	variable: '--font-ibm-plex-mono',
	subsets: ['latin'],
	weight: ['400', '500', '600']
});

/*
 * Aeonik is a display face used for card headings only, so just the three
 * weights those headings reach for are loaded, upright only: nothing sets
 * Aeonik in italic, and every face listed here is preloaded on every page.
 * The .woff2 files are Latin subsets of the .ttf originals (pyftsubset with the
 * Google Fonts "latin" and "latin-ext" ranges plus arrows), about half the
 * transfer size. Aeonik has no Cyrillic, Greek or CJK, so those fall back.
 */
const aeonik = localFont({
	variable: '--font-aeonik-local',
	display: 'swap',
	src: [
		{ path: '../../public/fonts/aeonik-font/Aeonik-Regular.woff2', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/aeonik-font/Aeonik-Medium.woff2', weight: '500', style: 'normal' },
		{ path: '../../public/fonts/aeonik-font/Aeonik-Bold.woff2', weight: '700', style: 'normal' }
	]
});

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

/*
 * Site-wide defaults only. Every page sets its own title, description,
 * canonical, hreflang and Open Graph tags through `pageMetadata` (lib/seo.ts).
 */
export const generateMetadata = async ({ params }: LocaleParams): Promise<Metadata> => {
	const { locale } = await params;
	const resolved = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;

	return {
		metadataBase: new URL(SITE_CONFIG.url),
		applicationName: SITE_CONFIG.siteName,
		title: siteTitle(resolved),
		description: siteDescription(resolved),
		authors: [SITE_CONFIG.author],
		creator: SITE_CONFIG.author.name,
		publisher: SITE_CONFIG.author.name,
		category: 'game tools',
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-image-preview': 'large',
				'max-snippet': -1,
				'max-video-preview': -1
			}
		},
		icons: {
			icon: [{ url: '/favicon.ico', sizes: 'any' }],
			shortcut: '/favicon.ico',
			apple: [{ url: '/assets/icons/clicker-heroes.png', sizes: '512x512', type: 'image/png' }]
		},
		manifest: '/site.webmanifest',
		other: {
			'og:image:type': 'image/png'
		}
	};
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#0a0a0a',
	colorScheme: 'dark light'
};

export default async function LocaleLayout({
	children,
	params
}: Readonly<LocaleParams & { children: ReactNode }>) {
	const locale = await initLocale(params);
	const clientMessages = Object.fromEntries(
		clientNamespaces.map((namespace) => [namespace, messages[locale][namespace]])
	);

	return (
		<html
			className={`${ibmPlexMono.variable} ${aeonik.variable} h-full antialiased`}
			data-scroll-behavior='smooth'
			lang={locale}
			suppressHydrationWarning
		>
			<body className='min-h-full'>
				<NextIntlClientProvider locale={locale} messages={clientMessages}>
					<ToastProvider>
						<PageShell footer={<SiteFooter />}>
							<PageBanner />
							{children}
						</PageShell>
					</ToastProvider>
				</NextIntlClientProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
