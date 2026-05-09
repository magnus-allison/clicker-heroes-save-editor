"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Props = {
	text: string;
	onCopied?: () => void;
	idleLabel?: string;
	successLabel?: string;
	variant?: "primary" | "secondary" | "ghost";
	size?: "sm" | "md";
	disabled?: boolean;
	className?: string;
};

export const CopyButton = ({
	className,
	disabled,
	idleLabel = "Copy",
	onCopied,
	size = "sm",
	successLabel = "Copied",
	text,
	variant = "ghost"
}: Props) => {
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		if (!isCopied) {
			return undefined;
		}

		const timeoutId = window.setTimeout(() => setIsCopied(false), 1200);
		return () => window.clearTimeout(timeoutId);
	}, [isCopied]);

	return (
		<Button
			aria-label={isCopied ? successLabel : idleLabel}
			className={cn("h-8 w-8 border-transparent bg-transparent p-0 disabled:border-transparent disabled:bg-transparent disabled:opacity-45", className)}
			disabled={disabled || !text}
			onClick={async () => {
				await navigator.clipboard.writeText(text);
				setIsCopied(true);
				onCopied?.();
			}}
			size={size}
			variant={variant}
		>
			{isCopied ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
			<span className="sr-only">{isCopied ? successLabel : idleLabel}</span>
		</Button>
	);
};
