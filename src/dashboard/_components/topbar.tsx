"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BellIcon,
  UserIcon,
  Setting07Icon,
  Logout03Icon,
  CheckmarkBadge01Icon,
  Calendar02Icon,
  LockIcon,
  FileValidationIcon,
} from "@hugeicons/core-free-icons";
import ThemeToggle from "./themetoggle";
import { useAuth } from "../../context/AuthContext";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  icon: typeof BellIcon;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "New consent request",
    body: "Lagos University Teaching Hospital requested access to your lab results.",
    time: "2h ago",
    unread: true,
    icon: FileValidationIcon,
  },
  {
    id: "n2",
    title: "Consent expiring soon",
    body: "Wellu Diagnostics access expires in 5 days.",
    time: "1d ago",
    unread: true,
    icon: Calendar02Icon,
  },
  {
    id: "n3",
    title: "PIN updated",
    body: "Your security PIN was changed successfully.",
    time: "3d ago",
    unread: false,
    icon: LockIcon,
  },
  {
    id: "n4",
    title: "Identity verified",
    body: "Your National ID was verified successfully.",
    time: "1w ago",
    unread: false,
    icon: CheckmarkBadge01Icon,
  },
];

export default function TopBar({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [notifsOpen, setNotifsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  const notifsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setNotifsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-cloud bg-paper/70 px-4 backdrop-blur lg:px-6">
      <div>
        <h1 className="text-lg font-semibold text-ink">{title}</h1>
        {subtitle && <p className="text-xs text-ink-soft">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications bell + dropdown */}
        <div className="relative" ref={notifsRef} data-tour="notifications">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setNotifsOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-cloud bg-paper/30 text-ink-soft transition-colors hover:bg-paper/50"
          >
            <HugeiconsIcon icon={BellIcon} size={18} strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifsOpen && (
            <div className="absolute right-0 mt-2 w-[320px] overflow-hidden rounded-2xl border border-cloud bg-white shadow-xl dark:bg-[#141927]">
              <div className="flex items-center justify-between border-b border-cloud px-4 py-3">
                <span className="text-[13px] font-semibold text-ink">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-[11.5px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-8 text-center text-[12.5px] text-ink-soft">
                    You're all caught up.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex gap-3 border-b border-cloud/60 px-4 py-3 last:border-b-0 ${
                        n.unread ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                        <HugeiconsIcon icon={n.icon} size={15} strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[12.5px] font-semibold text-ink">
                            {n.title}
                          </p>
                          {n.unread && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-ink-soft">
                          {n.body}
                        </p>
                        <p className="mt-1 text-[10.5px] text-ink-soft/70">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div data-tour="theme">
          <ThemeToggle />
        </div>

        {/* Profile avatar + dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            aria-label="Profile menu"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifsOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-cloud bg-paper/30 text-ink-soft transition-colors hover:bg-paper/50"
          >
            <span className="text-sm font-semibold">{initial}</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-[240px] overflow-hidden rounded-2xl border border-cloud bg-white shadow-xl dark:bg-[#141927]">
              <div className="border-b border-cloud px-4 py-3">
                <p className="truncate text-[13.5px] font-semibold text-ink">
                  {user?.name ?? "User"}
                </p>
                <p className="truncate text-[11.5px] text-ink-soft">
                  {user?.email ?? ""}
                </p>
              </div>
              <div className="py-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/dashboard/profile");
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-ink transition-colors hover:bg-paper/60"
                >
                  <HugeiconsIcon icon={UserIcon} size={16} strokeWidth={1.75} />
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/dashboard/settings");
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-ink transition-colors hover:bg-paper/60"
                >
                  <HugeiconsIcon icon={Setting07Icon} size={16} strokeWidth={1.75} />
                  Settings
                </button>
              </div>
              <div className="border-t border-cloud py-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                    navigate("/login");
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <HugeiconsIcon icon={Logout03Icon} size={16} strokeWidth={1.75} />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

