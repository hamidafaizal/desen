import { FiSearch, FiDownload, FiCheckCircle } from 'react-icons/fi';

// Data dummy untuk daftar desain yang sudah selesai
const dummyDesainSelesai = [
  { id: 1, client: 'Kopi Kenangan Manis', tanggal: '28 Agu 2025', thumbnail: 'https://placehold.co/100x60/4ade80/ffffff?text=Logo_Final' },
  { id: 2, client: 'CV. Maju Mundur', tanggal: '27 Agu 2025', thumbnail: 'https://placehold.co/100x60/4ade80/ffffff?text=Brosur_Final' },
];

// Komponen Halaman Daftar Desain Selesai
function DesainSelesai() {
  // Log untuk debugging saat komponen di-render
  console.log("DesainSelesai page rendered");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white text-center">Daftar Desain Selesai</h1>

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
          {dummyDesainSelesai.map((desain, index) => (
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
                </div>
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                 <FiCheckCircle size={18} />
                 <span className="text-sm font-semibold">Selesai</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DesainSelesai;

