import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateTeamForm } from "./create-team-form";
export function CreateTeamDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="transition-all hover:shadow-lg">Create Team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Team</DialogTitle>
        </DialogHeader>
        <CreateTeamForm />
      </DialogContent>
    </Dialog>
  );
}
