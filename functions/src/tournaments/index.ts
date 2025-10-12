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
  if (!name || typeof name !== "string" || !game || typeof game !== "string") {
    logger.warn("Invalid input data:", request.data);
    throw new HttpsError(
      "invalid-argument",
      "The function must be called with two non-empty string arguments: 'name' and 'game'.",
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

export const deleteTournament = onCall(async (request) => {
  // 1. Check for authentication
  if (!request.auth) {
    logger.error("User is not authenticated for deletion.");
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to delete a tournament.",
    );
  }

  // 2. Validate the incoming tournament ID
  const tournamentId = request.data.id;
  if (!tournamentId || typeof tournamentId !== "string") {
    logger.error("Invalid tournamentId for deletion:", tournamentId);
    throw new HttpsError(
      "invalid-argument",
      "A valid tournament ID must be provided.",
    );
  }

  // 3. Delete the document from Firestore
  try {
    const db = getFirestore();
    await db.collection("tournaments").doc(tournamentId).delete();
    logger.info(`Successfully deleted tournament: ${tournamentId}`);

    // 4. Return a success message
    return { success: true, message: "Tournament deleted." };
  } catch (error) {
    logger.error("Error deleting document: ", error);
    throw new HttpsError("internal", "Could not delete the tournament.");
  }
});

export const getTournamentById = onCall(async (request) => {
  // 1. Check if the user is authenticated.
  if (!request.auth) {
    logger.warn("Unauthenticated user tried to fetch a tournament.");
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to view a tournament.",
    );
  }

  const uid = request.auth.uid;
  const tournamentId = request.data.id;

  // 2. Validate the tournament ID.
  if (!tournamentId || typeof tournamentId !== "string") {
    logger.warn("Invalid tournament ID:", tournamentId);
    throw new HttpsError(
      "invalid-argument",
      "A valid tournament ID must be provided.",
    );
  }

  logger.info(`User ${uid} is fetching tournament ${tournamentId}.`);

  try {
    // 3. Get a reference to the Firestore database. with all teams
    const db = getFirestore();
    const docRef = db.collection("tournaments").doc(tournamentId);
    const doc = await docRef.get();

    // 4. Check if the document exists.
    if (!doc.exists) {
      logger.info(`Tournament ${tournamentId} not found.`);
      throw new HttpsError("not-found", "Tournament not found.");
    }

    // 5. Return the tournament data.
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    logger.error("Error fetching tournament:", error);
    throw new HttpsError(
      "internal",
      "An error occurred while fetching the tournament.",
    );
  }
});

export const addTeamToTournament = onCall(async (request) => {
  // 1. Check if the user is authenticated.
  if (!request.auth) {
    logger.warn("Unauthenticated user tried to add a team.");
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to add a team.",
    );
  }

  const uid = request.auth.uid;
  const { tournamentId, teamName } = request.data;

  // 2. Validate input data.
  if (
    !tournamentId ||
    typeof tournamentId !== "string" ||
    !teamName ||
    typeof teamName !== "string"
  ) {
    logger.warn("Invalid input data:", request.data);
    throw new HttpsError(
      "invalid-argument",
      "The function must be called with two non-empty string arguments: 'tournamentId' and 'teamName'.",
    );
  }

  logger.info(`User ${uid} is adding a team to tournament ${tournamentId}.`);

  try {
    // 3. Get a reference to the Firestore database.
    const db = getFirestore();
    const tournamentRef = db.collection("tournaments").doc(tournamentId);
    const tournamentDoc = await tournamentRef.get();

    // 4. Check if the tournament exists.
    if (!tournamentDoc.exists) {
      logger.warn(`Tournament ${tournamentId} not found.`);
      throw new HttpsError("not-found", "Tournament not found.");
    }

    // 5. Create a new team object.
    const newTeam = {
      id: db.collection("tournaments").doc().id, // Generate a new ID
      name: teamName,
      players: 0, // Initial player count
    };

    // 6. Add the new team to the tournament's teams array.
    await tournamentRef.update({
      teams: [...(tournamentDoc.data()?.teams || []), newTeam],
    });

    logger.info(
      `Team ${newTeam.id} added to tournament ${tournamentId} by user ${uid}.`,
    );

    // 7. Return the newly added team.
    return newTeam;
  } catch (error) {
    logger.error("Error adding team to tournament:", error);
    throw new HttpsError(
      "internal",
      "An error occurred while adding the team to the tournament.",
    );
  }
});

const addPlayerToTeam = onCall(async (request) => {
  // 1. Check if the user is authenticated.
  if (!request.auth) {
    logger.warn("Unauthenticated user tried to add a player.");
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to add a player.",
    );
  }

  const uid = request.auth.uid;
  const { tournamentId, teamId, playerName } = request.data;
  // 2. Validate input data.
  if (
    !tournamentId ||
    typeof tournamentId !== "string" ||
    !teamId ||
    typeof teamId !== "string" ||
    !playerName ||
    typeof playerName !== "string"
  ) {
    logger.warn("Invalid input data:", request.data);
    throw new HttpsError(
      "invalid-argument",
      "The function must be called with three non-empty string arguments: 'tournamentId', 'teamId', and 'playerName'.",
    );
  }

  logger.info(
    `User ${uid} is adding player ${playerName} to team ${teamId} in tournament ${tournamentId}.`,
  );

  try {
    // 3. Get a reference to the Firestore database.
    const db = getFirestore();
    const tournamentRef = db.collection("tournaments").doc(tournamentId);
    const tournamentDoc = await tournamentRef.get();

    // 4. Check if the tournament exists.
    if (!tournamentDoc.exists) {
      logger.warn(`Tournament ${tournamentId} not found.`);
      throw new HttpsError("not-found", "Tournament not found.");
    }

    // 5. Find the team within the tournament.
    const team = tournamentDoc
      .data()
      ?.teams.find((t: { id: string }) => t.id === teamId);
    if (!team) {
      logger.warn(`Team ${teamId} not found in tournament ${tournamentId}.`);
      throw new HttpsError("not-found", "Team not found.");
    }

    // 6. Add the player to the team's players array.
    team.players.push({
      id: db.collection("players").doc().id,
      name: playerName,
    });
    await tournamentRef.update({ teams: tournamentDoc.data()?.teams });

    logger.info(
      `Player ${playerName} added to team ${teamId} in tournament ${tournamentId} by user ${uid}.`,
    );

    // 7. Return the updated team.
    return team;
  } catch (error) {
    logger.error("Error adding player to team:", error);
    throw new HttpsError(
      "internal",
      "An error occurred while adding the player to the team.",
    );
  }
});
export { addPlayerToTeam };
