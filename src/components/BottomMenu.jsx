import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiList, FiPlus, FiEdit, FiCheckSquare } from 'react-icons/fi';

// Komponen Menu Bawah
function BottomMenu() {
  const location = useLocation();
  console.log("BottomMenu rendered, current path:", location.pathname);

  // Fungsi untuk mendapatkan kelas link
  const getLinkClass = (path) => {
    return `flex flex-col items-center w-full transition-colors ${
      location.pathname === path ? 'text-purple-400' : 'text-gray-400 hover:text-white'
    }`;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 p-2 z-10">
      <div className="glassmorphism flex justify-around items-center p-2 mx-auto max-w-screen-lg">
        {/* Menu Dashboard */}
        <Link to="/" className={getLinkClass('/')}>
          <FiHome className="w-6 h-6" />
          <span className="text-xs">Dashboard</span>
        </Link>

        {/* Menu Desain Baru */}
        <Link to="/desain-baru" className={getLinkClass('/desain-baru')}>
          <FiList className="w-6 h-6" />
          <span className="text-xs">Desain Baru</span>
        </Link>

        {/* Tombol Tambah Desain */}
        <Link to="/tambah-desain" className="p-4 bg-purple-600 rounded-full -mt-10 shadow-lg hover:bg-purple-700 transition-colors">
          <FiPlus className="w-7 h-7 text-white" />
        </Link>

        {/* Menu Desain Revisi */}
        <Link to="/desain-revisi" className={getLinkClass('/desain-revisi')}>
          <FiEdit className="w-6 h-6" />
          <span className="text-xs">Desain Revisi</span>
        </Link>

        {/* Menu Desain Selesai */}
        <Link to="/desain-selesai" className={getLinkClass('/desain-selesai')}>
          <FiCheckSquare className="w-6 h-6" />
          <span className="text-xs">Desain Selesai</span>
        </Link>
      </div>
    </footer>
  );
}

export default BottomMenu;

