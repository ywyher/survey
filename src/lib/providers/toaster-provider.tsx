"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function ToasterProvider() {
	const { theme } = useTheme();

	return (
		<Toaster
			theme={theme as "light" | "dark"}
			toastOptions={{
				style: {
					background: "var(--secondary)",
				},
			}}
		/>
	);
}
