import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function fetchSuspiciousLinks() {
  const snapshot = await getDocs(collection(db, "suspicious_links"));

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      url: data.url,
      type: data.type || "unknown",
      description: data.description || "Added manually",
      severity: "high",
      reports: 0,
      lastReported: "now",
    };
  });
}
