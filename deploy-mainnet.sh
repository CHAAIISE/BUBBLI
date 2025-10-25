#!/bin/bash

# 🚀 Script de déploiement BUBBLO sur Base Mainnet
# ⚠️ ATTENTION : Ceci déploiera sur le VRAI réseau avec de vrais ETH !

echo "=========================================="
echo "🎨 BUBBLO - Déploiement Base Mainnet"
echo "=========================================="
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -d "Backend" ]; then
    echo "❌ Erreur : Exécute ce script depuis la racine du projet"
    exit 1
fi

cd Backend

echo "📋 Checklist de déploiement :"
echo ""
echo "1. ✅ As-tu au moins 0.005 ETH sur Base Mainnet ?"
echo "2. ✅ As-tu sauvegardé ta seed phrase ?"
echo "3. ✅ Le code du contrat est-il testé ?"
echo ""
read -p "Tout est OK ? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Déploiement annulé"
    exit 0
fi

echo ""
echo "🔧 Configuration détectée :"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
forge --version
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📝 Adresses de comptes disponibles :"
cast wallet list
echo ""

read -p "Entre le nom de ton compte Foundry (ex: noewallet): " account_name
read -p "Entre ton adresse (0x...): " sender_address

echo ""
echo "🚀 Déploiement en cours sur Base Mainnet..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Déployer le contrat
forge script script/MoodNFT.s.sol:MoodNFTDeployScript \
  --rpc-url https://mainnet.base.org \
  --account $account_name \
  --sender $sender_address \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY \
  -vvvv

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Déploiement terminé !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Copie l'adresse du contrat affichée ci-dessus"
echo "2. Mets à jour .env.local : NEXT_PUBLIC_CONTRACT_ADDRESS=0x..."
echo "3. Mets à jour lib/contract.ts avec la nouvelle adresse"
echo "4. Push sur GitHub pour déclencher le déploiement Vercel"
echo "5. Teste le mint sur le site en production"
echo ""
echo "🔗 Liens utiles :"
echo "- BaseScan : https://basescan.org/address/TON_ADRESSE"
echo "- Base Bridge : https://bridge.base.org"
echo ""
echo "=========================================="
