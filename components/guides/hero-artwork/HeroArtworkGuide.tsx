import { type FC } from 'react';
import { useTranslations } from 'next-intl';

import { ArtworkViewer } from '@/components/guides/hero-artwork/ArtworkViewer';
import { GuideLead } from '@/components/guides/GuideLayout';
import { orderedHeroes } from '@/lib/data/heroes';

const frameClassName = 'flex h-32 items-center justify-center rounded-(--radius-card) border p-2';

/**
 * One portrait, which opens a full-size view, or a placeholder when the hero
 * has no artwork for that state.
 */
const Artwork: FC<{ gilded?: boolean; label: string; name: string; src?: string }> = ({
	gilded,
	label,
	name,
	src
}) => {
	const t = useTranslations('guides.heroArtwork');
	const alt = t(gilded ? 'gildedAlt' : 'normalAlt', { name });
	const className = gilded
		? `${frameClassName} border-(--color-gilded-line) bg-(--color-gilded-surface)`
		: `${frameClassName} border-(--color-line-subtle) bg-(--color-surface-muted)`;

	return (
		<figure className='flex min-w-0 flex-1 flex-col gap-1.5'>
			{src ? (
				<ArtworkViewer
					alt={alt}
					className={className}
					closeLabel={t('close')}
					gilded={gilded}
					src={src}
					title={t('viewerTitle', { name, state: label })}
					viewLabel={t('viewFull', { name: alt })}
				>
					<img alt={alt} className='max-h-full max-w-full object-contain' loading='lazy' src={src} />
				</ArtworkViewer>
			) : (
				<div className={className}>
					<span className='px-2 text-center text-[11px] leading-4 text-(--color-fg-dim)'>
						{t('noGildedArt')}
					</span>
				</div>
			)}
			<figcaption
				className={`text-center font-aeonik text-[11px] font-semibold uppercase tracking-[0.1em] ${
					gilded ? 'text-(--color-gold)' : 'text-(--color-fg-muted)'
				}`}
			>
				{label}
			</figcaption>
		</figure>
	);
};

export const HeroArtworkGuide: FC = () => {
	const t = useTranslations('guides.heroArtwork');

	return (
		<article className='flex flex-col gap-6'>
			<GuideLead>{t('intro')}</GuideLead>

			<ul className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{orderedHeroes.map((hero) => (
					<li className='glass-panel flex flex-col gap-4 rounded-2xl p-4 sm:p-5' key={hero.heroId}>
						<div className='flex items-baseline justify-between gap-3'>
							<h2 className='min-w-0 font-aeonik text-[0.95rem] font-semibold uppercase leading-tight tracking-wide text-fg-strong [word-spacing:0.15em]'>
								{hero.name}
							</h2>
							<p className='shrink-0 font-mono text-[11px] text-(--color-fg-dim)'>
								{t('heroNumber', { number: hero.heroId })}
							</p>
						</div>
						<div className='flex gap-3'>
							<Artwork label={t('normal')} name={hero.name} src={hero.image} />
							<Artwork gilded label={t('gilded')} name={hero.name} src={hero.gildedImage} />
						</div>
					</li>
				))}
			</ul>
		</article>
	);
};
