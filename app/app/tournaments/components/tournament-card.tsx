"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Tournament } from "@/lib/tournaments";
import { DeleteTournamentDialog } from "./delete-tournament-dialog";
import { useRouter } from "next/navigation";

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const router = useRouter();

  function handleClickTournament(e: React.MouseEvent) {
    // Don't navigate if clicking on the delete button area
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/tournaments/${tournament.id}`);
  }

  return (
    <Card
      onClick={handleClickTournament}
      className="p-0 group overflow-hidden transition-all hover:shadow-lg cursor-pointer"
    >
      <CardContent className="p-4">
        <h3 className="text-balance text-xl font-bold leading-tight text-card-foreground">
          {tournament.name}
        </h3>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border bg-muted/30 p-4">
        <Badge variant="secondary" className="font-semibold">
          {tournament.game}
        </Badge>
        <DeleteTournamentDialog tournament={tournament} />
      </CardFooter>
    </Card>
  );
}
