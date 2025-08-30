# 👥 Utilisateurs Admin - Mad2Moi Blog

## 🔐 Informations de Connexion

### **Jules (Admin Principal)**
- **Username:** `Jules`
- **Email:** `jules@mad2moi.com`
- **Password:** `jules123`
- **Rôle:** `admin`
- **Statut:** Actif

### **Alicia (Admin)**
- **Username:** `Alicia`
- **Email:** `alicia@mad2moi.com`
- **Password:** `alicia123`
- **Rôle:** `admin`
- **Statut:** Actif

### **Daniel (Admin)**
- **Username:** `Daniel`
- **Password:** `111222333`
- **Rôle:** `admin`
- **Statut:** Actif

### **Amine (Auteur)**
- **Username:** `Amine`
- **Password:** `123456`
- **Rôle:** `auteur`
- **Statut:** Actif

## 🔄 Changements Effectués

### **Remplacement de Ricklen par Jules**
- ✅ Utilisateur `Rickled` supprimé du système de login
- ✅ Nouvel utilisateur `Jules` créé avec le rôle admin
- ✅ Mot de passe sécurisé : `jules123`

### **Ajout d'Alicia**
- ✅ Nouvel utilisateur `Alicia` créé avec le rôle admin
- ✅ Mot de passe sécurisé : `alicia123`
- ✅ Accès complet à toutes les fonctionnalités admin

## 🛠️ Scripts de Mise à Jour

### **Initialisation de la Base de Données**
```bash
npm run init-db
```

### **Mise à Jour des Utilisateurs**
```bash
npm run update-users
```

### **Démarrage du Serveur**
```bash
npm run dev
```

## 🔒 Sécurité

- Tous les mots de passe sont hashés avec bcrypt
- Les utilisateurs admin ont accès à toutes les fonctionnalités
- Les utilisateurs auteur ont un accès limité
- Session stockée dans localStorage avec vérification des rôles

## 📱 Interface de Connexion

1. **Page de Login:** `/` ou `/debug-login`
2. **Dashboard Admin:** `/admin/dashboard`
3. **Gestion des Articles:** `/admin/articles`
4. **Génération GPT-5:** `/admin/gpt-articles`
5. **Paramètres:** `/admin/settings`

## ⚠️ Notes Importantes

- **Jules** remplace complètement **Ricklen** dans le système
- **Alicia** a maintenant le rôle admin (au lieu d'éditeur)
- Tous les mots de passe sont synchronisés entre l'interface et la base de données
- Les changements sont appliqués immédiatement après redémarrage

---
*Dernière mise à jour: $(Get-Date)*
