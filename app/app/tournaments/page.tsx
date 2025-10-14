import { getAuthUser } from "@/lib/auth";
import { TournamentsOverview } from "./components/tournaments-overview";
import { CreateTournament } from "./components/create-tournament-dialog";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-balance">
            Tournament Overview
          </h1>
          <CreateTournament />
        </div>
        <TournamentsOverview />
      </div>
    </main>
  );
}
