import { FiX, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// Komponen Modal Profil
function Profile({ isOpen, onClose }) {
  const { signOut } = useAuth(); // Mengambil fungsi signOut dari context

  // Log untuk debugging saat komponen di-render
  console.log("Profile modal rendered, isOpen:", isOpen);

  if (!isOpen) return null;

  // Fungsi untuk menangani logout
  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      await signOut();
      onClose(); // Tutup modal setelah logout
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    // Latar belakang semi-transparan
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose} // Menutup modal saat area luar diklik
    >
      {/* Kontainer Modal */}
      <div 
        className="glassmorphism w-full max-w-sm p-6 rounded-2xl relative"
        onClick={(e) => e.stopPropagation()} // Mencegah penutupan modal saat kontennya diklik
      >
        {/* Tombol Tutup */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <FiX size={24} />
        </button>

        <div className="flex flex-col items-center space-y-6">
           <h2 className="text-xl font-bold text-white">Profil Pengguna</h2>

           {/* Menu Pengaturan */}
           <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-200 hover:bg-gray-700/50 rounded-lg transition-colors">
             <FiSettings size={20} />
             <span>Pengaturan</span>
           </button>

           {/* Tombol Keluar */}
           <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 text-left text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
           >
             <FiLogOut size={20} />
             <span>Keluar</span>
           </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

