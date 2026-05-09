import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type Props = {
	title: string;
	description?: string;
	children: ReactNode;
	defaultOpen?: boolean;
	actions?: ReactNode;
	className?: string;
};

export const SectionCard = ({ actions, children, className, defaultOpen, description, title }: Props) => {
	return (
		<details
			className={cn("group border-b border-(--color-border-subtle) last:border-b-0", className)}
			open={defaultOpen}
		>
			<summary
				className="flex list-none cursor-pointer items-start gap-2 bg-transparent px-4 py-3 text-[13px] text-(--color-text) transition hover:bg-(--color-bg-hover) group-open:bg-(--color-bg-elevated) group-open:text-(--color-text-strong) marker:hidden [&::-webkit-details-marker]:hidden"
				style={{ padding: "12px 15px" }}
			>
				<span className="mt-0.5 text-[11px] text-(--color-text-dim) transition duration-200 group-open:rotate-90 group-open:opacity-60">▶</span>
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-3">
						<h2 className="text-[13px] text-(--color-text) group-open:text-(--color-text-strong)">{title}</h2>
						{actions ? <div className="shrink-0">{actions}</div> : null}
					</div>
					{description ? <p className="mt-1 text-[12px] text-(--color-text-muted)">{description}</p> : null}
				</div>
			</summary>
			<div className="bg-(--color-bg) px-4 py-4" style={{ padding: 16 }}>
				{children}
			</div>
		</details>
	);
};