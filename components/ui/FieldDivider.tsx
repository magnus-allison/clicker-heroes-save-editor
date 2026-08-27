export const FieldDivider = ({ label }: { label: string }) => (
	<div aria-hidden='true' className='flex items-center gap-3 py-1.5'>
		<span className='h-px flex-1 bg-line-subtle/60' />
		<span className='text-xs uppercase tracking-[0.07em] text-fg-dim font-aeonik'>{label}</span>
		<span className='h-px flex-1 bg-line-subtle/60' />
	</div>
);
