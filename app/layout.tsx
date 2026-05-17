import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import { ToastProvider } from '@/components/ui/ToastProvider';
import { SITE_CONFIG } from '@/lib/seo';

import './globals.css';

const ibmPlexMono = IBM_Plex_Mono({
	variable: '--font-ibm-plex-mono',
	subsets: ['latin'],
	weight: ['400', '500', '600']
});

export const metadata: Metadata = {
	metadataBase: new URL(SITE_CONFIG.url),
	applicationName: SITE_CONFIG.name,
	title: {
		default: SITE_CONFIG.title,
		template: `%s | ${SITE_CONFIG.name}`
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
		siteName: SITE_CONFIG.name,
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
	verification: {
		google: 'google33175fba0d09710c.html'
	},
	other: {
		'profile:first_name': 'Magnus',
		'profile:last_name': 'Allison',
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
		<html lang='en' className={`${ibmPlexMono.variable} h-full antialiased`}>
			<body className='min-h-full'>
				<ToastProvider>{children}</ToastProvider>
				<Analytics />
			</body>
		</html>
	);
}
