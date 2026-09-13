import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileValidationIcon,
  Home01Icon,
  MedicalFileIcon,
  Setting07Icon,
} from "@hugeicons/core-free-icons";
import logoMark from "../../assets/logo-mark.png";

import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", href: "/dashboard/home", icon: Home01Icon },
  {
    label: "Records",
    href: "/dashboard/records",
    icon: MedicalFileIcon,
  },
  {
    label: "Consents",
    href: "/dashboard/consents",
    icon: FileValidationIcon,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Setting07Icon,
  },
];

function isPathActive(pathname: string, href: string) {
  // The dashboard index (no trailing path) maps to Home.
  if (href === "/dashboard/home") {
    return (
      pathname === "/dashboard" ||
      pathname === "/dashboard/" ||
      pathname.startsWith("/dashboard/home")
    );
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <>
      {/* Desktop / tablet-landscape rail */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-cloud bg-paper lg:flex">
        {/* Branding header */}
        <div className="flex h-16 shrink-0 items-center gap-2 px-5">
          <img src={logoMark} alt="" className="h-7 w-7 shrink-0 object-contain" />
          <span className="kv-display text-lg font-bold text-ink">Karevo</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-2" data-tour="nav">
          {navItems.map((item) => {
            const isActive = isPathActive(pathname ?? "", item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors " +
                  (isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                    : "text-ink-soft hover:bg-paper/70 hover:text-ink")
                }
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={20}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile / tablet-portrait bottom bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex rounded-t-3xl border-t border-cloud bg-paper/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        data-tour="menu"
      >
        {navItems.map((item) => {
          const isActive = isPathActive(pathname ?? "", item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-11 font-semibold transition-colors"
            >
              <span
                className={
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-colors " +
                  (isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    : "text-ink-soft")
                }
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={20}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
              </span>
              <span className={isActive ? "text-blue-600 dark:text-blue-400" : "text-ink-soft"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

