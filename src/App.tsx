import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { ethers } from "ethers";
import { useEffect } from "react";
import { SafeFactory } from "@safe-global/protocol-kit";
import { SafeAccountConfig } from "@safe-global/protocol-kit";

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  let ethAdapterOwner1;
  let safeFactory;

  const useEthers = async () => {
    let signer = null;
    let provider;

    if (window.ethereum == null) {
      alert("MetaMask not installed");
    } else {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      signer = provider.getSigner();
      ethAdapterOwner1 = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      });
      safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 });

      const safeAccountConfig: SafeAccountConfig = {
        owners: [await signer.getAddress()],
        threshold: 1,
      };

      // if safe exists then get it's address and connect to it
      let retrievedSafeAddress = localStorage.getItem("safeAddress");
      if (retrievedSafeAddress) {
        const safeSdk = await Safe.create({
          ethAdapter: ethAdapterOwner1,
          safeAddress: retrievedSafeAddress,
        });
        return safeSdk;
      }

      const saltNonce = Math.floor(Math.random() * 1000000).toString();
      console.log(saltNonce);
      // return;
      const safeSdkOwner1 = await safeFactory.deploySafe({
        safeAccountConfig,
        saltNonce,
      });

      const safeAddress = await safeSdkOwner1.getAddress();

      console.log("Your Safe has been deployed:");
      console.log(`https://goerli.etherscan.io/address/${safeAddress}`);
      localStorage.setItem("safeAddress", safeAddress);

      // Save this address
    }
  };

  useEffect(() => {
    // useEthers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-evenly font-NotoSans min-h-screen py-16">
      <button
        className="px-2 py-1 bg-secondary text-primary rounded-md font-semibold"
        onClick={useEthers}
      >
        Create Safe Wallet
      </button>
    </div>
  );
}

export default App;
