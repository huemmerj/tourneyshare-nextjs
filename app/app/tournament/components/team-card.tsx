"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Pencil, Plus, Settings, Trash2, Users } from "lucide-react";
export type Team = {
  id: string;
  name: string;
  players: number;
};
export default function TeamCard({ team }: { team: Team }) {
  return (
    <Card key={team.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{team.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {team.players} {team.players === 1 ? "player" : "players"}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => console.log("Edit clicked")}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit team</span>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => console.log("Delete clicked")}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete team</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{3}</div>
            <div className="text-xs text-muted-foreground">Wins</div>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{4}</div>
            <div className="text-xs text-muted-foreground">Losses</div>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {/* {team.wins + team.losses > 0 ? ((team.wins / (team.wins + team.losses)) * 100).toFixed(0) : 0}% */}
            </div>
            <div className="text-xs text-muted-foreground">Win Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
