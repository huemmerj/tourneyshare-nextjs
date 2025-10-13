// write post method to /api/login with idToken in body
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { app as firebaseAdminApp } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    const auth = getAuth(firebaseAdminApp);
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn / 1000,
    });
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
