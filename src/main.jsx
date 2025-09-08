import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext'; // Import SearchProvider
import './index.css'
import App from './App.jsx'

// Log untuk debugging saat aplikasi dimulai
console.log("Application root is rendering");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider> {/* // Membungkus App dengan SearchProvider */}
          <App />
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
