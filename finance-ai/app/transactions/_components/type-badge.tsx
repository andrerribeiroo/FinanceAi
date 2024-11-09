import { Badge } from "@/app/_components/ui/badge";
import { TransactionType } from "@prisma/client";
import { CircleIcon } from "lucide-react";

interface TransactionTypeBadgeProps {
  transactionType: TransactionType;
}

const TransactionTypeBadge = ({
  transactionType,
}: TransactionTypeBadgeProps) => {
  if (transactionType === TransactionType.DEPOSIT) {
    return (
      <Badge className="bg-primary/10 font-bold text-primary">
        <CircleIcon className="mr-2 fill-primary" size={10} />
        Depósito
      </Badge>
    );
  }
  if (transactionType === TransactionType.EXPENSE) {
    return (
      <Badge className="font bold bg-danger/10 text-danger hover:bg-danger/20">
        <CircleIcon className="mr-2 fill-danger" size={10} />
        Despesa
      </Badge>
    );
  }
  return (
    <Badge className="font bold bg-white/10 text-white">
      <CircleIcon className="mr-2 fill-white" size={10} />
      Investimento
    </Badge>
  );
};

export default TransactionTypeBadge;
