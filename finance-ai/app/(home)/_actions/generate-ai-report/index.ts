"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/app/_lib/prisma";
import { OpenAI } from "openai";
import { generateAiReportSchema } from "./shema";


export const generateAiReport = async ({ month }: { month: string }) => {
  // Validar entrada com o schema
  generateAiReportSchema.parse({ month });

  // Verificar se o usuário está autenticado
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Usuário não autenticado.");
  }

  // Buscar informações do usuário no Clerk
  const user = await clerkClient.users.getUser(userId);
  const hasPremiumPlan = user.publicMetadata.subscription === "premium";
  if (!hasPremiumPlan) {
    throw new Error("Usuário não possui um plano premium.");
  }

  // Configurar a API do OpenAI
  const openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Buscar transações do banco de dados
  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: new Date(`${month}-01`),
        lt: new Date(`${month}-31`),
      },
    },
  });

  // Caso não existam transações, retornar uma mensagem de erro
  if (transactions.length === 0) {
    return "Nenhuma transação encontrada para o período especificado.";
  }

  // Construir o conteúdo da mensagem para o ChatGPT
  const content = `Gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira. 
As transações estão divididas por ponto e vírgula no seguinte formato: DATA-TIPO-VALOR-CATEGORIA. 
Aqui estão minhas transações:
${transactions
  .map(
    (transaction) =>
      `${new Date(transaction.date).toLocaleDateString("pt-BR")}-${transaction.type}-R$${transaction.amount.toFixed(2)}-${transaction.category}`
  )
  .join(";")}`;

  // Enviar a mensagem para o ChatGPT
  try {
    const completion = await openAi.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em finanças pessoais e ajuda a melhorar a organização financeira das pessoas.",
        },
        {
          role: "user",
          content,
        },
      ],
    });

    // Retornar o conteúdo gerado pelo ChatGPT
    return completion.choices[0].message?.content || "Erro ao gerar o relatório.";
  } catch (error) {
    console.error("Erro ao gerar relatório AI:", error);
    throw new Error("Erro ao gerar relatório. Tente novamente mais tarde.");
  }
};
