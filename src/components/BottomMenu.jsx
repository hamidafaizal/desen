import { Link, useLocation } from 'react-router-dom';
// Mengganti ikon dari Feather Icons (fi) ke Font Awesome (fa) untuk mengatasi masalah resolusi modul
import { FaHome, FaList, FaPlus, FaEdit, FaCheckSquare } from 'react-icons/fa';

// Komponen Menu Bawah
function BottomMenu() {
  const location = useLocation();
  // Log untuk debugging saat komponen di-render
  console.log("BottomMenu rendered, current path:", location.pathname);

  // Fungsi untuk mendapatkan kelas link
  const getLinkClass = (path) => {
    // Menyesuaikan kelas untuk menengahkan ikon karena teks dihapus
    return `flex justify-center items-center w-full py-2 transition-colors ${
      location.pathname === path ? 'text-purple-400' : 'text-gray-400 hover:text-white'
    }`;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 p-2 z-10">
      <div className="glassmorphism flex justify-around items-center p-2 mx-auto max-w-screen-lg">
        {/* Menu Dashboard */}
        <Link to="/" className={getLinkClass('/')}>
          <FaHome className="w-6 h-6" />
        </Link>

        {/* Menu Desain Baru */}
        <Link to="/desain-baru" className={getLinkClass('/desain-baru')}>
          <FaList className="w-6 h-6" />
        </Link>

        {/* Tombol Tambah Desain */}
        <Link to="/tambah-desain" className="p-4 bg-purple-600 rounded-full -mt-10 shadow-lg hover:bg-purple-700 transition-colors">
          <FaPlus className="w-7 h-7 text-white" />
        </Link>

        {/* Menu Desain Revisi */}
        <Link to="/desain-revisi" className={getLinkClass('/desain-revisi')}>
          <FaEdit className="w-6 h-6" />
        </Link>

        {/* Menu Desain Selesai */}
        <Link to="/desain-selesai" className={getLinkClass('/desain-selesai')}>
          <FaCheckSquare className="w-6 h-6" />
        </Link>
      </div>
    </footer>
  );
}

export default BottomMenu;

