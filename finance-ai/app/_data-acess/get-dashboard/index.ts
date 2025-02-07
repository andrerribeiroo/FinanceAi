import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./type";
import { auth } from "@clerk/nextjs/server";

export const getDashboard = async (month: string) => {
   const { userId } = auth();
   if (!userId) {
      throw new Error("Unauthorized");
   }

   const where = {
      userId,
      date: {
         gte: new Date(`2025-${month}-01`),
         lt: new Date(`2025-${month}-31`),
      },
   };

   const depositTotal = (
      await db.transaction.aggregate({
         where: { ...where, type: "DEPOSIT" },
         _sum: { amount: true },
      })
   )._sum.amount;

   const investmentTotal = (
      await db.transaction.aggregate({
         where: { ...where, type: "INVESTMENT" },
         _sum: { amount: true },
      })
   )._sum.amount;

   const expensesTotal = (
      await db.transaction.aggregate({
         where: { ...where, type: "EXPENSE" },
         _sum: { amount: true },
      })
   )._sum.amount;

   const balance =
      Number(depositTotal) - Number(investmentTotal) - Number(expensesTotal);

   const transactionsTotal = Number(
      (
         await db.transaction.aggregate({
            where,
            _sum: { amount: true },
         })
      )._sum.amount,
   );
   const typesPercentage: TransactionPercentagePerType = {
      [TransactionType.DEPOSIT]: Math.round(
         (Number(depositTotal || 0) / Number(transactionsTotal)) * 100,
      ),
      [TransactionType.EXPENSE]: Math.round(
         (Number(expensesTotal || 0) / Number(transactionsTotal)) * 100,
      ),
      [TransactionType.INVESTMENT]: Math.round(
         (Number(investmentTotal || 0) / Number(transactionsTotal)) * 100,
      ),
   };

   const totalExpensePerCategory: TotalExpensePerCategory[] = (
      await db.transaction.groupBy({
         by: ["category"],
         where: {
            ...where,
            type: TransactionType.EXPENSE,
         },
         _sum: {
            amount: true,
         },
      })
   ).map((category) => ({
      category: category.category,
      totalAmount: Number(category._sum.amount),
      percentageOfTotal: Math.round(
         (Number(category._sum.amount) / Number(expensesTotal)) * 100,
      ),
   }));

   return {
      balance,
      depositTotal: Number(depositTotal),
      investmentTotal: Number(investmentTotal),
      expensesTotal: Number(expensesTotal),
      typesPercentage,
      totalExpensePerCategory,
   };
};
