import { getAuthUser } from "@/lib/auth";
import { getFirestore } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // response with an error
    const data = await request.json();
    console.log("Received data:", data);

    const db = getFirestore();
    const tournamentsRef = db.collection("tournaments");
    await tournamentsRef.add(data);

    return NextResponse.json({ message: "Tournament created successfully!" });
  } catch (error) {
    console.error("Error creating tournament:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the tournament." },
      { status: 500 }
    );
  }
}
