"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Tournament } from "@/lib/tournaments";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function DeleteTournamentDialog({
  tournament,
}: {
  tournament: Tournament;
}) {
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tournaments/${tournament.id}`, {
        method: "DELETE",
        credentials: "include", // Important: Include cookies with the request
      });

      if (!response.ok) {
        throw new Error("Failed to delete tournament");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error deleting tournament:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete Tournament</DialogTitle>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={onSubmit} variant="destructive">
            {loading && <Spinner />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
