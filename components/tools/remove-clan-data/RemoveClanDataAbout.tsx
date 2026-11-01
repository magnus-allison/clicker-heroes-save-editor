import type { FC } from 'react';

import { ToolAbout } from '@/components/tools/ToolAbout';
import { toolLinks } from '@/components/tools/tool-links';

export const RemoveClanDataAbout: FC = () => (
	<ToolAbout
		id='about-remove-clan-data'
		intro='A save also holds your clan and account details. Strip them before posting a save for help or giving it to someone else.'
		related={[toolLinks.saveEditor, toolLinks.saveConverter, toolLinks.faq]}
		sections={[
			{
				title: 'What gets removed',
				body: 'All clan fields, including raid class, plus email, password hash, account and login fields. Your progress is untouched.'
			}
		]}
	/>
);
