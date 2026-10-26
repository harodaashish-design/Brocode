# Blockchain-Based Certificate Verification System

A college project demonstrating the use of blockchain technology for issuing and verifying digital certificates. This system uses Ethereum smart contracts to securely store certificate records on a local blockchain.

## Project Overview

This web application allows authorized issuers to issue digital certificates and anyone to verify their authenticity using either a certificate ID or by uploading the certificate PDF file. All certificate records are stored on a blockchain, ensuring immutability and transparency.

## Technologies Used

- **HTML** - Webpage structure
- **CSS** - Responsive and attractive design
- **JavaScript** - Frontend logic and certificate hashing
- **Solidity** - Blockchain smart contract
- **Remix IDE** - Smart contract compilation and deployment
- **Ganache** - Local blockchain network
- **Ethers.js** - JavaScript blockchain interaction library
- **MetaMask** - Web3 wallet for blockchain transactions

## Project Structure

```
certificate-verification-system/
│
├── index.html                  # Main HTML file with all UI sections
├── style.css                   # CSS styling with dark blue/white theme
├── app.js                      # JavaScript logic and blockchain integration
├── CertificateVerification.sol  # Solidity smart contract
└── README.md                   # This file
```

## Prerequisites

Before starting, ensure you have the following installed:

1. **VS Code** - Code editor (download from https://code.visualstudio.com/)
2. **Ganache** - Local blockchain (download from https://trufflesuite.com/ganache/)
3. **MetaMask** - Browser extension (install from https://metamask.io/)
4. **Live Server** - VS Code extension (install from VS Code extensions marketplace)

## Step-by-Step Setup Guide

### STEP 1: Install VS Code

1. Download Visual Studio Code from https://code.visualstudio.com/
2. Install it on your computer
3. Open VS Code

### STEP 2: Install and Configure Ganache

1. Download Ganache from https://trufflesuite.com/ganache/
2. Install and open Ganache
3. Click "Quickstart" to launch a local blockchain
4. Note the following information from Ganache:
   - **RPC Server**: Usually `http://127.0.0.1:7545`
   - **Network ID**: Usually `5777`
   - **Account Addresses**: Copy the first account address (this will be your authorized issuer)

### STEP 3: Set Up MetaMask for Local Ganache Network

1. Install MetaMask browser extension
2. Create a new wallet or import an existing one
3. Click the MetaMask extension icon
4. Click the network dropdown (top of MetaMask window)
5. Click "Add Network" → "Add a network manually"
6. Enter the following details:
   - **Network Name**: Ganache Local
   - **New RPC URL**: `http://127.0.0.1:7545` (or whatever Ganache shows)
   - **Chain ID**: `1337` (or whatever Ganache shows as Chain ID)
   - **Currency Symbol**: ETH
7. Click "Save"
8. Import the Ganache account into MetaMask:
   - Click the account icon in MetaMask
   - Click "Import Account"
   - Paste the private key from Ganache (click the key icon next to an account in Ganache to reveal)
   - Click "Import"
9. You should now see the imported account with ETH balance

### STEP 4: Open Remix IDE

1. Go to https://remix.ethereum.org/
2. Remix will open in your browser
3. Click the "File Explorers" icon (left sidebar)
4. Create a new file named `CertificateVerification.sol`
5. Copy the content from `CertificateVerification.sol` in this project
6. Paste it into the Remix editor

### STEP 5: Create and Compile CertificateVerification.sol

1. In Remix, click the "Solidity Compiler" icon (left sidebar)
2. Select compiler version `0.8.0` or higher (the contract uses `^0.8.0`)
3. Click "Compile CertificateVerification.sol"
4. You should see a green checkmark if compilation is successful
5. If there are errors, fix them and recompile

### STEP 6: Deploy the Contract to Ganache

1. In Remix, click the "Deploy & Run Transactions" icon (left sidebar)
2. In the "Environment" dropdown, select "Injected Provider - MetaMask"
3. MetaMask will pop up - click "Next" then "Connect"
4. Ensure the correct account (imported Ganache account) is selected
5. Click "Deploy"
6. MetaMask will pop up again - confirm the transaction
7. Wait for the transaction to complete
8. Once deployed, you'll see the contract at the bottom of the Deploy panel
9. Copy the **contract address** (starts with 0x...)

### STEP 7: Copy the Deployed Contract Address and ABI

1. **Contract Address**: Already copied from the previous step
2. **ABI**: 
   - In Remix, click the "Solidity Compiler" icon
   - Scroll down to find the "ABI" button
   - Click "ABI" and copy the entire JSON content

### STEP 8: Configure the Contract Address and ABI in app.js

1. Open the project folder in VS Code
2. Open `app.js`
3. Find the configuration section at the top:
   ```javascript
   const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
   const CONTRACT_ABI = [...];
   ```
4. Replace `YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE` with your actual contract address from Step 7
5. Replace the `CONTRACT_ABI` array with the ABI you copied from Remix
6. Save the file

### STEP 9: Run index.html Using VS Code Live Server

1. In VS Code, install the "Live Server" extension if not already installed
2. Right-click on `index.html` in the file explorer
3. Select "Open with Live Server"
4. The application will open in your default browser at `http://127.0.0.1:5500/...`

### STEP 10: Connect MetaMask to the Application

1. In the browser, click the "Connect Wallet" button in the top right
2. MetaMask will pop up - click "Next" then "Connect"
3. You should see your wallet address displayed as connected
4. The button should change to "Connected"

### STEP 11: Issue a Test Certificate

1. Click "Issue Certificate" in the navigation
2. Fill in the form (use fake test data):
   - Student Name: `John Doe`
   - Certificate ID: `CERT-001` (use a unique ID)
   - Course Name: `Blockchain Development`
   - Issuing Organization: `Tech University`
   - Certificate File: Upload a test PDF file
3. Click "Issue Certificate"
4. MetaMask will pop up - confirm the transaction
5. Wait for the transaction to complete
6. You should see a success message with the transaction hash

### STEP 12: Verify the Original PDF

1. Click "Verify Certificate" in the navigation
2. Click "Verify by File" tab
3. Enter the Certificate ID: `CERT-001`
4. Upload the same PDF file you used to issue the certificate
5. Click "Verify File"
6. You should see "VERIFIED: The uploaded document matches the certificate registered on the blockchain."

### STEP 13: Modify the PDF and Verify Again

1. Make a small change to the PDF (add a space, change a letter, etc.)
2. Save the modified PDF
3. Go back to "Verify Certificate" → "Verify by File"
4. Enter the same Certificate ID: `CERT-001`
5. Upload the modified PDF
6. Click "Verify File"
7. You should see "VERIFICATION FAILED: The uploaded document does not match the registered certificate."

### STEP 14: Test Unauthorized Issuance and Certificate Revocation

**Test Unauthorized Issuance:**
1. In MetaMask, switch to a different account (not the authorized issuer)
2. Try to issue a new certificate
3. You should see an error: "You are not authorized to issue certificates"

**Test Certificate Revocation:**
1. Switch back to the authorized issuer account in MetaMask
2. Go to Remix IDE
3. In the "Deployed Contracts" section, expand your contract
4. Find the `revokeCertificate` function
5. Enter the certificate ID: `CERT-001`
6. Click "revokeCertificate"
7. Confirm the transaction in MetaMask
8. Now try to verify the certificate - it should show as "REVOKED"

## Troubleshooting

### MetaMask Issues

**Problem: MetaMask not connecting**
- Solution: Ensure MetaMask is installed and unlocked. Check that you're on the correct network (Ganache Local).

**Problem: Transaction rejected**
- Solution: Ensure you have enough ETH in your Ganache account. Check that you confirmed the transaction in MetaMask.

**Problem: Wrong network**
- Solution: In MetaMask, ensure you're connected to the "Ganache Local" network, not the mainnet or testnet.

### Network Issues

**Problem: Cannot connect to Ganache**
- Solution: Ensure Ganache is running. Check the RPC URL in MetaMask matches Ganache's RPC Server.

**Problem: Chain ID mismatch**
- Solution: Update the Chain ID in MetaMask to match what Ganache shows (usually 1337).

### Contract Address and ABI Issues

**Problem: Contract address not configured**
- Solution: Update `CONTRACT_ADDRESS` in `app.js` with your actual deployed contract address.

**Problem: ABI mismatch**
- Solution: Ensure you copied the complete ABI from Remix and replaced the entire `CONTRACT_ABI` array in `app.js`.

**Problem: Contract function not found**
- Solution: Re-compile the contract in Remix and copy the new ABI. Ensure the contract is deployed correctly.

### Browser Errors

**Problem: Page not loading**
- Solution: Ensure you're using Live Server or a local web server. Don't open `index.html` directly (file:// protocol).

**Problem: Ethers.js not loading**
- Solution: Check your internet connection. The CDN link should load automatically.

**Problem: File hash calculation fails**
- Solution: Ensure you're uploading a valid PDF file. Check browser console for specific errors.

### Common Smart Contract Errors

**Problem: "Certificate with this ID already exists"**
- Solution: Use a unique certificate ID each time. Certificate IDs must be unique.

**Problem: "Only authorized issuer can perform this action"**
- Solution: Ensure you're using the account that deployed the contract (the authorized issuer).

**Problem: "Certificate does not exist"**
- Solution: Verify the certificate ID is correct and the certificate was successfully issued.

## Security Notes

**Important Security Considerations:**

1. **This is a college demonstration project** - Not suitable for production use without additional security measures.

2. **Personal Data on Blockchain** - Student details are stored on the local blockchain for demonstration purposes. In a real deployment, consider:
   - Storing only hashes on-chain
   - Keeping personal data off-chain in a secure database
   - Using encryption for sensitive information

3. **Trust Model** - This system verifies the registered record and file integrity. The trustworthiness of the original issuer must be established separately.

4. **Private Keys** - Never share your private keys or seed phrases. The application does not store or expose private keys.

5. **Local Blockchain** - Ganache is for development only. For production, deploy to a testnet (Goerli, Sepolia) or mainnet with proper security audits.

## Features

### Home Page
- Professional homepage with project description
- Navigation to Issue and Verify sections
- Wallet connection status indicator
- Feature cards explaining the system

### Issue Certificate
- Form with all required fields
- PDF file upload support
- SHA-256 hash calculation using Web Crypto API
- Blockchain transaction handling
- Success/error message display

### Verify Certificate
- **Method A: Verify by ID** - Retrieve and display certificate details
- **Method B: Verify by File** - Compare uploaded file hash with registered hash
- Clear verification results
- Revoked certificate detection

### Smart Contract
- Certificate structure with all necessary fields
- Authorized issuer access control
- Duplicate certificate ID prevention
- Certificate revocation functionality
- Event emission for tracking

## How It Works

1. **Issuing a Certificate:**
   - Authorized issuer fills the form and uploads PDF
   - Browser calculates SHA-256 hash of the PDF
   - Hash and metadata are sent to the smart contract
   - Smart contract stores the record on the blockchain
   - Transaction is confirmed and recorded

2. **Verifying by ID:**
   - User enters certificate ID
   - Application queries the smart contract
   - Certificate details are retrieved and displayed
   - Status (valid/revoked) is shown

3. **Verifying by File:**
   - User uploads PDF and enters certificate ID
   - Browser calculates hash of uploaded file
   - Application retrieves registered hash from blockchain
   - Hashes are compared
   - Verification result is displayed

## License

This project is created for educational purposes as a college project demonstration.

## Contact

For questions about this project, please refer to your course instructor or project supervisor.

---

**Note:** This is a beginner-friendly college project. For production use, additional security measures, proper audits, and professional development practices are required.
