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
        <div className="card-body grow-0 p-4 sm:p-8">
          <div className="flex">
            <label
              htmlFor="my-drawer"
              className="btn btn-square btn-ghost drawer-button lg:hidden"
            >
              <svg
                data-src="https://unpkg.com/heroicons/20/solid/bars-3.svg"
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
                data-id="svg-loader_1"
              >
                <path
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </label>
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
