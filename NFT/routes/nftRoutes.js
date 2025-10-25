const express = require('express');
const router = express.Router();
const NFTMetadata = require('../models/NFTMetadata');
const { generateMoodSVG, getMoodName } = require('../services/imageGenerator');

/**
 * GET /api/metadata/:tokenId
 * Retourne les métadonnées complètes du NFT (incluant l'image générée)
 * C'est l'endpoint appelé par tokenURI() du smart contract
 */
router.get('/metadata/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;

    // Récupérer les données depuis MongoDB
    const nft = await NFTMetadata.findOne({ tokenId: parseInt(tokenId) });
    
    if (!nft) {
      return res.status(404).json({ 
        error: 'NFT not found',
        tokenId: parseInt(tokenId)
      });
    }

    // Générer l'image SVG dynamique basée sur l'humeur
    const svgImage = generateMoodSVG(nft.mood, nft.message);

    // Construire les métadonnées JSON standard ERC-721
    const metadata = {
      name: `Mood NFT #${tokenId}`,
      description: `An adaptive mood NFT expressing: ${getMoodName(nft.mood)}. "${nft.message || 'No message'}"`,
      
      // Image encodée en base64 (fonctionne partout)
      image: `image/svg+xml;base64,${Buffer.from(svgImage).toString('base64')}`,
      
      // Les traits du NFT
      attributes: [
        {
          trait_type: "Mood",
          value: getMoodName(nft.mood)
        },
        {
          trait_type: "Message",
          value: nft.message || "No message"
        },
        {
          trait_type: "Last Updated",
          value: nft.lastUpdated.toISOString(),
          display_type: "date"
        },
        {
          trait_type: "Total Changes",
          value: nft.changeHistory.length
        }
      ],
      
      // Lien vers votre site
      external_url: `https://yoursite.com/nft/${tokenId}`
    };

    res.json(metadata);

  } catch (error) {
    console.error('Error fetching meta', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/nft/mint
 * Crée une nouvelle entrée NFT dans MongoDB après mint sur le smart contract
 */
router.post('/nft/mint', async (req, res) => {
  try {
    const { tokenId, owner, mood, message } = req.body;

    // Validation (tokenId peut être 0, donc on vérifie !== undefined)
    if (tokenId === undefined || !owner) {
      return res.status(400).json({ error: 'Missing required fields: tokenId, owner' });
    }

    // Vérifier si le NFT existe déjà
    const existingNFT = await NFTMetadata.findOne({ tokenId: parseInt(tokenId) });
    if (existingNFT) {
      return res.status(400).json({ error: 'NFT already exists' });
    }

    // Créer le nouveau NFT
    const newNFT = new NFTMetadata({
      tokenId: parseInt(tokenId),
      owner: owner.toLowerCase(),
      mood: mood || 0,
      message: message || '',
      changeHistory: [{
        mood: mood || 0,
        message: message || '',
        timestamp: new Date()
      }]
    });

    await newNFT.save();

    res.status(201).json({
      success: true,
      message: 'NFT created successfully',
      nft: newNFT
    });

  } catch (error) {
    console.error('Error creating NFT:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/nft/:tokenId
 * Met à jour l'humeur et le message du NFT
 * Appelé quand l'utilisateur change son mood
 */
router.put('/nft/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { mood, message, userAddress } = req.body;

    // Validation
    if (mood === undefined || !userAddress) {
      return res.status(400).json({ 
        error: 'Missing required fields: mood, userAddress' 
      });
    }

    // Récupérer le NFT
    const nft = await NFTMetadata.findOne({ tokenId: parseInt(tokenId) });
    
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    // Vérifier que l'utilisateur possède le NFT
    if (nft.owner.toLowerCase() !== userAddress.toLowerCase()) {
      return res.status(403).json({ 
        error: 'Unauthorized: You do not own this NFT' 
      });
    }

    // Vérifier que le mood est différent (optionnel)
    if (nft.mood === mood && nft.message === message) {
      return res.status(400).json({ 
        error: 'No changes detected' 
      });
    }

    // Ajouter le changement à l'historique
    nft.changeHistory.push({
      mood: nft.mood,
      message: nft.message,
      timestamp: new Date()
    });

    // Mettre à jour
    nft.mood = mood;
    nft.message = message || '';
    nft.lastUpdated = new Date();

    await nft.save();

    res.json({
      success: true,
      message: 'NFT updated successfully',
      nft
    });

  } catch (error) {
    console.error('Error updating NFT:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/nft/:tokenId
 * Récupère les données complètes d'un NFT (sans générer l'image)
 */
router.get('/nft/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;

    const nft = await NFTMetadata.findOne({ tokenId: parseInt(tokenId) });
    
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    res.json({
      success: true,
      nft: {
        ...nft.toObject(),
        moodName: getMoodName(nft.mood)
      }
    });

  } catch (error) {
    console.error('Error fetching NFT:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/nfts
 * Récupère tous les NFTs créés (pour la page Social)
 */
router.get('/nfts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const nfts = await NFTMetadata.find()
      .sort({ lastUpdated: -1 })
      .limit(limit)
      .skip(skip);

    const total = await NFTMetadata.countDocuments();

    res.json({
      success: true,
      count: nfts.length,
      total,
      nfts: nfts.map(nft => ({
        tokenId: nft.tokenId,
        owner: nft.owner,
        mood: nft.mood,
        moodName: getMoodName(nft.mood),
        message: nft.message,
        lastUpdated: nft.lastUpdated,
        createdAt: nft.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching all NFTs:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/nft/user/:address
 * Récupère tous les NFTs possédés par une adresse
 */
router.get('/nft/user/:address', async (req, res) => {
  try {
    const { address } = req.params;

    const nfts = await NFTMetadata.find({ 
      owner: address.toLowerCase() 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      owner: address,
      count: nfts.length,
      nfts: nfts.map(nft => ({
        ...nft.toObject(),
        moodName: getMoodName(nft.mood)
      }))
    });

  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/nft/:tokenId/history
 * Retourne l'historique des changements de mood/message
 */
router.get('/nft/:tokenId/history', async (req, res) => {
  try {
    const { tokenId } = req.params;

    const nft = await NFTMetadata.findOne({ tokenId: parseInt(tokenId) });
    
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    res.json({
      success: true,
      tokenId,
      currentMood: getMoodName(nft.mood),
      history: nft.changeHistory.map(h => ({
        ...h.toObject(),
        moodName: getMoodName(h.mood)
      })),
      totalChanges: nft.changeHistory.length
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
