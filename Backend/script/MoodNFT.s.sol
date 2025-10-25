// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/MoodNFT.sol";

contract MoodNFTDeployScript is Script {
    function run() external returns (MoodNFT) {
        // When using --account flag, Foundry handles the keystore automatically.
        // Call vm.startBroadcast() without argument to let Foundry use the account.
        console.log("========================================");
        console.log("Deploying MoodNFT Contract");
        console.log("========================================");
        console.log("Chain ID:", block.chainid);
        console.log("----------------------------------------");

        vm.startBroadcast();
        console.log("Deployer Address:", msg.sender);

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
