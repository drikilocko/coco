# 🎉 Coco Miracles - Site de Décoration de Fête

## 📋 Description

Site web professionnel pour **Coco Miracles**, une entreprise de décoration de fête. Le site présente les services, réalisations et propose un système de réservation en ligne avec génération de tickets et QR codes.

---

## 🏗️ Structure du Projet

```
coco miracles/
├── index.html          # Page principale du site
├── event-planner.html  # Présentation dédiée aux événements corporate
├── galerie-beaute.html
├── galerie-evenements.html
├── galerie-portfolio.html
├── css/
│   ├── style.css       # Styles de la page principale
│   ├── galleries.css   # Styles des galeries
│   ├── event-planner.css # Styles de la page Event Planner
│   ├── site-header.css # En-tête partagé avec effet de flou
│   └── footer.css      # Pied de page partagé
├── js/
│   ├── main.js         # JavaScript de la page principale
│   ├── site-header.js  # Menu mobile et comportement partagé de l'en-tête
│   ├── footer.js       # Année du pied de page partagé
│   ├── beauty-videos.js # Liste des vidéos beauté locales
│   ├── beauty-gallery.js # Cartes et fenêtre de lecture beauté
│   ├── portfolio-videos.js # Liste des vidéos locales du portfolio
│   └── portfolio-gallery.js # Lecteurs vidéo du portfolio
├── asset/video/        # Vidéos locales du portfolio
│   └── posters/        # Miniatures JPG extraites des vidéos du portfolio
├── asset/beaute/       # Vidéos locales de la galerie beauté
│   └── posters/        # Miniatures JPG des vidéos beauté
├── api/                # Routes serveur Gemini et formulaire e-mail
├── inutile/            # Ancienne page, fichiers CSS/JS et vidéos locales archivés
└── README.md           # Documentation du projet
```

Le portfolio utilise les vidéos locales de `asset/video/` sur l’accueil, dans la galerie complète et dans les aperçus des projets. Chaque vidéo possède une miniature JPG dans `asset/video/posters/`, affichée avant le lancement.

La page d’accueil affiche quatre vidéos beauté et une cinquième carte d’accès à la galerie complète. Les autres vidéos beauté de `asset/beaute/` sont listées dans `js/beauty-videos.js`; la galerie les présente avec une courte description et une fenêtre vidéo avec son et lien de contact. Pour activer l’audio dans le carrousel, utilisez le bouton son : les navigateurs bloquent généralement la lecture automatique avec le son.

---

## ✨ Fonctionnalités du Site

### Sections du Site
- **🏠 Accueil (Hero)** - Page d'accueil avec statistiques et appel à l'action
- **👥 À Propos** - Présentation de l'entreprise et ses valeurs
- **🎨 Services** - 6 types de services (Mariages, Anniversaires, Baptêmes, etc.)
- **🖼️ Réalisations** - Portfolio filtrable avec catégories
- **🎞️ Galeries dédiées** - Pages séparées pour les créations beauté, les événements et les vidéos locales du portfolio
- **🎤 Event Planner** - Page dédiée à l'organisation d'événements corporate
- **⭐ Témoignages** - Avis clients avec système de notation
- **❓ FAQ** - Questions fréquentes avec accordéon interactif
- **📞 Contact / CTA** - Appel à l'action pour réservation
- **💬 Conciergerie virtuelle** - Assistant Gemini limité aux informations Coco Miracles (serveur local Node.js ou fonction Vercel)
- **📍 Footer** - Informations de contact, liens, réseaux sociaux

### Caractéristiques Techniques
- ✅ **100% Responsive** (Mobile, Tablette, Desktop)
- ✅ **Animations fluides** (Scroll, Hover, Transitions)
- ✅ **Navigation fixe** avec effet de scroll
- ✅ **En-tête partagé et flouté** sur toutes les pages
- ✅ **Menu mobile** hamburger en plein écran
- ✅ **Boutons « Voir toute la galerie »** sous les carrousels beauté et portfolio, et sous les réalisations
- ✅ **Filtres de portfolio** dynamiques
- ✅ **Formulaire de réservation** avec validation
- ✅ **Système de ticketing** avec QR Code

