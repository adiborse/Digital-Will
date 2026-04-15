const contractAbi = [
  {
    "inputs": [],
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
      },
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
const savedNominee = document.getElementById("savedNominee");
const savedReleaseTime = document.getElementById("savedReleaseTime");

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

function getNomineeAddress() {
  const address = document.getElementById("nomineeAddress").value.trim();

  if (!address) {
    throw new Error("Please enter the nominee wallet address.");
  }

  if (!ethers.isAddress(address)) {
    throw new Error("Please enter a valid nominee wallet address.");
  }

  return address;
}

function getReleaseTime() {
  const rawValue = document.getElementById("releaseTime").value;

  if (!rawValue) {
    throw new Error("Please select a release date and time.");
  }

  const releaseDate = new Date(rawValue);
  const releaseTime = Math.floor(releaseDate.getTime() / 1000);

  if (Number.isNaN(releaseTime)) {
    throw new Error("Please enter a valid release date and time.");
  }

  const currentTime = Math.floor(Date.now() / 1000);

  if (releaseTime < currentTime) {
    throw new Error("Release time must be in the future.");
  }

  return releaseTime;
}

function formatTimestamp(timestamp) {
  if (!timestamp) {
    return "Not set";
  }

  return new Date(Number(timestamp) * 1000).toLocaleString();
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

async function refreshWillDetails(contract) {
  const [nominee, releaseTime] = await Promise.all([
    contract.nominee(),
    contract.releaseTime()
  ]);

  savedNominee.textContent = nominee === ethers.ZeroAddress ? "Not set" : nominee;
  savedReleaseTime.textContent = Number(releaseTime) === 0 ? "Not set" : formatTimestamp(releaseTime);
}

async function saveWill() {
  try {
    const willText = getWillText();

    if (!willText) {
      throw new Error("Please enter the will data before saving.");
    }

    const nomineeAddress = getNomineeAddress();
    const releaseTime = getReleaseTime();
    const contract = await getContractInstance();

    setStatus("Transaction started. Please confirm it in MetaMask...");

    const tx = await contract.setWill(willText, nomineeAddress, releaseTime);
    await tx.wait();
    await refreshWillDetails(contract);

    setStatus("Will details saved successfully on the blockchain.", "success");
  } catch (error) {
    setStatus(error.reason || error.message || "Failed to save the will.", "error");
  }
}

async function fetchWill() {
  try {
    const contract = await getContractInstance();
    setStatus("Fetching will data from the blockchain...");

    await refreshWillDetails(contract);

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
