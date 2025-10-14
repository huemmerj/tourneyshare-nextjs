export function TeamsList({ teams }: { teams: string[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teams</h2>
      {teams.length === 0 ? (
        <p>No teams registered.</p>
      ) : (
        <ul className="space-y-2">
          {teams.map((team, index) => (
            <li
              key={index}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              {team}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
