"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChefHat, ChevronDown, CircleUserRound, LogOut } from "lucide-react";

import {
  clearSessionCookie,
  getSessionServerSnapshot,
  getSessionSnapshot,
  subscribeToSession,
} from "@/lib/auth/session";
import { useT } from "@/lib/i18n/provider";
import { clearDraft } from "@/lib/order/storage";

/** Navigation header with user menu dropdown. */
export const Navbar = () => {
  const t = useT();
  const router = useRouter();
  const username = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getSessionServerSnapshot,
  );

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /** Closes menu when clicking outside. */
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Clears session and draft, then redirects to signin. */
  const handleSignOut = () => {
    setOpen(false);
    clearSessionCookie();
    clearDraft();
    router.replace("/signin");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
        <Link
          href="/welcome"
          className="flex items-center gap-2 text-sm font-semibold text-ink"
        >
          <ChefHat className="h-5 w-5 text-brand" />
          {t("common.appName")}
        </Link>

        {username && (
          <div ref={rootRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-haspopup="menu"
              className="flex items-center gap-1.5 rounded-full py-1 pr-2 pl-1 text-sm text-ink hover:bg-brand-soft"
            >
              <CircleUserRound className="h-7 w-7 text-brand" />
              <span className="hidden sm:inline">{username}</span>
              <ChevronDown className="h-4 w-4 text-muted" />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-48 overflow-hidden rounded-md border border-line bg-white py-1 shadow-lg"
              >
                <div className="border-b border-line px-3 py-2 text-sm text-muted">
                  {t("welcome.greeting", { name: username })}
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-brand-soft"
                >
                  <LogOut className="h-4 w-4" />
                  {t("auth.signOut")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
