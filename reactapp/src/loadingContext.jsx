import React, { createContext, useState, useContext } from 'react';
import Preloader from './utils/Preloader';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && <Preloader />}
      {children}
    </LoadingContext.Provider>
  );
};
