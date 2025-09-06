import { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import ProfileModal from '../modals/Profile';

// Komponen Header
function Header() {
  // State untuk mengontrol visibilitas modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Log untuk debugging saat komponen di-render
  console.log("Header component rendered, modal state:", isModalOpen);

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
        <div className="glassmorphism mx-4 my-3 px-4 py-2 rounded-xl flex justify-between items-center">
          {/* Sisi Kiri: Logo */}
          <div className="flex items-center">
            <img src="/logodesen2.svg" alt="Desen Logo" className="h-8 w-8" />
          </div>

          {/* Tengah: Judul Aplikasi */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-xl font-bold text-white tracking-wider">Desen</h1>
          </div>

          {/* Sisi Kanan: Avatar */}
          <div className="flex items-center">
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
