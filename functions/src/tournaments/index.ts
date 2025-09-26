// functions/src/index.ts

import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

// Initialize the Firebase Admin SDK
initializeApp();

export const getAllTournaments = onCall(async (request) => {
  // 1. Check if the user is authenticated.
  if (!request.auth) {
    logger.warn("Unauthenticated user tried to fetch tournaments.");
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to view tournaments.",
    );
  }

  const uid = request.auth.uid;
  logger.info(`User ${uid} is fetching all tournaments.`);

  try {
    // 2. Get a reference to the Firestore database.
    const db = getFirestore();
    const tournamentsRef = db.collection("tournaments");
    const snapshot = await tournamentsRef.get();

    // 3. Check if the collection is empty.
    if (snapshot.empty) {
      logger.info("No tournaments found.");
      return []; // Return an empty array if no documents exist.
    }

    // 4. Map the documents to an array of data.
    const tournaments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return tournaments;
  } catch (error) {
    logger.error("Error fetching tournaments:", error);
    throw new HttpsError(
      "internal",
      "An error occurred while fetching tournaments.",
    );
  }
});

export const addTournament = onCall(async (request) => {
  // 1. Check if the user is authenticated.
  if (!request.auth) {
    logger.warn("Unauthenticated user tried to add a tournament.");
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to add a tournament.",
    );
  }

  const uid = request.auth.uid;
  logger.info(`User ${uid} is adding a new tournament.`);

  // 2. Validate input data.
  const { name, game } = request.data;
  if (typeof name !== "string" || typeof game !== "string") {
    logger.warn("Invalid input data:", request.data);
    throw new HttpsError(
      "invalid-argument",
      "The function must be called with two string arguments: 'name' and 'game'.",
    );
  }

  try {
    // 3. Get a reference to the Firestore database.
    const db = getFirestore();
    const tournamentsRef = db.collection("tournaments");

    // 4. Create a new tournament document.
    const newTournament = {
      name,
      game,
      createdBy: uid,
      createdAt: new Date().toISOString(),
    };

    const docRef = await tournamentsRef.add(newTournament);
    logger.info(`Tournament ${docRef.id} added by user ${uid}.`);

    // 5. Return the newly created tournament with its ID.
    return { id: docRef.id, ...newTournament };
  } catch (error) {
    logger.error("Error adding tournament:", error);
    throw new HttpsError(
      "internal",
      "An error occurred while adding the tournament.",
    );
  }
});
