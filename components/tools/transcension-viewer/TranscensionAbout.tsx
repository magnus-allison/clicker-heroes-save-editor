import type { FC } from 'react';

import { ToolAbout } from '@/components/tools/ToolAbout';
import { toolLinks } from '@/components/tools/tool-links';

export const TranscensionAbout: FC = () => (
	<ToolAbout
		id='about-transcension-viewer'
		intro='The game keeps a history of your recent transcensions and ascensions but never shows it. This reads it out of your save.'
		related={[toolLinks.outsidersCalculator, toolLinks.ancientsCalculator, toolLinks.progressTips]}
		sections={[
			{
				title: 'What it shows',
				body: 'Duration, ascensions, highest zone, Hero Souls and Ancient Souls for each transcension. Pick one to see its ascensions.'
			},
			{
				title: 'Why it helps',
				body: 'When the last few ascensions added little for the time they took, it is time to transcend.'
			}
		]}
	/>
);
