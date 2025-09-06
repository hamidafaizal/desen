import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiPaperclip, FiX, FiSend } from 'react-icons/fi';

// Komponen Halaman Tambah Desain
function TambahDesain() {
  const { session } = useAuth();
  const navigate = useNavigate();
  
  const [namaClient, setNamaClient] = useState('');
  const [tanggalBriefing, setTanggalBriefing] = useState('');
  const [briefing, setBriefing] = useState('');
  const [files, setFiles] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fungsi yang dipanggil saat file di-drop atau dipilih
  const onDrop = useCallback(acceptedFiles => {
    console.log("Files accepted:", acceptedFiles);
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }, // Hanya menerima file gambar
    multiple: true // Mengizinkan upload banyak file
  });
  
  // Fungsi untuk menghapus file dari daftar preview
  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  // Fungsi utama untuk submit form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started.");
    
    if (!namaClient || !tanggalBriefing) {
        setError('Nama Klien dan Tanggal Briefing wajib diisi.');
        return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
        const fileUrls = [];
        // Langkah 1: Upload semua file ke Supabase Storage
        if (files.length > 0) {
            console.log(`Uploading ${files.length} files...`);
            for (const file of files) {
                const fileName = `${Date.now()}_${file.name}`;
                const filePath = `${session.user.id}/${fileName}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('desain-files')
                    .upload(filePath, file);

                if (uploadError) {
                    throw new Error(`Gagal mengunggah file: ${uploadError.message}`);
                }
                
                // Mendapatkan URL publik dari file yang baru diunggah
                const { data: { publicUrl } } = supabase.storage
                    .from('desain-files')
                    .getPublicUrl(filePath);
                
                fileUrls.push(publicUrl);
                console.log(`File uploaded: ${publicUrl}`);
            }
        }
        
        // Langkah 2: Masukkan data ke tabel 'desains'
        console.log("Inserting data into 'desains' table.");
        const { error: insertError } = await supabase
            .from('desains')
            .insert({
                nama_client: namaClient,
                tanggal_briefing: tanggalBriefing,
                briefing: briefing,
                user_id: session.user.id,
                files: fileUrls, // Menyimpan array URL
                status: 'dalam antrian'
            });

        if (insertError) {
            throw new Error(`Gagal menyimpan data desain: ${insertError.message}`);
        }

        console.log("Submission successful.");
        setMessage('Desain baru berhasil dikirim!');
        
        // Arahkan ke halaman Desain Baru setelah 2 detik
        setTimeout(() => {
            navigate('/desain-baru');
        }, 2000);

    } catch (error) {
        console.error("Submission error:", error.message);
        setError(error.message);
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Tambah Desain Baru</h1>

      {error && <p className="text-red-400 bg-red-500/20 p-3 rounded-lg text-center">{error}</p>}
      {message && <p className="text-green-400 bg-green-500/20 p-3 rounded-lg text-center">{message}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Input Nama Client */}
        <input
          type="text"
          placeholder="Nama Client"
          value={namaClient}
          onChange={(e) => setNamaClient(e.target.value)}
          required
          className="w-full p-3 bg-gray-800/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Input Tanggal */}
        <input
          type="date"
          value={tanggalBriefing}
          onChange={(e) => setTanggalBriefing(e.target.value)}
          required
          className="w-full p-3 bg-gray-800/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Textarea Briefing */}
        <textarea
          placeholder="Silahkan tulis briefing desain disini"
          rows="6"
          value={briefing}
          onChange={(e) => setBriefing(e.target.value)}
          className="w-full p-3 bg-gray-800/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Dropzone */}
        <div {...getRootProps()} className="border-2 border-dashed border-gray-600 rounded-lg p-10 text-center cursor-pointer hover:border-purple-500 transition-colors">
          <input {...getInputProps()} />
          <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          {isDragActive ?
            <p className="mt-2 text-gray-300">Lepaskan file di sini...</p> :
            <p className="mt-2 text-gray-300">Seret & lepas file di sini, atau klik untuk memilih file</p>
          }
        </div>

        {/* File Preview */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-300">File yang akan diunggah:</h3>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-800/60 p-2 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <FiPaperclip className="text-gray-400" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <button type="button" onClick={() => removeFile(file)} className="text-red-400 hover:text-red-300">
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center space-x-2 p-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors disabled:bg-purple-800 disabled:cursor-not-allowed"
        >
          <FiSend />
          <span>{loading ? 'Mengirim...' : 'Kirim Ke Desainer'}</span>
        </button>
      </form>
    </div>
  );
}

export default TambahDesain;
