import { getTranslations } from 'next-intl/server';

import { SaveEditor } from '@/components/editor/SaveEditor';
import { RelatedToolLinks } from '@/components/tools/ToolAbout';
import type { ToolLinkKey } from '@/components/tools/tool-links';
import { saveEditorFaqs } from '@/lib/seo';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('saveEditor');

const relatedLinks: readonly ToolLinkKey[] = ['saveJson', 'saveConverter', 'removeClanData', 'faq'];

const features = ['progress', 'heroes', 'clientSide'] as const;

const SaveEditorPage = async ({ params }: LocaleParams) => {
	const locale = await initLocale(params);
	const t = await getTranslations('toolAbout.saveEditor');

	return (
		<>
			<PageJsonLd locale={locale} page='saveEditor' />
			<SaveEditor />
			<section
				aria-labelledby='about-clicker-heroes-save-editor'
				className='mx-auto flex w-full max-w-6xl flex-col gap-5 px-10 pb-14 text-(--color-fg)'
			>
				<div>
					<h2
						id='about-clicker-heroes-save-editor'
						className='text-lg font-semibold text-(--color-fg-strong)'
					>
						{t('heading')}
					</h2>
					<p className='mt-3 max-w-4xl text-sm text-(--color-fg-muted)'>{t('intro')}</p>
				</div>

				<div className='grid gap-5 md:grid-cols-3'>
					{features.map((feature) => (
						<div key={feature}>
							<h3 className='text-sm font-semibold text-(--color-fg-strong)'>
								{t(`features.${feature}.title`)}
							</h3>
							<p className='mt-2 text-sm text-(--color-fg-muted)'>{t(`features.${feature}.body`)}</p>
						</div>
					))}
				</div>

				<div aria-labelledby='clicker-heroes-save-editor-faq' className='grid gap-3'>
					<h2 id='clicker-heroes-save-editor-faq' className='text-lg font-semibold text-(--color-fg-strong)'>
						{t('faqHeading')}
					</h2>
					<div className='grid gap-4 md:grid-cols-3'>
						{saveEditorFaqs(locale).map((faq) => (
							<div key={faq.question}>
								<h3 className='text-sm font-semibold text-(--color-fg-strong)'>{faq.question}</h3>
								<p className='mt-2 text-sm text-(--color-fg-muted)'>{faq.answer}</p>
							</div>
						))}
					</div>
				</div>

				<RelatedToolLinks className='text-sm text-(--color-fg-muted)' related={relatedLinks} />
			</section>
		</>
	);
};

export default SaveEditorPage;
