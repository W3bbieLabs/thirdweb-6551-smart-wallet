"use client";
import {
  Popover,
  Transition,
  PopoverButton,
  PopoverPanel,
  PopoverBackdrop,
} from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useTheme } from "next-themes";
import { darkTheme, lightTheme } from "thirdweb/react";

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  console.log(href, pathname);
  return (
    <PopoverButton
      as={Link}
      href={href}
      className={clsx(
        "block w-full p-2",
        (pathname === href || pathname.startsWith(href)) &&
          "text-primary dark:text-primary-dark"
      )}
    >
      {children}
    </PopoverButton>
  );
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0"
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0"
        )}
      />
    </svg>
  );
}

export default function MobileNavigation() {
  return (
    <Popover>
      {({ open }) => (
        <>
          <PopoverButton
            className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <MobileNavIcon open={open} />
          </PopoverButton>
          <Transition
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-150 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <PopoverBackdrop className="fixed inset-0 bg-slate-300/50" />
          </Transition>
          <Transition
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <PopoverPanel
              as="div"
              className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white dark:bg-black p-4 text-lg tracking-tight text-foreground-light dark:text-foreground-dark shadow-xl ring-1 ring-slate-900/5"
            >
              <MobileNavLink href="/">Community</MobileNavLink>
              <MobileNavLink href="/">Learn</MobileNavLink>
              <MobileNavLink href="/">My NFTs</MobileNavLink>
              <ConnectWallet/>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
}