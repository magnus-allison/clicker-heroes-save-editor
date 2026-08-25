'use client';

import { Breadcrumb, homeCrumb } from '@/components/home/Breadcrumb';
import { SaveJsonPanel } from '@/components/tools/save-json/SaveJsonPanel';

export const SaveJson = () => {
	return (
		<>
			<Breadcrumb items={[homeCrumb, { label: 'Tools' }, { label: 'Save JSON' }]} />

			<SaveJsonPanel />
		</>
	);
};
