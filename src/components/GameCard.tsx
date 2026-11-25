import { Link } from 'react-router-dom';
import type { Game } from '../api';

interface Props {
  game: Game;
  linkToDetail?: boolean;
}

export default function GameCard({ game, linkToDetail = false }: Props) {
  const content = (
    <>
      <h2 className="text-lg font-bold">{game.name}</h2>
      <p>Categoría: {game.category}</p>
      <p>Jugadores recomendados: {game.recommendedPlayers}</p>
      <p>Unidades disponibles: {game.availableUnits}</p>
    </>
  );
  const className = 'flex flex-col gap-1 rounded border bg-white p-4';

  return linkToDetail ? (
    <Link to={`/games/${game.id}`} className={`${className} hover:border-slate-500`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}