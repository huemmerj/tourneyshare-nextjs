import { getFirestore } from "firebase-admin/firestore";

export interface Tournament {
  id: string;
  name: string;
  game: string;
}

/**
 * Fetches all tournaments from Firestore
 * @returns Array of tournaments with their IDs
 */
export async function getTournaments(): Promise<Tournament[]> {
  const db = getFirestore();
  const tournamentsRef = db.collection("tournaments");
  const snapshot = await tournamentsRef.get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Tournament[];
}

/**
 * Fetches a single tournament by ID
 * @param id - Tournament ID
 * @returns Tournament data or null if not found
 */
export async function getTournamentById(
  id: string
): Promise<Tournament | null> {
  const db = getFirestore();
  const tournamentDoc = await db.collection("tournaments").doc(id).get();

  if (!tournamentDoc.exists) {
    return null;
  }

  return {
    id: tournamentDoc.id,
    ...tournamentDoc.data(),
  } as Tournament;
}

/**
 * Creates a new tournament
 * @param data - Tournament data
 * @returns Created tournament with ID
 */
export async function createTournament(
  data: Omit<Tournament, "id">
): Promise<Tournament> {
  const db = getFirestore();
  const docRef = await db.collection("tournaments").add(data);

  return {
    id: docRef.id,
    ...data,
  };
}

/**
 * Updates an existing tournament
 * @param id - Tournament ID
 * @param data - Partial tournament data to update
 */
export async function updateTournament(
  id: string,
  data: Partial<Omit<Tournament, "id">>
): Promise<void> {
  const db = getFirestore();
  await db.collection("tournaments").doc(id).update(data);
}

/**
 * Deletes a tournament
 * @param id - Tournament ID
 */
export async function deleteTournament(id: string): Promise<void> {
  const db = getFirestore();
  await db.collection("tournaments").doc(id).delete();
}
