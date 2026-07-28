export type ToastItem = {
	id: number;
	message: string;
};

type Props = {
	toasts: ToastItem[];
};

export const ToastStack = ({ toasts }: Props) => {
	return (
		<div
			aria-live='polite'
			className='pointer-events-none fixed top-5 right-5 z-50 flex max-w-70 flex-col gap-2'
		>
			{toasts.map((toast) => (
				<div
					className='animate-toast-in rounded-(--radius-card) border border-(--color-success-line) bg-(--color-success-surface) px-4 py-2.5 text-[12px] font-medium text-(--color-primary-text) shadow-[var(--shadow-popover)]'
					key={toast.id}
				>
					{toast.message}
				</div>
			))}
		</div>
	);
};
