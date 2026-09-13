import { useEffect, useRef, useState } from "react";

export type ToastState = { message: string; tone: string } | null;

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  function fireToast(message: string, tone = "positive") {
    setToast({ message, tone });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 3200);
  }

  return { toast, fireToast };
}
