import { getAuthUser } from "@/lib/auth";
import { getTournaments } from "@/lib/tournaments";
import React from "react";
import { TournamentCard } from "./tournament-card";

export async function TournamentsOverview() {
  const user = await getAuthUser();

  if (!user) {
    return <div>Please log in to view tournaments</div>;
  }

  const tournaments = await getTournaments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          All Tournaments
        </h2>
        <p className="text-muted-foreground">
          {tournaments.length}{" "}
          {tournaments.length === 1 ? "tournament" : "tournaments"}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
    </div>
  );
}
