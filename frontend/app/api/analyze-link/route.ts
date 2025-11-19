await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/scams/add`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url,
    type: category,
    description: reason,
    severity: suspicious ? "high" : "medium",
    reports: 1,
    last_reported: new Date().toISOString(),
  }),
});