---

## 🎫 Système de Réservation et Ticketing

### Comment ça marche ?

Le système de réservation fonctionne en **3 étapes simples** :

#### Étape 1 : Remplissage du Formulaire
L'utilisateur clique sur **"Réserver"** et remplit le formulaire avec :
- Nom complet et coordonnées (email, téléphone)
- Type d'événement (Mariage, Anniversaire, Baptême, etc.)
- Date et lieu de l'événement
- Nombre d'invités et budget estimé
- Message et demandes spéciales

#### Étape 2 : Génération du Ticket
Après soumission du formulaire :
- Un **code de réservation unique** est généré (ex: CM-2024-1234)
- Un **QR Code** est créé contenant les informations de réservation
- Un **ticket électronique** s'affiche avec toutes les informations

#### Étape 3 : Utilisation du Ticket
- Le ticket peut être **téléchargé** ou **capturé en screenshot**
- Le QR Code peut être **scanné** pour vérifier la réservation
- Le ticket est présenté le **jour de l'événement**

### Structure du Ticket
```
┌─────────────────────────────────────┐
│  ✨ Coco Miracles                   │
│  TICKET DE RÉSERVATION              │
├─────────────────────────────────────┤
│  Numéro: #CM-2024-1234              │
│  Client: Jean Dupont                 │
│  Événement: Mariage                 │
│  Date: 15 juin 2024                 │
│  Statut: En attente de confirmation │
├─────────────────────────────────────┤
│         [ QR CODE ]                 │
│  Scannez pour vérifier              │
├─────────────────────────────────────┤
│  Présentez ce ticket le jour J      │
│  Généré le 01/10/2024               │
└─────────────────────────────────────┘
```

### Format du QR Code
Le QR Code contient une chaîne de données structurée :
```
COCOMIRACLES|CM-2024-1234|Jean Dupont|mariage|2024-06-15
```

Cette donnée peut être :
- **Scannée** pour vérification sur place
- **Lue** par un système externe de gestion
- **Intégrée** dans un système de billetterie professionnel

---

## 🚀 Comment Lancer le Site

### Option 1 : Ouverture Directe
Le site peut être consulté avec un serveur statique, mais les vidéos du portfolio nécessitent la route serveur décrite ci-dessous.

### Option 2 : Serveur Local (Recommandé)

Il faut Node.js 18 ou plus récent : le serveur local gère le site et les routes privées `/api/chat` et `/api/contact`. Il prend aussi en charge les requêtes HTTP Range pour charger progressivement les vidéos du portfolio.

1. Après avoir révoqué toute clé déjà exposée, copiez `.env.example` vers `.env.local` à la racine du projet.
2. Remplacez la valeur exemple par votre nouvelle clé, sans guillemets : `GEMINI_API_KEY=VOTRE_NOUVELLE_CLE`.
3. Pour activer les demandes par e-mail, créez une clé API Resend, vérifiez votre domaine d'envoi dans Resend, puis ajoutez dans `.env.local` `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (une adresse du domaine vérifié) et `CONTACT_TO_EMAIL=drikilocko@gmail.com` (adresse qui reçoit les demandes).
4. Double-cliquez sur `demarrer.bat`, puis ouvrez `http://localhost:8000`.

Le fichier `.env.local` est ignoré par Git et n'est jamais servi au navigateur. N'ouvrez pas `index.html` directement en `file://` et n'utilisez pas un serveur statique Python/Live Server pour le chat ou l'envoi d'e-mails : ils ne peuvent pas exécuter les routes API. Le lecteur du portfolio attend que cinq secondes de vidéo soient tamponnées avant de démarrer. Si la configuration Resend manque, le formulaire l'indiquera ; après un envoi réussi, la demande est transmise à Coco Miracles et le client reçoit un e-mail de confirmation au format HTML aux couleurs de la Maison.

