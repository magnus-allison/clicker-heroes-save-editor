'use client';

import { PageHeading } from '@/components/ui/PageHeading';
import { SaveConverterPanel } from '@/components/tools/save-converter/SaveConverterPanel';

export const SaveConverter = () => {
	return (
		<div className='flex min-h-screen w-full justify-center overflow-x-hidden p-5 sm:p-10'>
			<main className='flex w-full max-w-6xl flex-col gap-3'>
				<PageHeading
					title='Save Converter'
					subtitle='Import a Clicker Heroes save, detect whether it came from PC or mobile, and export it for the other device.'
				/>

				<SaveConverterPanel />
			</main>
		</div>
	);
};
