import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, apiError } from '../api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await api.post('/api/auth/register', { name: name.trim(), email, password });
      navigate('/login');
    } catch (err) {
      setError(apiError(err).message); // ej: correo ya registrado
    } finally {
      setSending(false);
    }
  };

  // Validaciones con atributos del input: required, maxLength, type="email", pattern
  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-16 flex max-w-sm flex-col gap-3 rounded border bg-white p-6">
      <h1 className="text-xl font-bold">Crear cuenta</h1>

      <label htmlFor="name">Nombre</label>
      <input
        id="name"
        required
        maxLength={100}
        pattern=".*\S.*"
        title="Ingresa tu nombre (hasta 100 caracteres)."
        value={name}
        onChange={e => setName(e.target.value)}
        className="rounded border p-2"
      />

      <label htmlFor="email">Correo</label>
      <input id="email" type="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className="rounded border p-2" />

      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        required
        pattern="[ -~]{8,72}"
        title="De 8 a 72 caracteres ASCII (sin tildes ni ñ)."
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="rounded border p-2"
      />

      {error && <p className="text-red-600">{error}</p>}

      <button disabled={sending} className="rounded bg-slate-700 p-2 text-white disabled:bg-slate-300">
        {sending ? 'Registrando...' : 'Registrarme'}
      </button>
      <Link to="/login" className="text-center underline">
        Ya tengo cuenta
      </Link>
    </form>
  );
}