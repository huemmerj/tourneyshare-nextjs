import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { app as firebaseAdminApp } from "@/lib/firebase-admin";
import {
  deleteTournament,
  getTournamentById,
  updateTournament,
} from "@/lib/tournaments";

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

// GET /api/tournaments/[id] - Get a single tournament
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifySession(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const tournament = await getTournamentById(id);

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ tournament });
  } catch (error) {
    console.error("Error fetching tournament:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the tournament." },
      { status: 500 }
    );
  }
}

// DELETE /api/tournaments/[id] - Delete a tournament
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifySession(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Tournament ID is required" },
        { status: 400 }
      );
    }

    await deleteTournament(id);

    return NextResponse.json({ message: "Tournament deleted successfully!" });
  } catch (error) {
    console.error("Error deleting tournament:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the tournament." },
      { status: 500 }
    );
  }
}

// PATCH /api/tournaments/[id] - Update a tournament
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifySession(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const data = await request.json();

    await updateTournament(id, data);

    return NextResponse.json({ message: "Tournament updated successfully!" });
  } catch (error) {
    console.error("Error updating tournament:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the tournament." },
      { status: 500 }
    );
  }
}
