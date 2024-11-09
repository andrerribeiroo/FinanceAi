import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SummuryCard from "./summry-card";
import { db } from "@/app/_lib/prisma";

interface SummaryCards {
  month?: string; // `month` agora é opcional
}

const SummaryCards = async ({ month = "01" }: SummaryCards) => {
  // Validação para garantir que `month` é um número entre "01" e "12"
  const validMonth = String(month).padStart(2, "0");
  if (!/^(0[1-9]|1[0-2])$/.test(validMonth)) {
    throw new Error("Mês inválido. O valor de `month` deve ser entre '01' e '12'.");
  }

  const startDate = new Date(`2024-${validMonth}-01`);
  const endDate = new Date(`2024-${validMonth}-31`);

  const where = {
    date: {
      gte: startDate,
      lt: endDate,
    },
  };

  const depositsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "DEPOSIT" },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0
  );
  const investmentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "INVESTMENT" },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0
  );
  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0
  );

  const balance = depositsTotal - investmentsTotal - expensesTotal;

  return (
    <div className="space-y-6">
      <SummuryCard
        icon={<WalletIcon size={16} />}
        title={"Saldo"}
        amount={balance}
        size={"large"}
      />

      <div className="grid grid-cols-3 gap-6">
        <SummuryCard
          icon={<PiggyBankIcon size={16} className="" />}
          title={"Investido"}
          amount={investmentsTotal}
          size={"small"}
        />
        <SummuryCard
          icon={<TrendingUpIcon size={16} className=" text-primary" />}
          title={"Receita"}
          amount={depositsTotal}
          size={"small"}
        />
        <SummuryCard
          icon={<TrendingDownIcon size={16} className="text-red-500" />}
          title={"Despesas"}
          amount={expensesTotal}
          size={"small"}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
