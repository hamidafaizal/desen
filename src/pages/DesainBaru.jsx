import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiSearch, FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';
import EditDesainModal from '../modals/EditDesainModal';

// Komponen untuk badge status, dengan warna yang berbeda
const StatusBadge = ({ status }) => {
  const statusColor = {
    'dalam antrian': 'bg-yellow-500/20 text-yellow-300',
    'proses': 'bg-blue-500/20 text-blue-300',
    'revisi': 'bg-orange-500/20 text-orange-300',
    'selesai': 'bg-green-500/20 text-green-300',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor[status] || 'bg-gray-500/20 text-gray-300'}`}>
      {status}
    </span>
  );
};

// Komponen Halaman Desain Baru
function DesainBaru() {
  const [desains, setDesains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDesain, setEditingDesain] = useState(null);

  // Fungsi untuk mengambil data dari Supabase
  const getDesains = async () => {
    console.log("Fetching new designs from Supabase...");
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('desains')
        .select('*')
        .in('status', ['dalam antrian', 'proses'])
        .order('created_at', { ascending: false });
      if (error) throw error;
      console.log("Fetched designs:", data);
      setDesains(data);
    } catch (error) {
      console.error("Error fetching designs:", error.message);
      setError("Gagal memuat data desain. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    getDesains();
  }, []);

  // Fungsi untuk menangani penghapusan data
  const handleDelete = async (id) => {
    console.log(`Attempting to delete design with id: ${id}`);
    if (window.confirm('Apakah Anda yakin ingin menghapus desain ini?')) {
      try {
        // Logika untuk menghapus file dari storage bisa ditambahkan di sini jika perlu
        const { error } = await supabase.from('desains').delete().match({ id });
        if (error) throw error;
        console.log("Delete successful.");
        setDesains(desains.filter((d) => d.id !== id));
      } catch (error) {
        console.error('Error deleting design:', error.message);
        alert('Gagal menghapus desain.');
      }
    }
  };

  // Membuka modal edit
  const handleEditClick = (desain) => {
    console.log("Opening edit modal for:", desain);
    setEditingDesain(desain);
    setIsEditModalOpen(true);
  };
  
  // Menutup modal edit
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingDesain(null);
  };
  
  // Memperbarui UI setelah data berhasil diupdate di modal
  const handleUpdateSuccess = (updatedDesain) => {
    console.log("Updating UI with new data:", updatedDesain);
    setDesains(desains.map(d => d.id === updatedDesain.id ? updatedDesain : d));
  };


  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Desain Baru</h1>

        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama client..."
            className="w-full p-3 pl-10 bg-gray-800/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Tampilan Loading dan Error */}
        {loading && (
            <div className="flex justify-center items-center py-10">
            <FiLoader className="animate-spin h-8 w-8 text-purple-500" />
            <p className="ml-3 text-gray-300">Memuat data...</p>
            </div>
        )}
        {error && <p className="text-red-400 bg-red-500/20 p-3 rounded-lg text-center">{error}</p>}
        
        {/* Konten Utama */}
        {!loading && !error && (
          <div className="overflow-x-auto glassmorphism p-4 rounded-xl">
            {desains.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Tidak ada desain baru yang ditemukan.</p>
            ) : (
              <table className="w-full text-left">
                {/* ... table head ... */}
                 <thead>
                    <tr className="border-b border-gray-700 text-sm text-gray-400">
                    <th className="p-4 font-semibold">No</th>
                    <th className="p-4 font-semibold">Client</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                  {desains.map((desain, index) => (
                    <tr key={desain.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-800/50">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">
                        <div className="font-semibold">{desain.nama_client}</div>
                        <div className="text-xs text-gray-400">{formatDate(desain.tanggal_briefing)}</div>
                      </td>
                      <td className="p-4"><StatusBadge status={desain.status} /></td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditClick(desain)} className="text-blue-400 hover:text-blue-300"><FiEdit size={18} /></button>
                          <button onClick={() => handleDelete(desain.id)} className="text-red-400 hover:text-red-300"><FiTrash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Render Modal */}
      {isEditModalOpen && (
        <EditDesainModal
          desain={editingDesain}
          onClose={handleCloseModal}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </>
  );
}

export default DesainBaru;

