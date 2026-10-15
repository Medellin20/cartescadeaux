"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Refresher({ seconds = 4, max = 15 }) {
  const router = useRouter();
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => { if (++n > max) clearInterval(t); else router.refresh(); }, seconds * 1000);
    return () => clearInterval(t);
  }, [router, seconds, max]);
  return null;
}
