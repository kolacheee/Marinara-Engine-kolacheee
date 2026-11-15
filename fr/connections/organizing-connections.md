# Organiser les connexions

Ce guide explique comment garder tes comptes et tes modèles bien rangés sur la page **Connections** (Connexions), accessible par **Library → Connections** (Bibliothèque → Connexions) : étoiles, tri, modification, retrait, Shuffle (le mélange de modèles), dossiers et export. Pour ajouter un compte, consulte [Se connecter à un fournisseur d'IA](connecting-to-a-provider.md).

## La liste des comptes

Sous l'encadré **Defaults** (valeurs par défaut), la page liste tes comptes dans un tableau avec les colonnes **Models** (modèles), **Status** (statut) et **Balance** (solde). **On this device** (sur cet appareil) contient le [modèle intégré](local-model.md). Clique sur un compte pour afficher ses modèles enregistrés en dessous, puis de nouveau pour les replier. Une ligne de modèle affiche son nom et des badges, comme la tâche dont il s'occupe (**Main**, **Agents**, **Images**), **Custom settings** (réglages personnalisés), son prix, ou **Plan** (forfait) pour les modèles inclus dans un abonnement. Un compte local ou auto-hébergé peut aussi afficher **Par défaut**, qui porte la mention "Quel que soit le modèle chargé sur le serveur" et n'a pas d'étoile. Voir [Utiliser le modèle chargé sur le serveur](local-self-hosted.md#use-whatever-model-the-server-has-loaded).

Au-dessus du tableau :

- **All kinds** (tous les types) limite la liste aux comptes **Chat**, **Images**, **Video** (vidéo) ou **Voice** (voix).
- **Search accounts and models** (rechercher des comptes et des modèles) filtre la liste au fil de la saisie.
- Le menu de tri propose **Sort: Name** (trier par nom), **Sort: Most models** (trier par nombre de modèles) et **Sort: Recently changed** (trier par modification récente).

Certains comptes donnent accès aux modèles de plusieurs créateurs, comme NanoGPT ou un proxy. Leurs modèles sont regroupés sous des intitulés comme **via NanoGPT**.

### Actions sur un compte

Clique sur **⋯** sur la ligne d'un compte :

| Action | Ce qu'elle fait |
| --- | --- |
| **Edit account** (modifier le compte) | Ouvre ses réglages : **Name** (nom), **Address** (adresse), **API key** (clé API), **Use this account** (utiliser ce compte, désactive-le sans le supprimer), **Test account** (tester le compte), **Usage and balance** (utilisation et solde), ainsi que **More options** (plus d'options) avec **Requests per minute** (requêtes par minute) et **Parallel requests** (requêtes en parallèle). **Delete** (supprimer) se trouve ici aussi. |
| **Replace key** (remplacer la clé) | Colle une nouvelle clé. Si l'ancienne clé se trouve sur d'autres comptes, Marinara te demande s'il faut aussi les mettre à jour. |
| **Add model** (ajouter un modèle) | Ouvre la liste des modèles du compte. |

Pour supprimer un compte, ouvre **Edit account** et clique sur **Delete**. Marinara te demande de confirmer et liste ce qui utilise ses modèles, sous **Used by** (utilisé par) : chats, agents, modèles et tâches. Clique sur **Delete with its N models** (supprimer avec ses N modèles) pour retirer le compte et ses modèles. Ces chats et ces tâches ont ensuite besoin d'un autre modèle. Si un modèle ne peut pas être retiré, l'éditeur le liste sous **This account still has models. Remove these first:**. Ouvre chacun d'eux et retire-le.

### Icônes des fournisseurs

Chaque compte affiche l'icône de son service. Les icônes sont livrées avec Marinara et ne sont jamais chargées depuis internet. Une adresse personnalisée affiche l'icône d'un serveur ou d'une passerelle connus quand son adresse ou son nom en contient un, par exemple Ollama, LM Studio, KoboldCpp, Bifrost ou LiteLLM. Sinon, elle affiche la première lettre de son nom. Dans la disposition classique, tu peux choisir la tienne : clique sur l'image d'un compte, puis choisis le logo d'un service, téléverse une image ou utilise des lettres.

## Modèles favoris

Une étoile marque les modèles que tu veux retrouver vite. Les modèles étoilés sont listés sous **Starred** (favoris), près du haut de chaque sélecteur de modèle : les fenêtres **Model for** (modèle pour) de l'encadré **Defaults**, **Model for this chat** (modèle pour ce chat), et les champs de modèle dans **Chat Settings** (réglages du chat) et dans l'éditeur d'agent.

Pour étoiler un modèle, clique sur l'étoile de sa ligne ou dans la liste **Add model** du compte. Confier une tâche à un modèle l'enregistre aussi.

Pour retirer l'étoile d'un modèle, clique de nouveau dessus. Marinara retire le modèle et affiche **Undo** (annuler) pendant quelques secondes. Le modèle reste, sans son étoile, quand un chat l'utilise, qu'il a une tâche dans **Defaults**, qu'il a ses propres réglages ou qu'il est le dernier modèle de son compte. Le message en indique la raison.

## Modifier et retirer un modèle

Clique sur la ligne d'un modèle pour ouvrir **Edit model** (modifier le modèle), avec tous ses réglages. **Export model** (exporter le modèle) l'enregistre dans un fichier (voir [Exporter et importer](#export-and-import)). Pour confier une tâche à un modèle, clique sur cette tâche dans l'encadré **Defaults** et choisis-le à cet endroit.

Sur un ordinateur, tu peux faire glisser une ligne de modèle sur un chat pour utiliser ce modèle dans le chat.

### Actions sur un modèle

Clique sur **⋯** à la fin de la ligne d'un modèle, ou fais un clic droit sur la ligne :

| Action | Ce qu'elle fait |
| --- | --- |
| **Edit model** | Ouvre les réglages du modèle. |
| **Make default for…** (définir par défaut pour…) | Confie une tâche au modèle, comme si tu le choisissais dans **Defaults**. Une coche indique les tâches qu'il a déjà. |
| **Move to account…** (déplacer vers un compte…) | Déplace le modèle vers un autre compte. Il utilise alors la clé de ce compte. Son nom, son image, ses tâches et ses chats le suivent, et les options propres au service sont réinitialisées. |
| **Move to folder** (déplacer vers un dossier) | Range le modèle dans un dossier (voir [Dossiers](#folders)). |
| **Duplicate** | Fait une copie complète avec les mêmes réglages et l'ouvre. |
| **Add to Shuffle** (ajouter à Shuffle) / **Remove from Shuffle** (retirer de Shuffle) | Voir [Shuffle](#shuffle). Un modèle du groupe affiche un tag **Shuffle** sur sa ligne. |
| **Export** (exporter) | Enregistre le modèle dans un fichier. |
| **Remove** (retirer) | Supprime le modèle après confirmation. La confirmation liste ce qui l'utilise. |

## Dossiers

Les dossiers regroupent tes modèles, par exemple **RP** et **Work**. Un modèle se trouve dans un seul dossier.

1. Clique sur **⋯** sur un modèle et choisis **Move to folder**.
2. Choisis un dossier, ou clique sur **New folder…** (nouveau dossier…), tape un nom et clique sur **Create** (créer).
3. Pour voir tes dossiers, remplace **By account** (par compte) par **By folder** (par dossier) dans le menu situé à côté du menu de tri.

Dans **By folder**, chaque dossier liste ses modèles avec le nom de leur compte, et les modèles sans dossier se trouvent sous **Not in a folder** (hors dossier). Clique sur **⋯** sur un dossier, ou fais un clic droit dessus, pour le renommer ou le supprimer. Supprimer un dossier garde ses modèles sous **Not in a folder**. Le panneau classique affiche les mêmes dossiers et te permet aussi de leur donner une icône et une couleur.

## Shuffle

Shuffle permet à un chat de choisir un modèle différent chaque fois qu'il écrit une réponse. Sers-t'en pour répartir les requêtes entre plusieurs services ou modèles.

1. Clique sur **⋯** sur chaque modèle que tu veux inclure dans Shuffle et choisis **Add to Shuffle**.
2. Dans un chat, ouvre **Model for this chat** depuis la zone de saisie du chat, ou **Chat Settings → Connection → Model** (réglages du chat → connexion → modèle), et choisis **Shuffle**.

Chaque réponse pioche alors un modèle au hasard parmi ceux que tu as ajoutés à Shuffle.

Si le modèle choisi pour une réponse échoue et que **Main** a un modèle **If it fails** (en cas d'échec), c'est ce modèle qui écrit la réponse. Un avis nomme le modèle qui a échoué et une courte raison, comme "key rejected", "rate limited" ou "not found". La réponse garde une petite étiquette **Fallback** (secours). Touche-la, ou pointe dessus, pour revoir la même ligne.

Un choix dans **Model for this chat** ne change que ce chat. Pour changer le modèle des nouveaux chats, définis **Main** dans l'encadré **Defaults**.

## Dans la disposition classique

Le panneau Connections classique propose quelques outils supplémentaires. Passe à cette disposition avec **New layout** (nouvelle disposition) dans **Settings → Appearance → Theme** (Paramètres → Apparence → Thème), et reviens à l'autre de la même manière. Les deux dispositions utilisent les mêmes comptes.

- Le menu **⋯** d'un modèle propose aussi **Change picture** (changer l'image).
- Le menu **⋯** d'un compte propose aussi **Test** (tester), **Select models** (sélectionner des modèles, pour en déplacer ou supprimer plusieurs à la fois), **Duplicate** (dupliquer) et **Turn off** (désactiver) / **Turn on** (activer).
- **More actions** (plus d'actions, trois points), en haut du panneau, propose **Fold all accounts** (replier tous les comptes), **Open all accounts** (ouvrir tous les comptes), **Show only Off or Needs key** (afficher seulement les comptes Off ou Needs key) et **Show cost badges** (afficher les badges de coût).

## Exporter et importer

Tu peux exporter des comptes dans un fichier pour les sauvegarder ou les transférer vers une autre installation, puis les importer plus tard.

> **Avertissement :** les exports n'incluent jamais les clés API. Après l'import, ouvre chaque compte et saisis de nouveau sa clé. Ne partage jamais une clé avec qui que ce soit.

- **Exporter un seul modèle :** ouvre-le avec **Edit model** et clique sur **Export model** (exporter le modèle).
- **Tout exporter :** clique sur **Export all accounts** (exporter tous les comptes, l'icône de téléversement à côté de **Import**) en haut de la page Connections. Marinara te rappelle que le fichier ne contient aucune clé. Clique sur **Export** (exporter).
- **Importer :** clique sur **Import** (importer) en haut de la page Connections. Dépose un ou plusieurs fichiers (`.json`, `.jsonl` ou `.zip`) sur la fenêtre, ou clique pour aller les chercher. Cela inclut le fichier `marinara-connections.zip` que tu as exporté. Chaque compte importé a une clé vide tant que tu ne l'as pas renseignée.

Un modèle seul est téléchargé sous la forme d'un fichier `.connection.json`. Plusieurs sont téléchargés ensemble dans `marinara-connections.zip`. Les étoiles sont incluses. Le catalogue de modèles du service ne l'est pas : il se recharge donc la première fois que tu ouvres les modèles du compte.

## Guides associés

- [Se connecter à un fournisseur d'IA](connecting-to-a-provider.md)
- [Vue d'ensemble des réglages du chat](../chats/chat-settings.md)
