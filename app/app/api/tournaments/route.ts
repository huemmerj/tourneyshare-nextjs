import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { app as firebaseAdminApp } from "@/lib/firebase-admin";
import { getTournaments, createTournament } from "@/lib/tournaments";

// Helper function to verify session cookie in API routes
async function verifySession(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value || "";

  if (!sessionCookie) {
    return null;
  }

  try {
    const auth = getAuth(firebaseAdminApp);
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

// GET /api/tournaments - Get all tournaments
export async function GET(request: NextRequest) {
  const user = await verifySession(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  try {
    const tournaments = await getTournaments();
    return NextResponse.json({ tournaments });
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching tournaments." },
      { status: 500 }
    );
  }
}

// POST /api/tournaments - Create a new tournament
export async function POST(request: NextRequest) {
  const user = await verifySession(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();
    console.log("Received data:", data);

    const tournament = await createTournament(data);

    return NextResponse.json({
      message: "Tournament created successfully!",
      tournament,
    });
  } catch (error) {
    console.error("Error creating tournament:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the tournament." },
      { status: 500 }
    );
  }
}
