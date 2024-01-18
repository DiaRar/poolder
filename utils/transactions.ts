import { cookies } from "next/headers";
import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";
import { Transaction } from "./types";

export async function deleteTransaction(transactionId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("Transactions")
    .delete()
    .match({ id: transactionId });
  if (error) {
    throw error;
  }
  revalidatePath("/dashboard/", "page");
  revalidatePath("/dashboard/transactions/", "page");
}

export async function addTransaction(transaction: {
  title: string;
  description: string;
  value: number;
  created_at?: string;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("Transactions")
    .insert([
      {
        title: transaction.title,
        description: transaction.description,
        value: transaction.value,
        // if no date is provided dont add it
        ...(transaction.created_at && { created_at: transaction.created_at }),
      },
    ])
    .select("*");
  if (error) {
    throw error;
  }
  if (!data) throw new Error("No data returned from supabase");
  revalidatePath("/dashboard/", "page");
  revalidatePath("/dashboard/transactions/", "page");
  return data[0];
}

export async function updateTransaction(transaction: Transaction) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("Transactions")
    .update({
      title: transaction.title,
      description: transaction.description,
      value: transaction.value,
      created_at: transaction.created_at,
    })
    .match({ id: transaction.id });
  if (error) {
    throw error;
  }
  revalidatePath("/dashboard/", "page");
  revalidatePath("/dashboard/transactions/", "page");
}
