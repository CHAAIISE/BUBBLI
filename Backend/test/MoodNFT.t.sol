// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import "../src/MoodNFT.sol";

contract MoodNFTTest is Test {
    MoodNFT public nft;
    address public owner;
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        owner = address(this);
        nft = new MoodNFT();
    }

    // Test 1: Mint basique avec humeur HAPPY
    function testMintNFTHappy() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintNFT(MoodNFT.Mood.HAPPY);

        assertEq(nft.ownerOf(tokenId), user1);
        assertEq(uint256(nft.getMood(tokenId)), uint256(MoodNFT.Mood.HAPPY));
        assertTrue(nft.hasMinted(user1));
        assertEq(nft.totalSupply(), 1);
    }

    // Test 2: Mint avec différentes humeurs
    function testMintWithDifferentMoods() public {
        vm.prank(user1);
        uint256 id1 = nft.mintNFT(MoodNFT.Mood.SAD);

        vm.prank(user2);
        uint256 id2 = nft.mintNFT(MoodNFT.Mood.EXCITEMENT);

        assertEq(uint256(nft.getMood(id1)), uint256(MoodNFT.Mood.SAD));
        assertEq(uint256(nft.getMood(id2)), uint256(MoodNFT.Mood.EXCITEMENT));
    }

    // Test 3: Ne peut pas minter deux fois
    function testCannotMintTwice() public {
        vm.startPrank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.expectRevert("User has already minted an NFT");
        nft.mintNFT(MoodNFT.Mood.SAD);
        vm.stopPrank();
    }

    // Test 4: N'importe qui peut minter (public)
    function testAnyoneCanMint() public {
        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.prank(user2);
        nft.mintNFT(MoodNFT.Mood.SAD);

        assertTrue(nft.hasMinted(user1));
        assertTrue(nft.hasMinted(user2));
    }

    // Test 5: Changer l'humeur
    function testChangeMood() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.prank(user1);
        nft.changeMood(MoodNFT.Mood.SAD);

        assertEq(uint256(nft.getMood(tokenId)), uint256(MoodNFT.Mood.SAD));
    }

    // Test 6: Tester toutes les humeurs
    function testAllMoods() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.startPrank(user1);

        nft.changeMood(MoodNFT.Mood.SAD);
        assertEq(uint256(nft.getMood(tokenId)), 1);

        nft.changeMood(MoodNFT.Mood.ANGER);
        assertEq(uint256(nft.getMood(tokenId)), 2);

        nft.changeMood(MoodNFT.Mood.FEAR);
        assertEq(uint256(nft.getMood(tokenId)), 3);

        nft.changeMood(MoodNFT.Mood.SURPRISE);
        assertEq(uint256(nft.getMood(tokenId)), 4);

        vm.stopPrank();
    }

    // Test 7: Ne peut pas changer vers la même humeur
    function testCannotChangeSameMood() public {
        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.prank(user1);
        vm.expectRevert("New mood must be different from the current mood");
        nft.changeMood(MoodNFT.Mood.HAPPY);
    }

    // Test 8: Seul le propriétaire peut changer son humeur
    function testOnlyOwnerCanChangeMood() public {
        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.prank(user2); // user2 essaie de changer l'humeur de user1
        vm.expectRevert("User has not minted an NFT");
        nft.changeMood(MoodNFT.Mood.SAD);
    }

    // Test 9: TokenURI contient les bonnes informations
    function testTokenURI() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintNFT(MoodNFT.Mood.EXCITEMENT);

        string memory uri = nft.tokenURI(tokenId);

        // Vérifie que l'URI contient les bonnes informations
        assertTrue(bytes(uri).length > 0);
        // L'URI devrait être "0?mood=9" (si baseURL est vide)
    }

    // Test 10: Récupérer le token ID par adresse
    function testGetTokenIdByAddress() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintNFT(MoodNFT.Mood.BOREDOM);

        assertEq(nft.getTokenIdByAddress(user1), tokenId);
    }

    // Test 11: Erreur si user n'a pas de NFT
    function testGetTokenIdByAddressRevert() public {
        vm.expectRevert("User has no NFT");
        nft.getTokenIdByAddress(user1);
    }

    // Test 12: Events émis correctement
    function testMintEvent() public {
        vm.expectEmit(true, false, false, true);
        emit MoodNFT.NFTMinted(user1, 0);

        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);
    }

    function testMoodChangeEvent() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.expectEmit(true, false, false, true);
        emit MoodNFT.MoodChanged(tokenId, MoodNFT.Mood.HAPPY, MoodNFT.Mood.SAD);

        vm.prank(user1);
        nft.changeMood(MoodNFT.Mood.SAD);
    }

    // Test 13: Total supply augmente correctement
    function testTotalSupply() public {
        assertEq(nft.totalSupply(), 0);

        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);
        assertEq(nft.totalSupply(), 1);

        vm.prank(user2);
        nft.mintNFT(MoodNFT.Mood.SAD);
        assertEq(nft.totalSupply(), 2);
    }

    // ============= TESTS POUR LES MESSAGES =============

    // Test 14: Définir un message
    function testSetMessage() public {
        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.prank(user1);
        nft.setMessage("Hello from my NFT!");

        uint256 tokenId = nft.userTokenId(user1);
        assertEq(nft.getMessage(tokenId), "Hello from my NFT!");
    }

    // Test 15: Récupérer son propre message
    function testGetMyMessage() public {
        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.prank(user1);
        nft.setMessage("My personal message");

        vm.prank(user1);
        string memory message = nft.getMyMessage();
        assertEq(message, "My personal message");
    }

    // Test 16: Message trop long
    function testMessageTooLong() public {
        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);

        // Créer un message de 201 caractères
        string
            memory longMessage = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

        vm.prank(user1);
        vm.expectRevert("Message too long");
        nft.setMessage(longMessage);
    }

    // Test 17: Seul le propriétaire peut définir un message
    function testOnlyOwnerCanSetMessage() public {
        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.prank(user2);
        vm.expectRevert("User has not minted an NFT");
        nft.setMessage("Trying to set message");
    }

    // Test 18: Event MessageUpdated
    function testMessageUpdatedEvent() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.expectEmit(true, false, false, true);
        emit MoodNFT.MessageUpdated(tokenId, "Test message");

        vm.prank(user1);
        nft.setMessage("Test message");
    }

    // Test 19: Mettre à jour un message existant
    function testUpdateMessage() public {
        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.startPrank(user1);
        nft.setMessage("First message");
        nft.setMessage("Updated message");
        vm.stopPrank();

        uint256 tokenId = nft.userTokenId(user1);
        assertEq(nft.getMessage(tokenId), "Updated message");
    }

    // ============= TESTS SOULBOUND (NON-TRANSFÉRABLE) =============

    // Test 20: Ne peut pas transférer le NFT
    function testCannotTransferNFT() public {
        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);
        uint256 tokenId = nft.userTokenId(user1);

        vm.prank(user1);
        vm.expectRevert("Soulbound: Transfer not allowed");
        nft.transferFrom(user1, user2, tokenId);
    }

    // Test 21: Ne peut pas utiliser safeTransferFrom
    function testCannotSafeTransferNFT() public {
        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);
        uint256 tokenId = nft.userTokenId(user1);

        vm.prank(user1);
        vm.expectRevert("Soulbound: Transfer not allowed");
        nft.safeTransferFrom(user1, user2, tokenId);
    }

    // Test 22: Ne peut pas approuver
    function testCannotApprove() public {
        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);
        uint256 tokenId = nft.userTokenId(user1);

        vm.prank(user1);
        vm.expectRevert("Soulbound: Approval not allowed");
        nft.approve(user2, tokenId);
    }

    // Test 23: Ne peut pas setApprovalForAll
    function testCannotSetApprovalForAll() public {
        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.prank(user1);
        vm.expectRevert("Soulbound: Approval not allowed");
        nft.setApprovalForAll(user2, true);
    }

    // ============= TESTS COMPLETS D'INTÉGRATION =============

    // Test 24: Workflow complet
    function testCompleteWorkflow() public {
        // 1. Mint
        vm.prank(user1);
        uint256 tokenId = nft.mintNFT(MoodNFT.Mood.HAPPY);
        assertEq(nft.ownerOf(tokenId), user1);

        // 2. Définir un message
        vm.prank(user1);
        nft.setMessage("I'm feeling great!");
        assertEq(nft.getMessage(tokenId), "I'm feeling great!");

        // 3. Changer l'humeur
        vm.prank(user1);
        nft.changeMood(MoodNFT.Mood.EXCITEMENT);
        assertEq(
            uint256(nft.getMood(tokenId)),
            uint256(MoodNFT.Mood.EXCITEMENT)
        );

        // 4. Mettre à jour le message
        vm.prank(user1);
        nft.setMessage("Now I'm full of excitement!");
        assertEq(nft.getMessage(tokenId), "Now I'm full of excitement!");

        // 5. Vérifier qu'on ne peut pas transférer
        vm.prank(user1);
        vm.expectRevert("Soulbound: Transfer not allowed");
        nft.transferFrom(user1, user2, tokenId);
    }

    // Test 25: Message vide est valide
    function testEmptyMessage() public {
        vm.prank(user1);
        nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.prank(user1);
        nft.setMessage("");

        uint256 tokenId = nft.userTokenId(user1);
        assertEq(nft.getMessage(tokenId), "");
    }

    // Test 26: Tester toutes les humeurs disponibles
    function testAllMoodsAvailable() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintNFT(MoodNFT.Mood.HAPPY);

        vm.startPrank(user1);

        // Test chaque humeur
        nft.changeMood(MoodNFT.Mood.SAD);
        assertEq(uint256(nft.getMood(tokenId)), uint256(MoodNFT.Mood.SAD));

        nft.changeMood(MoodNFT.Mood.ANGER);
        assertEq(uint256(nft.getMood(tokenId)), uint256(MoodNFT.Mood.ANGER));

        nft.changeMood(MoodNFT.Mood.FEAR);
        assertEq(uint256(nft.getMood(tokenId)), uint256(MoodNFT.Mood.FEAR));

        nft.changeMood(MoodNFT.Mood.SURPRISE);
        assertEq(uint256(nft.getMood(tokenId)), uint256(MoodNFT.Mood.SURPRISE));

        nft.changeMood(MoodNFT.Mood.BOREDOM);
        assertEq(uint256(nft.getMood(tokenId)), uint256(MoodNFT.Mood.BOREDOM));

        nft.changeMood(MoodNFT.Mood.SHAME);
        assertEq(uint256(nft.getMood(tokenId)), uint256(MoodNFT.Mood.SHAME));

        nft.changeMood(MoodNFT.Mood.DETERMINATION);
        assertEq(
            uint256(nft.getMood(tokenId)),
            uint256(MoodNFT.Mood.DETERMINATION)
        );

        nft.changeMood(MoodNFT.Mood.EXCITEMENT);
        assertEq(
            uint256(nft.getMood(tokenId)),
            uint256(MoodNFT.Mood.EXCITEMENT)
        );

        nft.changeMood(MoodNFT.Mood.KAWAII);
        assertEq(uint256(nft.getMood(tokenId)), uint256(MoodNFT.Mood.KAWAII));

        nft.changeMood(MoodNFT.Mood.SLEEPY);
        assertEq(uint256(nft.getMood(tokenId)), uint256(MoodNFT.Mood.SLEEPY));

        nft.changeMood(MoodNFT.Mood.MISCHIEVOUS);
        assertEq(
            uint256(nft.getMood(tokenId)),
            uint256(MoodNFT.Mood.MISCHIEVOUS)
        );

        vm.stopPrank();
    }
}
