"use client";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  target,
  children,
}: {
  href: string;
  target?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      target={target}
      className={clsx(
        "inline-block rounded-lg py-1 px-2 text-sm text-foreground-light dark:text-foreground-dark hover:text-primary dark:hover:text-primary-dark",
        pathname === href
      )}
    >
      {children}
    </Link>
  );
}
