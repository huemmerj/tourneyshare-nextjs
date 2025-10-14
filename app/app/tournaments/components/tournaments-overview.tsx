import React from "react";

export async function TournamentsOverview() {
  const getTournaments = async () => {
    // fetch from /api/tournaments
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/tournaments`
    );
    return response.json();
  };
  const tournaments = await getTournaments();

  console.log(tournaments);
  return <div>Tournaments Overview</div>;
}
