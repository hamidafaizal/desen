import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import BottomMenu from './components/BottomMenu.jsx';
import TambahDesain from './pages/TambahDesain.jsx';
import DesainBaru from './pages/DesainBaru.jsx';
import DesainRevisi from './pages/DesainRevisi.jsx';
import DesainSelesai from './pages/DesainSelesai.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

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
      {/* // Sesuaikan padding atas untuk memberi ruang bagi header yang lebih ringkas */}
      <main className="pt-24 pb-24 px-4">
        <Routes>
          <Route path="/" element={<ProtectedRoute><DesainBaru /></ProtectedRoute>} />
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

