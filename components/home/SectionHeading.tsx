import Link from 'next/link';
import { type FC } from 'react';

interface Props {
	description: string;
	icon: React.ReactNode;
	title: string;
	back?: string;
}

export const SectionHeading: FC<Props> = ({ description, icon, title, back }) => (
	<div className='flex flex-col gap-2.5 mb-2'>
		<div className='flex flex-row items-center gap-1'>
			<span className='flex h-10 w-10 items-center justify-center rounded-(--radius-card) text-fg-strong'>
				{back ? <Link href={back}>{icon}</Link> : icon}
			</span>
			<h2
				className='text-[1.25rem] font-semibold leading-tight text-fg-strong'
				id={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}
			>
				{title}
			</h2>
		</div>
	</div>
);
