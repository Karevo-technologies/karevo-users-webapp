import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Download04Icon,
  Cancel01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons";
import logo from "../../assets/logo.png";

/** The `beforeinstallprompt` event isn't in the standard DOM lib types. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "karevo-install-dismissed";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * A branded prompt to install Karevo as an app. Uses the native install flow
 * on Chrome/Edge/Android; on iOS Safari (which has no install API) it shows
 * the Add-to-Home-Screen steps instead. Dismissal is remembered.
 */
export function InstallBanner() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Already installed, or dismissed before — stay out of the way entirely.
    if (isStandalone() || localStorage.getItem(DISMISS_KEY) === "1") return;

    // Reveal after paint so we never hydrate a banner the server didn't render.
    const raf = requestAnimationFrame(() => {
      setHidden(false);
      // iOS can't fire beforeinstallprompt, so offer manual steps there.
      if (isIos()) setIosHint(true);
    });

    const onPrompt = (e: Event) => {
      e.preventDefault(); // stop the mini-infobar; we show our own UI
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setPromptEvent(null);
      setIosHint(false);
      setHidden(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const close = () => {
    setHidden(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // private mode / storage disabled — dismiss for this session only
    }
  };

  const install = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  };

  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-md items-center gap-3 rounded-3xl border border-cloud bg-paper/95 p-3 pr-2 shadow-[0_20px_50px_-24px_rgba(52,82,217,0.5)] backdrop-blur-lg sm:bottom-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900">
        <img
          src={logo}
          alt="Karevo"
          className="h-full w-full object-contain p-0.5"
        />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">Install Karevo</p>
        <p className="mt-0.5 text-xs text-ink-soft">
          {iosHint && !promptEvent
            ? "Tap Share, then Add to Home Screen"
            : "Add to your home screen for quick access."}
        </p>
      </div>

      <button
        type="button"
        onClick={promptEvent ? install : close}
        className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-blue-600 px-4 text-[13px] font-semibold text-white transition-colors duration-300 hover:bg-blue-700"
      >
        <HugeiconsIcon
          icon={promptEvent ? Download04Icon : ArrowUp01Icon}
          size={15}
        />
        {promptEvent ? "Install" : "Add to Home Screen"}
      </button>

      <button
        type="button"
        onClick={close}
        aria-label="Dismiss"
        className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-ink-soft transition-colors duration-300 hover:bg-cloud hover:text-ink"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={16} />
      </button>
    </div>
  );
}
