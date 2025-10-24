# Mood NFT Backend Server

Backend API pour la génération et la gestion des métadonnées des NFTs Mood.

## 🚀 Installation

```bash
npm install
```

## ⚙️ Configuration

1. Copiez le fichier `.env.example` vers `.env`:
```bash
cp .env.example .env
```

2. Modifiez `.env` avec vos paramètres:
```env
MONGODB_URI=mongodb://localhost:27017/bubblo-nft
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🏃 Démarrage

### Mode développement (avec nodemon)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarre sur `http://localhost:3001`

## 📡 Endpoints API

### Health Check
```bash
GET /health
```
Retourne le statut du serveur

### NFT Metadata
```bash
GET /api/metadata/:tokenId
```
Retourne les métadonnées complètes du NFT (format ERC-721)

### Update NFT Mood
```bash
POST /api/update-mood
Body: {
  "tokenId": 1,
  "mood": 3,
  "message": "Feeling great!"
}
```
Met à jour l'humeur d'un NFT

### Update NFT Style
```bash
POST /api/update-style
Body: {
  "tokenId": 1,
  "backgroundColor": "#8B5CF6",
  "bubbleColor": "#FFFFFF",
  "pattern": "bubbles"
}
```
Met à jour le style visuel d'un NFT

## 🗄️ Base de données

Ce serveur utilise MongoDB pour stocker les métadonnées des NFTs. Assurez-vous que MongoDB est installé et en cours d'exécution:

```bash
# macOS (avec Homebrew)
brew services start mongodb-community

# Vérifier que MongoDB tourne
mongosh --eval "db.version()"
```

## 🛠️ Structure du projet

```
NFT/
├── config/          # Configuration (DB, etc.)
├── models/          # Modèles MongoDB
├── routes/          # Routes API Express
├── services/        # Services (génération d'images, etc.)
├── assets/          # Fichiers statiques
├── server.js        # Point d'entrée
└── .env             # Variables d'environnement
```

## ✅ Corrections effectuées

1. ✅ Renommé `servives/` → `services/`
2. ✅ Créé `.env` avec la configuration MongoDB
3. ✅ Supprimé les options dépréciées de MongoDB (`useNewUrlParser`, `useUnifiedTopology`)

## 📝 Notes

- Le serveur génère dynamiquement des images SVG pour chaque NFT
- Les métadonnées sont compatibles ERC-721
- Les images sont encodées en base64 pour être embarquées directement
