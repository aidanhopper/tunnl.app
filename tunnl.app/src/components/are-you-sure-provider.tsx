'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type AreYouSureContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AreYouSureContext = createContext<AreYouSureContextType | undefined>(undefined);

export const AreYouSureProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <AreYouSureContext.Provider value={{ open, setOpen }}>
      {children}
    </AreYouSureContext.Provider>
  );
};

export const useAreYouSure = () => {
  const context = useContext(AreYouSureContext);
  if (!context) throw new Error("useAreYouSure must be used within AreYouSureProvider");
  return context;
};