Pour le déploiement, configurez `GEMINI_API_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` et `CONTACT_TO_EMAIL` dans les variables d'environnement Vercel, puis déployez normalement. Vérifiez que les vidéos voulues de `asset/video/` sont incluses dans le dépôt et le déploiement. Les clés ne doivent jamais être inscrites dans le HTML, le JavaScript public ou un fichier versionné.

#### Avec VS Code
Utilisez l'extension **Live Server** et cliquez sur "Go Live".

---

## 🔧 Personnalisation et Intégration

### 1. Images du Site
Les visuels de la page principale et des galeries se trouvent dans le dossier `asset/`. Les pages principales sont `index.html`, `galerie-beaute.html`, `galerie-evenements.html` et `galerie-portfolio.html`.

### 2. Informations de l'Entreprise
Mettez à jour les informations de la page principale dans `index.html` : coordonnées dans le pied de page, services dans `#prestations`, portfolio dans `#portfolio` et beauté dans `#mise-en-beaute`.

### 3. Couleurs du Thème
Modifiez les variables de thème en haut de `css/style.css` :
```css
:root {
    --editorial-paper: #f5f0e8;
    --editorial-ink: #33291f;
    --hero-gold: #d6bd8c;
    --hero-ivory: #f4efe7;
}
```

### 4. Intégration d'un Service de Billetterie Professionnel

Le système actuel est une **démonstration fonctionnelle**. Pour une solution **100% professionnelle**, intégrez l'un de ces services :

#### Option A : Integration avec un Backend (Recommandé)
```
Architecture complète :
Frontend (ce site) → Backend (Node.js/PHP) → Base de données → Email Service
```

**Stack recommandée :**
- **Backend** : Node.js + Express ou PHP
- **Base de données** : MySQL ou PostgreSQL
- **Email** : SendGrid, Mailgun, ou Nodemailer
- **QR Code** : Génération côté serveur avec `qrcode` npm package
- **Paiement** : Stripe ou PayPal (optionnel)

#### Option B : Services de Billetterie en Ligne
Intégrez des services existants :

| Service | URL | Prix |
|---------|-----|------|
| **Eventbrite** | eventbrite.fr | Gratuit + frais |
| **WeezEvent** | weezevent.com | À partir de 0,50€/billet |
| **Digitick** | digitick.com | Sur devis |
| **Ticketmaster** | ticketmaster.fr | Sur devis |

#### Option C : Système de Réservation avec Google Calendar
Utilisez l'API Google Calendar pour :
- Créer des événements automatiquement
- Envoyer des invitations par email
- Gérer les disponibilités en temps réel

### 5. Génération de QR Codes Côté Serveur
Pour un système professionnel, générez les QR codes côté serveur :

**Exemple avec Node.js :**
```javascript
const QRCode = require('qrcode');

// Générer un QR code
const qrCodeDataURL = await QRCode.toDataURL(bookingData, {
    width: 300,
    margin: 2,
    color: {
        dark: '#000000',
        light: '#FFFFFF'
    }
});
```

### 6. Vérification des Billets
Créez une page de vérification (ex: `verification.html`) :
```
URL: https://votresite.com/verifier?code=CM-2024-1234
```

Cette page affichera :
- Les détails de la réservation
- Le statut (Confirmé / En attente / Annulé)
- Un scan QR pour vérification rapide

---

## 📧 Système d'Email Automatique

### Configuration Recommandée

**Pour des emails professionnels**, utilisez :

1. **SendGrid** (Recommandé)
   - 100 emails/jour gratuits
   - API simple à intégrer
   - Templates personnalisables

2. **Mailgun**
   - 5 000 emails/mois gratuits pendant 3 mois
   - Excellente délivrabilité

3. **Nodemailer** (pour développement)
   - Gratuit et open-source
   - Nécessite un serveur SMTP

