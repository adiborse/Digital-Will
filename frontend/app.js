const contractAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_nominee",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_releaseTime",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "nominee",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "releaseTime",
        "type": "uint256"
      }
    ],
    "name": "WillCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      }
    ],
    "name": "WillUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getWill",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nominee",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "releaseTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "data",
        "type": "string"
      }
    ],
    "name": "setWill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let provider;
let signer;

const connectButton = document.getElementById("connectButton");
const saveButton = document.getElementById("saveButton");
const fetchButton = document.getElementById("fetchButton");
const walletAddress = document.getElementById("walletAddress");
const statusMessage = document.getElementById("statusMessage");
const willOutput = document.getElementById("willOutput");

function setStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = type;
}

function getContractAddress() {
  const address = document.getElementById("contractAddress").value.trim();

  if (!address) {
    throw new Error("Please enter the deployed contract address.");
  }

  if (!ethers.isAddress(address)) {
    throw new Error("Please enter a valid Ethereum contract address.");
  }

  return address;
}

function getWillText() {
  return document.getElementById("willData").value.trim();
}

async function connectMetaMask() {
  if (!window.ethereum) {
    setStatus("MetaMask is not installed in this browser.", "error");
    return;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    const address = await signer.getAddress();
    walletAddress.textContent = address;
    setStatus("MetaMask connected successfully.", "success");
  } catch (error) {
    setStatus(error.message || "Failed to connect MetaMask.", "error");
  }
}

async function getContractInstance() {
  if (!signer) {
    throw new Error("Please connect MetaMask first.");
  }

  const address = getContractAddress();
  return new ethers.Contract(address, contractAbi, signer);
}

async function saveWill() {
  try {
    const willText = getWillText();

    if (!willText) {
      throw new Error("Please enter the will data before saving.");
    }

    const contract = await getContractInstance();
    setStatus("Transaction started. Please confirm it in MetaMask...");

    const tx = await contract.setWill(willText);
    await tx.wait();

    setStatus("Will saved successfully on the blockchain.", "success");
  } catch (error) {
    setStatus(error.reason || error.message || "Failed to save the will.", "error");
  }
}

async function fetchWill() {
  try {
    const contract = await getContractInstance();
    setStatus("Fetching will data from the blockchain...");

    const data = await contract.getWill();
    willOutput.textContent = data;

    setStatus("Will fetched successfully.", "success");
  } catch (error) {
    setStatus(error.reason || error.message || "Failed to fetch the will.", "error");
  }
}

connectButton.addEventListener("click", connectMetaMask);
saveButton.addEventListener("click", saveWill);
fetchButton.addEventListener("click", fetchWill);
