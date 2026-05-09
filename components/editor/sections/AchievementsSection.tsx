import { Checkbox } from "@/components/ui/Checkbox";
import { EditorImage } from "@/components/ui/EditorImage";
import { NumberInput } from "@/components/ui/NumberInput";
import { SectionCard } from "@/components/ui/SectionCard";
import { achievementGroups, getAchievementImage } from "@/lib/data/achievements";
import { useSaveStore } from "@/lib/save-store";
import { getValueAtPath } from "@/lib/save-utils";

type Props = {
	defaultOpen?: boolean;
};

export const AchievementsSection = ({ defaultOpen }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);

	return (
		<SectionCard
			defaultOpen={defaultOpen}
			description="Toggle achievements in groups and adjust the transcendent highest zone field."
			title="Achievements"
		>
			<div className="space-y-6">
				<div className="my-2 overflow-hidden border border-(--color-border)">
					<div className="overflow-x-auto">
						<table className="min-w-full border-collapse text-left text-[13px] text-(--color-text-secondary)">
							<thead className="bg-(--color-bg-elevated) text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)">
								<tr>
									<th className="px-4 py-3">Image</th>
									<th className="px-4 py-3">Item</th>
									<th className="px-4 py-3">Value</th>
								</tr>
							</thead>
							<tbody className="bg-(--color-bg)">
								<tr className="border-b border-(--color-border-subtle)">
									<td className="px-4 py-3">
										<EditorImage
											alt="Transcendent Highest Zone"
											className="h-11 w-11 object-contain"
											size={44}
											src="/assets/profile/Transcend_achieve.webp"
										/>
									</td>
									<td className="px-4 py-3 text-(--color-text)">Transcendent Highest Zone</td>
									<td className="min-w-55 px-4 py-3">
										<NumberInput
											disabled={!saveData}
											onCommit={(value) => updateValue(["transcendentHighestFinishedZone"], value)}
											selectOnFocus
											value={Number(getValueAtPath(saveData, ["transcendentHighestFinishedZone"]) ?? 0)}
										/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div className="grid gap-4 xl:grid-cols-2">
					{achievementGroups.map((group) => (
						<div className="overflow-hidden border border-(--color-border)" key={group.type}>
							<div className="border-b border-(--color-border-subtle) bg-(--color-bg-elevated) px-4 py-3">
								<h3 className="text-[13px] text-(--color-text)">
									{group.label}-related achievements
								</h3>
							</div>
							<div className="overflow-x-auto">
								<table className="min-w-full border-collapse text-left text-[13px] text-(--color-text-secondary)">
									<thead className="bg-(--color-bg) text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)">
										<tr>
											<th className="px-4 py-3">Image</th>
											<th className="px-4 py-3">Description</th>
											<th className="px-4 py-3">Unlocked</th>
										</tr>
									</thead>
									<tbody className="bg-(--color-bg)">
										{group.items.map(({ achievement, id }) => (
											<tr className="not-last:border-b not-last:border-(--color-border-subtle)" key={id}>
												<td className="px-4 py-3 align-top">
													<EditorImage alt={achievement[0]} className="h-11 w-11 object-contain" size={44} src={getAchievementImage(achievement[4])} />
												</td>
												<td className="px-4 py-3 align-top">
													<p className="text-(--color-text)">{achievement[0]}</p>
													<p className="mt-1 leading-6 text-(--color-text-secondary)">{achievement[1]}</p>
													{achievement[2] ? <p className="mt-1 italic text-(--color-text-dim)">{achievement[2]}</p> : null}
													{achievement[3] ? <p className="mt-1 text-(--color-primary)">Reward: {achievement[3]}</p> : null}
												</td>
												<td className="px-4 py-3 align-top">
													<div className="flex justify-start pt-1">
														<Checkbox
															checked={Boolean(getValueAtPath(saveData, ["achievements", id]))}
															disabled={!saveData}
															onCheckedChange={(checked) => {
																if (!saveData) {
																	return;
																}

																updateValue(["achievements", id], checked);
															}}
														/>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					))}
				</div>
			</div>
		</SectionCard>
	);
};
