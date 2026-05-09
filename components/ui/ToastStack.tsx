export type ToastItem = {
	id: number;
	message: string;
};

type Props = {
	toasts: ToastItem[];
};

export const ToastStack = ({ toasts }: Props) => {
	return (
		<div className="pointer-events-none fixed right-5 top-5 z-50 flex max-w-70 flex-col gap-2">
			{toasts.map((toast) => (
				<div
					className="rounded-(--input-radius) border border-(--color-success-border) bg-(--color-success-bg) px-4 py-2.5 text-[12px] text-(--color-primary) shadow-[0_2px_8px_var(--color-shadow)]"
					key={toast.id}
				>
					{toast.message}
				</div>
			))}
		</div>
	);
};