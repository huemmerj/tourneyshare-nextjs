// create get all tournaments route using firebase admin sdk
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { app as firebaseAdminApp } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    const auth = getAuth(firebaseAdminApp);
    try {
      // 2. Get a reference to the Firestore database.
      const db = getFirestore();
      const tournamentsRef = db.collection("tournaments");
      const snapshot = await tournamentsRef.get();

      // 3. Check if the collection is empty.
      if (snapshot.empty) {
        console.info("No tournaments found.");
        return NextResponse.json({ tournaments: [] });
      }

      // 4. Map the documents to an array of data.
      const tournaments = snapshot.docs.map(
        (doc: { id: any; data: () => any }) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      return NextResponse.json({ tournaments });
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      throw NextResponse.json(
        { error: "An error occurred while fetching tournaments." },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
