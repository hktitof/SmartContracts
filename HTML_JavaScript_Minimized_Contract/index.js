import { ethers } from "./ethers-5.6.esm.min.js"
console.log(window.ethereum?"true":"false");


// connect Button
const connectButton=document.getElementById("connectButton");
async function connect() {
    if (typeof window.ethereum!== "undefined"){
        let accounts
        try{
            accounts= await ethereum.request({method:"eth_requestAccounts"})
        }catch(error){
            console.log(error)
        }
        connectButton.innerHTML="Connected"
        console.log("Connected Account : ",accounts);
    }else{
        connectButton.innerHTML="Please install MetaMask";
    }
}
connectButton.onclick=connect


//withdraw
