// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateVerification {
    
    // Structure to store certificate details
    struct Certificate {
        string certificateId;
        bytes32 fileHash;
        string studentName;
        string courseName;
        string issuingOrganization;
        uint256 issueTimestamp;
        bool isValid;
        bool isRevoked;
    }
    
    // Mapping from certificate ID to certificate record
    mapping(string => Certificate) public certificates;
    
    // Address of the authorized issuer
    address public authorizedIssuer;
    
    // Events
    event CertificateIssued(
        string indexed certificateId,
        bytes32 fileHash,
        string studentName,
        string courseName,
        string issuingOrganization,
        uint256 issueTimestamp
    );
    
    event CertificateRevoked(
        string indexed certificateId,
        uint256 revokeTimestamp
    );
    
    // Modifier to restrict function access to authorized issuer only
    modifier onlyAuthorizedIssuer() {
        require(msg.sender == authorizedIssuer, "Only authorized issuer can perform this action");
        _;
    }
    
    // Constructor to set the authorized issuer
    constructor() {
        authorizedIssuer = msg.sender;
    }
    
    // Function to add a new certificate
    function addCertificate(
        string memory _certificateId,
        bytes32 _fileHash,
        string memory _studentName,
        string memory _courseName,
        string memory _issuingOrganization
    ) public onlyAuthorizedIssuer {
        // Validate inputs
        require(bytes(_certificateId).length > 0, "Certificate ID cannot be empty");
        require(_fileHash != bytes32(0), "File hash cannot be empty");
        require(bytes(_studentName).length > 0, "Student name cannot be empty");
        require(bytes(_courseName).length > 0, "Course name cannot be empty");
        require(bytes(_issuingOrganization).length > 0, "Issuing organization cannot be empty");
        
        // Check for duplicate certificate ID
        require(!certificates[_certificateId].isValid, "Certificate with this ID already exists");
        
        // Create and store the certificate
        certificates[_certificateId] = Certificate({
            certificateId: _certificateId,
            fileHash: _fileHash,
            studentName: _studentName,
            courseName: _courseName,
            issuingOrganization: _issuingOrganization,
            issueTimestamp: block.timestamp,
            isValid: true,
            isRevoked: false
        });
        
        // Emit event
        emit CertificateIssued(
            _certificateId,
            _fileHash,
            _studentName,
            _courseName,
            _issuingOrganization,
            block.timestamp
        );
    }
    
    // Function to get certificate details
    function getCertificate(string memory _certificateId) public view returns (
        string memory certificateId,
        bytes32 fileHash,
        string memory studentName,
        string memory courseName,
        string memory issuingOrganization,
        uint256 issueTimestamp,
        bool isValid,
        bool isRevoked
    ) {
        require(certificates[_certificateId].isValid || certificates[_certificateId].isRevoked, "Certificate does not exist");
        
        Certificate memory cert = certificates[_certificateId];
        return (
            cert.certificateId,
            cert.fileHash,
            cert.studentName,
            cert.courseName,
            cert.issuingOrganization,
            cert.issueTimestamp,
            cert.isValid,
            cert.isRevoked
        );
    }
    
    // Function to check if a certificate exists
    function certificateExists(string memory _certificateId) public view returns (bool) {
        return certificates[_certificateId].isValid || certificates[_certificateId].isRevoked;
    }
    
    // Function to revoke a certificate
    function revokeCertificate(string memory _certificateId) public onlyAuthorizedIssuer {
        require(certificates[_certificateId].isValid, "Certificate does not exist or is already revoked");
        
        certificates[_certificateId].isValid = false;
        certificates[_certificateId].isRevoked = true;
        
        emit CertificateRevoked(_certificateId, block.timestamp);
    }
    
    // Function to change the authorized issuer (only current issuer can do this)
    function changeAuthorizedIssuer(address _newIssuer) public onlyAuthorizedIssuer {
        require(_newIssuer != address(0), "New issuer address cannot be zero address");
        authorizedIssuer = _newIssuer;
    }
}
