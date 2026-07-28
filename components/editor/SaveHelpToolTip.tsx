import { EditorImage } from '@/components/ui/EditorImage';
import { HelpToolTip } from '@/components/ui/HelpToolTip';
import { saveHelpContent } from '@/lib/data/editor-config';

const iconAltLabels: Record<string, string> = {
	'/assets/icons/apple.svg': 'Apple',
	'/assets/icons/folder-open.svg': 'Open folder',
	'/assets/icons/steam.svg': 'Steam',
	'/assets/icons/windows.svg': 'Windows'
};

const getIconAlt = (iconPath: string) => `${iconAltLabels[iconPath] ?? 'Platform'} icon`;

/**
 * The "where is my save file?" help affordance. Driven entirely by
 * `saveHelpContent`, so every tool that imports a save shows the same paths.
 */
export const SaveHelpToolTip = () => {
	return (
		<HelpToolTip title='Where is my save file?'>
			{saveHelpContent.map((entry) => (
				<div className='border-t border-(--color-line-soft) py-2.5 first:border-t-0' key={entry.title}>
					<p className='flex items-center gap-1.5 text-[12px] uppercase tracking-[0.08em] text-(--color-fg-strong)'>
						{entry.iconPaths.map((iconPath) => (
							<EditorImage
								alt={getIconAlt(iconPath)}
								className='h-3.5 w-3.5 object-contain opacity-80'
								key={iconPath}
								size={14}
								src={iconPath}
								style={{ filter: 'var(--color-icon-filter)' }}
							/>
						))}
						<span>{entry.title}</span>
					</p>
					{/* A filesystem path, so the monospace treatment is meaningful here. */}
					<p className='mt-1 rounded-(--radius-control) border border-(--color-line-soft) bg-(--color-surface) px-2 py-1 font-mono text-[11px] text-(--color-fg-muted) break-all'>
						{entry.path}
					</p>
					{entry.note ? (
						<p className='mt-1 text-[11px] leading-5 text-(--color-fg-secondary)'>{entry.note}</p>
					) : null}
				</div>
			))}
		</HelpToolTip>
	);
};
