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
    <div
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-2xl border bg-white p-6 shadow-lg dark:bg-[#141927]",
        className,
      )}
      {...props}
    >
      {children}
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
