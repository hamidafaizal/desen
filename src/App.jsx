import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import BottomMenu from './components/BottomMenu';
import TambahDesain from './pages/TambahDesain';
import DesainBaru from './pages/DesainBaru';
import DesainRevisi from './pages/DesainRevisi';
import DesainSelesai from './pages/DesainSelesai';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Komponen Dashboard sementara
function Dashboard() {
  return <h1 className="text-2xl font-bold text-white text-center">Dashboard</h1>;
}

// Komponen utama aplikasi
function App() {
  const { session } = useAuth();
  // Log untuk debugging saat komponen App di-render
  console.log("App component rendered, session state:", session);

  // Jika belum login, tampilkan hanya halaman Login/Register
  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} /> {/* Arahkan ke login jika path tidak ditemukan */}
      </Routes>
    );
  }

  // Jika sudah login, tampilkan layout utama aplikasi
  return (
    <div className="text-gray-200">
      <Header />
      <main className="pt-20 pb-24 px-4">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tambah-desain" element={<ProtectedRoute><TambahDesain /></ProtectedRoute>} />
          <Route path="/desain-baru" element={<ProtectedRoute><DesainBaru /></ProtectedRoute>} />
          <Route path="/desain-revisi" element={<ProtectedRoute><DesainRevisi /></ProtectedRoute>} />
          <Route path="/desain-selesai" element={<ProtectedRoute><DesainSelesai /></ProtectedRoute>} />
        </Routes>
      </main>
      <BottomMenu />
    </div>
  );
}

export default App;

