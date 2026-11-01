import type { FC } from 'react';

import { GuideLink } from '@/components/guides/GuideLink';
import { ToolAbout } from '@/components/tools/ToolAbout';
import { toolLinks } from '@/components/tools/tool-links';

export const AncientsAbout: FC = () => (
	<ToolAbout
		id='about-ancients-calculator'
		intro={
			<>
				Spreads your Hero Souls across the ancients you own using the community Rules of Thumb. Ported from
				the <GuideLink href='https://kepow.org/clickerheroes/'>kepow.org optimizer</GuideLink>.
			</>
		}
		related={[toolLinks.outsidersCalculator, toolLinks.gildingChart, toolLinks.transcensionViewer]}
		sections={[
			{
				title: 'Builds',
				body: 'Idle levels everything against Siyalatas, active against Fragsworth. Hybrid levels both, with the ratio setting how many Fragsworth levels you buy per Siyalatas level.'
			},
			{
				title: 'Best hero',
				body: 'Each hero tier has a different gold-to-damage ratio, which changes how far the gold ancients are worth levelling.'
			}
		]}
	/>
);
