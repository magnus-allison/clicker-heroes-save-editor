'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import type { ToastItem } from '@/components/ui/ToastStack';
import { ToastStack } from '@/components/ui/ToastStack';

const TOAST_DURATION_MS = 2200;

type ToastContextValue = {
	showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

type Props = {
	children: ReactNode;
};

export const ToastProvider = ({ children }: Props) => {
	const [toasts, setToasts] = useState<ToastItem[]>([]);
	const timeoutsRef = useRef<number[]>([]);
	const nextIdRef = useRef(0);

	// Clear any in-flight dismiss timers on unmount so they cannot fire against
	// an unmounted provider.
	useEffect(() => {
		const timeouts = timeoutsRef;
		return () => {
			timeouts.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
			timeouts.current = [];
		};
	}, []);

	const showToast = useCallback((message: string) => {
		nextIdRef.current += 1;
		const id = nextIdRef.current;
		setToasts((current) => [...current, { id, message }]);

		const timeoutId = window.setTimeout(() => {
			setToasts((current) => current.filter((toast) => toast.id !== id));
			timeoutsRef.current = timeoutsRef.current.filter((pending) => pending !== timeoutId);
		}, TOAST_DURATION_MS);

		timeoutsRef.current.push(timeoutId);
	}, []);

	const value = useMemo(() => ({ showToast }), [showToast]);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<ToastStack toasts={toasts} />
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error('useToast must be used within a ToastProvider.');
	}

	return context;
};
