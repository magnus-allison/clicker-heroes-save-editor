'use client';

import { Breadcrumb, homeCrumb } from '@/components/home/Breadcrumb';
import { SaveConverterPanel } from '@/components/tools/save-converter/SaveConverterPanel';

export const SaveConverter = () => {
	return (
		<>
			<Breadcrumb items={[homeCrumb, { label: 'Tools' }, { label: 'Save Converter' }]} />

			<SaveConverterPanel />
		</>
	);
};
