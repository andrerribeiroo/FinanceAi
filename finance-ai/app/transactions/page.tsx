import { DataTable } from "../_components/data-table";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import { db } from "../_lib/prisma";
import { transactionColumns } from "./_components/columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";

const TransactionsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  const transactions = await db.transaction.findMany({
    where:{
      userId,
    }
  });
  return (
    <>
    <Navbar></Navbar>
    <div className="space-y-6 overflow-hidden p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Transações</h1>
        <AddTransactionButton />
      </div>
      <ScrollArea>
        <DataTable columns={transactionColumns} data={transactions} />
      </ScrollArea>
    </div>
    </>
  );
};

export default TransactionsPage;
