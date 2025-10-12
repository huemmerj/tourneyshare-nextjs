"use client";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { Tournament } from "../components/add-tournament-form";
import { useRequireAuth } from "@/context/AuthContext";
import React, { useState, useEffect, use } from "react";
import TeamCard from "../components/team-card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { useParams } from "next/navigation";

export default function TournamentPage() {
  const user = useRequireAuth();
  const getTournament = httpsCallable(functions, "getTournamentById");
  const [tournament, setTournament] = useState<Tournament>({} as Tournament);
  const [loading, setLoading] = useState(true);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", players: 0 });
  // unwrap params using use from react

  const params = useParams();
  const tournamentId = params.id;

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const response = await getTournament({ id: tournamentId });
        const data = response.data as Tournament;
        console.log("Fetched tournament:", data);
        setTournament(data);
      } catch (error) {
        console.error("Error fetching tournament:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, []);

  const handleAddTeam = async () => {
    if (!formData.name) return;

    try {
      const addTeam = httpsCallable(functions, "addTeamToTournament");
      await addTeam({ tournamentId: tournamentId, teamName: formData.name });
      setTournament((prev: Tournament) => ({
        ...prev,
        teams: [
          ...(prev.teams || []),
          { id: Date.now().toString(), name: formData.name, players: [] },
        ],
      }));
      setFormData({ name: "", players: 0 });
      setIsAddTeamOpen(false);
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">
              {tournament.name}
            </h1>
            {/* <p className="text-muted-foreground">{tournament.teams.length} Teams</p> */}
          </div>
          <div className="flex gap-3">
            <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Team</DialogTitle>
                  <DialogDescription>
                    Enter the team details to add them to the tournament.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="team-name">Team Name</Label>
                    <Input
                      id="team-name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter team name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="players">Number of Players</Label>
                    <Input
                      id="players"
                      type="number"
                      value={formData.players}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          players: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="5"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddTeamOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddTeam} disabled={!formData.name}>
                    Add Team
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-transparent"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tournament Settings</DialogTitle>
                  <DialogDescription>
                    Configure your tournament parameters.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tournament-name">Tournament Name</Label>
                    <Input
                      id="tournament-name"
                      value={settings.name}
                      onChange={(e) =>
                        setSettings({ ...settings, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="format">Format</Label>
                    <Input
                      id="format"
                      value={settings.format}
                      onChange={(e) =>
                        setSettings({ ...settings, format: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="max-teams">Maximum Teams</Label>
                    <Input
                      id="max-teams"
                      type="number"
                      value={settings.maxTeams}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxTeams: Number.parseInt(e.target.value) || 16,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={settings.startDate}
                      onChange={(e) =>
                        setSettings({ ...settings, startDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsSettingsOpen(false)}>
                    Save Settings
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog> */}
          </div>
        </div>
        {/* Teams Grid */}
        {tournament.teams && tournament.teams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournament.teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
