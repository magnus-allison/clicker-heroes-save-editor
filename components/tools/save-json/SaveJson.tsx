'use client';

import { Breadcrumb } from '@/components/home/Breadcrumb';
import { SaveJsonPanel } from '@/components/tools/save-json/SaveJsonPanel';

export const SaveJson = () => {
	return (
		<>
			<Breadcrumb subtitle='Save JSON' title='tools' />
			<SaveJsonPanel />
		</>
	);
};
