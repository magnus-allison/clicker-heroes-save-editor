import { BoundFieldControl } from "@/components/editor/BoundFieldControl";
import { EditorImage } from "@/components/ui/EditorImage";
import { HelpToolTip } from "@/components/ui/HelpToolTip";
import { SectionCard } from "@/components/ui/SectionCard";
import type { SimpleFieldConfig } from "@/lib/data/editor-config";

type Props = {
	title: string;
	description?: string;
	fields: SimpleFieldConfig[];
	defaultOpen?: boolean;
	note?: string;
};

export const SimpleFieldsSection = ({
	defaultOpen,
	description,
	fields,
	note,
	title,
}: Props) => {
	const showImageColumn = fields.some((field) => Boolean(field.imageSrc));

	return (
		<SectionCard defaultOpen={defaultOpen} description={description} title={title}>
			{note ? <p className="mb-4 text-[12px] leading-6 text-(--color-text-secondary)">{note}</p> : null}
			<div className="my-2 overflow-visible border border-(--color-border)">
				<table className="w-full table-fixed border-collapse text-left text-[13px] text-(--color-text-secondary)">
					<colgroup>
						{showImageColumn ? <col className="w-18 sm:w-22" /> : null}
						<col />
						<col className="w-[46%] sm:w-80" />
					</colgroup>
					<thead className="bg-(--color-bg-elevated) text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)">
						<tr>
							{showImageColumn ? <th className="px-3 py-3 sm:px-4">Image</th> : null}
							<th className="px-3 py-3 sm:px-4">Item</th>
							<th className="px-3 py-3 sm:px-4">Value</th>
						</tr>
					</thead>
					<tbody className="bg-(--color-bg)">
						{fields.map((field) => (
							<tr className="align-middle not-last:border-b not-last:border-(--color-border-subtle)" key={field.path.join(".")}>
								{showImageColumn ? (
									<td className="px-3 py-3 sm:px-4">
										{field.imageSrc ? (
											<EditorImage alt="" className="h-11 w-11 object-contain" size={44} src={field.imageSrc} />
										) : (
											<div className="h-11 w-11 border border-dashed border-(--color-border-soft) bg-(--color-bg-soft)" />
										)}
									</td>
								) : null}
								<td className="px-3 py-3 sm:px-4">
									<div className="flex min-w-0 items-center gap-3">
										<span className="min-w-0 text-[13px] text-(--color-text)">{field.label}</span>
										{field.help ? (
											<HelpToolTip title={field.help.title}>
												<p>{field.help.body}</p>
											</HelpToolTip>
										) : null}
									</div>
								</td>
								<td className="px-3 py-3 sm:px-4">
									<BoundFieldControl
										allowMissing={field.allowMissing}
										kind={field.kind}
										options={field.options}
										path={field.path}
										selectOnFocus
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</SectionCard>
	);
};
