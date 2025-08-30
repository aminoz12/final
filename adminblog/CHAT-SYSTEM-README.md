# 🚀 Chat System - Documentation Complète

## 📋 Vue d'ensemble

Le système de chat complet pour Mad2Moi Blog comprend :
- **Base de données SQLite** pour stocker les messages et utilisateurs
- **WebSocket en temps réel** pour la communication instantanée
- **Intégration GPT-5** pour les réponses automatiques et suggestions
- **Interface admin** complète pour gérer les conversations
- **Widget utilisateur** pour les visiteurs du blog
- **Gestion des pièces jointes** et emojis

## 🗄️ Structure de la Base de Données

### Tables créées :

#### `users`
- `id` - Identifiant unique
- `name` - Nom de l'utilisateur
- `email` - Email (optionnel)
- `session_id` - ID de session unique
- `created_at` - Date de création

#### `messages`
- `id` - Identifiant unique
- `user_id` - Référence vers l'utilisateur
- `message` - Contenu du message
- `sender` - Expéditeur ('user', 'gpt', 'admin')
- `intercepted` - Si le message a été intercepté par un admin
- `has_attachment` - Présence de pièce jointe
- `attachment_url` - URL de la pièce jointe
- `attachment_type` - Type de pièce jointe
- `timestamp` - Horodatage

#### `admin_status`
- `id` - Identifiant (toujours 1)
- `available` - Disponibilité de l'admin (0/1)
- `updated_at` - Dernière mise à jour

## 🚀 Installation et Configuration

### 1. Initialiser la Base de Données

```bash
cd adminblog
npm run init-chat-db
```

### 2. Vérifier les Dépendances

Assurez-vous que ces packages sont installés :
```json
{
  "sqlite": "^5.1.1",
  "sqlite3": "^5.1.7",
  "ws": "^8.0.0"
}
```

### 3. Démarrer le Serveur

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:4322`

## 🔌 Architecture WebSocket

### Connexions
- **Utilisateurs** : Se connectent via `/ws/chat`
- **Admins** : Se connectent via le même endpoint
- **Gestion automatique** des reconnexions

### Types de Messages

#### Utilisateur → Serveur
```json
{
  "type": "register_client",
  "data": {
    "sessionId": "session_123",
    "userId": "user_456",
    "name": "John Doe"
  }
}
```

#### Admin → Serveur
```json
{
  "type": "register_admin",
  "data": {
    "adminId": "admin_789",
    "name": "Admin User"
  }
}
```

#### Envoi de Message
```json
{
  "type": "send_message",
  "data": {
    "userId": "user_123",
    "message": "Bonjour !",
    "sessionId": "session_456",
    "attachment": null
  }
}
```

## 🎯 Fonctionnalités Principales

### 1. Gestion de la Disponibilité Admin
- **Toggle** pour activer/désactiver le support
- **Statut en temps réel** affiché aux utilisateurs
- **Logique conditionnelle** pour les réponses GPT

### 2. Intégration GPT-5
- **Réponses automatiques** quand l'admin est indisponible
- **Suggestions** quand l'admin est disponible
- **Approbation/Modification** des réponses par l'admin

### 3. Gestion des Conversations
- **Liste des conversations** actives
- **Recherche** par nom/email
- **Historique complet** des messages
- **Indicateurs de statut** (en ligne/hors ligne)

### 4. Pièces Jointes et Emojis
- **Support des images** (prévisualisation)
- **Fichiers PDF/DOC** (nom et taille)
- **Sélecteur d'emojis** intégré
- **Gestion des erreurs** de téléchargement

## 🎨 Interface Utilisateur

### Widget Utilisateur (Blog)
- **Position** : Coin inférieur droit
- **Taille** : 320x384 pixels
- **Fonctionnalités** :
  - Chat en temps réel
  - Sélecteur d'emojis
  - Pièces jointes
  - Indicateur de statut admin

### Interface Admin
- **Layout** : Grille 1:3 (conversations:chat)
- **Fonctionnalités** :
  - Liste des conversations
  - Chat en temps réel
  - Panel de suggestions GPT
  - Gestion de la disponibilité
  - Recherche et filtres

## 🔧 API Endpoints

### `/api/chat/send` (POST)
Envoi de message utilisateur
```json
{
  "user_id": "user_123",
  "message": "Bonjour !",
  "session_id": "session_456",
  "name": "John Doe",
  "email": "john@example.com",
  "attachment": null
}
```

### `/api/admin/chat` (GET)
Récupération des données admin
- `?action=messages&user_id=123` - Messages d'un utilisateur
- `?action=conversations` - Toutes les conversations
- `?action=stats` - Statistiques du chat
- `?action=status` - Statut de disponibilité admin

### `/api/admin/chat` (POST)
Actions admin
```json
{
  "action": "send_message",
  "user_id": "user_123",
  "message": "Bonjour ! Comment puis-je vous aider ?",
  "session_id": "session_456",
  "admin_name": "Admin User"
}
```

## 🚨 Gestion des Erreurs

### Reconnexion Automatique
- **WebSocket** : Tentative de reconnexion toutes les 5 secondes
- **Fallback HTTP** : Utilisation des API REST si WebSocket échoue
- **Notifications** : Affichage des erreurs à l'utilisateur

### Validation des Données
- **Messages** : Vérification de la longueur et du contenu
- **Pièces jointes** : Validation du type et de la taille
- **Sessions** : Gestion des sessions expirées

## 📊 Monitoring et Statistiques

### Métriques Disponibles
- **Utilisateurs actifs** : Nombre de conversations ouvertes
- **Messages** : Total par type (utilisateur, GPT, admin)
- **Temps de réponse** : Performance du support
- **Disponibilité** : Statut admin en temps réel

### Logs
- **Connexions** : Utilisateurs et admins
- **Messages** : Envoi et réception
- **Erreurs** : WebSocket et base de données
- **GPT** : Génération et approbation des réponses

## 🔒 Sécurité

### Authentification
- **Sessions** : Identifiants uniques par utilisateur
- **Admin** : Vérification des permissions
- **Rate Limiting** : Protection contre le spam

### Validation
- **Input** : Nettoyage des messages
- **Fichiers** : Vérification des types autorisés
- **SQL Injection** : Protection via requêtes préparées

## 🚀 Déploiement

### Variables d'Environnement
```env
# Base de données
DB_DRIVER=sqlite
DB_NAME=chat_system

