import { createPayment } from "@/lib/api";

async function handlePayment() {
  try {
    const data = await createPayment({ /* whatever payload you send */ });
    console.log("Payment created:", data);
  } catch (err) {
    console.error(err);
  }
}
