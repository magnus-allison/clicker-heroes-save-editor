'use client';

import { ArrowLeft } from 'lucide-react';

import { SectionHeading } from '@/components/home/SectionHeading';
import { SaveJsonPanel } from '@/components/tools/save-json/SaveJsonPanel';

export const SaveJson = () => {
	return (
		<>
			<SectionHeading
				back='/'
				description=''
				icon={<ArrowLeft aria-hidden='true' className='h-4 w-4' />}
				title='Tools · Clicker Heroes Save JSON'
			/>

			<SaveJsonPanel />
		</>
	);
};
