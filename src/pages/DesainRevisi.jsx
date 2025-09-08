import { useState, useEffect } from 'react';
import { supabase } from '/src/supabaseClient.js';
import { useSearch } from '/src/context/SearchContext.jsx';
import { FiEdit, FiCheck, FiLoader, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';
import EditDesainModal from '/src/modals/EditDesainModal.jsx';

// Fungsi untuk membuat huruf pertama setiap kata menjadi kapital
const capitalizeWords = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Komponen untuk badge status, dengan warna yang berbeda
const StatusBadge = ({ status }) => {
  const statusColor = {
    'revisi': 'bg-orange-500/20 text-orange-300',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor[status] || 'bg-gray-500/20 text-gray-300'}`}>
      {status}
    </span>
  );
};

// Komponen Image Slider
const ImageSlider = ({ files, clientName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? files.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === files.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    if (!files || files.length === 0) {
        return (
            <div className="aspect-square w-full bg-zinc-800">
                <img 
                    src={'https://placehold.co/600x600/18181b/FFF?text=No+Image'} 
                    alt={`Desain untuk ${clientName}`} 
                    className="w-full h-full object-cover" 
                />
            </div>
        );
    }
    
    return (
        <div className="aspect-square w-full relative group">
            <div 
                style={{ backgroundImage: `url(${files[currentIndex]})`}}
                className="w-full h-full bg-center bg-cover duration-500"
            ></div>
            {files.length > 1 && (
                <>
                    <div onClick={prevSlide} className='hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                        <FiChevronLeft size={30} />
                    </div>
                    <div onClick={nextSlide} className='hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                        <FiChevronRight size={30} />
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {files.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}
                            ></div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// Komponen Halaman Desain Revisi
function DesainRevisi() {
  const [data, setData] = useState([]);
  const { searchQuery } = useSearch();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDesain, setEditingDesain] = useState(null);

  // Fungsi untuk mengambil data dari Supabase
  const getDesains = async () => {
    setLoading(true);
    setError(null);
    console.log("Fetching revision designs from Supabase...");

    try {
      const { data: desainsData, error: fetchError } = await supabase
        .from('desains')
        .select('*')
        .eq('status', 'revisi')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      console.log("Fetched revision designs:", desainsData);
      setData(desainsData);
      setFilteredData(desainsData);
    } catch (err) {
      console.error("Error fetching designs:", err.message);
      setError("Gagal memuat data desain revisi.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getDesains();
  }, []);

  // Efek untuk filtering data berdasarkan search query
  useEffect(() => {
    if(data) {
        const result = data.filter(item =>
        item.nama_client.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(result);
    }
  }, [searchQuery, data]);

  // Fungsi untuk menyetujui revisi
  const handleSetujui = async (id) => {
    console.log(`Approving design with id: ${id}`);
    if (window.confirm('Apakah Anda yakin ingin menyetujui desain ini? Status akan diubah menjadi "selesai".')) {
        const { error } = await supabase
        .from('desains')
        .update({ status: 'selesai' })
        .eq('id', id);

        if (error) {
            console.error("Error updating status:", error.message);
            setError('Gagal menyetujui desain.');
        } else {
            console.log("Design approved successfully.");
            setData(currentDesains => currentDesains.filter(d => d.id !== id));
            setFilteredData(currentFiltered => currentFiltered.filter(d => d.id !== id));
        }
    }
  };

  // Handler untuk membuka modal
  const handleEditClick = (desain) => {
    console.log("Opening edit modal for:", desain);
    setEditingDesain(desain);
    setIsEditModalOpen(true);
  };
  
  // Handler untuk menutup modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingDesain(null);
  };
  
  // Handler untuk memperbarui UI setelah edit berhasil
  const handleUpdateSuccess = (updatedDesain) => {
    console.log("Updating UI with new data:", updatedDesain);
    setData(prevData => prevData.map(d => d.id === updatedDesain.id ? updatedDesain : d));
    setFilteredData(prevFilteredData => prevFilteredData.map(d => d.id === updatedDesain.id ? updatedDesain : d));
  };

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center pt-20">
        <FiLoader className="animate-spin h-8 w-8 text-white" />
        <p className="ml-3 text-gray-300">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-400 pt-10">{error}</p>;
  }


  return (
    <>
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <p className="text-center text-gray-400 pt-10">
            {searchQuery ? 'Tidak ada desain revisi yang cocok.' : 'Tidak ada desain yang perlu direvisi.'}
          </p>
        ) : (
          filteredData.map((item) => (
            <div key={item.id} className="glassmorphism rounded-xl overflow-hidden w-full max-w-lg mx-auto">
              {/* Card Header */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-bold text-white">{capitalizeWords(item.nama_client)}</p>
                  <p className="text-xs text-gray-400">{formatDate(item.tanggal_briefing)}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>

              {/* Card Image Slider */}
              <ImageSlider files={item.hasil_desain} clientName={item.nama_client} />

              {/* Card Footer */}
              <div className="p-4">
                <div className="flex items-center space-x-4 mb-3">
                   <button onClick={() => handleEditClick(item)} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                    <FiEdit />
                    <span>Edit Brief</span>
                  </button>
                  <button onClick={() => handleSetujui(item.id)} className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors">
                    <FiCheck />
                    <span>Setujui</span>
                  </button>
                  <a 
                    href={item.hasil_desain && item.hasil_desain.length > 0 ? item.hasil_desain[0] : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    download
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FiDownload />
                    <span>Unduh</span>
                  </a>
                </div>
                <p className="text-sm text-gray-300">
                  {item.briefing}
                </p>
              </div>
            </div>
          ))
        )}
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

export default DesainRevisi;

