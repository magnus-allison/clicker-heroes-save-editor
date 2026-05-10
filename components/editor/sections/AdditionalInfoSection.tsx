import { EditorImage } from '@/components/ui/EditorImage';
import { SectionCard } from '@/components/ui/SectionCard';
import { additionalDisclaimer, additionalLinkGroups } from '@/lib/data/editor-config';

type Props = {
	defaultOpen?: boolean;
};

export const AdditionalInfoSection = ({ defaultOpen }: Props) => {
	return (
		<SectionCard
			defaultOpen={defaultOpen}
			description='Useful links for the project, support, and the official game.'
			title='Additional Info'
		>
			<div className='space-y-4'>
				<p className='text-[12px] leading-6 text-(--color-text-secondary)'>
					This project is open source and maintained on GitHub. If it helped, support is
					appreciated.
				</p>
				<div className='grid gap-4 lg:grid-cols-2'>
					{additionalLinkGroups.map((group, groupIndex) => (
						<div className='grid gap-4' key={groupIndex}>
							{group.map((link) => (
								<a
									className='border border-(--color-border) bg-(--color-bg) p-4 transition hover:border-(--color-border-hover) hover:bg-(--color-bg-hover)'
									href={link.href}
									key={link.href}
									rel='noreferrer'
									target='_blank'
								>
									<div className='flex items-center gap-4'>
										<EditorImage
											alt=''
											className='h-11 w-11 object-contain'
											size={44}
											src={link.iconSrc}
											style={
												link.invertIcon === false
													? undefined
													: { filter: 'var(--color-icon-filter)' }
											}
										/>
										<div>
											<p className='text-[13px] text-(--color-text)'>{link.title}</p>
											<p className='mt-1 text-[12px] text-(--color-text-secondary)'>
												{link.description}
											</p>
										</div>
									</div>
								</a>
							))}
						</div>
					))}
				</div>
				<p className='text-[12px] leading-6 text-(--color-text-dim)'>{additionalDisclaimer}</p>
			</div>
		</SectionCard>
	);
};
