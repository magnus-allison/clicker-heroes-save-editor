import type { FC } from 'react';

import { ToolAbout } from '@/components/tools/ToolAbout';
import { toolLinks } from '@/components/tools/tool-links';

export const InstakillAbout: FC = () => (
	<ToolAbout
		id='about-instakill-calculator'
		intro='Once every monster dies in one hit, speed comes down to monsters per zone and frames per kill. This works out both from your Kumawakamaru and Borb levels.'
		related={[toolLinks.outsidersCalculator, toolLinks.ancientsCalculator, toolLinks.progressTips]}
		sections={[
			{
				title: 'Monsters per zone',
				body: 'Zones start at 10 monsters and gain 0.1 every 500 zones. Kumawakamaru removes up to 8, Borb multiplies that, and nothing goes below 2.'
			},
			{
				title: 'Route time',
				body: 'Each kill takes 15 frames, or 14 with AC instakill. Frames are added up zone by zone and divided by your FPS.'
			}
		]}
	/>
);
