"use client";

import { useEffect, useState } from "react";

/**
 * Reads an optional `?to=Name` (or `?guest=Name`) query param so invitations
 * can be personalised per guest, e.g. abims2026.com/?to=The%20Johnsons
 * Returns null on the server and until mounted to avoid hydration mismatch.
 */
export function useGuestName(): string | null {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("to") || params.get("guest");
      if (raw) {
        const clean = raw.trim().slice(0, 60);
        setName(clean.length ? clean : null);
      }
    } catch {
      setName(null);
    }
  }, []);

  return name;
}
