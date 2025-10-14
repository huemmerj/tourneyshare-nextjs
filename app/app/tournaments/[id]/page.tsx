export default async function TournamentPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-balance mb-8">
        Tournament Details (ID: {params.id})
      </h1>
      {/* Tournament details and management components go here */}
    </div>
  );
}
