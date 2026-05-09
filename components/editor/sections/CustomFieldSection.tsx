"use client";

import { useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/Checkbox";
import { Dropdown } from "@/components/ui/Dropdown";
import { NumberInput } from "@/components/ui/NumberInput";
import { SectionCard } from "@/components/ui/SectionCard";
import { TextInput } from "@/components/ui/TextInput";
import { useSaveStore } from "@/lib/save-store";

type Props = {
	defaultOpen?: boolean;
};

export const CustomFieldSection = ({ defaultOpen }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);
	const options = useMemo(
		() =>
			Object.keys(saveData ?? {})
				.filter((key) => {
					const value = saveData?.[key];
					return value == null || ["string", "number", "boolean"].includes(typeof value);
				})
				.map((key) => ({ label: key, value: key })),
		[saveData],
	);
	const [selectedKey, setSelectedKey] = useState("");
	const resolvedKey = options.some((option) => option.value === selectedKey) ? selectedKey : String(options[0]?.value ?? "");
	const currentValue = resolvedKey && saveData ? saveData[resolvedKey] : undefined;
	const isDisabled = !saveData || !resolvedKey;

	return (
		<SectionCard defaultOpen={defaultOpen} description="Search a top-level primitive field and edit it directly." title="Find Custom Field">
			<div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
				<div className="space-y-4">
					<div>
						<p className="mb-2 text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)">Search field by name</p>
						<Dropdown disabled={!saveData} onChange={(event) => setSelectedKey(event.target.value)} options={options} placeholder="Choose a field" value={resolvedKey} />
					</div>
					<div>
						<p className="mb-2 text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)">Field name</p>
						<div className="border border-(--color-border) bg-(--color-bg-soft) px-4 py-3 text-[13px] text-(--color-text)">{resolvedKey || "Choose a field"}</div>
					</div>
				</div>

				<div>
					<p className="mb-2 text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)">Field value</p>
					{typeof currentValue === "boolean" ? (
						<div className="border border-(--color-border) bg-(--color-bg) px-4 py-3">
							<Checkbox checked={currentValue} disabled={isDisabled} label="Enabled" onCheckedChange={(checked) => updateValue([resolvedKey], checked)} />
						</div>
					) : typeof currentValue === "number" ? (
						<NumberInput disabled={isDisabled} onCommit={(value) => updateValue([resolvedKey], value)} selectOnFocus value={currentValue} />
					) : (
						<TextInput disabled={isDisabled} onCommit={(value) => updateValue([resolvedKey], value)} value={currentValue == null ? "" : String(currentValue)} />
					)}
				</div>
			</div>
		</SectionCard>
	);
};
