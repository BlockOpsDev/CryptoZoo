/* eslint-disable no-debugger */

import React, { useState } from "react";
import cx from "classnames";
import Popup from "reactjs-popup";
import { ethers } from "ethers";
import Variants from "tailwind-config/variants";
import { FaWallet, FaTimes } from "react-icons/fa";

import { shortAddress, humanizeEther } from "../../../lib";
import { Button } from "../../inputs/Button";
import { Card } from "../../components/Card";
import { useEthersContext } from "@cryptozoo/ethers-context";

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}


export const WalletButton: React.FC = () => {
  const [connectOpen, setConnectOpen] = useState(false);
  const closeConnect = () => setConnectOpen(false);
  const { provider, setProvider } = useEthersContext();

  const [accounts, setAccounts] = useState([]);
  const [kprBalance, setKprBalance] = useState("0");
  const [zooBalance, setZooBalance] = useState("0");

  React.useEffect(() => {
    if (provider === undefined) {
      return;
    }
    const _provider = (provider.provider as ethers.providers.Provider);

    _provider.on("accountsChanged", setAccounts);

    // TODO: Fetch Balances
    setKprBalance(humanizeEther(ethers.BigNumber.from("10000000000000000000000")));
    setZooBalance(humanizeEther(ethers.BigNumber.from("12000000000000000000000")));
  }, [provider]);

  const connectMetaMask = async () => {
    if (window.ethereum === undefined) {
      throw new Error("Metamask Not Available");
    }
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const _accounts = await _provider.send("eth_requestAccounts", []);
      setAccounts(_accounts);
      setProvider(_provider);
      closeConnect();
    } catch(e) {
      console.warn(e);
    }
  }

  const connectPopup = (
    <Popup
      open={connectOpen}
      modal
      closeOnDocumentClick={false}
      onClose={closeConnect}
      position="top center"
      overlayStyle={{
        backgroundColor: "rgba(0,0,0,0.8)"
      }}
    >
      <div className="max-w-[95vw] w-[250px] relative text-primary-text font-chakra">
        <Card layer={4} className="p-4 pt-8 w-full">
          <div className="flex flex-col gap-4">
            <button className="button bg-primary" onClick={connectMetaMask}>Metamask</button>
            <button className="button bg-primary">WalletConnect</button>
            <button className="button border-2 border-error flex gap-2 items-center justify-center" onClick={closeConnect}>
              <FaTimes />
              <span>Cancel</span>
            </button>
          </div>
        </Card>
      </div>
    </Popup>
  );


  return (
    <div className="drop-shadow font-chakra">
      {connectPopup}

      <div className={cx({ "hidden": accounts.length })}>
        <Button loading={false} onClick={() => setConnectOpen(true)} variant={Variants.Primary}>
          <div className="flex gap-1 items-center">
            <FaWallet className="mr-2" />
            <span>Connect</span>
          </div>
        </Button>
      </div>

      <div className={cx(
        "flex bg-layer--3 rounded-lg text-secondary-text w-fit",
        { "hidden": !accounts.length },
      )}>
        <div className="flex flex-col justify-end p-2 text-xs text-right">
          <span>{kprBalance} <strong>$KPR</strong></span>
          <span>{zooBalance} <strong>$ZOO</strong></span>
        </div>

        <div className="bg-layer--2 py-2 px-4 rounded-lg">
          <div className="flex items-center justify-center h-full">
            <FaWallet className="mr-2" />
            { accounts.length ? shortAddress(accounts[0]) : "" }
          </div>
        </div>
      </div>
    </div>
  );
};
