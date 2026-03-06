import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Online Clothing App",
	description: "Clothing Store LK front-end",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
