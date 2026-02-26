import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { ToasterProvider } from "@/lib/providers/toaster-provider";
import { env } from "@/lib/env/server";
import { ReactQueryProvider } from "@/lib/providers/react-query-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: env.APP_NAME,
	description:
		"Enjoy a seamless immersion experience through countless of animes, featuring Japanese subtitles and live translation.",
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: "cover",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} bg-muted/90 antialiased`}>
				<ReactQueryProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<main className="container mx-auto px-4 max-w-2xl mt-6 md:p-0">
							{children}
						</main>
						<ToasterProvider />
					</ThemeProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
