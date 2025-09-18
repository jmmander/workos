export function formatJoined(dateIso: string) {
  const d = new Date(dateIso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
