import { createNavigation } from 'next-intl/navigation';

import { routing } from '@/i18n/routing';

/** Locale-aware drop-ins for `next/link` and `next/navigation`. */
export const { Link, getPathname, redirect, usePathname, useRouter } = createNavigation(routing);
