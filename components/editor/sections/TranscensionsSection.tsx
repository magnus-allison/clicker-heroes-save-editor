import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import { useSaveStore } from "@/lib/save-store";

type Props = {
	defaultOpen?: boolean;
	showToast: (message: string) => void;
};

export const TranscensionsSection = ({ defaultOpen, showToast }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateSave = useSaveStore((state) => state.updateSave);

	return (
		<SectionCard
			defaultOpen={defaultOpen}
			description="Save history for transcensions and ascensions can safely be cleared if you want a smaller export."
			title="Transcensions and Ascensions"
		>
			<div className="space-y-4 text-[12px] leading-6 text-(--color-text-secondary)">
				<p>
					The save contains all transcensions and ascensions information. This can significantly increase the size of the save file, and the game does not require this history to continue working.
				</p>
				<p>
					To inspect the history first, look under <span className="border border-(--color-border) bg-(--color-bg-elevated) px-2 py-1 text-(--color-text)">stats &gt; transcensions</span> in the JSON tools below.
				</p>
				<div className="max-w-70">
					<Button
						disabled={!saveData}
						onClick={() => {
							if (!saveData) {
								return;
							}

							updateSave((current) => {
								const next = structuredClone(current);
								if (!next.stats || typeof next.stats !== "object") {
									next.stats = {};
								}
								(next.stats as Record<string, unknown>).transcensions = {};
								return next;
							});
							showToast("Transcension history cleared.");
						}}
						variant="primary"
					>
						Clear Transcension Data
					</Button>
				</div>
			</div>
		</SectionCard>
	);
};
