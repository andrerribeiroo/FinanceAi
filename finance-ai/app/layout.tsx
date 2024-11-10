import type { Metadata } from "next";
import "./globals.css";
import { Mulish } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ptBR } from "@clerk/localizations";

export const metadata: Metadata = {
   title: "Create Next App",
   description: "Generated by create next app",
};

const mulish = Mulish({
   subsets: ["latin-ext"],
});

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={`${mulish.className} antialiasedt dark`}>
            <ClerkProvider
               localization={ptBR}
               appearance={{
                  baseTheme: dark,
               }}
            >
               <div className="flex h-full flex-col overflow-hidden">
                  {children}
               </div>
            </ClerkProvider>
         </body>
      </html>
   );
}
