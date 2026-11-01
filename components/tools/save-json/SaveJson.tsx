'use client';

import { Breadcrumb } from '@/components/home/Breadcrumb';
import { SaveJsonPanel } from '@/components/tools/save-json/SaveJsonPanel';

export const SaveJson = () => {
	return (
		<>
			<Breadcrumb page='saveJson' title='tools' />
			<SaveJsonPanel />
		</>
	);
};
