import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiEdit, FiCheck, FiDownload } from 'react-icons/fi';
import EditModal from '../modals/EditModal';

function DesainRevisi() {
  const [desains, setDesains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDesain, setSelectedDesain] = useState(null);

  // Fungsi untuk mengambil data revisi dari Supabase
  const getDesains = async () => {
    console.log("Fetching revision designs for client...");
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
      .eq('status', 'revisi')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching designs:", error.message);
      setError('Gagal memuat data desain revisi.');
      setDesains([]);
    } else {
      console.log("Successfully fetched designs:", data);
      setDesains(data);
      setError('');
    }
    setLoading(false);
  };

  useEffect(() => {
    getDesains();
  }, []);

  // Fungsi untuk menyetujui revisi
  const handleSetujui = async (id) => {
    console.log(`Approving design with id: ${id}`);
    const { error } = await supabase
      .from('desains')
      .update({ status: 'selesai' })
      .eq('id', id);

    if (error) {
      console.error("Error updating status:", error.message);
      setError('Gagal menyetujui desain.');
    } else {
      console.log("Design approved successfully.");
      setDesains(currentDesains => currentDesains.filter(d => d.id !== id));
    }
  };

  // Fungsi untuk menyimpan briefing dan file yang diedit
  const handleSaveChanges = async (id, newBriefing, filesToUpdate) => {
    console.log(`Saving changes for id: ${id}`);
    try {
      let newUploadedUrls = [];

      if (filesToUpdate.new.length > 0) {
        console.log(`Uploading ${filesToUpdate.new.length} new files to 'desain-files'.`);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User tidak login, tidak dapat mengunggah file.");

        const uploadPromises = filesToUpdate.new.map(file => {
          const fileName = `${user.id}/${id}/${Date.now()}-${file.name}`;
          return supabase.storage.from('desain-files').upload(fileName, file);
        });

        const uploadResults = await Promise.all(uploadPromises);

        for (const result of uploadResults) {
          if (result.error) {
            throw new Error(`Upload error: ${result.error.message}`);
          }
          const { data: urlData } = supabase.storage.from('desain-files').getPublicUrl(result.data.path);
          newUploadedUrls.push(urlData.publicUrl);
        }
        console.log("New files uploaded successfully:", newUploadedUrls);
      }

      const finalFileUrls = [...filesToUpdate.current, ...newUploadedUrls];

      const { error: dbError } = await supabase
        .from('desains')
        .update({
          briefing: newBriefing,
          files: finalFileUrls,
          briefing_dilihat: false
        })
        .eq('id', id);

      if (dbError) {
        throw new Error(`Database update error: ${dbError.message}`);
      }

      console.log("Briefing and files saved successfully.");
      getDesains();
      setSelectedDesain(null);

    } catch (error) {
      console.error("Error in handleSaveChanges:", error.message);
      setError(`Gagal menyimpan perubahan: ${error.message}`);
    }
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

  return (
    <div className="container mx-auto p-4">
      {selectedDesain && (
        <EditModal
          isOpen={!!selectedDesain}
          onClose={() => setSelectedDesain(null)}
          onSave={handleSaveChanges}
          desain={selectedDesain}
        />
      )}

      <h1 className="text-3xl font-bold mb-6 text-white">Desain Revisi</h1>
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {desains.length > 0 ? (
            desains.map(desain => (
              <div key={desain.id} className="glassmorphism rounded-lg overflow-hidden flex flex-col">
                <img
                  src={desain.hasil_desain && desain.hasil_desain.length > 0 ? desain.hasil_desain[desain.hasil_desain.length - 1] : 'https://placehold.co/600x400/27272a/FFF?text=No+Image'}
                  alt={`Desain untuk ${desain.nama_client}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-white">{desain.nama_client}</h2>
                  <p className="text-sm text-gray-400 mb-2">
                    {new Date(desain.tanggal_briefing).toLocaleDateString('id-ID')}
                  </p>
                  <span className="inline-block bg-yellow-500/20 text-yellow-300 text-xs font-semibold px-2 py-1 rounded-full capitalize self-start">
                    {desain.status}
                  </span>
                  
                  {/* // Bagian Download File */}
                  <div className="mt-4 border-t border-white/10 pt-4 mb-4">
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
                        <p className="text-xs text-gray-500">Belum ada hasil desain.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <button
                      onClick={() => setSelectedDesain(desain)}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-600 rounded-md text-sm hover:bg-gray-700 transition-colors"
                    >
                      <FiEdit />
                      <span>Edit Brief</span>
                    </button>
                    <button
                      onClick={() => handleSetujui(desain.id)}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600 rounded-md text-sm hover:bg-green-700 transition-colors"
                    >
                      <FiCheck />
                      <span>Setujui</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-full">Tidak ada desain yang perlu direvisi saat ini.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default DesainRevisi;

