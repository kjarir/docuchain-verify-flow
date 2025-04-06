// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateValidator {
    struct Certificate {
        string documentId;
        address issuer;
        uint256 timestamp;
        bool isValid;
    }

    mapping(string => Certificate) public certificates;
    address public owner;

    event CertificateGenerated(string documentId, address issuer, uint256 timestamp);
    event CertificateValidated(string documentId, bool isValid);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function generateCertificate(string memory documentId) public onlyOwner {
        require(certificates[documentId].timestamp == 0, "Certificate already exists");
        
        certificates[documentId] = Certificate({
            documentId: documentId,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isValid: true
        });

        emit CertificateGenerated(documentId, msg.sender, block.timestamp);
    }

    function validateCertificate(string memory documentId) public view returns (bool) {
        return certificates[documentId].isValid;
    }

    function getCertificateDetails(string memory documentId) public view returns (Certificate memory) {
        return certificates[documentId];
    }
} 