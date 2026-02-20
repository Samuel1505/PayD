import React, { createContext, use, useState, ReactNode } from "react";

interface WalletContextType {
  wallet: unknown;
  setWallet: React.Dispatch<React.SetStateAction<unknown>>;
}

export const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<unknown>(null);
  return (
    <WalletContext value={{ wallet, setWallet }}>
      {children}
    </WalletContext>
  );
};

export const useWallet = () => {
  const context = use(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
