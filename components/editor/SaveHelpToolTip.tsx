import { useTranslations } from 'next-intl';

import { EditorImage } from '@/components/ui/EditorImage';
import { HelpToolTip } from '@/components/ui/HelpToolTip';
import { saveHelpContent } from '@/lib/data/editor-config';

const iconAltKeys = {
	'/assets/icons/apple.svg': 'apple',
	'/assets/icons/folder-open.svg': 'openFolder',
	'/assets/icons/steam.svg': 'steam',
	'/assets/icons/windows.svg': 'windows'
} as const;

const getIconKey = (iconPath: string) =>
	iconPath in iconAltKeys ? iconAltKeys[iconPath as keyof typeof iconAltKeys] : 'platform';

/**
 * The "where is my save file?" help affordance. Driven entirely by
 * `saveHelpContent`, so every tool that imports a save shows the same paths.
 */
export const SaveHelpToolTip = () => {
	const t = useTranslations('editor.saveHelp');

	return (
		<HelpToolTip title={t('title')}>
			{saveHelpContent.map((entry) => (
				<div className='border-t border-(--color-line-soft) py-2.5 first:border-t-0' key={entry.key}>
					<p className='flex items-center gap-1.5 text-[12px] uppercase tracking-[0.08em] text-(--color-fg-strong)'>
						{entry.iconPaths.map((iconPath) => (
							<EditorImage
								alt={t('iconAlt', { name: t(`icons.${getIconKey(iconPath)}`) })}
								className='h-3.5 w-3.5 object-contain opacity-80'
								key={iconPath}
								size={14}
								src={iconPath}
								style={{ filter: 'var(--color-icon-filter)' }}
							/>
						))}
						<span>{t(`entries.${entry.key}.title`)}</span>
					</p>
					{/* A filesystem path, so the monospace treatment is meaningful here. */}
					<p className='mt-1 rounded-(--radius-control) border border-(--color-line-soft) bg-(--color-surface) px-2 py-1 font-mono text-[11px] text-(--color-fg-muted) break-all'>
						{entry.path}
					</p>
					{entry.key === 'windows' && entry.note ? (
						<p className='mt-1 text-[11px] leading-5 text-(--color-fg-secondary)'>
							{t('entries.windows.note')}
						</p>
					) : null}
				</div>
			))}
		</HelpToolTip>
	);
};
