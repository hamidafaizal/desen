import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Komponen untuk melindungi rute
function ProtectedRoute({ children }) {
  const { session } = useAuth();

  // Log untuk debugging status sesi
  console.log("ProtectedRoute check, session exists:", !!session);

  // Jika tidak ada sesi (user belum login), arahkan ke halaman login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada sesi, tampilkan konten yang diminta
  return children;
}

export default ProtectedRoute;
