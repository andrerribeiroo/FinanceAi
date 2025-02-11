"use client";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { BotIcon, Loader2Icon, CreditCardIcon } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import { ScrollArea } from "@/app/_components/ui/scroll-area";

interface AiReportButtonProps {
  month: string;
}

const AiReportButton = ({ month }: AiReportButtonProps) => {
  const [report, setReport] = useState<string | null>(null);
  const [reportIsLoading, setReportIsLoading] = useState(false);
  
  const handleGenerateReportClick = async () => {
    try {
      setReportIsLoading(true);
      // Simulação da geração de relatório IA
      setTimeout(() => {
        setReport("Relatório gerado com sucesso!");
        setReportIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setReportIsLoading(false);
    }
  };
  
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost">
            Relatório IA
            <BotIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Relatório IA</DialogTitle>
            <DialogDescription>
              Use a inteligência artificial para gerar um relatório com insights sobre suas finanças
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="prose prose-h3:text-white prose-h4:text-white prose-strong:text-white max-h-[450px] text-white">
            <Markdown>{report}</Markdown>
          </ScrollArea>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleGenerateReportClick} disabled={reportIsLoading}>
              {reportIsLoading && <Loader2Icon className="animate-spin" />} Gerar relatório
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Botão para integrar Mercado Pago */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" style={{ color: "black", borderColor: "#03AFED", backgroundColor: "#03AFED" }}>
            Adicionar Mercado Pago
            <CreditCardIcon className="ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Integração com Mercado Pago</DialogTitle>
            <DialogDescription>
              Conecte sua conta do Mercado Pago para gerenciar pagamentos. Deseja conectar ?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button onClick={() => alert("Integração iniciada!")} style={{backgroundColor: "#03AFED" }}>Conectar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AiReportButton;
