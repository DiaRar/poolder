"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function LinkItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname == href;
  return (
    <Link
      href={href}
      className={clsx(isActive ? "active" : "", "flex items-center")}
    >
      {children}
    </Link>
  );
}
