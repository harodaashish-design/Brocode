// ============================================
// CONFIGURATION - UPDATE AFTER DEPLOYMENT
// ============================================

// Replace this with your deployed contract address from Remix
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";

// Replace this with your contract ABI from Remix (copy from "ABI" button)
const CONTRACT_ABI = [
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
                "internalType": "string",
                "name": "certificateId",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "fileHash",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "studentName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "courseName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "issuingOrganization",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "issueTimestamp",
                "type": "uint256"
            }
        ],
        "name": "CertificateIssued",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "string",
                "name": "certificateId",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "revokeTimestamp",
                "type": "uint256"
            }
        ],
        "name": "CertificateRevoked",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "authorizedIssuer",
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
        "inputs": [
            {
                "internalType": "string",
                "name": "_certificateId",
                "type": "string"
            }
        ],
        "name": "addCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_certificateId",
                "type": "string"
            }
        ],
        "name": "certificateExists",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "certificates",
        "outputs": [
            {
                "internalType": "string",
                "name": "certificateId",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "fileHash",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "studentName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "courseName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "issuingOrganization",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "issueTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isValid",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isRevoked",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_certificateId",
                "type": "string"
            }
        ],
        "name": "getCertificate",
        "outputs": [
            {
                "internalType": "string",
                "name": "certificateId",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "fileHash",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "studentName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "courseName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "issuingOrganization",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "issueTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isValid",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isRevoked",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_newIssuer",
                "type": "address"
            }
        ],
        "name": "changeAuthorizedIssuer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_certificateId",
                "type": "string"
            }
        ],
        "name": "revokeCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// ============================================
// GLOBAL VARIABLES
// ============================================

let provider = null;
let signer = null;
let contract = null;
let userAddress = null;
let demoMode = false;
let demoCertificates = {};

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('load', async () => {
    checkWalletConnection();
});

// ============================================
// WALLET CONNECTION
// ============================================

async function connectWallet() {
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            // Offer demo mode if MetaMask is not installed
            if (confirm('MetaMask is not installed. Would you like to use Demo Mode instead?\n\nDemo Mode allows you to test the UI without blockchain functionality.\nCertificates will be stored in browser memory only.')) {
                enableDemoMode();
                return;
            }
            showError('MetaMask is not installed. Please install MetaMask to use this application.');
            return;
        }

        showLoading('Connecting to wallet...');

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length === 0) {
            hideLoading();
            showError('No accounts found. Please connect your MetaMask wallet.');
            return;
        }

        // Initialize provider and signer
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();

        // Initialize contract only if address is configured
        if (CONTRACT_ADDRESS !== "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE") {
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        }

        // Check network
        const network = await provider.getNetwork();
        console.log('Connected to network:', network);

        // Update UI
        updateWalletStatus(true);
        hideLoading();
        showSuccess('Wallet connected successfully!');

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

    } catch (error) {
        hideLoading();
        console.error('Wallet connection error:', error);
        if (error.code === 4001) {
            showError('Connection rejected by user. Please try again.');
        } else {
            showError('Failed to connect wallet: ' + error.message);
        }
    }
}

function enableDemoMode() {
    demoMode = true;
    userAddress = '0x0000000000000000000000000000000000000000';
    updateWalletStatus(true);
    showSuccess('Demo Mode enabled! Certificates will be stored in browser memory only.');
    
    // Add demo mode indicator to the page
    const navContainer = document.querySelector('.nav-container');
    if (!document.getElementById('demoIndicator')) {
        const demoIndicator = document.createElement('div');
        demoIndicator.id = 'demoIndicator';
        demoIndicator.style.cssText = 'background: #f6ad55; color: #000; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem;';
        demoIndicator.textContent = '⚠️ DEMO MODE';
        navContainer.appendChild(demoIndicator);
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        updateWalletStatus(false);
        showError('Wallet disconnected. Please reconnect.');
    } else {
        userAddress = accounts[0];
        updateWalletStatus(true);
    }
}

function handleChainChanged() {
    // Reload page on network change
    window.location.reload();
}

async function checkWalletConnection() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                userAddress = await signer.getAddress();
                
                if (CONTRACT_ADDRESS !== "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE") {
                    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
                }
                
                updateWalletStatus(true);
            }
        }
    } catch (error) {
        console.error('Error checking wallet connection:', error);
    }
}

