import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiUser, FiSearch } from 'react-icons/fi';
import ProfileModal from '../modals/Profile.jsx';
import { useSearch } from '../context/SearchContext.jsx';

// Komponen Header
function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useSearch();

  // Tentukan apakah search bar harus ditampilkan berdasarkan halaman saat ini
  const showSearchBar = ['/', '/desain-baru', '/desain-revisi', '/desain-selesai'].includes(location.pathname);

  // Fungsi untuk membuka modal
  const openModal = () => {
    console.log("Opening profile modal");
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    console.log("Closing profile modal");
    setIsModalOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="glassmorphism mx-4 my-3 px-4 py-2 rounded-xl flex items-center space-x-4">
          {/* Sisi Kiri: Logo */}
          <div className="flex-shrink-0">
            <img src="/logodesen2.svg" alt="Desen Logo" className="h-8 w-8" />
          </div>

          {/* Tengah: Search Bar (kondisional) */}
          <div className="flex-grow">
            {showSearchBar && (
              <div className="relative w-full max-w-lg mx-auto">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 pl-10 bg-gray-800/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            )}
          </div>

          {/* Sisi Kanan: Avatar */}
          <div className="flex-shrink-0">
            <button onClick={openModal} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <FiUser className="text-white" size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Render komponen modal */}
      <ProfileModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

export default Header;

