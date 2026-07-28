'use client';

import { ArrowLeft } from 'lucide-react';

import { SectionHeading } from '@/components/home/SectionHeading';
import { SaveConverterPanel } from '@/components/tools/save-converter/SaveConverterPanel';

export const SaveConverter = () => {
	return (
		<>
			<SectionHeading
				back='/'
				description=''
				icon={<ArrowLeft aria-hidden='true' className='h-4 w-4' />}
				title='Tools · Clicker Heroes Save Converter'
			/>

			<SaveConverterPanel />
		</>
	);
};
