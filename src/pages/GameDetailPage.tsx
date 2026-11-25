import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, apiError } from '../api';
import type { Game } from '../api';
import GameCard from '../components/GameCard';

const OUT_OF_STOCK_MESSAGE = 'El juego se quedó sin unidades disponibles.';

// Validación: entero de 1 a 3. Devuelve el error, o '' si está bien
function validateDays(days: string) {
  const value = Number(days);
  if (days.trim() === '') return 'Ingresa la cantidad de días.';
  if (!Number.isInteger(value) || value < 1 || value > 3) return 'Los días deben ser un entero de 1 a 3.';
  return '';
}

export default function GameDetailPage() {
  const { id } = useParams(); // saca el número de la URL
  const [game, setGame] = useState<Game | null>(null);
  const [loadError, setLoadError] = useState('');
  const [days, setDays] = useState('1');
  const [daysError, setDaysError] = useState('');
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [sending, setSending] = useState(false);

  // 1. Pedir el juego
  useEffect(() => {
    api
      .get<Game>(`/api/games/${id}`)
      .then(r => setGame(r.data))
      .catch(err => setLoadError(apiError(err).message));
  }, [id]);

  // 2. Al enviar el formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(null);

    const validation = validateDays(days);
    setDaysError(validation);
    if (validation) return; // si hay error, NO se envía

    setSending(true);
    try {
      const { data } = await api.post<{ gameId: number; days: number; availableUnits: number }>(
        `/api/games/${id}/loans`,
        { days: Number(days) }, // número, no texto
      );
      setGame(g => g && { ...g, availableUnits: data.availableUnits }); // unidades que dijo la API
      setResult({ ok: true, text: `Préstamo confirmado por ${data.days} día(s).` });
    } catch (err) {
      const { code, message } = apiError(err);
      if (code === 'OUT_OF_STOCK') {
        setGame(g => g && { ...g, availableUnits: 0 });
        setResult({ ok: false, text: OUT_OF_STOCK_MESSAGE });
      } else {
        setResult({ ok: false, text: message });
      }
    } finally {
      setSending(false);
    }
  };

  if (loadError) return <p className="text-red-600">{loadError}</p>;
  if (!game) return <p>Cargando juego...</p>;

  return (
    <section className="flex flex-col gap-4">
      <Link to="/games" className="underline">
        ← Volver al listado
      </Link>
      <GameCard game={game} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2 rounded border bg-white p-4">
        <h2 className="text-lg font-bold">Solicitar préstamo</h2>
        <p>Cantidad: 1 unidad</p>

        <label htmlFor="days">Días de préstamo (1 a 3)</label>
        <input
          id="days"
          type="number"
          min={1}
          max={3}
          step={1}
          value={days}
          onChange={e => {
            setDays(e.target.value);
            setDaysError(validateDays(e.target.value));
          }}
          className="rounded border p-2"
        />
        {daysError && <p className="text-sm text-red-600">{daysError}</p>}

        <button disabled={sending} className="rounded bg-slate-700 p-2 text-white disabled:bg-slate-300">
          {sending ? 'Enviando...' : 'Confirmar préstamo'}
        </button>
        {result && <p className={result.ok ? 'text-green-700' : 'text-red-600'}>{result.text}</p>}
      </form>
    </section>
  );
}