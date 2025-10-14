import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Tournament } from "@/lib/tournaments";
import { DeleteTournamentDialog } from "./delete-tournament-dialog";

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  return (
    <Card className="p-0 group overflow-hidden transition-all hover:shadow-lg">
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
