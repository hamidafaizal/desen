import { createContext, useState, useContext } from 'react';

// // Membuat context untuk state pencarian
const SearchContext = createContext();

// // Komponen Provider untuk menyediakan state pencarian
export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  // // console.log untuk debugging perubahan query
  console.log("SearchContext updated, query:", searchQuery);

  const value = {
    searchQuery,
    setSearchQuery,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

// // Custom hook untuk mempermudah penggunaan context
export function useSearch() {
  return useContext(SearchContext);
}
