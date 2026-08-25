"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileValidationIcon,
  Home01Icon,
  MedicalFileIcon,
  Setting07Icon,
} from "@hugeicons/core-free-icons";
import logo from "../../assets/logo.png";

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
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-cloud bg-paper/50 lg:flex">
        <div className="mt-auto" />

        {/* Symmetrically aligned branding header frame */}
        <div className="flex h-16 items-center px-5">
          <img
            src={logo} // Replace with 'logo' if imported as 'logo' in your file framework
            alt="Karevo Logo"
            className="h-45 pt-10 w-auto object-contain"
          />
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-12 py-2" data-tour="nav">
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
                    ? "bg-blue-600 text-white"
                    : "text-ink-soft hover:bg-paper/40 hover:text-ink")
                }
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={30}
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
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-cloud bg-paper/95 backdrop-blur lg:hidden"
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
              className={
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors " +
                (isActive ? "text-blue-600" : "text-ink-soft")
              }
            >
              <HugeiconsIcon
                icon={item.icon}
                size={22}
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

