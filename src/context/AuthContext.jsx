import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

// Membuat context untuk autentikasi
const AuthContext = createContext();

// Komponen Provider untuk menyediakan state autentikasi
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek sesi yang sedang aktif saat komponen pertama kali mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      console.log("Initial auth session checked:", session);
    });

    // Dengarkan perubahan state autentikasi (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log("Auth state changed:", session);
    });

    // Hentikan listener saat komponen unmount
    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user: session?.user,
    signOut: () => supabase.auth.signOut(),
  };

  // Tampilkan children hanya setelah selesai loading
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook untuk menggunakan auth context
export function useAuth() {
  return useContext(AuthContext);
}
