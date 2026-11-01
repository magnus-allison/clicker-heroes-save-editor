import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { ToastProvider } from '@/components/ui/ToastProvider';
import { SITE_CONFIG } from '@/lib/seo';

import './globals.css';
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
		{ path: '../public/fonts/aeonik-font/Aeonik-Regular.woff2', weight: '400', style: 'normal' },
		{ path: '../public/fonts/aeonik-font/Aeonik-Medium.woff2', weight: '500', style: 'normal' },
		{ path: '../public/fonts/aeonik-font/Aeonik-Bold.woff2', weight: '700', style: 'normal' }
	]
});

export const metadata: Metadata = {
	metadataBase: new URL(SITE_CONFIG.url),
	applicationName: SITE_CONFIG.siteName,
	title: {
		default: SITE_CONFIG.title,
		template: `${SITE_CONFIG.name} | %s`
	},
	description: SITE_CONFIG.description,
	keywords: [
		'clicker heroes save editor',
		'clicker heroes save file editor',
		'clicker heroes gold editor',
		'clicker heroes rubies editor',
		'clicker heroes hero souls editor',
		'clicker heroes ancients editor',
		'clicker heroes ascension editor',
		'clicker heroes achievements editor',
		'clicker heroes save decoder',
		'clicker heroes save encoder',
		'idle game save editor'
	],
	authors: [SITE_CONFIG.author],
	creator: SITE_CONFIG.author.name,
	publisher: SITE_CONFIG.author.name,
	category: 'game tools',
	openGraph: {
		type: 'website',
		url: '/',
		title: SITE_CONFIG.title,
		description: SITE_CONFIG.description,
		siteName: SITE_CONFIG.siteName,
		locale: 'en_US',
		images: [
			{
				url: SITE_CONFIG.ogImage,
				width: 1200,
				height: 630,
				alt: SITE_CONFIG.title
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: SITE_CONFIG.title,
		description: SITE_CONFIG.description,
		images: [
			{
				url: SITE_CONFIG.ogImage,
				alt: SITE_CONFIG.title
			}
		]
	},
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

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#0a0a0a',
	colorScheme: 'dark light'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={`${ibmPlexMono.variable} ${aeonik.variable} h-full antialiased`}
			data-scroll-behavior='smooth'
			lang='en'
			suppressHydrationWarning
		>
			<head>
				{/* Hides the dismissed welcome banner before first paint; see `WelcomeBanner`. */}
				<script dangerouslySetInnerHTML={{ __html: welcomeBannerScript }} />
			</head>
			<body className='min-h-full'>
				<ToastProvider>
					<PageShell footer={<SiteFooter />}>
						<PageBanner />
						{children}
					</PageShell>
				</ToastProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
