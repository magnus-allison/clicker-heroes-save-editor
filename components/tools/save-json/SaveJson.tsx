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
				icon={<ArrowLeft aria-hidden='true' className='h-5 w-5' />}
				title='Tools · Clicker Heroes Save JSON'
			/>

			<SaveJsonPanel />
		</>
	);
};