function updateWalletStatus(connected) {
    const walletStatus = document.getElementById('walletStatus');
    const connectBtn = document.getElementById('connectWalletBtn');
    
    if (connected && userAddress) {
        walletStatus.textContent = `${userAddress.substring(0, 6)}...${userAddress.substring(38)}`;
        walletStatus.classList.add('connected');
        connectBtn.textContent = 'Connected';
        connectBtn.disabled = true;
    } else {
        walletStatus.textContent = 'Not Connected';
        walletStatus.classList.remove('connected');
        connectBtn.textContent = 'Connect Wallet';
        connectBtn.disabled = false;
    }
}

// ============================================
// NAVIGATION
// ============================================

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + 'Section').classList.add('active');
}

function switchVerifyTab(method) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide verify methods
    document.getElementById('verifyById').classList.remove('active');
    document.getElementById('verifyByFile').classList.remove('active');
    
    if (method === 'id') {
        document.getElementById('verifyById').classList.add('active');
    } else {
        document.getElementById('verifyByFile').classList.add('active');
    }
}

// ============================================
// FILE HASHING
// ============================================

async function calculateFileHash(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target.result;
                const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                resolve('0x' + hashHex);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsArrayBuffer(file);
    });
}

// ============================================
// ISSUE CERTIFICATE
// ============================================

async function handleIssueCertificate(event) {
    event.preventDefault();
    
    // Check wallet connection
    if (!signer && !demoMode) {
        showError('Please connect your wallet first.');
        return;
    }
    
    // Check contract configuration (not required for demo mode)
    if (!demoMode && !contract) {
        showError('Smart contract not configured. Please deploy the contract and update CONTRACT_ADDRESS in app.js.');
        return;
    }
    
    // Get form values
    const studentName = document.getElementById('studentName').value.trim();
    const certificateId = document.getElementById('certificateId').value.trim();
    const courseName = document.getElementById('courseName').value.trim();
    const issuingOrganization = document.getElementById('issuingOrganization').value.trim();
    const certificateFile = document.getElementById('certificateFile').files[0];
    
    // Validate inputs
    if (!studentName || !certificateId || !courseName || !issuingOrganization) {
        showError('Please fill in all required fields.');
        return;
    }
    
    if (!certificateFile) {
        showError('Please upload a certificate PDF file.');
        return;
    }
    
    if (certificateFile.type !== 'application/pdf') {
        showError('Only PDF files are supported.');
        return;
    }
    
    try {
        showLoading('Calculating file hash...');
        
        // Calculate file hash
        const fileHash = await calculateFileHash(certificateFile);
        
        if (demoMode) {
            // Demo mode: Store in browser memory
            showLoading('Issuing certificate in Demo Mode...');
            
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check for duplicate
            if (demoCertificates[certificateId]) {
                hideLoading();
                showError('A certificate with this ID already exists. Please use a unique ID.');
                return;
            }
            
            // Store certificate in demo memory
            demoCertificates[certificateId] = {
                certificateId: certificateId,
                fileHash: fileHash,
                studentName: studentName,
                courseName: courseName,
                issuingOrganization: issuingOrganization,
                issueTimestamp: Math.floor(Date.now() / 1000),
                isValid: true,
                isRevoked: false
            };
            
            hideLoading();
            
            // Show success message
            const successDiv = document.getElementById('issueSuccess');
            const resultContainer = document.getElementById('issueResult');
            
            successDiv.innerHTML = `
                <h3>✓ Certificate Issued Successfully! (Demo Mode)</h3>
                <p><strong>Certificate ID:</strong> ${certificateId}</p>
                <p><strong>Student Name:</strong> ${studentName}</p>
                <p><strong>Course Name:</strong> ${courseName}</p>
                <p><strong>Issuing Organization:</strong> ${issuingOrganization}</p>
                <p><strong>File Hash:</strong> ${fileHash}</p>
                <p style="color: #f6ad55; margin-top: 10px;">Note: This certificate is stored in browser memory only and will be lost when you refresh the page.</p>
            `;
            
            successDiv.classList.remove('hidden');
            resultContainer.classList.remove('hidden');
            document.getElementById('issueError').classList.add('hidden');
            
            // Reset form
            document.getElementById('issueForm').reset();
        } else {
            // Blockchain mode
            showLoading('Issuing certificate on blockchain...');
            
            // Call smart contract
            const tx = await contract.addCertificate(
                certificateId,
                fileHash,
                studentName,
                courseName,
                issuingOrganization
            );
            
            showLoading('Waiting for transaction confirmation...');
            
            // Wait for transaction to be mined
            const receipt = await tx.wait();
            
            hideLoading();
            
            // Show success message
            const successDiv = document.getElementById('issueSuccess');
            const resultContainer = document.getElementById('issueResult');
            
            successDiv.innerHTML = `
                <h3>✓ Certificate Issued Successfully!</h3>
                <p><strong>Certificate ID:</strong> ${certificateId}</p>
                <p><strong>Transaction Hash:</strong> ${receipt.transactionHash}</p>
                <p><strong>Block Number:</strong> ${receipt.blockNumber}</p>
            `;
            
            successDiv.classList.remove('hidden');
            resultContainer.classList.remove('hidden');
            document.getElementById('issueError').classList.add('hidden');
            
            // Reset form
            document.getElementById('issueForm').reset();
        }
        
    } catch (error) {
        hideLoading();
        console.error('Error issuing certificate:', error);
        
        if (error.code === 4001) {
            showError('Transaction rejected by user.');
        } else if (error.message.includes('Only authorized issuer')) {
            showError('You are not authorized to issue certificates. Only the contract deployer can issue certificates.');
        } else if (error.message.includes('already exists')) {
            showError('A certificate with this ID already exists. Please use a unique ID.');
        } else {
            showError('Failed to issue certificate: ' + error.message);
        }
    }
}

