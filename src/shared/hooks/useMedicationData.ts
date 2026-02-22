import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import DOMPurify from "isomorphic-dompurify";
// import { db } from "@/src/config/firebase";

export function useMedicationData(userId: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      // const q = query(collection(db, "medicationLogs"), where("userId", "==", userId), orderBy("date", "desc"));
      // const snap = await getDocs(q);
      // const sanitized = snap.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data(),
      //   // Sanitizing name before it reaches the UI
      //   medicationName: DOMPurify.sanitize(doc.data().medicationName || "")
      // }));
      // setData(sanitized);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [userId]);
  return { data, loading, refetch: fetchLogs };
}