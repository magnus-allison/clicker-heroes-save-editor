import type { Metadata } from 'next';

import { SaveEditor } from '@/components/editor/SaveEditor';
import { createPageJsonLd, createPageMetadata, saveEditorFaqs } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('saveEditor');

const structuredData = createPageJsonLd('saveEditor');

const SaveEditorPage = () => (
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

			<div aria-labelledby='clicker-heroes-save-editor-faq' className='grid gap-3'>
				<h2
					id='clicker-heroes-save-editor-faq'
					className='text-lg font-semibold text-(--color-text-strong)'
				>
					Clicker Heroes Save Editor FAQ
				</h2>
				<div className='grid gap-4 md:grid-cols-3'>
					{saveEditorFaqs.map((faq) => (
						<div key={faq.question}>
							<h3 className='text-sm font-semibold text-(--color-text-strong)'>{faq.question}</h3>
							<p className='mt-2 text-sm text-(--color-text-muted)'>{faq.answer}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	</>
);

export default SaveEditorPage;
