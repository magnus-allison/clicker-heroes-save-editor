import type { FC } from 'react';

import { ToolAbout } from '@/components/tools/ToolAbout';
import { toolLinks } from '@/components/tools/tool-links';

export const MercenaryAbout: FC = () => (
	<ToolAbout
		id='about-mercenary-viewer'
		intro='Lays out your mercenaries in one table, alongside the lifetime stats the game tracks but rarely shows.'
		related={[toolLinks.newPlayerGuide, toolLinks.saveEditor, toolLinks.transcensionViewer]}
		sections={[
			{
				title: 'Roster',
				body: 'Level, experience, time to die, bonus lives, last quest and its success chance for every slot.'
			},
			{
				title: 'Lifetime stats',
				body: 'Mercenaries revived and buried, highest level reached, and quests completed by reward type.'
			}
		]}
	/>
);
