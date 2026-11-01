import type { ReactNode } from 'react';

/*
 * The real root layout, with `<html lang>`, is `app/[locale]/layout.tsx`. This
 * pass-through only exists so `app/not-found.tsx` has a layout to render in.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
	return children;
}
