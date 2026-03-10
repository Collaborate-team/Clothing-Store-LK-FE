import type { Metadata } from "next";
import NavBar from "@/components/common/nav-bar";
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
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body>
				<NavBar />
				{children}
			</body>
		</html>
	);
}