### Exemple d'Email de Confirmation
```
Objet: ✅ Réservation Confirmée - Coco Miracles - #CM-2024-1234

Bonjour Jean Dupont,

Votre réservation a été confirmée avec succès !

📋 Détails de la réservation :
- Numéro: #CM-2024-1234
- Événement: Mariage
- Date: 15 juin 2024
- Lieu: Versailles

📎 Votre ticket avec QR code est en pièce jointe.

Notre équipe vous contactera sous 24h pour confirmer les détails.

Cordialement,
L'équipe Coco Miracles
```

---

## 🎨 Design et UX

### Palette de Couleurs
- **Primaire** : Violet (#8b5cf6)
- **Secondaire** : Rose (#ec4899)
- **Accent** : Orange (#f59e0b)
- **Fond** : Blanc et Gris clair

### Typographie
- **Titres** : Playfair Display (élégant, serif)
- **Corps** : Poppins (moderne, sans-serif)

### Animations
- Flottement des éléments hero
- Apparition au scroll (fadeInUp)
- Hover effects sur les cartes
- Transitions fluides sur la navigation

---

## 📱 Compatibilité

- ✅ Chrome / Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile (iOS / Android)
- ✅ Tablettes

---

## 🔒 Sécurité

### Déploiement Vercel

Vercel fournit le certificat HTTPS et redirige les requêtes HTTP vers HTTPS. Le fichier `vercel.json` ajoute les en-têtes de sécurité du site : HSTS, Content Security Policy, protection contre l’intégration en iframe, politique de référent et restrictions des permissions du navigateur. La CSP autorise les scripts nécessaires au site, notamment Lenis depuis jsDelivr et les polices Google.

Après toute modification de la configuration, redéployez le projet et vérifiez que le domaine de production utilise HTTPS. HSTS ne doit être conservé que sur un domaine qui reste accessible en HTTPS.

### Conciergerie Gemini sur Vercel

La page `index.html` utilise la fonction serveur `api/chat.js` pour appeler Gemini. La clé n'est jamais incluse dans le navigateur.

1. Pour tester sans déployer, suivez les étapes de configuration du serveur Node.js local ci-dessus.
2. Sur Vercel, ajoutez `GEMINI_API_KEY` dans **Project Settings → Environment Variables**, puis déployez.
3. Ne jamais ajouter la clé à HTML, JavaScript public ou à un fichier versionné. Révoquez toute clé déjà partagée ou exposée, puis créez-en une nouvelle dans Google AI Studio / Google Cloud.

L'assistant est configuré pour guider les visiteurs uniquement sur les informations Coco Miracles présentes sur le site. Les réponses sont générées par Gemini ; vérifiez les informations et limites d'utilisation dans la console Google.

---

## 🛠️ Technologies Utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Styles modernes (Flexbox, Grid, Variables, Animations)
- **JavaScript ES6+** - Interactions et logique
- **API QR Code** - Génération de QR codes (goqr.me / qrserver)
- **Google Fonts** - Typographies professionnelles

---

## 📈 Améliorations Futures Possibles

- [ ] Intégration d'un système de paiement en ligne (Stripe)
- [ ] Calendrier de disponibilités en temps réel
- [ ] Espace client pour suivre sa réservation
- [ ] Notifications SMS automatiques
- [ ] Système de galerie photos avant/après
- [ ] Blog / Conseils en décoration
- [ ] Intégration des réseaux sociaux (partage de réalisations)
- [ ] Chat en direct avec les clients
- [ ] Système de devis automatisé
- [ ] Intégration Google Maps pour le lieu de l'événement

---

## 📞 Support et Contact

Pour toute question ou assistance :
- **Email** : contact@cocomiracles.fr
- **Téléphone** : 01 23 45 67 89

---

## 📄 Licence

Ce projet est la propriété de **Coco Miracles**. Tous droits réservés.

---

## 🙏 Remerciements

Merci d'avoir choisi Coco Miracles pour sublimer vos événements !

✨ **Créons ensemble des souvenirs inoubliables.** ✨

---

*Dernière mise à jour : Octobre 2024*
