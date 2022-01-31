import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import { useEffect } from "react";
import { useState } from "react";
import abi from "./utils/WavePortal.json";
import Spinner from "./components/Spinner";
import Story from "./components/Story";

export default function App() {
    const [currentAccount, setCurrentAccount] = useState("");
    const [inputField, setInputField] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [waves, setWaves] = useState([]);

    const contractAddress = "0x7c9ae82F11Cb2aa81faB3A324ad1Feb29A2D9b71";
    const contractABI = abi.abi;


    const onFieldChange = (e) => {
        setInputField(e.target.value);
    }

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                console.log("Make sure you have metamask.");
            } else {
                console.log("We have ethereum", ethereum);
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log(`Found account: ${account}`);
                setCurrentAccount(account);
            } else {
                console.log("No accounts found.");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert("Get metamask!");
                return;
            }
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
            getStories();
        } catch (err) {
            console.log(err);
        }
    }

    const getStories = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
                const waves = (await wavePortalContract.getAllWaves())
                    .slice(0)
                    .reverse()
                    .map(wave => ({
                        address: wave.waver,
                        timestamp: new Date(wave.timestamp * 1000),
                        message: wave.message
                    }));
                //We reverse them so the newest are at the top.

                setWaves(waves);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const post = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                setIsLoading(true);

                const waveTxn = await wavePortalContract.wave(inputField, { gasLimit: 300000 });
                console.log(`Mining...`, waveTxn.hash);

                await waveTxn.wait();
                console.log(`Mined -- ${waveTxn.hash}`);

                setIsLoading(false);
                setInputField("");

                getStories();
                //console.log(`Retrieved stories: ${await wavePortalContract.getAllWaves()}`);
            } else {
                console.log("No ethereum");
                setIsLoading(false);
            }
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        getStories();
        let wavePortalContract;

        const onNewWave = (from, timestamp, message) => {
            console.log(`New wave from ${from} at ${timestamp} with message: ${message}`);
            setWaves(waves => [
                {
                    address: from,
                    timestamp: new Date(timestamp * 1000),
                    message: message
                },
                ...waves
            ]);
        };

        if(window.ethereum){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
            wavePortalContract.on("NewWave", onNewWave);
        }
        return () => {
            if(wavePortalContract){
                wavePortalContract.off("NewWave", onNewWave);
            }
        }
    }, []);

    return (
        <div className="mainContainer">
            <div className="dataContainer">
                <div className="header">
                    <span role="img" aria-label="wave">👋</span> Hello There
                </div>

                <div className="bio">
                    Mortals call me Eddie, I weave stories into code. Tell me a story through the Ethereum blockchain, or just say hi.
                </div>
                <textarea
                    placeholder={currentAccount !== "" ? "Tell me your story" : "Connect to your ethereum wallet first."}
                    rows={4}
                    onChange={onFieldChange}
                    value={inputField}
                    disabled={isLoading || currentAccount === ""}
                />

                {isLoading ?
                    <Spinner color="white" /> :
                    <button
                        disabled={currentAccount === ""}
                        className="waveButton"
                        onClick={post}
                    >
                        Post it!
                    </button>}
                {!currentAccount && <button className="waveButton" onClick={connectWallet}>
                    Connect Wallet
                </button>}

                {waves.map((story, index) => (
                    <Story key={index} className="story" story={story} />
                ))}
            </div>
        </div>
    );
}
