"use server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Table from "./table.component";
import "./table.css";

import Modal from "@/components/modal.component";
import AddButton from "./addbutton.component";
export default async function History() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("Transactions")
    .select("*")
    .order("created_at", { ascending: false });
  const transactions = data?.map((transaction) => {
    return {
      id: transaction.id,
      title: transaction.title,
      created_at: transaction.created_at,
      value: transaction.value,
      description: transaction.description,
    };
  });
  return (
    <>
      <section className="card col-span-6 overflow-hidden bg-base-100 shadow-sm row-span-3 ">
        <div className="card-body grow-0">
          <div className="flex">
            <h2 className="card-title grow">All Transactions</h2>
            <AddButton />
          </div>
        </div>
        <div className="overflow-y-auto p-1 max-h-custom">
          <Table tableData={transactions}></Table>
        </div>
      </section>
    </>
  );
}
