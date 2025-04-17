// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentVerifier {
    struct Document {
        bytes32 hash;
        string signature;
        string title;
        address issuer;
        uint256 timestamp;
        bool exists;
    }

    // Mapping from document hash to Document struct
    mapping(bytes32 => Document) public documents;
    
    // Mapping from issuer address to their document hashes
    mapping(address => bytes32[]) public issuerDocuments;
    
    // Mapping from title to document hashes (for search)
    mapping(string => bytes32[]) public titleDocuments;

    event DocumentAdded(
        bytes32 indexed hash,
        string signature,
        string title,
        address indexed issuer,
        uint256 timestamp
    );

    function addDocumentWithMetadata(
        bytes32 hash,
        string memory signature,
        string memory title,
        address issuer
    ) public {
        require(!documents[hash].exists, "Document already exists");
        
        Document memory doc = Document({
            hash: hash,
            signature: signature,
            title: title,
            issuer: issuer,
            timestamp: block.timestamp,
            exists: true
        });
        
        documents[hash] = doc;
        issuerDocuments[issuer].push(hash);
        titleDocuments[title].push(hash);
        
        emit DocumentAdded(hash, signature, title, issuer, block.timestamp);
    }

    function getDocumentsByIssuer(address issuer) public view returns (bytes32[] memory) {
        return issuerDocuments[issuer];
    }
    
    function getDocumentsByTitle(string memory title) public view returns (bytes32[] memory) {
        return titleDocuments[title];
    }
    
    function getDocument(bytes32 hash) public view returns (
        bytes32,
        string memory,
        string memory,
        address,
        uint256,
        bool
    ) {
        Document memory doc = documents[hash];
        return (doc.hash, doc.signature, doc.title, doc.issuer, doc.timestamp, doc.exists);
    }

    function verifyDocument(
        bytes32 hash,
        string memory signature,
        address issuer
    ) public view returns (bool) {
        Document memory doc = documents[hash];
        return (
            doc.exists &&
            keccak256(abi.encodePacked(doc.signature)) == keccak256(abi.encodePacked(signature)) &&
            doc.issuer == issuer
        );
    }
} 