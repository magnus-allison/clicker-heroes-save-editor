import type { FC } from 'react';

import { LinkCard } from '@/components/ui/LinkCard';
import { additionalDisclaimer, additionalLinkGroups } from '@/lib/data/editor-config';

const links = additionalLinkGroups.flat();

export const AdditionalInfo: FC = () => (
	<div className='flex flex-col gap-3'>
		<LinkCard
			cta='Open'
			href='/feedback'
			layout='horizontal'
			title='Report bugs, request features, or suggest a guide'
		/>
		<div className='flex flex-col gap-3'>
			<div className='grid gap-3 sm:grid-cols-2'>
				{links.map((link) => (
					<LinkCard
						description={link.description}
						external
						href={link.href}
						iconSrc={link.iconSrc}
						invertIcon={link.invertIcon}
						key={link.href}
						layout='horizontal'
						title={link.title}
					/>
				))}
			</div>
			<p className='text-[12px] leading-6 text-(--color-fg-dim) mt-12'>{additionalDisclaimer}</p>
		</div>
	</div>
);
