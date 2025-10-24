// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/MoodNFT.sol";

contract MoodNFTDeployScript is Script {
    function run() external returns (MoodNFT) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("========================================");
        console.log("Deploying MoodNFT Contract");
        console.log("========================================");
        console.log("Deployer Address:", deployer);
        console.log("Chain ID:", block.chainid);
        console.log("----------------------------------------");

        vm.startBroadcast(deployerPrivateKey);

        // Déployer le contrat MoodNFT
        MoodNFT nft = new MoodNFT();

        vm.stopBroadcast();

        console.log("----------------------------------------");
        console.log("Deployment Successful!");
        console.log("========================================");
        console.log("MoodNFT Contract Address:", address(nft));
        console.log("Owner:", nft.owner());
        console.log("Name:", nft.name());
        console.log("Symbol:", nft.symbol());
        console.log("Total Supply:", nft.totalSupply());
        console.log("========================================");
        console.log("");
        console.log("Next Steps:");
        console.log("1. Update NEXT_PUBLIC_MOOD_NFT_ADDRESS in .env.local");
        console.log("2. Verify contract on Etherscan (optional)");
        console.log("3. Test minting from frontend");
        console.log("========================================");

        return nft;
    }
}

// Script pour tester le contrat après déploiement
contract MoodNFTTestScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Adresse du contrat déployé (à mettre à jour)
        address nftAddress = vm.envAddress("MOOD_NFT_ADDRESS");
        MoodNFT nft = MoodNFT(nftAddress);

        console.log("========================================");
        console.log("Testing MoodNFT Contract");
        console.log("========================================");
        console.log("Contract Address:", address(nft));
        console.log("Tester Address:", deployer);
        console.log("----------------------------------------");

        vm.startBroadcast(deployerPrivateKey);

        // Test 1: Mint un NFT
        console.log("Test 1: Minting NFT with HAPPY mood...");
        uint256 tokenId = nft.mintNFT(deployer, MoodNFT.Mood.HAPPY);
        console.log("Minted Token ID:", tokenId);
        console.log("Owner:", nft.ownerOf(tokenId));
        console.log("Mood:", uint256(nft.getMood(tokenId)));

        // Test 2: Définir un message
        console.log("\nTest 2: Setting message...");
        nft.setMessage("Hello from Bubbli! This is my first mood NFT!");
        console.log("Message set:", nft.getMyMessage());

        // Test 3: Changer l'humeur
        console.log("\nTest 3: Changing mood to EXCITEMENT...");
        nft.changeMood(MoodNFT.Mood.EXCITEMENT);
        console.log("New Mood:", uint256(nft.getMood(tokenId)));

        // Test 4: Mettre à jour le message
        console.log("\nTest 4: Updating message...");
        nft.setMessage("Now I'm full of excitement!");
        console.log("Updated Message:", nft.getMyMessage());

        vm.stopBroadcast();

        console.log("----------------------------------------");
        console.log("All tests passed!");
        console.log("========================================");
    }
}
