import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, apiError } from '../api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // evita que la página se recargue
    setError('');
    setSending(true);
    try {
      const { data } = await api.post<{ token: string }>('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token); // guarda la "pulsera"
      navigate('/games');
    } catch (err) {
      setError(apiError(err).message); // ej: credenciales incorrectas
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-16 flex max-w-sm flex-col gap-3 rounded border bg-white p-6">
      <h1 className="text-xl font-bold">Iniciar sesión</h1>

      <label htmlFor="email">Correo</label>
      <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="rounded border p-2" />

      <label htmlFor="password">Contraseña</label>
      <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="rounded border p-2" />

      {error && <p className="text-red-600">{error}</p>}

      <button disabled={sending} className="rounded bg-slate-700 p-2 text-white disabled:bg-slate-300">
        {sending ? 'Ingresando...' : 'Ingresar'}
      </button>
      <Link to="/register" className="text-center underline">
        Crear una cuenta
      </Link>
    </form>
  );
}