import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getLastTransactions = async (month: string) => {
   const { userId } = await auth();
   if (!userId) {
      throw new Error("Unauthorized");
   }

   const where = {
      userId,
      date: {
         gte: new Date(`2024-${month}-01`),
         lt: new Date(`2024-${month}-31`),
      },
   };

   return await db.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      take: 5,
   });
};
