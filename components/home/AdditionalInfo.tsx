import { type FC } from 'react';
import { ArrowUpRight } from 'lucide-react';

import { EditorImage } from '@/components/ui/EditorImage';
import { additionalDisclaimer, additionalLinkGroups, type ExternalLinkCard } from '@/lib/data/editor-config';

const links: ExternalLinkCard[] = additionalLinkGroups.flat();

interface Props {
	link: ExternalLinkCard;
}

export const AdditionalInfo: FC = () => (
	<div className='flex flex-col gap-3'>
		<div className='grid gap-3 sm:grid-cols-2'>
			{links.map((link) => (
				<AdditionalInfoCard link={link} key={link.href} />
			))}
		</div>
		<p className='text-[12px] leading-6 text-(--color-fg-dim) mt-12'>{additionalDisclaimer}</p>
	</div>
);

const AdditionalInfoCard: FC<Props> = ({ link }) => (
	<a
		className='group flex items-center gap-4 rounded-(--radius-panel) border border-(--color-line) bg-(--color-surface-raised) bg-[image:var(--gradient-raised)] p-5 shadow-[var(--shadow-card)] hover:border-(--color-primary-line) hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
		href={link.href}
		rel='noreferrer'
		target='_blank'
	>
		<EditorImage
			alt={`${link.title} icon`}
			className='h-11 w-11 shrink-0 object-contain'
			size={44}
			src={link.iconSrc}
			style={link.invertIcon === false ? undefined : { filter: 'var(--color-icon-filter)' }}
		/>
		<span className='min-w-0'>
			<span className='block text-sm font-medium text-fg-strong'>{link.title}</span>
			<span className='mt-1 block text-sm text-(--color-fg-muted)'>{link.description}</span>
		</span>
		<ArrowUpRight
			aria-hidden='true'
			className='ml-auto h-3.5 w-3.5 shrink-0 text-(--color-primary-text) transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
		/>
	</a>
);
