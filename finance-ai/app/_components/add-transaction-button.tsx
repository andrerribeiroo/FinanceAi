"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

import { useState } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";

const AddTransactionButton = () => {
   const [dialogIsOpen, setDialogIsOpen] = useState(false);

   return (
      <Dialog
         open={dialogIsOpen}
         onOpenChange={(open) => {
            setDialogIsOpen(open);
         }}
      >
         <DialogTrigger asChild>
            <Button className="rounded-full font-bold">
               Adicionar transações
               <ArrowDownUpIcon />
            </Button>
         </DialogTrigger>

         <UpsertTransactionDialog setDialogIsOpen={setDialogIsOpen} />
      </Dialog>
   );
};

export default AddTransactionButton;
