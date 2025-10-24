const mongoose = require('mongoose');

const nftMetadataSchema = new mongoose.Schema({
  // Identifiant unique du NFT
  tokenId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  
  // Adresse du propriétaire
  owner: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  
  // L'humeur actuelle (0-11)
  mood: {
    type: Number,
    required: true,
    min: 0,
    max: 11,
    default: 0
  },
  
  // Message personnalisé
  message: {
    type: String,
    default: '',
    maxlength: 200
  },
  
  // Historique de tous les changements
  changeHistory: [{
    mood: Number,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index composé pour les recherches rapides
nftMetadataSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('NFTMetadata', nftMetadataSchema);
