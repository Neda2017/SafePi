"use client";

import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

type SuspiciousLink = {
  id: string;
  url: string;
  type: string;
  addedBy?: string;
  timestamp?: number;
};

export default function AdminDashboard() {
  const [links, setLinks] = useState<SuspiciousLink[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState("suspicious");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      const querySnapshot = await getDocs(collection(db, "suspicious_links"));

      const data: SuspiciousLink[] = querySnapshot.docs.map((d) => {
        const docData = d.data() as Omit<SuspiciousLink, "id">;
        return {
          id: d.id,
          ...docData,
        };
      });

      setLinks(data);
      setLoading(false);
    };

    fetchLinks();
  }, []);

  const addLink = async () => {
    if (!newUrl.trim()) return;

    const timestamp = Date.now();

    const docRef = await addDoc(collection(db, "suspicious_links"), {
      url: newUrl,
      type: newType,
      timestamp,
      addedBy: "Bill",
    });

    const newLink: SuspiciousLink = {
      id: docRef.id,
      url: newUrl,
      type: newType,
      addedBy: "Bill",
      timestamp,
    };

    setLinks((prev) => [...prev, newLink]);
    setNewUrl("");
  };

  const deleteLink = async (id: string) => {
    await deleteDoc(doc(db, "suspicious_links", id));
    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  if (loading) {
    return <p>Loading admin dashboard...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Safeπ Admin Dashboard</h1>

      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl mb-2">Add Suspicious URL</h2>

        <input
          type="text"
          className="border p-2 w-full mb-2"
          placeholder="https://example.com"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />

        <select
          className="border p-2 w-full mb-2"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        >
          <option value="suspicious">Suspicious</option>
          <option value="phishing">Phishing</option>
          <option value="fakePiApp">Fake Pi App</option>
        </select>

        <button
          onClick={addLink}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add URL
        </button>
      </div>

      <h2 className="text-xl mb-3">Existing Suspicious Links</h2>

      {links.length === 0 ? (
        <p>No suspicious links yet.</p>
      ) : (
        <ul className="space-y-3">
          {links.map((link) => (
            <li
              key={link.id}
              className="p-3 border rounded-lg flex justify-between"
            >
              <div>
                <p className="font-medium break-all">{link.url}</p>
                <p className="text-sm text-gray-500">
                  {link.type}
                  {link.addedBy ? ` • added by ${link.addedBy}` : ""}
                </p>
              </div>

              <button
                onClick={() => deleteLink(link.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
