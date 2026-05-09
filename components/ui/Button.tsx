import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "primary" | "secondary" | "ghost";
	size?: "sm" | "md";
	fullWidth?: boolean;
};

const variantClasses = {
	primary: "border-(--color-primary-dim) text-(--color-primary) hover:border-(--color-primary-border) hover:text-(--color-text-strong)",
	secondary: "border-(--color-border-soft) bg-(--color-bg-soft) text-(--color-text-muted) hover:text-(--color-text)",
	ghost: "border-transparent bg-transparent px-2.5 text-[11px] text-(--color-text-dim) hover:border-transparent hover:bg-transparent hover:text-(--color-text-muted)"
} as const;

const sizeClasses = {
	sm: "px-2.5 py-1.5 text-[11px]",
	md: "px-4 py-2.5 text-[13px]"
} as const;

export const Button = ({
	children,
	className,
	fullWidth,
	size = "md",
	type = "button",
	variant = "secondary",
	...props
}: Props) => {
	return (
		<button
			className={cn(
				"inline-flex items-center justify-center gap-2 rounded-(--input-radius) border bg-(--color-bg-elevated-2) leading-none text-(--color-text) transition-[background-color,border-color,color,box-shadow] duration-150 hover:border-(--color-border-hover) hover:bg-(--color-bg-hover) active:bg-(--color-bg-elevated) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-(--color-border-soft) disabled:bg-(--color-bg-soft) disabled:text-(--color-text-dim)",
				variantClasses[variant],
				sizeClasses[size],
				fullWidth && "w-full",
				className
			)}
			type={type}
			{...props}
		>
			{children}
		</button>
	);
};