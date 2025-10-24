# BUBBLO Mini App Configuration

## ✅ Configuration terminée

Votre application a été transformée en Mini App selon la documentation Base.org.

### Modifications apportées :

1. ✅ **SDK installé** : `@farcaster/miniapp-sdk`
2. ✅ **Provider créé** : `MiniAppProvider` qui appelle `sdk.actions.ready()`
3. ✅ **Manifest créé** : `/public/.well-known/farcaster.json`
4. ✅ **Métadonnées embed** : Ajoutées dans `app/layout.tsx`

## 📝 Prochaines étapes (À FAIRE MANUELLEMENT)

### 1. Déployer votre application
Déployez votre app sur Vercel ou votre hébergeur préféré.

### 2. Mettre à jour les URLs dans le manifest
Une fois déployé, mettez à jour toutes les URLs dans `/public/.well-known/farcaster.json` :
- Remplacez `https://your-app-url.vercel.app` par votre vraie URL
- Ajoutez votre adresse Base dans `baseBuilder.allowedAddresses`

### 3. Créer les images requises
Créez et ajoutez ces images dans `/public` :
- `icon.png` - Icône de l'app (recommandé 512x512px)
- `splash.png` - Image de chargement
- `hero.png` - Image hero pour la page
- `og.png` - Image OpenGraph pour le partage
- `embed-image.png` - Image pour les embeds Farcaster
- `screenshot1.png`, `screenshot2.png`, `screenshot3.png` - Captures d'écran

### 4. Mettre à jour les métadonnées dans layout.tsx
Mettez à jour l'URL dans `app/layout.tsx` avec votre vraie URL de déploiement.

### 5. Générer les credentials d'association de compte
Une fois l'app déployée :
1. Allez sur https://www.base.dev/preview?tab=account
2. Collez votre domaine (ex: your-app.vercel.app)
3. Cliquez "Submit" puis "Verify"
4. Suivez les instructions pour générer les champs `accountAssociation`
5. Copiez les valeurs `header`, `payload` et `signature` dans `/public/.well-known/farcaster.json`

### 6. Prévisualiser votre app
Utilisez l'outil de prévisualisation : https://www.base.dev/preview
- Vérifiez que l'embed s'affiche correctement
- Testez le bouton de lancement
- Validez l'association de compte
- Vérifiez les métadonnées

### 7. Publier votre Mini App
Pour publier :
1. Créez un post dans l'app Base avec l'URL de votre app
2. L'app sera automatiquement ajoutée au catalogue Base

## 🔧 Configuration locale

Votre `.env.local` doit contenir :
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=votre_project_id
```

## 📚 Documentation
- [Guide de migration Mini App](https://docs.base.org/mini-apps/quickstart/migrate-existing-apps)
- [Référence du Manifest](https://docs.base.org/mini-apps/features/manifest)
- [SDK MiniApp](https://docs.base.org/mini-apps/sdk/overview)
