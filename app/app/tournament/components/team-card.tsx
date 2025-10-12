"use client";
import { Pencil, Trash2, Users, UserPlus, Check } from "lucide-react";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type Player = {
  id: string;
  name: string;
  position?: string;
};

export type Team = {
  id: string;
  name: string;
  players: Player[];
};

export default function TeamCard({ team }: { team: Team }) {
  const [playerName, setPlayerName] = useState("");

  const handleAddPlayer = () => {
    if (!playerName.trim()) return;
    // Logic to add player to the team
    console.log("Adding player:", playerName);
    setPlayerName("");
  };
  return (
    <Card key={team.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{team.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {team.players.length}{" "}
              {team.players.length === 1 ? "player" : "players"}
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
        <div className="space-y-3">
          {team.players.length > 0 ? (
            <div className="space-y-2">
              {team.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {player.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{player.name}</div>
                      {player.position && (
                        <div className="text-xs text-muted-foreground">
                          {player.position}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => console.log("Remove player", player.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Remove player</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No players yet. Add your first player!
            </div>
          )}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleAddPlayer}
              disabled={!playerName.trim()}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Add player</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
