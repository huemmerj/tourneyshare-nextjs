// ./components/add-tournament-form.tsx

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { PlusCircle } from "lucide-react";

// Define the shape of the new tournament for our callback
export type Tournament = {
  id: string; // Firestore IDs are strings
  name: string;
  game: string;
};

type AddTournamentFormProps = {
  onTournamentAdded: (newTournament: Tournament) => void;
};

export function AddTournamentForm({
  onTournamentAdded,
}: AddTournamentFormProps) {
  const [name, setName] = useState("");
  const [game, setGame] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const addTournament = httpsCallable(functions, "addTournament");
      const response = await addTournament({ name, game });
      const newTournament = response.data as Tournament;

      // Call the parent's function to update the UI
      onTournamentAdded(newTournament);

      // Reset form and close dialog
      setName("");
      setGame("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating tournament:", error);
      alert("Failed to create tournament. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Tournament</DialogTitle>
            <DialogDescription>
              Enter the details for the new tournament. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Summer Championship"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="game" className="text-right">
                Game
              </Label>
              <Input
                id="game"
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Handball"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Tournament"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
