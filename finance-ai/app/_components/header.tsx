"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
   const pathname = usePathname();

   return (
      <header className="flex items-center justify-between border-b border-solid px-8 py-4">
         <div className="flex items-center gap-10">
            <Image src="/logo.svg" alt="Finance Ai" width={173} height={39} />

            <Link
               href="/"
               className={`font-bold hover:text-primary ${
                  pathname === "/"
                     ? "font-bold text-primary"
                     : "text-muted-foreground"
               }`}
            >
               Dashboard
            </Link>
            <Link
               href="/transactions"
               className={`font-bold hover:text-primary ${
                  pathname === "/transactions"
                     ? "font-bold text-primary"
                     : "text-muted-foreground"
               }`}
            >
               Transações
            </Link>
            <Link
               href="/subscription"
               className={`font-bold hover:text-primary ${
                  pathname === "/subscription"
                     ? "font-bold text-primary"
                     : "text-muted-foreground"
               }`}
            >
               Assinaturas
            </Link>
         </div>

         <UserButton showName />
      </header>
   );
};

export default Header;
