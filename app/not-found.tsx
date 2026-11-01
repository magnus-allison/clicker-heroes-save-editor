'use client';

import NextError from 'next/error';

/**
 * 404 for requests the locale proxy never sees (paths with a file extension).
 * Everything else 404s inside `app/[locale]`, with the site's own layout.
 */
export default function GlobalNotFound() {
	return (
		<html lang='en'>
			<body>
				<NextError statusCode={404} />
			</body>
		</html>
	);
}