# GPT-5
OPENAI_API_KEY=your_api_key_here

# Serveur
PORT=4322
HOST=0.0.0.0
```

### Production
```bash
npm run build
npm start
```

## 🧪 Tests

### Test de la Base de Données
```bash
npm run test-chat-db
```

### Test des WebSockets
```bash
npm run test-chat-ws
```

### Test de l'API
```bash
npm run test-chat-api
```

## 📝 Exemples d'Utilisation

### 1. Démarrer une Conversation
```javascript
// Côté utilisateur
const chat = new LiveChatSystem();
chat.sendMessage("Bonjour, j'ai une question !");
```

### 2. Répondre en tant qu'Admin
```javascript
// Côté admin
const adminChat = new AdminChatSystem();
adminChat.sendMessage("Bonjour ! Comment puis-je vous aider ?");
```

### 3. Générer une Réponse GPT
```javascript
// Générer et approuver
await adminChat.generateGPTResponse();
await adminChat.approveGPTResponse();
```

## 🔮 Améliorations Futures

### Fonctionnalités Planifiées
- **Chat vidéo** : Intégration WebRTC
- **Notifications push** : Browser notifications
- **Analytics avancés** : Métriques détaillées
- **Intégration CRM** : Synchronisation avec les outils existants
- **Multi-langues** : Support international
- **Chatbots** : IA plus sophistiquée

### Optimisations Techniques
- **Redis** : Cache pour les sessions
- **Elasticsearch** : Recherche avancée
- **CDN** : Distribution des pièces jointes
- **Load Balancing** : Support multi-serveurs

## 📞 Support

Pour toute question ou problème :
1. **Vérifiez les logs** du serveur
2. **Testez la base de données** avec les scripts fournis
3. **Consultez la documentation** des dépendances
4. **Ouvrez une issue** sur le repository

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Mad2Moi Team


