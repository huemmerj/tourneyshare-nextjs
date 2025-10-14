// write post method to /api/login with idToken in body
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { app as firebaseAdminApp } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

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
    (await cookies()).set({
      httpOnly: true, // A cookie with the HttpOnly attribute is inaccessible to the JavaScript Document.cookie API; it's only sent to the server.
      maxAge: expiresIn, // After the specified time period, the cookie will be automatically deleted by the browser. The value can be updated at any time to extend or shorten the cookie's validity period. Expects duration in seconds
      name: "session", // Name of the cookie.
      path: "/", // This is the most common approach. It makes the cookie available to all pages within your website's root directory and subdirectories. This ensures seamless user experience as navigation occurs.
      sameSite: "strict", // With Strict, the browser only sends the cookie with requests from the cookie's origin site (= Same-site only).
      secure: true, // A cookie with the Secure attribute is only sent to the server with an encrypted request over the HTTPS protocol. It's never sent with unsecured HTTP (except on localhost).
      value: sessionCookie, // Value to be stored in cookie
    });

    return Response.json({}, { status: 200 });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
