"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";

// Sample tournament data - replace with your actual data source

// type for Tournament
type Tournament = {
  id: number;
  name: string;
  game: string;
};

export function TournamentsOverview() {
  const [tournaments, setTournaments] = useState<Array<Tournament>>([]);
  useEffect(() => {
    const fetchTournaments = async () => {
      const getTournaments = httpsCallable(functions, "getAllTournaments");
      const response = await getTournaments();
      const data = response.data as Array<Tournament>;
      setTournaments(data);
    };
    fetchTournaments().then((data) => {
      console.log("Fetched tournaments:", data);
      // Here you would typically update state with the fetched data
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tournaments.map((tournament) => (
        <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-balance">
              {tournament.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-sm">
              {tournament.game}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
