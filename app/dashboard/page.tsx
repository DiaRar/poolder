"use server";
import {
  TcLineReact as TcLine,
  TcPieReact as TcPie,
} from "@/components/chart.component";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
export default async function Dashboard() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("Transactions")
    .select("*")
    .order("created_at", { ascending: false });

  // Transactions Table
  const transactions = data?.slice(0, 5).map((transaction) => {
    return {
      id: transaction.id,
      title: transaction.title,
      created_at: transaction.created_at,
      value: transaction.value,
    };
  });

  // Pie Chart
  const positiveSum = data?.reduce((acc, transaction) => {
    if (transaction.value > 0) {
      acc += transaction.value;
    }
    return acc;
  }, 0);
  const negativeSum = data?.reduce((acc, transaction) => {
    if (transaction.value < 0) {
      acc += transaction.value;
    }
    return acc;
  }, 0);
  const totalProfit = positiveSum + negativeSum;

  // Line Chart
  const last10Days = new Date();
  last10Days.setDate(last10Days.getDate() - 10);
  const lastTransactions = data
    ?.filter((transaction) => {
      return new Date(transaction.created_at) > last10Days;
    })
    ?.reduce((acc, transaction) => {
      const date = new Date(transaction.created_at).toDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.value;
      return acc;
    }, {});
  const lastTransactionsValues = Object.values(lastTransactions) as number[];
  const lastTransactionsKeys = Object.keys(lastTransactions);
  const profit = lastTransactionsValues.reduce((acc, value) => {
    return acc + value;
  }, 0);

  return (
    <>
      <header className="col-span-6 flex items-center">
        <div className="grow">
          <h1 className="lg:text-2xl lg:font-light">Dashboard</h1>
        </div>
      </header>
      <section className="card col-span-6 overflow-hidden bg-base-100 shadow-sm xl:col-span-4 row-span-1">
        <div className="card-body grow-0">
          <h2 className="card-title">Last 5 transactions</h2>
          <Link
            className="link-hover link text-xs"
            href="/dashboard/transactions"
          >
            All transactions →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <tbody>
              {(transactions || []).map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.title}</td>
                  <td>{new Date(transaction.created_at).toLocaleString()}</td>
                  <td>
                    {transaction.value > 0 ? (
                      <svg
                        data-src="https://unpkg.com/heroicons/20/solid/arrow-up-right.svg"
                        className="inline-block h-5 w-5 text-success"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                        data-id="svg-loader_3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        data-src="https://unpkg.com/heroicons/20/solid/arrow-down-right.svg"
                        className="inline-block h-5 w-5 text-error"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                        data-id="svg-loader_6"
                      >
                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06l7.22 7.22H6.75a.75.75 0 0 0 0 1.5h7.5a.747.747 0 0 0 .75-.75v-7.5a.75.75 0 0 0-1.5 0v5.69L6.28 5.22Z"></path>
                      </svg>
                    )}
                    {transaction.value}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="card col-span-6 bg-base-100 shadow-sm xl:col-span-2">
        <div className="card-body">
          <h2 className="card-title">{totalProfit}€</h2>
          Total profit
          <div className="flex items-center  gap-10 h-full">
            <div className="grow">
              <div className="flex items-center gap-2">
                <span className="badge badge-xs bg-[#19D6BF]"></span>
                Positive
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-xs bg-[#3C37FF]"></span>
                Negative
              </div>
            </div>
            <TcPie
              className="h-40 w-40 shrink-0 [--shape-color-1:#19D6BF] [--shape-color-2:#3C37FF]"
              values={[positiveSum, -negativeSum]}
              labels={[positiveSum, negativeSum]}
              tooltip="@L€"
              shape-size="30"
              shape-gap="6"
            ></TcPie>
          </div>
        </div>
      </section>
      <section className="card col-span-6 bg-base-100 shadow-sm xl:col-span-6 row-span-12">
        <div className="card-body pb-0">
          <h2 className="card-title">{profit}€</h2>
          <p>Profit in the last 10 days</p>
        </div>
        <TcLine
          values={lastTransactionsValues.reverse()}
          labels={lastTransactionsKeys.reverse()}
          tooltip="@L - @V€"
          className="h-full w-full rounded-box  [--area-opacity:.2] [--shape-color:#A838FF]"
        ></TcLine>
      </section>
    </>
  );
}
