'use client';

import { Breadcrumb, homeCrumb, toolsCrumb } from '@/components/home/Breadcrumb';
import { SaveJsonPanel } from '@/components/tools/save-json/SaveJsonPanel';

export const SaveJson = () => {
	return (
		<>
			<Breadcrumb items={[homeCrumb, toolsCrumb, { label: 'Save JSON' }]} />

			<SaveJsonPanel />
		</>
	);
};
