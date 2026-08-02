"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Minimal Dialog primitives.
 *
 * Lightweight replacements for @radix-ui/react-dialog to keep the app
 * compiling without additional dependencies.
 */

export function Dialog(props: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  const shouldShow = props.open ?? false;
  if (!shouldShow) return null;
  return <>{props.children}</>;
}

export function DialogTrigger(_props: Record<string, unknown>) {
  return null;
}

export function DialogPortal(props: { children?: React.ReactNode }) {
  return <>{props.children}</>;
}

export function DialogOverlay(_props: Record<string, unknown>) {
  return null;
}

export function DialogContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassmorphism backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md dark:bg-slate-950/60"
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#141927]/90",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <div
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
