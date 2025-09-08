import { useState, useEffect, useRef } from 'react';
import { supabase } from '/src/supabaseClient.js';
import { useSearch } from '/src/context/SearchContext.jsx';
import { FiEdit, FiTrash2, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import EditDesainModal from '/src/modals/EditDesainModal.jsx';

// Komponen untuk badge status, dengan warna yang berbeda
const StatusBadge = ({ status }) => {
  const statusColor = {
    'dalam antrian': 'bg-yellow-500/20 text-yellow-300',
    'proses': 'bg-blue-500/20 text-blue-300',
    'revisi': 'bg-orange-500/20 text-orange-300',
    'selesai': 'bg-green-500/20 text-green-300',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusColor[status] || 'bg-gray-500/20 text-gray-300'}`}>
      {status}
    </span>
  );
};

// Komponen Slider Gambar
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full bg-zinc-800 rounded-lg flex items-center justify-center">
        <span className="text-zinc-500">No Image</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full group">
      <div
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
        className="w-full h-full rounded-lg bg-center bg-cover duration-500"
      ></div>
      {images.length > 1 && (
        <>
          <div onClick={goToPrevious} className="absolute top-1/2 left-2 -translate-y-1/2 p-2 bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <FiChevronLeft size={20} />
          </div>
          <div onClick={goToNext} className="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <FiChevronRight size={20} />
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, slideIndex) => (
              <div
                key={slideIndex}
                className={`h-2 w-2 rounded-full transition-colors ${currentIndex === slideIndex ? 'bg-white' : 'bg-white/50'}`}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Komponen untuk menampilkan teks yang bisa diperluas
const ExpandableText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [text]);

  return (
    <div>
      <p
        ref={textRef}
        className={`text-sm text-gray-300 whitespace-pre-wrap ${!isExpanded ? 'line-clamp-3' : ''}`}
      >
        <span className="font-semibold text-white">Briefing: </span>
        {text}
      </p>
      {isOverflowing && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-xs text-gray-400 hover:underline mt-1 cursor-pointer">
          {isExpanded ? '...lebih sedikit' : 'lebih banyak...'}
        </button>
      )}
    </div>
  );
};

// Halaman Desain Baru
function DesainBaru() {
  const [desains, setDesains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDesain, setEditingDesain] = useState(null);
  const { searchQuery } = useSearch();

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

  useEffect(() => {
    getDesains();
  }, []);

  const handleDelete = async (id, files) => {
    console.log(`Attempting to delete design with id: ${id}`);
    if (window.confirm('Apakah Anda yakin ingin menghapus desain ini? Aksi ini tidak dapat dibatalkan.')) {
      try {
        // Hapus file dari storage jika ada
        if (files && files.length > 0) {
          const filePaths = files.map(url => {
            const parts = new URL(url).pathname.split('/');
            return parts.slice(parts.indexOf('desain-files') + 1).join('/');
          });
          console.log("Deleting files from storage:", filePaths);
          const { error: storageError } = await supabase.storage.from('desain-files').remove(filePaths);
          if (storageError) {
            console.error("Error deleting files from storage:", storageError.message);
            // Tetap lanjutkan menghapus record DB meskipun file gagal dihapus
          }
        }

        // Hapus record dari database
        const { error: dbError } = await supabase.from('desains').delete().match({ id });
        if (dbError) throw dbError;
        
        console.log("Delete successful from database.");
        setDesains(desains.filter((d) => d.id !== id));
      } catch (error) {
        console.error('Error deleting design:', error.message);
        alert('Gagal menghapus desain.');
      }
    }
  };
  
  const handleEditClick = (desain) => {
    setEditingDesain(desain);
    setIsEditModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingDesain(null);
  };
  
  const handleUpdateSuccess = (updatedDesain) => {
    setDesains(desains.map(d => d.id === updatedDesain.id ? updatedDesain : d));
  };

  const capitalizeWords = (str) => {
    if (!str) return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak valid';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  const filteredDesains = desains.filter(desain =>
    desain.nama_client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="max-w-xl mx-auto space-y-4">
        {loading && (
          <div className="flex justify-center items-center py-10">
            <FiLoader className="animate-spin h-8 w-8 text-purple-500" />
            <p className="ml-3 text-gray-300">Memuat data...</p>
          </div>
        )}
        {error && <p className="text-red-400 bg-red-500/20 p-3 rounded-lg text-center">{error}</p>}
        
        {!loading && !error && filteredDesains.length === 0 && (
          <p className="text-center text-gray-400 py-8">Tidak ada desain baru yang ditemukan.</p>
        )}

        {!loading && !error && filteredDesains.map(desain => (
          <div key={desain.id} className="glassmorphism rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="font-bold text-white">{capitalizeWords(desain.nama_client)}</p>
                <p className="text-xs text-gray-400">{formatDate(desain.created_at)}</p>
              </div>
              <StatusBadge status={desain.status} />
            </div>

            <ImageSlider images={desain.files} />
            
            <div className="p-3">
              <div className="flex justify-end items-center space-x-2 mb-2">
                <button onClick={() => handleEditClick(desain)} className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600/50 rounded-md text-sm hover:bg-gray-700/70 transition-colors">
                  <FiEdit />
                  <span>Edit</span>
                </button>
                <button onClick={() => handleDelete(desain.id, desain.files)} className="flex items-center space-x-2 px-3 py-1.5 bg-red-600/50 rounded-md text-sm hover:bg-red-700/70 transition-colors">
                  <FiTrash2 />
                  <span>Hapus</span>
                </button>
              </div>

              {desain.briefing && <ExpandableText text={desain.briefing} />}
            </div>
          </div>
        ))}
      </div>

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

