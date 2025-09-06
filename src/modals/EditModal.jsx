import { useState, useEffect } from 'react';
import { FiX, FiUpload, FiTrash2, FiFileText } from 'react-icons/fi';

function EditModal({ isOpen, onClose, onSave, desain }) {
  const [briefing, setBriefing] = useState('');
  const [currentFiles, setCurrentFiles] = useState([]); // File yang sudah ada dari DB
  const [newFiles, setNewFiles] = useState([]); // File baru yang akan diunggah

  // // Mengisi state saat modal dibuka dengan data dari 'desain'
  useEffect(() => {
    if (desain) {
      console.log("EditModal opened for desain:", desain.nama_client);
      setBriefing(desain.briefing || '');
      setCurrentFiles(desain.files || []);
      setNewFiles([]); // Reset file baru setiap kali modal dibuka
    }
  }, [desain]);

  if (!isOpen) return null;

  // // Menangani pemilihan file dari input
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...selectedFiles]);
    console.log("New files selected:", selectedFiles.map(f => f.name));
  };

  // // Menghapus file yang sudah ada (dari URL)
  const handleRemoveCurrentFile = (fileUrlToRemove) => {
    setCurrentFiles(prev => prev.filter(url => url !== fileUrlToRemove));
    console.log("Removed existing file:", fileUrlToRemove);
  };

  // // Menghapus file yang baru dipilih (sebelum diunggah)
  const handleRemoveNewFile = (fileNameToRemove) => {
    setNewFiles(prev => prev.filter(file => file.name !== fileNameToRemove));
    console.log("Removed new file:", fileNameToRemove);
  };

  // // Mengirim data briefing dan file ke parent component
  const handleSave = () => {
    console.log("Saving changes from EditModal.");
    const filesToUpdate = {
      current: currentFiles, // Daftar URL file lama yang masih ada
      new: newFiles,         // Daftar objek File baru
    };
    onSave(desain.id, briefing, filesToUpdate);
  };

  // // Mendapatkan nama file dari URL untuk ditampilkan
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div
        className="glassmorphism p-6 rounded-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Edit Briefing & Files</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
            <FiX size={20} />
          </button>
        </div>

        {/* Textarea untuk Briefing */}
        <h4 className="text-lg font-semibold text-white mb-2">Briefing</h4>
        <textarea
          value={briefing}
          onChange={(e) => setBriefing(e.target.value)}
          className="w-full p-3 bg-gray-700/50 rounded-lg border border-transparent focus:border-white/20 focus:outline-none"
          rows="6"
          placeholder="Tuliskan revisi atau detail briefing di sini..."
        />

        {/* Bagian Unggah File */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-white mb-2">Files Referensi</h4>
          {/* Daftar file yang sudah ada */}
          <div className="space-y-2 mb-3 max-h-24 overflow-y-auto">
            {currentFiles.map((fileUrl, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700/50 p-2 rounded-md">
                <div className="flex items-center space-x-2 text-gray-300 overflow-hidden">
                  <FiFileText className="flex-shrink-0" />
                  <span className="truncate">{getFileNameFromUrl(fileUrl)}</span>
                </div>
                <button onClick={() => handleRemoveCurrentFile(fileUrl)} className="text-red-400 hover:text-red-500">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
          {/* Daftar file baru yang akan diunggah */}
          <div className="space-y-2 mb-3 max-h-24 overflow-y-auto">
            {newFiles.map((file, index) => (
              <div key={index} className="flex justify-between items-center bg-indigo-500/20 p-2 rounded-md">
                <div className="flex items-center space-x-2 text-indigo-300 overflow-hidden">
                  <FiFileText className="flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
                <button onClick={() => handleRemoveNewFile(file.name)} className="text-red-400 hover:text-red-500">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
          <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
            <FiUpload className="mr-2" />
            <span>Tambah File Referensi</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="px-5 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
            Batal
          </button>
          <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;

