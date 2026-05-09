import { EditorImage } from "@/components/ui/EditorImage";
import { NumberInput } from "@/components/ui/NumberInput";
import { SectionCard } from "@/components/ui/SectionCard";
import { orderedHeroes } from "@/lib/data/heroes";
import { useSaveStore } from "@/lib/save-store";
import { getValueAtPath } from "@/lib/save-utils";

type Props = {
	defaultOpen?: boolean;
};

function getGildedLabel(epicLevel: number) {
	if (epicLevel <= 0) {
		return "";
	}

	return `${epicLevel}x Gilded (+${epicLevel * 50}%)`;
}

export const HeroesSection = ({ defaultOpen }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);
	const heroCollection =
		getValueAtPath<Record<string, { level?: number; epicLevel?: number }>>(saveData, ["heroCollection", "heroes"]) ?? {};

	return (
		<SectionCard
			defaultOpen={defaultOpen}
			description="Edit hero levels and gilded levels without digging through the raw save structure."
			title="Heroes"
		>
			<div className="my-2 overflow-hidden border border-(--color-border)">
				<div className="overflow-x-auto">
					<table className="min-w-full border-collapse text-left text-[13px] text-(--color-text-secondary)">
						<thead className="bg-(--color-bg-elevated) text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)">
							<tr>
								<th className="px-4 py-3">Image</th>
								<th className="px-4 py-3">Hero</th>
								<th className="px-4 py-3">Level</th>
								<th className="px-4 py-3">Gilded Level</th>
							</tr>
						</thead>
						<tbody className="bg-(--color-bg)">
							{orderedHeroes.map((hero) => {
								const heroState = heroCollection[hero.heroId] ?? {};
								const level = heroState.level ?? 0;
								const epicLevel = heroState.epicLevel ?? 0;
								const imageSrc = epicLevel >= 1 && hero.gildedImage ? hero.gildedImage : hero.image;

								return (
									<tr className={epicLevel >= 1 ? "bg-(--color-gilded-bg) text-(--color-gold-text) not-last:border-b not-last:border-(--color-gilded-border)" : "not-last:border-b not-last:border-(--color-border-subtle)"} key={hero.heroId}>
										<td className="px-4 py-3">
											<EditorImage alt={hero.name} className="h-12 w-12 object-contain" size={48} src={imageSrc} />
										</td>
										<td className="px-4 py-3">
											<p className={epicLevel >= 1 ? "text-(--color-gold-text)" : "text-(--color-text)"}>{hero.name}</p>
											{epicLevel >= 1 ? <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-(--color-gold-text)">{getGildedLabel(epicLevel)}</p> : null}
										</td>
										<td className="min-w-45 px-4 py-3">
											<NumberInput
												disabled={!saveData}
												onCommit={(value) => updateValue(["heroCollection", "heroes", hero.heroId, "level"], value)}
												selectOnFocus
												value={level}
											/>
										</td>
										<td className="min-w-45 px-4 py-3">
											<NumberInput
												disabled={!saveData}
												onCommit={(value) => updateValue(["heroCollection", "heroes", hero.heroId, "epicLevel"], value)}
												selectOnFocus
												value={epicLevel}
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</SectionCard>
	);
};
