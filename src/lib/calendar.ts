import { weddingData } from "@/lib/wedding-data";

function toICSDate(iso: string): string {
  // Format: YYYYMMDDTHHMMSS (local, floating) -> use UTC Z form
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

/**
 * Generates and downloads an .ics calendar file for the wedding day.
 */
export function downloadWeddingICS() {
  const { couple, date, venues } = weddingData;
  const start = new Date(date.ceremony);
  // Assume the celebration runs ~10 hours
  const end = new Date(start.getTime() + 10 * 60 * 60 * 1000);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Abims2026//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@abims2026`,
    `DTSTAMP:${toICSDate(new Date().toISOString())}`,
    `DTSTART:${toICSDate(start.toISOString())}`,
    `DTEND:${toICSDate(end.toISOString())}`,
    `SUMMARY:${couple.shortNames} Wedding`,
    `DESCRIPTION:Join us to celebrate the wedding of ${couple.shortNames}!`,
    `LOCATION:${venues.ceremony.name}, ${venues.ceremony.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "abims2026-wedding.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
