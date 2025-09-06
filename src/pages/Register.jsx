import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi';

// Komponen Halaman Register
function Register() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fungsi untuk menangani proses pendaftaran
  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Attempting to register:", email);
    try {
      setLoading(true);
      setError('');
      setMessage('');
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) throw error;

      console.log("Registration successful, confirmation email sent");
      setMessage('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
    } catch (error) {
      console.error("Registration error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glassmorphism w-full max-w-md p-8 rounded-2xl space-y-6">
        <div className="text-center">
            <img src="/logodesen2.svg" alt="Desen Logo" className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">Buat Akun Baru</h1>
            <p className="text-gray-300">Mulai kelola desain Anda</p>
        </div>

        {error && <p className="text-red-400 bg-red-500/20 p-3 rounded-lg text-center">{error}</p>}
        {message && <p className="text-green-400 bg-green-500/20 p-3 rounded-lg text-center">{message}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Alamat Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Kata Sandi (minimal 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center space-x-2 p-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors disabled:bg-purple-800 disabled:cursor-not-allowed"
          >
            <FiUserPlus />
            <span>{loading ? 'Memproses...' : 'Daftar'}</span>
          </button>
        </form>

        <p className="text-center text-gray-400">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold text-purple-400 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
