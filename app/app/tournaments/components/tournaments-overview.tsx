import { getAuthUser } from "@/lib/auth";
import { getFirestore } from "firebase-admin/firestore";
import React from "react";

export async function TournamentsOverview() {
  const user = await getAuthUser();

  if (!user) {
    return <div>Please log in to view tournaments</div>;
  }

  const db = getFirestore();
  const tournamentsRef = db.collection("tournaments");
  const snapshot = await tournamentsRef.get();

  const tournaments = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return <div>Tournaments Overview: {tournaments.length} tournaments</div>;
}