// ============================================
// VERIFY CERTIFICATE BY ID
// ============================================

async function handleVerifyById(event) {
    event.preventDefault();
    
    // Check wallet connection
    if (!provider && !demoMode) {
        showError('Please connect your wallet first.');
        return;
    }
    
    // Check contract configuration (not required for demo mode)
    if (!demoMode && CONTRACT_ADDRESS === "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE") {
        showError('Smart contract not configured. Please deploy the contract and update CONTRACT_ADDRESS in app.js.');
        return;
    }
    
    const certificateId = document.getElementById('verifyCertificateId').value.trim();
    
    if (!certificateId) {
        showError('Please enter a certificate ID.');
        return;
    }
    
    try {
        showLoading('Retrieving certificate from blockchain...');
        
        let cert;
        
        if (demoMode) {
            // Demo mode: Retrieve from browser memory
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (!demoCertificates[certificateId]) {
                hideLoading();
                showError('Certificate not found in Demo Mode.');
                return;
            }
            
            cert = demoCertificates[certificateId];
        } else {
            // Blockchain mode
            // Create read-only contract instance
            const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            
            // Check if certificate exists
            const exists = await readOnlyContract.certificateExists(certificateId);
            
            if (!exists) {
                hideLoading();
                showError('Certificate not found on the blockchain.');
                return;
            }
            
            // Get certificate details
            cert = await readOnlyContract.getCertificate(certificateId);
        }
        
        hideLoading();
        
        // Display certificate details
        const detailsDiv = document.getElementById('certificateDetails');
        const resultContainer = document.getElementById('verifyIdResult');
        
        const issueDate = new Date(cert.issueTimestamp * 1000).toLocaleString();
        
        if (cert.isRevoked) {
            detailsDiv.innerHTML = `
                <h3>⚠️ Certificate Revoked</h3>
                <p><strong>Certificate ID:</strong> ${cert.certificateId}</p>
                <p><strong>Student Name:</strong> ${cert.studentName}</p>
                <p><strong>Course Name:</strong> ${cert.courseName}</p>
                <p><strong>Issuing Organization:</strong> ${cert.issuingOrganization}</p>
                <p><strong>Issue Date:</strong> ${issueDate}</p>
                <p><strong>Status:</strong> <span style="color: #f56565;">REVOKED</span></p>
                <p><strong>File Hash:</strong> ${cert.fileHash}</p>
            `;
        } else {
            detailsDiv.innerHTML = `
                <h3>✓ Valid Certificate</h3>
                <p><strong>Certificate ID:</strong> ${cert.certificateId}</p>
                <p><strong>Student Name:</strong> ${cert.studentName}</p>
                <p><strong>Course Name:</strong> ${cert.courseName}</p>
                <p><strong>Issuing Organization:</strong> ${cert.issuingOrganization}</p>
                <p><strong>Issue Date:</strong> ${issueDate}</p>
                <p><strong>Status:</strong> <span style="color: #48bb78;">VALID</span></p>
                <p><strong>File Hash:</strong> ${cert.fileHash}</p>
                ${demoMode ? '<p style="color: #f6ad55; margin-top: 10px;">(Demo Mode)</p>' : ''}
            `;
        }
        
        detailsDiv.classList.remove('hidden');
        document.getElementById('verifyIdError').classList.add('hidden');
        document.getElementById('verifyIdSuccess').classList.add('hidden');
        resultContainer.classList.remove('hidden');
        
    } catch (error) {
        hideLoading();
        console.error('Error verifying certificate:', error);
        showError('Failed to verify certificate: ' + error.message);
    }
}

