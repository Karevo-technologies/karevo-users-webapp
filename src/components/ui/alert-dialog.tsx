"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Minimal AlertDialog primitives.
 *
 * This project currently does not include `@radix-ui/react-alert-dialog`,
 * so we provide lightweight replacements to keep the app compiling.
 */

type CommonProps = React.HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
};

export function AlertDialog(props: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  return <>{props.children}</>;
}

export function AlertDialogTrigger(_props: any) {
  return null;
}

export function AlertDialogPortal(props: any) {
  return <>{props.children}</>;
}

export function AlertDialogClose(_props: any) {
  return null;
}

export function AlertDialogOverlay(_props: any) {
  return null;
}

export function AlertDialogContent({
  className,
  open,
  children,
  ...props
}: CommonProps & { children?: React.ReactNode }) {
  // If `open` isn't provided, default to closed to avoid modal showing on load.
  const shouldShow = open ?? false;
  if (!shouldShow) return null;

  return (
    <div
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-2xl border bg-paper p-6 shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertDialogHeader({
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

export function AlertDialogFooter({
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

export function AlertDialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <div className={cn("text-lg font-semibold", className)} {...props} />;
}

export function AlertDialogDescription({
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

export function AlertDialogAction({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function AlertDialogCancel({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-2xl border border-input bg-background px-4 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
