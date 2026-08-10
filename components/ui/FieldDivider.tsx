/**
 * Labelled hairline between two ways of doing the same thing — "upload a file"
 * versus "paste a string". Purely decorative, so it stays out of the a11y tree.
 */
export const FieldDivider = ({ label }: { label: string }) => (
	<div aria-hidden='true' className='flex items-center gap-3 py-1.5'>
		<span className='h-px flex-1 bg-(--color-line-subtle)' />
		<span className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>{label}</span>
		<span className='h-px flex-1 bg-(--color-line-subtle)' />
	</div>
);