// ============================================
// VERIFY CERTIFICATE BY FILE
// ============================================

async function handleVerifyByFile(event) {
    event.preventDefault();
    
    // Check wallet connection
    if (!provider && !demoMode) {
        showError('Please connect your wallet first.');
        return;
    }
    
    // Check contract configuration (not required for demo mode)
    if (!demoMode && CONTRACT_ADDRESS === "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE") {
        showError('Smart contract not configured. Please deploy the contract and update CONTRACT_ADDRESS in app.js.');
        return;
    }
    
    const certificateId = document.getElementById('verifyFileCertificateId').value.trim();
    const certificateFile = document.getElementById('verifyCertificateFile').files[0];
    
    if (!certificateId) {
        showError('Please enter a certificate ID.');
        return;
    }
    
    if (!certificateFile) {
        showError('Please upload a certificate PDF file.');
        return;
    }
    
    if (certificateFile.type !== 'application/pdf') {
        showError('Only PDF files are supported.');
        return;
    }
    
    try {
        showLoading('Calculating file hash...');
        
        // Calculate uploaded file hash
        const uploadedHash = await calculateFileHash(certificateFile);
        
        showLoading('Retrieving registered certificate from blockchain...');
        
        let cert;
        
        if (demoMode) {
            // Demo mode: Retrieve from browser memory
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (!demoCertificates[certificateId]) {
                hideLoading();
                showError('Certificate not found in Demo Mode.');
                return;
            }
            
            cert = demoCertificates[certificateId];
        } else {
            // Blockchain mode
            // Create read-only contract instance
            const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            
            // Check if certificate exists
            const exists = await readOnlyContract.certificateExists(certificateId);
            
            if (!exists) {
                hideLoading();
                showError('Certificate not found on the blockchain.');
                return;
            }
            
            // Get certificate details
            cert = await readOnlyContract.getCertificate(certificateId);
        }
        
        hideLoading();
        
        // Compare hashes
        const resultContainer = document.getElementById('verifyFileResult');
        const successDiv = document.getElementById('verifyFileSuccess');
        const errorDiv = document.getElementById('verifyFileError');
        
        if (cert.isRevoked) {
            errorDiv.innerHTML = `
                <h3>⚠️ Certificate Revoked</h3>
                <p>This certificate has been revoked by the issuing authority.</p>
            `;
            errorDiv.classList.remove('hidden');
            successDiv.classList.add('hidden');
            resultContainer.classList.remove('hidden');
        } else if (uploadedHash.toLowerCase() === cert.fileHash.toLowerCase()) {
            successDiv.innerHTML = `
                <h3>✓ VERIFIED</h3>
                <p>The uploaded document matches the certificate registered on the blockchain.</p>
                <p><strong>Certificate ID:</strong> ${certificateId}</p>
                <p><strong>Student Name:</strong> ${cert.studentName}</p>
                <p><strong>Course Name:</strong> ${cert.courseName}</p>
                ${demoMode ? '<p style="color: #f6ad55; margin-top: 10px;">(Demo Mode)</p>' : ''}
            `;
            successDiv.classList.remove('hidden');
            errorDiv.classList.add('hidden');
            resultContainer.classList.remove('hidden');
        } else {
            errorDiv.innerHTML = `
                <h3>✗ VERIFICATION FAILED</h3>
                <p>The uploaded document does not match the registered certificate.</p>
                <p><strong>Uploaded Hash:</strong> ${uploadedHash}</p>
                <p><strong>Registered Hash:</strong> ${cert.fileHash}</p>
            `;
            errorDiv.classList.remove('hidden');
            successDiv.classList.add('hidden');
            resultContainer.classList.remove('hidden');
        }
        
    } catch (error) {
        hideLoading();
        console.error('Error verifying file:', error);
        showError('Failed to verify file: ' + error.message);
    }
}

// ============================================
// UI HELPERS
// ============================================

function showLoading(message) {
    document.getElementById('loadingMessage').textContent = message;
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

function showSuccess(message) {
    // You can implement a toast notification here
    console.log('Success:', message);
}

function showError(message) {
    alert('Error: ' + message);
    console.error('Error:', message);
}
