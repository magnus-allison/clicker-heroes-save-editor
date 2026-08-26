import { type FC } from 'react';

import { GuideLink } from '@/components/guides/GuideLink';
import { siteFaqSections } from '@/lib/seo';

/**
 * The `/faq` body. Sections come straight from `siteFaqSections`, which also
 * feeds the page's `FAQPage` structured data, so the answers Google sees are
 * the answers on the page.
 */
export const FaqContent: FC = () => (
	<article className='flex flex-col gap-10'>
		<div className='flex flex-col gap-6'>
			<p className='max-w-3xl text-[14px] leading-7 text-(--color-fg-secondary)'>
				Common questions about the Clicker Heroes save editor and the tools around it — loading and exporting
				saves, what happens to your save data, and what the errors mean when a save will not decode.
			</p>
			<nav aria-label='FAQ contents' className='border-y border-(--color-line-subtle) py-4 sm:py-5'>
				<p className='text-[11px] uppercase tracking-[0.12em] text-(--color-fg-dim)'>Contents</p>
				<div className='mt-3 grid gap-x-8 gap-y-4 sm:grid-cols-3'>
					{siteFaqSections.map((section, index) => (
						<div key={section.id}>
							<p className='flex items-baseline gap-2 text-[12px] font-semibold text-fg-strong'>
								<span aria-hidden='true' className='text-[11px] font-normal text-(--color-fg-dim)'>
									{String(index + 1).padStart(2, '0')}
								</span>
								<a
									className='transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
									href={`#${section.id}`}
								>
									{section.title}
								</a>
							</p>
							<p className='mt-1.5 pl-[1.6rem] text-[13px] leading-5 text-(--color-fg-secondary)'>
								{section.summary}
							</p>
						</div>
					))}
				</div>
			</nav>
		</div>

		{siteFaqSections.map((section) => (
			<section
				aria-labelledby={`${section.id}-heading`}
				className='scroll-mt-8'
				id={section.id}
				key={section.id}
			>
				<div className='border-b border-(--color-line-soft) pb-2.5'>
					<h2
						className='text-[1.1rem] font-semibold leading-tight text-fg-strong'
						id={`${section.id}-heading`}
					>
						{section.title}
					</h2>
				</div>
				<dl className='mt-5 flex max-w-3xl flex-col gap-5'>
					{section.faqs.map((faq) => (
						<div key={faq.question}>
							<dt className='text-[13px] font-semibold text-fg-strong'>{faq.question}</dt>
							<dd className='mt-1 text-[13px] leading-6 text-(--color-fg-secondary)'>{faq.answer}</dd>
						</div>
					))}
				</dl>
			</section>
		))}

		<p className='max-w-3xl border-t border-(--color-line-subtle) pt-5 text-[13px] leading-6 text-(--color-fg-secondary)'>
			Still stuck, or think something here is wrong? <GuideLink href='/feedback'>Send feedback</GuideLink> and
			tell us what you were trying to do — bug reports and questions this page should answer are both useful.
		</p>
	</article>
);
