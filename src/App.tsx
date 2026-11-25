import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import GameDetailPage from './pages/GameDetailPage';
import GamesPage from './pages/GamesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Guardia: si no hay token → /login. Si hay, muestra la barra con "Cerrar sesión"
function ProtectedLayout() {
  const navigate = useNavigate();
  if (!localStorage.getItem('token')) return <Navigate to="/login" replace />;

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <header className="flex items-center justify-between border-b bg-white px-6 py-3">
        <span className="font-bold">Préstamo de juegos</span>
        <button onClick={logout} className="rounded bg-slate-700 px-3 py-1 text-white">
          Cerrar sesión
        </button>
      </header>
      <main className="mx-auto max-w-4xl p-6">
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/games" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}