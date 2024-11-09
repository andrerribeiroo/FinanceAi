import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";


export const metadata: Metadata = {
  title: "Finance AI",
  description: "Gerencie suas operações financeiras.",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.className} dark antialiased`}>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
