'use client';

import { Breadcrumb } from '@/components/home/Breadcrumb';
import { SaveConverterPanel } from '@/components/tools/save-converter/SaveConverterPanel';

export const SaveConverter = () => {
	return (
		<>
			<Breadcrumb page='saveConverter' title='tools' />
			<SaveConverterPanel />
		</>
	);
};
