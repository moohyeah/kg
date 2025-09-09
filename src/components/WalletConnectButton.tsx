import React from "react";
import { ConnectButton } from "arweave-wallet-kit";

const WalletConnectButton: React.FC = () => {
  return (
    <div className="fixed top-5 right-5 z-50 bg-white/10 rounded-xl p-1 backdrop-blur-md border border-white/20">
      <ConnectButton 
        profileModal={false} 
        showBalance={false}
        accent="#667eea"
        className="rounded-lg font-semibold"
      />
    </div>
  );
};

export default WalletConnectButton;