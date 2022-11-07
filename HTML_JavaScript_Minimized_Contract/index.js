import { ethers } from "./ethers-5.6.esm.min.js";
console.log(window.ethereum ? "true" : "false");

// connect Button
const connectButton = document.getElementById("connectButton");
const connect = async () => {
  if (typeof window.ethereum !== "undefined") {
    let accounts;
    try {
      accounts = await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectButton.innerHTML = "Connected";
    console.log("Connected Account : ", accounts);
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
};
connectButton.onclick = connect;

// getBalance Button
import { contractAddress } from "./constants.js";
const balanceButton = document.getElementById("balanceButton");
const getBalance = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const balance = await provider.getBalance(contractAddress);
      console.log("Contract Balance : ", ethers.utils.formatEther(balance));
    } catch (error) {
      console.log(error);
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask";
  }
};
balanceButton.onclick = getBalance;

//fund Button
import { abi } from "./constants.js";
const fundButton = document.getElementById("fundButton");

// transaction Listener
const listenForTransactionMine = (transactionResponse, provider) => {
  console.log(`Mining transaction hash : ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, transactionReceipt => {
        console.log(`Completed with ${transactionReceipt.confirmations} confirmations. `);
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

const fund = async () => {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask";
  }
};
fundButton.onclick = fund;

// withdraw Button
const withdrawButton = document.getElementById("withdrawButton");
const withdraw  =async()=> {
    console.log(`Withdrawing...`)
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const transactionResponse = await contract.withdraw()
        await listenForTransactionMine(transactionResponse, provider)
        // await transactionResponse.wait(1)
        console.log("Successfully withdrawn!!!")
      } catch (error) {
        console.log(error)
      }
    } else {
      withdrawButton.innerHTML = "Please install MetaMask"
    }
  }
withdrawButton.onclick = withdraw;
