"use client";
import FormControl from "@/components/formcontrol.component";
import Modal from "@/components/modal.component";
import { Transaction } from "@/utils/types";
import "./table.css";
import { useState } from "react";

// NOTE: This could be highly optimized by using a minheap. Unfortunately, I don't have time to implement that right now.

export default function Table({
  tableData,
}: {
  tableData: Transaction[] | undefined;
}) {
  async function onClickDelete(e: any, id: string) {
    e.preventDefault();
    await fetch("/api/transactions", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    setTransactions(transactions.filter((transaction) => transaction.id != id));
  }
  async function onClickView(e: any, transaction: Transaction) {
    e.preventDefault();
    const modal = document.getElementById("view");
    const form: any = modal?.firstChild?.firstChild;
    form[0].value = transaction.title;
    form[1].value = transaction.value;
    form[2].value = transaction.description;
    form[3].value = new Date(transaction.created_at)
      .toISOString()
      .replace(/:\d\d\.[0-9.Z]+/, "");
    //@ts-ignore
    modal.showModal();
  }
  async function onClickEdit(e: any, transaction: Transaction) {
    e.preventDefault();
    const modal = document.getElementById("edit");
    const form: any = modal?.firstChild?.firstChild;
    form[0].value = transaction.title;
    form[1].value = transaction.value;
    form[2].value = transaction.description;
    form[3].value = new Date(transaction.created_at)
      .toISOString()
      // replace : followed by 2 digits followed by . followed by 3 digits followed by Z with empty string
      .replace(/:\d\d\.[0-9.Z]+/, "");
    form[4].value = transaction.id;
    //@ts-ignore
    modal.showModal();
  }
  const [transactions, setTransactions] = useState<Transaction[]>(
    tableData || []
  );
  return (
    <table className="table table-zebra max-h-custom">
      <Modal id="add">
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form: any = e.target;
            const title = form[0].value;
            const value = Number.parseInt(form[1].value);
            if (isNaN(value)) {
              alert("Invalid Value!");
              return;
            }
            const description = form[2].value;
            console.log(form[3].value);
            const created_at = form[3].value
              ? new Date(form[3].value).toISOString()
              : undefined;
            const transaction = {
              title: title,
              value: value,
              description: description,
              created_at: created_at,
            };
            try {
              const res = await fetch("/api/transactions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(transaction),
              });
              const data = await res.json();
              console.log(data);
              if (data.status == "error") {
                alert("Unknown ERROR, check logs!");
                console.log(data.message);
                return;
              }
              setTransactions(
                [data.transaction, ...transactions].sort((a, b) => {
                  return (
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                  );
                })
              );
              form.reset();
              //@ts-ignore
              document.getElementById("add")?.close();
            } catch (error) {
              alert("Unknown ERROR, check logs!");
              console.error(error);
            }
          }}
        >
          <FormControl label="Title">
            <input
              type="text"
              placeholder="Transaction Title"
              required
              className="input input-bordered w-full"
            />
          </FormControl>
          <FormControl label="Value">
            <input
              type="text"
              placeholder="Value of transaction"
              required
              className="input input-bordered w-full"
            />
          </FormControl>
          <FormControl label="Description">
            <textarea
              placeholder="Description..."
              required
              className="textarea textarea-bordered w-full"
            ></textarea>
          </FormControl>
          <FormControl label="Date ( Empty means now )">
            <input
              type="datetime-local"
              className="input input-bordered w-full"
            />
          </FormControl>
          <button type="submit" className="btn btn-primary w-full">
            Save
          </button>
        </form>
      </Modal>
      <Modal id="view">
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            //@ts-ignore
            document.getElementById("view")?.close();
          }}
        >
          <FormControl label="Title">
            <input
              type="text"
              placeholder="Transaction Title"
              disabled
              className="input input-bordered w-full"
            />
          </FormControl>
          <FormControl label="Value">
            <input
              type="text"
              placeholder="Value of transaction"
              disabled
              className="input input-bordered w-full"
            />
          </FormControl>
          <FormControl label="Description">
            <textarea
              placeholder="Description..."
              disabled
              className="textarea textarea-bordered w-full"
            ></textarea>
          </FormControl>
          <FormControl label="Date ( Empty means now )">
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              disabled
            />
          </FormControl>
          <button type="submit" className="btn btn-primary w-full">
            Close
          </button>
        </form>
      </Modal>
      <Modal id="edit">
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form: any = e.target;
            const title = form[0].value;
            const value = form[1].value;
            const description = form[2].value;
            const created_at = new Date(form[3].value).toISOString();
            const id = form[4].value;
            const transaction = {
              title: title,
              value: value,
              description: description,
              created_at: created_at,
              id: id,
            };
            try {
              const res = await fetch("/api/transactions", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(transaction),
              });
              if (res.status != 200) {
                alert("Unknown ERROR, check logs!");
                console.log(res);
                return;
              }
              // sort it by date
              setTransactions(
                transactions
                  .map((transaction) => {
                    if (transaction.id == id) {
                      return {
                        ...transaction,
                        title: title,
                        value: value,
                        description: description,
                        created_at: created_at,
                      };
                    }
                    return transaction;
                  })
                  .sort((a, b) => {
                    return (
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                    );
                  })
              );
              form.reset();
              //@ts-ignore
              document.getElementById("edit")?.close();
            } catch (error) {
              alert("Unknown ERROR, check logs!");
              console.error(error);
            }
          }}
        >
          <FormControl label="Title">
            <input
              type="text"
              placeholder="Transaction Title"
              required
              className="input input-bordered w-full"
            />
          </FormControl>
          <FormControl label="Value">
            <input
              type="text"
              placeholder="Value of transaction"
              required
              className="input input-bordered w-full"
            />
          </FormControl>
          <FormControl label="Description">
            <textarea
              placeholder="Description..."
              required
              className="textarea textarea-bordered w-full"
            ></textarea>
          </FormControl>
          <FormControl label="Date ( Empty means now )">
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              required
            />
          </FormControl>
          <input type="hidden" name="id"></input>
          <button type="submit" className="btn btn-primary w-full">
            Save
          </button>
        </form>
      </Modal>
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
          <th>Value</th>
          <th>Description</th>
          <th className="text-end">View/Edit/Delete</th>
        </tr>
      </thead>
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
            <td className="overflow-x-hidden ">
              {transaction.description.length > 40
                ? transaction.description.substring(0, 40) + "..."
                : transaction.description}
            </td>
            <td className="flex gap-2 justify-end">
              <button
                className="btn btn-square btn-outline"
                //@ts-ignore
                onClick={(e) => onClickView(e, transaction)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 576 512"
                  fill="currentColor"
                >
                  <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                </svg>
              </button>
              <button
                className="btn btn-success btn-square btn-outline"
                onClick={(e) => onClickEdit(e, transaction)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                >
                  <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
                </svg>
              </button>
              <button
                className="btn btn-error btn-square btn-outline"
                onClick={(e) => onClickDelete(e, transaction.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
