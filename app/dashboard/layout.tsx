"use server";
import Link from "next/link";
import "./sidebar.css";
import LinkItem from "@/components/linkItem.component";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full min-w-full drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle"></input>
      <aside className="drawer-side z-10">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="w-custom h-full menu pt-5 p-2 bg-base-100 gap-2">
          <li>
            <LinkItem href="/dashboard">
              <svg
                data-src="https://unpkg.com/heroicons/20/solid/home.svg"
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
                data-id="svg-loader_10"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>Dashboard</span>
            </LinkItem>
          </li>
          <li>
            <LinkItem href="/dashboard/transactions">
              <svg
                data-src="https://unpkg.com/heroicons/20/solid/credit-card.svg"
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
                data-id="svg-loader_13"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 4A1.5 1.5 0 0 0 1 5.5V6h18v-.5A1.5 1.5 0 0 0 17.5 4h-15ZM19 8.5H1v6A1.5 1.5 0 0 0 2.5 16h15a1.5 1.5 0 0 0 1.5-1.5v-6ZM3 13.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm4.75-.75a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Transactions
            </LinkItem>
          </li>
        </ul>
      </aside>
      <div className="drawer-content grid grid-cols-6 grid-rows-[min-content] gap-12 p-5 bg-base-200 lg:p-10 ">
        {children}
      </div>
    </div>
  );
}
