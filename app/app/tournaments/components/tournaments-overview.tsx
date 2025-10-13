import React from "react";

export async function TournamentsOverview() {
  const getTournaments = async () => {
    const response = await fetch("/api/tournaments");
    return response.json();
  };
  const tournaments = await getTournaments();

  return <div>Tournaments Overview</div>;
}
