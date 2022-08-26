import React from "react";
import { ethers } from 'ethers'


export interface IEthersContext {
  provider?: ethers.providers.JsonRpcProvider;
  setProvider: React.Dispatch<ethers.providers.JsonRpcProvider>;
}

export interface EthersContextProviderProps {
  children?: React.ReactNode;
}



const EthersContext = React.createContext<IEthersContext>({
  setProvider: () => { throw new Error("EthersContext.setProvider not defined"); }
});

export const useEthersContext = () => React.useContext(EthersContext);

export const EthersContextProvider: React.FC<EthersContextProviderProps>  = ({ children }) => {
  const [provider, setProvider] = React.useState<ethers.providers.JsonRpcProvider>();
  const contextValue: IEthersContext = {
    provider,
    setProvider,
  }

  return (
    <EthersContext.Provider value={contextValue}>
      {children}
    </EthersContext.Provider>
  );
}
