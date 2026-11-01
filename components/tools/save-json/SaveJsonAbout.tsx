import type { FC } from 'react';

import { ToolAbout } from '@/components/tools/ToolAbout';
import { toolLinks } from '@/components/tools/tool-links';

export const SaveJsonAbout: FC = () => (
	<ToolAbout
		id='about-save-json'
		intro='A save is one large JSON object under the encoding. Decode it, edit any field by hand, and encode it back.'
		related={[toolLinks.saveEditor, toolLinks.saveConverter, toolLinks.faq]}
		sections={[
			{
				title: 'Be careful',
				body: 'Nothing checks your values against what the game expects. Keep the original and change one thing at a time.'
			}
		]}
	/>
);
