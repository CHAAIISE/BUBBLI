#!/usr/bin/env node

/**
 * Script pour synchroniser manuellement un NFT existant avec MongoDB
 * Utile pour les NFTs mintés avant l'implémentation des hooks de sync
 * 
 * Usage: node sync-existing-nft.js <tokenId>
 */

const { execSync } = require('child_process');

const tokenId = process.argv[2];

if (!tokenId) {
  console.error('❌ Usage: node sync-existing-nft.js <tokenId>');
  process.exit(1);
}

const API_URL = 'https://server-nft.onrender.com/api';
const CONTRACT_ADDRESS = '0xb54b20C431e73313e9d46Ad84C55971943448Cd3';

async function getTokenDataFromBlockchain(tokenId) {
  console.log(`\n🔍 Fetching data from blockchain for tokenId ${tokenId}...`);
  
  try {
    // Récupérer l'owner
    const ownerCmd = `cast call ${CONTRACT_ADDRESS} "ownerOf(uint256)(address)" ${tokenId} --rpc-url https://sepolia.base.org`;
    const owner = execSync(ownerCmd).toString().trim();
    console.log(`✅ Owner: ${owner}`);
    
    // Récupérer le mood
    const moodCmd = `cast call ${CONTRACT_ADDRESS} "getMood(uint256)(uint8)" ${tokenId} --rpc-url https://sepolia.base.org`;
    const moodHex = execSync(moodCmd).toString().trim();
    const mood = parseInt(moodHex, 16);
    console.log(`✅ Mood: ${mood}`);
    
    // Récupérer le message
    const messageCmd = `cast call ${CONTRACT_ADDRESS} "getMessage(uint256)(string)" ${tokenId} --rpc-url https://sepolia.base.org`;
    const message = execSync(messageCmd).toString().trim().replace(/^"|"$/g, '');
    console.log(`✅ Message: "${message || '(empty)'}"`);
    
    return { owner, mood, message };
  } catch (error) {
    console.error('❌ Error fetching from blockchain:', error.message);
    throw error;
  }
}

async function syncToMongoDB(tokenId, owner, mood, message) {
  console.log(`\n📤 Syncing to MongoDB...`);
  
  try {
    const response = await fetch(`${API_URL}/nft/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenId: parseInt(tokenId),
        owner: owner.toLowerCase(),
        mood: mood,
        message: message || '',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ NFT synced to MongoDB successfully!');
      console.log(JSON.stringify(data, null, 2));
      return true;
    } else {
      console.error('❌ Error from API:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to sync:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Manual NFT Sync Tool');
  console.log('========================\n');
  console.log(`📝 Token ID: ${tokenId}`);
  console.log(`🌐 API URL: ${API_URL}`);
  console.log(`📄 Contract: ${CONTRACT_ADDRESS}`);
  
  try {
    // Étape 1: Récupérer les données depuis la blockchain
    const { owner, mood, message } = await getTokenDataFromBlockchain(tokenId);
    
    // Étape 2: Synchroniser avec MongoDB
    const success = await syncToMongoDB(tokenId, owner, mood, message);
    
    if (success) {
      console.log('\n🎉 Sync completed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ Sync failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
