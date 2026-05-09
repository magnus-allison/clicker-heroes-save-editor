import { SaveEditor } from '@/components/editor/SaveEditor';

const siteUrl = 'https://clickerheroes.dev';

const structuredData = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'WebSite',
			'@id': `${siteUrl}/#website`,
			name: 'Clicker Heroes Save Editor',
			url: siteUrl,
			description:
				'Free online Clicker Heroes save editor for decoding, inspecting, editing, and re-encoding Clicker Heroes save files.',
			inLanguage: 'en',
			potentialAction: {
				'@type': 'SearchAction',
				target: `${siteUrl}/?q={search_term_string}`,
				'query-input': 'required name=search_term_string'
			}
		},
		{
			'@type': 'WebApplication',
			'@id': `${siteUrl}/#app`,
			name: 'Clicker Heroes Save Editor',
			url: siteUrl,
			applicationCategory: 'GameApplication',
			operatingSystem: 'Windows, macOS, Linux, iOS, Android',
			browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
			isAccessibleForFree: true,
			description:
				'A free, browser-based tool to decode, view, edit, and re-encode Clicker Heroes save data. Edit gold, rubies, hero levels, Hero Souls, Ancients, ascensions, achievements, skins, mercenaries, outsiders, clan values, and raw JSON data client-side.',
			featureList: [
				'Decode Clicker Heroes save strings',
				'Encode edited saves for import back into the game',
				'Edit gold, rubies, Hero Souls, Ancients, and ascension data',
				'Edit heroes, achievements, skins, mercenaries, outsiders, clan values, and custom fields',
				'Inspect structured save JSON in the browser'
			],
			keywords:
				'clicker heroes save editor, clicker heroes save file editor, clicker heroes save decoder, clicker heroes gold editor, clicker heroes rubies editor, clicker heroes hero souls editor, clicker heroes ancients editor, idle game save editor',
			author: {
				'@type': 'Person',
				name: 'Magnus Allison',
				url: 'https://github.com/magnus-allison'
			},
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD'
			}
		},
		{
			'@type': 'FAQPage',
			'@id': `${siteUrl}/#faq`,
			mainEntity: [
				{
					'@type': 'Question',
					name: 'How do I edit a Clicker Heroes save file?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'Paste your Clicker Heroes save string into the editor, decode it, change the fields you need, then copy the encoded result back into the game import dialog.'
					}
				},
				{
					'@type': 'Question',
					name: 'Can this editor change gold, rubies, Hero Souls, and Ancients?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'Yes. The editor includes controls for core currencies, hero levels, Hero Souls, Ancients-related progression, ascensions, achievements, skins, mercenaries, outsiders, clan values, and raw save JSON.'
					}
				},
				{
					'@type': 'Question',
					name: 'Is my Clicker Heroes save uploaded to a server?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'No. The editor runs in the browser and processes save data client-side.'
					}
				}
			]
		}
	]
};

const Page = () => (
	<>
		<script
			type='application/ld+json'
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
		<SaveEditor />
		<section
			aria-labelledby='about-clicker-heroes-save-editor'
			className='mx-auto flex w-full max-w-6xl flex-col gap-5 px-10 pb-14 text-(--color-text)'
		>
			<div>
				<h2
					id='about-clicker-heroes-save-editor'
					className='text-lg font-semibold text-(--color-text-strong)'
				>
					Free Clicker Heroes Save Decoder and Editor
				</h2>
				<p className='mt-3 max-w-4xl text-sm text-(--color-text-muted)'>
					This browser-based Clicker Heroes save editor decodes save strings, exposes editable game
					data, and re-encodes the result for import back into Clicker Heroes. It is built for
					restoring progress, testing builds, creating specific save states, and inspecting what is
					inside a Clicker Heroes save file.
				</p>
			</div>

			<div className='grid gap-5 md:grid-cols-3'>
				<div>
					<h3 className='text-sm font-semibold text-(--color-text-strong)'>Editable Progress</h3>
					<p className='mt-2 text-sm text-(--color-text-muted)'>
						Change gold, rubies, Hero Souls, ascensions, transcensions, zone data, clan values,
						outsiders, and custom fields.
					</p>
				</div>
				<div>
					<h3 className='text-sm font-semibold text-(--color-text-strong)'>Heroes and Unlocks</h3>
					<p className='mt-2 text-sm text-(--color-text-muted)'>
						Inspect and adjust heroes, levels, gilds, skins, mercenaries, achievements, and
						profile-related save values.
					</p>
				</div>
				<div>
					<h3 className='text-sm font-semibold text-(--color-text-strong)'>Client-Side Tool</h3>
					<p className='mt-2 text-sm text-(--color-text-muted)'>
						Save strings are decoded and encoded locally in the browser, so the workflow stays
						fast and does not require installing a desktop trainer or mod.
					</p>
				</div>
			</div>
		</section>
	</>
);

export default Page;
