'use client';

import { useEffect, useState } from 'react';

const READING_LINE_PX = 120;

/** Tracks the section currently under the reading line. */
export const useActiveSection = (ids: readonly string[]) => {
	const [active, setActive] = useState<string | null>(null);

	useEffect(() => {
		let frame = 0;

		const update = () => {
			frame = 0;
			let current: string | null = null;

			for (const id of ids) {
				const element = document.getElementById(id);
				if (element && element.getBoundingClientRect().top <= READING_LINE_PX) current = id;
			}

			setActive(current);
		};

		const schedule = () => {
			if (!frame) frame = window.requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);

		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
		};
	}, [ids]);

	return active;
};
