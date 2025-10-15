import { getTournamentById, Tournament } from "@/lib/tournaments";
import { TeamsList } from "../components/teams-list";
import { CreateTeamDialog } from "../components/create-team-dialog";

export default async function TournamentPage({
  params,
}: {
  params: { id: string };
}) {
  const tournament = (await getTournamentById(params.id)) as Tournament;

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-balance">
            Tournament Details
          </h1>
          <CreateTeamDialog />
        </div>
        {/* <TeamsList teams={tournament?.teams || []} /> */}
      </div>
    </main>
  );
}
