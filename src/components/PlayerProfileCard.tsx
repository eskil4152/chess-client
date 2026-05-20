export default function PlayerProfileCard(elo: number, username: string) {
  return (
    <div>
      <h1>{username}</h1>
      <p>ELO: {elo}</p>
    </div>
  );
}
