"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { ToastStack, type ToastItem } from "@/components/ui/ToastStack";

type ToastContextValue = {
	showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

type Props = {
	children: ReactNode;
};

export const ToastProvider = ({ children }: Props) => {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	const showToast = (message: string) => {
		const id = Date.now() + Math.floor(Math.random() * 1000);
		setToasts((current) => [...current, { id, message }]);
		window.setTimeout(() => {
			setToasts((current) => current.filter((toast) => toast.id !== id));
		}, 2200);
	};

	const value = useMemo(
		() => ({
			showToast,
		}),
		[]
	);

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
		throw new Error("useToast must be used within a ToastProvider.");
	}

	return context;
};