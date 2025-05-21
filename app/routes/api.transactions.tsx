import { PrismaClient } from '@prisma/client';
import type { Route } from "./+types/api.transactions";

const prisma = new PrismaClient();

export async function loader({}: Route.LoaderArgs) {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
    });
    return Response.json(transactions);
  } catch (error) {
    return new Response('Failed to fetch transactions', { status: 500 });
  }
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const data = await request.json();
    const transaction = await prisma.transaction.create({
      data: {
        amount: data.amount,
        description: data.description,
        category: data.category,
        type: data.type,
      },
    });
    return Response.json(transaction);
  } catch (error) {
    return new Response('Failed to create transaction', { status: 500 });
  }
}