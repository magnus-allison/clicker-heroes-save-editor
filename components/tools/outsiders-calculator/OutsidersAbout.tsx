import type { FC } from 'react';

import { GuideLink } from '@/components/guides/GuideLink';
import { ToolAbout } from '@/components/tools/ToolAbout';
import { toolLinks } from '@/components/tools/tool-links';

export const OutsidersAbout: FC = () => (
	<ToolAbout
		id='about-outsiders-calculator'
		intro={
			<>
				Turns the Ancient Souls in your save into outsider levels and estimates where the transcension ends.
				Ported from{' '}
				<GuideLink href='https://driej.github.io/Clicker-Heroes-Outsiders/'>
					Driej&rsquo;s outsiders calculator
				</GuideLink>
				.
			</>
		}
		related={[toolLinks.ancientsCalculator, toolLinks.instakillCalculator, toolLinks.transcensionViewer]}
		sections={[
			{
				title: 'Spending order',
				body: 'Borb first, then Rhageist, K’Ariqua, Orphalas and Sen-Akhan up to their caps. The rest goes to Chor’gorloth, Phandoryss and Ponyboy, whichever is worth most per soul.'
			},
			{
				title: 'Applying the levels',
				body: 'The plan uses every Ancient Soul you have earned, so respec in game first, or apply the levels to your save and import it.'
			}
		]}
	/>
);
