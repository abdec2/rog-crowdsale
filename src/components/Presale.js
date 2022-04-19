import { ethers } from 'ethers';
import { useContext, useRef, useState } from 'react';
import Web3Modal from 'web3modal';
import { GlobalContext } from '../context/GlobalContext';

import CROWDSALE_ABI from './../abi/abi.json';
const crowdsaleAddress = "0x804Bb060DD3f87f8d1A3c451Cf89b6A995adE2D7";

function Presale() {
    const { account } = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);

    const ethPrice = useRef(null);

    const addToken = async () => {
        const tokenAddress = '0xA648ce7cF04913B77Ce5abc85F765Ee20a580Ba9';
        const tokenSymbol = 'ROG';
        const tokenDecimals = 9;
        const tokenImage = '';

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals in the token
                        image: tokenImage, // A string url of the token logo
                    },
                },
            });

            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const buyToken = async (e) => {
        try {
            e.preventDefault();
            if (!window.ethereum) {
                alert('Please install MetaMask');
                return
            }
            if (!account) {
                alert('Please connnect wallet');
                return;
            }
            setLoading(true);
            const web3modal = new Web3Modal();
            const instance = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(crowdsaleAddress, CROWDSALE_ABI, signer);
            const price = ethers.utils.parseEther(ethPrice.current.value);
            const balance = ethers.utils.formatEther(await provider.getBalance(signer.getAddress()));

            if (balance < ethPrice.current.value) {
                setLoading(false);
                alert('Insufficient Balance');
                return;
            }

            const transaction = await contract.buyTokens(account, { value: price.toString() });
            await transaction.wait();

            setLoading(false);
            alert('purchase done');
        } catch (e) {
            setLoading(false);
        }
    }

    return (
        <div className="my-11 p-7 flex items-center flex-col md:flex-row justify-between border border-white border-opacity-20 rounded-3xl shadow-xl ">
            <div className="md:pl-8 text-center md:text-left md:mr-2">
                <h1 className="text-base sm:text-xl font-bold uppercase" >Initial Coin Offering</h1>
                <h1 className="text-2xl sm:text-4xl font-bold uppercase text-yellow-500" >Ride of Gamers Token</h1>
                <button className='mt-5 px-6 py-2 bg-yellow-500 text-white rounded font-semibold' onClick={() => addToken()}>Add Token to your MetaMask</button>
                {/* <div className='mt-3 hidden md:block'>
                <p className="text-lg">For Progress, Investment & Success</p>
            </div> */}
                <div className='mt-10 text-left'>
                    <h3 className=' uppercase text-sm font-semibold mb-2 text-yellow-500'>Instructions:</h3>
                    <ul className='text-sm list-outside list-disc'>
                        <li className='ml-4'>Minimum purchase allowed: 0.01 BNB</li>
                        <li className='ml-4'>Purchase amount should be multiple of minimum purchase</li>
                    </ul>
                </div>
            </div>
            <div className="my-10 border p-10 rounded-xl border-white border-opacity-30  ">
                <form onSubmit={buyToken}>
                    <div className="my-3">
                        <label className="text-base font-bold text-yellow-500">Amount BNB</label>
                        <input ref={ethPrice} type="text" className="w-full h-12 rounded-lg p-2 text-xl focus:outline-none mt-1 bg-white bg-opacity-30" required />
                    </div>
                    <div className="my-3">
                        <label className="text-base font-bold text-yellow-500">Rate</label>
                        <input className="w-full h-12 rounded-lg p-2 text-xl focus:outline-none mt-1" type="text" value="$0.01" disabled />
                    </div>

                    <div className="mt-10">
                        <button disabled={loading} className="w-full py-2 px-6 uppercase bg-yellow-500 hover:bg-yellow-300 rounded  font-semibold">{loading ? 'Busy' : 'Buy'}</button>
                        
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Presale;
