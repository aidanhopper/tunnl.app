'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Platform = 'iOS' | 'MacOS' | 'Android' | 'Windows' | 'Linux' | 'Docker';

const detectPlatform = (): Platform => {
  if (typeof navigator === 'undefined') return 'Linux';

  const ua = navigator.userAgent;

  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Macintosh|Mac OS/i.test(ua)) return 'MacOS';
  if (/Win/i.test(ua)) return 'Windows';
  if (/Linux/i.test(ua)) return 'Linux';
  if (/Docker/i.test(ua)) return 'Docker';

  return 'Linux';
};

type PlatformContextType = {
  platform: Platform | null;
  setPlatform: (platform: Platform) => void;
};

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) throw new Error('usePlatform must be used within a PlatformProvider');
  return context;
};

export const PlatformProvider = ({ children }: { children: React.ReactNode }) => {
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  return (
    <PlatformContext.Provider value={{ platform, setPlatform }}>
      {children}
    </PlatformContext.Provider>
  );
};
