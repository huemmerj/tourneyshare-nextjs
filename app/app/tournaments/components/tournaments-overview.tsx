"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/context/AuthContext";
import { AddTournamentForm, Tournament } from "./add-tournament-form";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// Sample tournament data - replace with your actual data source

export function TournamentsOverview() {
  const user = useRequireAuth();
  const [tournaments, setTournaments] = useState<Array<Tournament>>([]);
  const [isLoading, setIsLoading] = useState(true); // <-- Add a loading state
  const handleTournamentAdded = (newTournament: Tournament) => {
    setTournaments((prevTournaments) => [...prevTournaments, newTournament]);
  };
  useEffect(() => {
    const fetchTournaments = async () => {
      const getTournaments = httpsCallable(functions, "getAllTournaments");
      const response = await getTournaments();
      const data = response.data as Array<Tournament>;
      setTournaments(data);
      setIsLoading(false);
    };
    fetchTournaments().then((data) => {
      console.log("Fetched tournaments:", data);
      // Here you would typically update state with the fetched data
    });
  }, []);

  const handleDeleteTournament = async (tournamentId: string) => {
    try {
      const deleteFunction = httpsCallable(functions, "deleteTournament");
      await deleteFunction({ id: tournamentId });

      // Update the UI by removing the deleted tournament from the state
      setTournaments((prev) => prev.filter((t) => t.id !== tournamentId));
    } catch (error) {
      console.error("Error deleting tournament:", error);
      alert("Failed to delete tournament. See console for details.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-end">
        {/* Pass the callback function to the form component */}
        <AddTournamentForm onTournamentAdded={handleTournamentAdded} />
      </div>

      {isLoading ? (
        <p className="text-center">Loading tournaments...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Card
              key={tournament.id}
              className="hover:shadow-lg transition-shadow flex flex-col relative"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-balance">
                  {tournament.name}
                </CardTitle>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 shrink-0 absolute bottom-4 right-3"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the
                        <strong> {tournament.name}</strong> tournament.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTournament(tournament.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                {tournament.game && (
                  <Badge variant="secondary" className="text-sm">
                    {tournament.game}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
