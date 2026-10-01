export function Alert({ tone = "bad", children }: { tone?: "bad" | "ok" | "warn"; children: React.ReactNode }) {
  const cls = { bad: "bg-bad-bg text-bad", ok: "bg-ok-bg text-ok", warn: "bg-warn-bg text-warn" }[tone];
  return (
    <p role={tone === "bad" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${cls}`}>
      {children}
    </p>
  );
}
