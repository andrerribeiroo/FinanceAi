"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/app/_lib/prisma";
import { OpenAI } from "openai";
import { CopyPlus } from "lucide-react";
import { GenerateAiReportSchema, generateAiReportSchema } from "./shema";

export const generateAiReport = async ({ month }: GenerateAiReportSchema) => {
  generateAiReportSchema.parse({month})
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User is not authenticated");
  }
  const user = await clerkClient().users.getUser(userId);
  const hasPremiumPlan = user.publicMetadata.subscription === "premium";
  if (!hasPremiumPlan) {
    throw new Error("User does not have a premium plan");
  }

  const openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: new Date(`${month}-01`),
        lt: new Date(`${month}-31`),
      },
    },
  });

  const content = `Gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira. As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{TIPO}- {VALOR}-{CATEGORIA). São elas:
    ${transactions
      .map(
        (transaction) =>
          `${transaction.date.toLocaleDateString("pt-BR")}-R$${transaction.amount}-${transaction.type}-${transaction.category}`,
      )
      .join(";")}`;
  const completion = await openAi.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Você é um especialista em gestão e organização de finanças pessoais. Voçê ajuda as pessoas a organizarem mulhor as suas finanças."
      },
      {
        role: "user",
        content,
      }
    ],
  });
  return completion.choices[0].message.content
};
