import { useEffect, useState } from 'react';
import { api, apiError } from '../api';
import type { Game, Page } from '../api';
import GameCard from '../components/GameCard';
import Pagination from '../components/Pagination';

const SIZE = 5;

export default function GamesPage() {
  const [page, setPage] = useState(1); // la API empieza en 1
  const [data, setData] = useState<Page<Game> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cada vez que cambia "page", vuelve a pedir los juegos al servidor
  useEffect(() => {
    api
      .get<Page<Game>>('/api/games', { params: { page, size: SIZE } })
      .then(r => {
        setData(r.data);
        setError('');
      })
      .catch(err => setError(apiError(err).message))
      .finally(() => setLoading(false));
  }, [page]);

  const changePage = (next: number) => {
    setLoading(true);
    setPage(next);
  };

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Juegos</h1>

      {loading && <p>Cargando juegos...</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}
      {!loading && data && (
        <>
          {data.items.length === 0 ? (
            <p>No hay juegos para mostrar.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.items.map(game => (
                <GameCard key={game.id} game={game} linkToDetail />
              ))}
            </div>
          )}
          <Pagination page={data.page} totalPages={data.totalPages} onChange={changePage} />
        </>
      )}
    </section>
  );
}