import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateTournamentForm } from "./create-tournament-form";

export function CreateTournament() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="transition-all hover:shadow-lg">
          Create Tournament
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Tournament</DialogTitle>
        </DialogHeader>
        <CreateTournamentForm />
      </DialogContent>
    </Dialog>
  );
}
