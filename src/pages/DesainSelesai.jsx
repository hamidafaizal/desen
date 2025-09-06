import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiDownload } from 'react-icons/fi';

function DesainSelesai() {
  const [desains, setDesains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fungsi untuk mengambil data desain yang sudah selesai dari Supabase
  const getDesains = async () => {
    console.log("Fetching completed designs for client...");
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("User tidak ditemukan.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('desains')
      .select('*')
      .eq('status', 'selesai')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching designs:", error.message);
      setError('Gagal memuat data desain yang telah selesai.');
      setDesains([]);
    } else {
      console.log("Successfully fetched completed designs:", data);
      setDesains(data);
      setError('');
    }
    setLoading(false);
  };
  
  // Fungsi untuk mendapatkan nama file dari URL
  const getFileNameFromUrl = (url) => {
    try {
      const urlObject = new URL(url);
      const pathParts = urlObject.pathname.split('/');
      return decodeURIComponent(pathParts[pathParts.length - 1]);
    } catch (e) {
      return 'file-tidak-dikenal';
    }
  };

  useEffect(() => {
    getDesains();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Desain Selesai</h1>
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {desains.length > 0 ? (
            desains.map(desain => (
              <div key={desain.id} className="glassmorphism rounded-lg overflow-hidden">
                <img
                  src={desain.hasil_desain && desain.hasil_desain.length > 0 ? desain.hasil_desain[desain.hasil_desain.length - 1] : 'https://placehold.co/600x400/27272a/FFF?text=No+Image'}
                  alt={`Desain untuk ${desain.nama_client}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold text-white">{desain.nama_client}</h2>
                  <p className="text-sm text-gray-400 mb-2">
                    {new Date(desain.tanggal_briefing).toLocaleDateString('id-ID')}
                  </p>
                  <span className="inline-block bg-green-500/20 text-green-300 text-xs font-semibold px-2 py-1 rounded-full capitalize">
                    {desain.status}
                  </span>
                  
                  {/* // Bagian Download File */}
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">File Hasil Desain:</h3>
                    <div className="flex flex-col space-y-2 max-h-24 overflow-y-auto">
                      {desain.hasil_desain && desain.hasil_desain.length > 0 ? (
                        desain.hasil_desain.map((fileUrl, index) => (
                          <a
                            key={index}
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="flex items-center space-x-2 text-indigo-400 hover:underline"
                          >
                            <FiDownload size={16} />
                            <span className="truncate">{getFileNameFromUrl(fileUrl)}</span>
                          </a>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">Tidak ada file.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-full">Belum ada desain yang selesai.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default DesainSelesai;

