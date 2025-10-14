// create a method to check sessino cookie and return user if valid
import { NextRequest, NextResponse } from "next/server";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { app as firebaseAdminApp } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { cache } from "react";

export const getAuthUser = cache(async (): Promise<DecodedIdToken | null> => {
  const sessionCookie = (await cookies()).get("session")?.value || "";
  // If session cookie is not present, return null
  if (!sessionCookie) {
    console.log("Session cookie could not be found.");
    return null;
  }

  try {
    const auth = getAuth(firebaseAdminApp);
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    console.log("Session verified for user:", decodedClaims.uid);
    return decodedClaims;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
});
