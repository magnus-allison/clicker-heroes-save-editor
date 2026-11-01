import type { FC } from 'react';

import { ToolAbout } from '@/components/tools/ToolAbout';
import { toolLinks } from '@/components/tools/tool-links';

export const SaveConverterAbout: FC = () => (
	<ToolAbout
		id='about-save-converter'
		intro='PC and mobile saves hold the same data but are compressed differently, so a save from one will not import on the other. This re-encodes it for the other platform.'
		related={[toolLinks.saveEditor, toolLinks.removeClanData, toolLinks.faq]}
		sections={[
			{
				title: 'The difference',
				body: 'PC saves use raw deflate; mobile saves wrap the same JSON in zlib. Older legacy saves are recognised too.'
			}
		]}
	/>
);
