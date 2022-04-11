import { ethers } from "ethers";
import { useContext, useEffect } from "react";
import Web3Modal from 'web3modal';
import { GlobalContext } from "../context/GlobalContext";
import logo from './../assets/BSK_LOGO.png';


const HeaderComponent = () => {

    const { account, addAccount, delAccount } = useContext(GlobalContext);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask');
            return
        }
        const web3modal = new Web3Modal();
        const instance = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        addAccount({ id: address });
        
    }
    useEffect(()=>{
        if(window.ethereum) {
            window.ethereum.on('accountsChanged', accounts => {
                addAccount({ id: accounts[0] })
            })
            window.ethereum.on('chainChanged', chainId => {
                window.location.reload();
            })
        }
    }, [account]);
    return (
        <div className="w-full flex items-center justify-between  flex-col sm:flex-row">
            <div className="max-w-[100px] p-2">
                <img src={logo} alt="logo" />
            </div>
            <div className="mt-4 sm:mt-0">
                {account ? (
                    <div className="flex items-center flex-col">
                        <a
                            href={`https://etherscan.io/address/${account}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-300 rounded-full">
                            {account.slice(0, 5) + '...' + account.slice(38, 42)}
                        </a>
                        <button className="text-xs text-right hover:text-yellow-500" onClick={() => delAccount()}>Disconnect</button>
                    </div>
                ) : (
                    <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-300 rounded-full" onClick={() => connectWallet()}>Connect Wallet</button>
                )}
            </div>

        </div>
    );
};

export default HeaderComponent;
