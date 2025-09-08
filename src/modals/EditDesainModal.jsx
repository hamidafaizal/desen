import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '/src/supabaseClient';
import { useAuth } from '/src/context/AuthContext';
import { FaUpload, FaTimes, FaSave, FaSpinner } from 'react-icons/fa';

// Komponen Modal untuk Edit Desain
function EditDesainModal({ desain, onClose, onUpdate }) {
  const { session } = useAuth();
  const [briefing, setBriefing] = useState('');
  const [currentFiles, setCurrentFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mengisi state saat komponen dimuat dengan data desain yang ada
  useEffect(() => {
    if (desain) {
      setBriefing(desain.briefing || '');
      setCurrentFiles(desain.files || []);
    }
  }, [desain]);

  const onDrop = useCallback(acceptedFiles => {
    setNewFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true
  });

  // Fungsi untuk menghapus file yang sudah ada (dari database)
  const removeCurrentFile = (fileUrlToRemove) => {
    setCurrentFiles(currentFiles.filter(url => url !== fileUrlToRemove));
  };

  // Fungsi untuk menghapus file baru (sebelum diunggah)
  const removeNewFile = (fileToRemove) => {
    setNewFiles(newFiles.filter(file => file !== fileToRemove));
  };
  
  // Fungsi untuk menyimpan perubahan
  const handleSaveChanges = async () => {
    console.log("Saving changes for design ID:", desain.id);
    setLoading(true);
    setError('');

    try {
      // 1. Hapus file lama yang ditandai untuk dihapus dari Supabase Storage
      const filesToDelete = desain.files.filter(url => !currentFiles.includes(url));
      if (filesToDelete.length > 0) {
        const filePathsToDelete = filesToDelete.map(url => {
          const parts = new URL(url).pathname.split('/');
          // Ambil path setelah nama bucket
          return parts.slice(parts.indexOf('desain-files') + 1).join('/');
        });
        console.log("Deleting files from storage:", filePathsToDelete);
        const { error: deleteError } = await supabase.storage.from('desain-files').remove(filePathsToDelete);
        if (deleteError) throw new Error(`Gagal menghapus file lama: ${deleteError.message}`);
      }

      // 2. Unggah file baru
      const newFileUrls = [];
      if (newFiles.length > 0) {
        console.log(`Uploading ${newFiles.length} new files...`);
        for (const file of newFiles) {
          const fileName = `${Date.now()}_${file.name}`;
          const filePath = `${session.user.id}/${fileName}`;
          const { error: uploadError } = await supabase.storage.from('desain-files').upload(filePath, file);
          if (uploadError) throw new Error(`Gagal mengunggah file baru: ${uploadError.message}`);
          const { data: { publicUrl } } = supabase.storage.from('desain-files').getPublicUrl(filePath);
          newFileUrls.push(publicUrl);
        }
      }

      // 3. Siapkan payload dan perbarui database
      const updatedFileUrls = [...currentFiles, ...newFileUrls];
      
      const updatePayload = {
        briefing: briefing,
        files: updatedFileUrls,
      };

      // Tambahkan `briefing_dilihat: false` jika statusnya 'revisi'
      if (desain && desain.status === 'revisi') {
        updatePayload.briefing_dilihat = false;
        console.log("Client sent a revision. Setting briefing_dilihat to false.");
      }

      const { data, error: updateError } = await supabase
        .from('desains')
        .update(updatePayload)
        .match({ id: desain.id })
        .select();

      if (updateError) throw updateError;
      
      console.log("Update successful.");
      onUpdate(data[0]); // Kirim data yang diperbarui kembali ke komponen induk
      onClose(); // Tutup modal

    } catch (err) {
      console.error("Error saving changes:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  if (!desain) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="glassmorphism rounded-xl p-8 w-full max-w-2xl space-y-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <FaTimes size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white">Edit Desain: {desain.nama_client}</h2>
        
        {error && <p className="text-red-400 bg-red-500/20 p-3 rounded-lg text-center">{error}</p>}
        
        {/* Edit Briefing */}
        <textarea
          value={briefing}
          onChange={(e) => setBriefing(e.target.value)}
          rows="5"
          className="w-full p-3 bg-gray-800/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Tuliskan revisi atau detail briefing di sini..."
        />

        {/* Daftar File Saat Ini */}
        {currentFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-300">File Saat Ini:</h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {currentFiles.map((url, index) => (
                <li key={index} className="relative group">
                   <img src={url} alt={`file-${index}`} className="w-full h-24 object-cover rounded-md" />
                   <button onClick={() => removeCurrentFile(url)} className="absolute top-1 right-1 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <FaTimes size={12} />
                   </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dropzone untuk file baru */}
        <div {...getRootProps()} className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors">
          <input {...getInputProps()} />
          <FaUpload className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-300">{isDragActive ? "Lepaskan file..." : "Klik atau seret file baru ke sini"}</p>
        </div>

        {/* Preview file baru */}
        {newFiles.length > 0 && (
           <div className="space-y-2">
            <h3 className="font-semibold text-gray-300">File Baru:</h3>
            <ul className="space-y-2">
                {newFiles.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-800/60 p-2 rounded-lg text-sm">
                    <span className="truncate">{file.name}</span>
                    <button onClick={() => removeNewFile(file)} className="text-red-400 hover:text-red-300"><FaTimes /></button>
                  </li>
                ))}
            </ul>
           </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-4 pt-4">
          <button onClick={onClose} className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg">Batal</button>
          <button onClick={handleSaveChanges} disabled={loading} className="py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center space-x-2 disabled:bg-purple-800">
            {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
            <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditDesainModal;

