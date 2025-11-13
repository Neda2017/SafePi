export function mountPayments(app) {
    app.post("/payments/complete", async (req, res) => {
        try {
            const body = req.body || {};
            return res.status(200).json({ ok: true, message: "Payment recorded", received: body });
        }
        catch (err) {
            return res.status(500).json({ ok: false, error: err?.message || "error" });
        }
    });
}
