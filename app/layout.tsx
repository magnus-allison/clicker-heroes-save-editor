import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import { ToastProvider } from '@/components/ui/ToastProvider';

import './globals.css';

const ibmPlexMono = IBM_Plex_Mono({
	variable: '--font-ibm-plex-mono',
	subsets: ['latin'],
	weight: ['400', '500', '600']
});

const siteUrl = 'https://clickerheroes.dev';
const siteTitle = 'Clicker Heroes Save Editor - Free Online Save Editor';
const siteDescription =
	'Free Clicker Heroes save editor online. Decode and edit Clicker Heroes save files instantly — modify gold, rubies, hero levels, achievements, ascensions, and more.';

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	applicationName: 'Clicker Heroes Save Editor',
	title: {
		default: siteTitle,
		template: '%s | Clicker Heroes Save Editor'
	},
	description: siteDescription,
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
	authors: [{ name: 'Magnus Allison', url: 'https://github.com/magnus-allison' }],
	creator: 'Magnus Allison',
	publisher: 'Magnus Allison',
	category: 'game tools',
	alternates: {
		canonical: 'https://clickerheroes.dev/'
	},
	openGraph: {
		type: 'website',
		url: '/',
		title: 'Clicker Heroes Save Editor - Free Online Save File Decoder & Editor',
		description:
			'Free browser-based Clicker Heroes save editor. Modify gold, rubies, hero levels, Hero Souls, Ancients, ascensions, achievements, and more.',
		siteName: 'Clicker Heroes Save Editor',
		locale: 'en_US',
		images: [
			{
				url: '/opengraph-image',
				width: 1200,
				height: 630,
				alt: 'Clicker Heroes Save Editor interface'
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Clicker Heroes Save Editor - Free Online Save File Editor',
		description:
			'Free browser-based editor for Clicker Heroes save files. Edit gold, rubies, heroes, Hero Souls, Ancients, and more.',
		images: [
			{
				url: '/opengraph-image',
				alt: 'Clicker Heroes Save Editor interface'
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
			<body className='min-h-full bg-black'>
				<ToastProvider>{children}</ToastProvider>
				<Analytics />
			</body>
		</html>
	);
}
