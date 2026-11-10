import { EditorImage } from '@/components/ui/EditorImage';
import { cn } from 'cn';
import { relicRarityTiles, type RelicRarity } from '@/lib/data/relic-bonuses';
import { getRelicImage } from '@/lib/relics';

/** Common's tile, for a relic whose rarity the site cannot name yet. */
const FALLBACK_TILE = relicRarityTiles.common;

/**
 * A relic's icon on its rarity tile, as the relics tab shows it. Decorative:
 * the relic's name always sits beside it.
 */
export const RelicIcon = ({
	imageId,
	rarity,
	size = 'md'
}: {
	imageId: unknown;
	rarity: RelicRarity | null;
	size?: 'sm' | 'md';
}) => {
	const image = getRelicImage(imageId);
	const tile = rarity ? relicRarityTiles[rarity] : FALLBACK_TILE;

	return (
		<span
			aria-hidden='true'
			className={cn(
				'inline-flex shrink-0 items-center justify-center rounded-md border border-(--color-line-soft)',
				size === 'sm' ? 'size-7' : 'size-11'
			)}
			style={{ backgroundImage: `linear-gradient(to bottom, ${tile.from}, ${tile.to})` }}
		>
			{image ? (
				<EditorImage
					alt=''
					className={size === 'sm' ? 'size-5 object-contain' : 'size-8 object-contain'}
					size={size === 'sm' ? 20 : 32}
					src={image.file}
				/>
			) : null}
		</span>
	);
};

/**
 * Rarity text colours, as the `--color-rarity-*` variables in `globals.css`.
 * Written out in full so Tailwind sees every class.
 */
export const rarityTextClassNames: Record<RelicRarity, string> = {
	common: 'text-(--color-rarity-common)',
	uncommon: 'text-(--color-rarity-uncommon)',
	rare: 'text-(--color-rarity-rare)',
	epic: 'text-(--color-rarity-epic)',
	fabled: 'text-(--color-rarity-fabled)',
	mythical: 'text-(--color-rarity-mythical)',
	legendary: 'text-(--color-rarity-legendary)'
};

/** The game tints a relic's name by rarity, leaving Common plain. */
export const relicNameClassName = (rarity: RelicRarity | null) =>
	rarity && rarity !== 'common' ? rarityTextClassNames[rarity] : undefined;

/** A rarity's translated name, coloured like the game shows it. */
export const RarityLabel = ({ rarity, label }: { rarity: RelicRarity; label: string }) => (
	<span className={rarityTextClassNames[rarity]}>{label}</span>
);
