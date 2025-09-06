import { FiSearch, FiEdit, FiDownload, FiCheckCircle } from 'react-icons/fi';

// Data dummy untuk daftar desain revisi
const dummyDesainRevisi = [
  { id: 1, client: 'Warung Makan Sejahtera', tanggal: '01 Sep 2025', thumbnail: 'https://placehold.co/100x60/eab308/ffffff?text=Menu_V2', status: 'Revisi' },
  { id: 2, client: 'PT. Angin Ribut', tanggal: '30 Agu 2025', thumbnail: 'https://placehold.co/100x60/eab308/ffffff?text=Logo_Rev1', status: 'Revisi' },
];

// Fungsi untuk mendapatkan warna status
const getStatusClass = (status) => {
  if (status === 'Revisi') {
    return 'bg-orange-500/80';
  }
  return 'bg-gray-500/80';
};

// Komponen Halaman Daftar Desain Revisi
function DesainRevisi() {
  // Log untuk debugging saat komponen di-render
  console.log("DesainRevisi page rendered");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white text-center">Daftar Desain Revisi</h1>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama client..."
          className="w-full pl-10 p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* List Desain */}
      <div className="overflow-x-auto">
        <div className="min-w-full bg-gray-700/30 rounded-lg p-1">
          {dummyDesainRevisi.map((desain, index) => (
            <div key={desain.id} className="flex items-center justify-between p-3 my-2 bg-gray-900/40 rounded-lg hover:bg-gray-900/60 transition-colors">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 font-semibold">{index + 1}.</span>
                <div className="relative group">
                  <img src={desain.thumbnail} alt="Thumbnail" className="w-24 h-14 object-cover rounded-md" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-white hover:text-purple-400 transition-colors">
                      <FiDownload size={20} />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-white">{desain.client}</p>
                  <p className="text-sm text-gray-400">{desain.tanggal}</p>
                  <span className={`text-xs text-white px-2 py-1 rounded-full ${getStatusClass(desain.status)}`}>
                    {desain.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-300 hover:text-white transition-colors">
                  <FiEdit size={18} />
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-600/80 hover:bg-green-700/80 rounded-lg transition-colors">
                  <FiCheckCircle size={16} />
                  <span>Setujui</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DesainRevisi;

