"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Signed in
      const user = userCredential.user;
      console.log("User signed in:", user);
      router.push("/tournaments");
    } catch (error) {
      const errorCode = (error as { code: string }).code;
      const errorMessage = (error as { message: string }).message;

      setIsLoading(false);
      console.error("Error signing in:", errorCode, errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 pb-4 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring"
            />
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-6">
          <Button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
