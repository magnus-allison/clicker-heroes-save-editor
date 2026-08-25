'use client';

import { Breadcrumb, homeCrumb, toolsCrumb } from '@/components/home/Breadcrumb';
import { SaveConverterPanel } from '@/components/tools/save-converter/SaveConverterPanel';

export const SaveConverter = () => {
	return (
		<>
			<Breadcrumb items={[homeCrumb, toolsCrumb, { label: 'Save Converter' }]} />

			<SaveConverterPanel />
		</>
	);
};
