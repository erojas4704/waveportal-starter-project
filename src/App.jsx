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
    const [stories, setStories] = useState([]);

    const contractAddress = "0x3BB2F44E55421bF0Fc7627c4E381FbD11e20f499";
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

                const stories = (await wavePortalContract.getAllStories())
                    .slice(0)
                    .reverse();

                setStories(stories); //Shorthand for
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

                const waveTxn = await wavePortalContract.postStory(inputField);
                console.log(`Mining...`, waveTxn.hash);

                await waveTxn.wait();
                console.log(`Mined -- ${waveTxn.hash}`);

                setIsLoading(false);

                console.log(`Retrieved stories: ${await wavePortalContract.getAllStories()}`);
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

                {stories.map((story, index) => (
                    <Story key={index} className="story">
                        {story}
                    </Story>
                ))}
            </div>
        </div>
    );
}
