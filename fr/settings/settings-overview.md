# Vue d'ensemble des paramètres

Trouve quelle partie de **Settings** (Paramètres) contient un contrôle, configure l'onglet **General** (Général) et apprends comment tes réglages se synchronisent entre tes appareils.

## Ouvrir Settings

Ouvre **Library → Settings** (Bibliothèque → Paramètres) : clique sur **Library** en haut à droite, puis sur **Settings** sous la liste de la bibliothèque. Tu peux aussi appuyer sur <kbd>Ctrl</kbd>+<kbd>K</kbd> (<kbd>⌘</kbd>+<kbd>K</kbd> sur Mac) et saisir le nom d'un réglage, comme `streaming` ou `font`, pour y aller directement. Sur téléphone, Settings se trouve dans la bibliothèque, derrière le bouton des panneaux superposés en haut à droite.

Le champ **Search all settings** (rechercher dans tous les réglages) en haut de la page trouve un réglage par son nom. Saisis un mot comme `delete`, `streaming` ou `quotes`, et Marinara saute à la section correspondante. La recherche trouve les noms dans la langue de ton interface et en anglais.

Settings comporte neuf onglets. Sous les onglets, une rangée de boutons permet d'accéder à chaque section de l'onglet ouvert. Dans ces guides, un chemin comme **Settings → Chatting → Message Box** signifie : l'onglet **Chatting**, puis la section **Message Box**.

### Je veux…

| Je veux… | Où aller |
| --- | --- |
| Changer la langue | **Settings → General → Language** |
| Agrandir le texte | **Settings → Appearance → Fonts & Text Size** |
| Changer le thème ou les couleurs | **Settings → Appearance → Theme**, ou une apparence prête à l'emploi dans **Settings → Appearance → CSS Themes** |
| Définir un son de notification | **Settings → General → Notifications** |
| Arrêter la confirmation de suppression | **Settings → General → Confirmations & Help** |
| Relancer la visite | **Settings → General → Confirmations & Help → Walkthroughs** |
| Ajouter des réponses rapides | **Settings → Chatting → Message Box** |
| Désactiver les swipes tactiles | **Settings → Chatting → Editing & Swipes** |
| Importer depuis SillyTavern | **Settings → Data → SillyTavern Import** |
| Faire une sauvegarde | **Settings → Data → Backup & Restore** |
| Supprimer mes données | **Settings → Data → Delete Data** |
| Mettre Marinara à jour | **Settings → Advanced → Updates** |
| Utiliser Marinara depuis mon téléphone | **Settings → Advanced → Access** et **Security** |
| Comprendre pourquoi les appuis semblent lents | **Paramètres → Avancé → Dépannage → Show tap timings** |
| Changer les images à côté des messages sur mon téléphone | **Paramètres → Apparence → Conversation → Photos de profil sur téléphone** |

### Ce que contient chaque onglet

| Onglet | Sections |
| --- | --- |
| **General** | **Language**, **Confirmations & Help**, **Extras**, **Professor Mari**, **Notifications** |
| **Chatting** | **Responses**, **Message Box**, **Editing & Swipes**, **Thinking**, **Text Formatting**, **Message Info** |
| **Appearance** | **Theme**, **Fonts & Text Size**, **Accessibility**, **Text Colors**, **Layout**, **Effects**, **Backgrounds**, **Chat Buttons & Windows**, **CSS Themes**. Voir [Réglages d'apparence](../appearance/appearance-settings.md). |
| **Conversation** | **Conversation Layout**, **Conversation Background** |
| **Roleplay** | **Tracker Panel**, **Roleplay Messages**, **Avatars**, **Visual Novel** |
| **Game** | **Game Text**, **Game Art**, **Game Assets**. Voir [Ressources de jeu](../game/game-assets.md). |
| **Media** | **Generation Defaults**, **Image Generation**, **Video Generation**, **Prompt Overrides**. Tant que tu n'as pas installé l'agent Illustrator, cet onglet propose seulement de le télécharger. Voir [Profils de style](../media/style-profiles.md) et [Remplacements de prompts](../prompts/prompt-overrides.md). |
| **Data** | **SillyTavern Import**, **Backup & Restore**, **Chat Exports**, **Storage Cleanup**, **Delete Data**. Voir [Sauvegarder et restaurer Marinara](../data/backup-and-restore.md) et [Effacer ou réinitialiser tes données](../data/clearing-data.md). |
| **Advanced** | **Updates**, **Server**, **Timeouts & Retries**, **Custom Request Parameters**, **Lorebooks**, **Security**, **Access**, **Multiplayer**, **Troubleshooting**. Voir [L'onglet Advanced](#the-advanced-tab). |

Les extensions personnelles et externes ne se trouvent pas dans Settings. Elles ont leur propre page, **Library → Extensions**. Voir [Extensions personnelles](../extending/personal-extensions.md).

### Dans la disposition classique

Si tu as désactivé **New layout** dans **Settings → Appearance → Theme**, Settings est un panneau à six onglets qui contient les mêmes sections, regroupées différemment :

| Onglet classique | Contient, dans la nouvelle disposition |
| --- | --- |
| **General** | L'onglet General, plus **Responses**, **Message Box**, **Editing & Swipes**, **Thinking**, **Text Formatting** et **Game Text** |
| **Appearance** | Les onglets Appearance, Conversation et Roleplay, plus **Game Art**, derrière quatre boutons : **App**, **Conversation**, **Roleplay** et **Game** |
| **Generations** | L'onglet Media |
| **Addons** | **CSS Themes** et les extensions personnelles |
| **Imports** | **SillyTavern Import**, **Game Assets** et l'import de profil |
| **Advanced** | L'onglet Advanced, plus **Message Info**, **Backup & Restore**, **Chat Exports**, **Storage Cleanup** et **Delete Data** |

## L'onglet General

| Section | Ce qu'elle contrôle |
| --- | --- |
| **Language** | La langue de l'interface et celle de ces guides. Voir [Langue](#language). |
| **Confirmations & Help** | **Confirm before deleting**, **Hide chat Help button** et **Walkthroughs**. |
| **Extras** | **Achievements**, **Disable seasonal Marinara themes** et **Music Player**. |
| **Professor Mari** | Une ligne, **Search and Professor Mari settings** (réglages de Search et de Professor Mari). Clique sur **Open** (ouvrir) pour ouvrir les réglages de Search – la recherche de l'application –, des réponses rapides et de Professor Mari. Voir [Professor Mari](../home/professor-mari.md). |
| **Notifications** | Position des avis, sons, notifications navigateur et Android, et push via ntfy. Voir [Notifications](#notifications). |

### Langue

| Réglage | Ce qu'il fait |
| --- | --- |
| **Language** | Définit la langue de l'interface. Il ne change ni les prompts du modèle ni le contenu des chats. Le texte pas encore traduit s'affiche en anglais. L'arabe s'affiche de droite à gauche. Par défaut : anglais. |
| **Documentation Language** | Définit la langue des guides intégrés. Voir plus bas. Par défaut : anglais. |

Les langues de l'interface sont l'arabe, le chinois simplifié, l'anglais, le français, l'allemand, l'hindi, le japonais, le coréen, le polonais, le portugais brésilien, le russe et l'espagnol. Pour améliorer une traduction ou ajouter une langue, voir [Localisation de l'interface](../development/localization.md).

Pour **Documentation Language**, l'anglais est intégré. Choisis une autre langue et clique sur **Download & Replace** (télécharger et remplacer). Marinara télécharge ce pack de langue une fois et supprime le précédent, donc il garde une seule langue téléchargée. Les guides pas encore traduits s'ouvrent en anglais avec un petit badge `EN`. La recherche dans la documentation fonctionne dans la langue active. Ton choix survit aux mises à jour, et le pack se rafraîchit après une mise à jour quand ses traductions ont changé. Si les guides téléchargés disparaissent ou sont endommagés, un bouton **Fix documentation** apparaît. Il retélécharge le pack, ou remet les guides en anglais quand la source de téléchargement est injoignable.

### Confirmations, aide et extras

| Réglage | Ce qu'il fait |
| --- | --- |
| **Confirm before deleting** | Demande confirmation avant que Marinara supprime définitivement un chat, un personnage ou un autre élément. Par défaut : activé. |
| **Hide chat Help button** | Masque le bouton **Help** dans les chats Conversation, Roleplay et Game. Par défaut : désactivé. |
| **Walkthroughs** | **Replay the welcome tour**, relancer le guide de cet appareil, ou **Show chat mode tips again**. Voir [Le tutoriel de première utilisation](../home/tutorial.md). |
| **Achievements** | Suit les succès, affiche les avis de déblocage et le widget Achievements. Voir [Succès](../home/achievements.md). Par défaut : activé. |
| **Disable seasonal Marinara themes** | Désactive les apparences saisonnières de Marinara. Par défaut : désactivé. |
| **Music Player** | Affiche le lecteur de musique compact. Il a besoin de l'agent **Music DJ** de **Library → Agents**, et reste grisé tant que tu ne l'as pas installé. Voir [Musique](../media/music.md). Par défaut : activé. |

**Show Android status bar** et **Open Android launcher** se trouvent dans **Settings → Appearance → Layout**, et seulement dans l'application Android.

### Notifications

Marinara joue une tonalité intégrée pour les notifications. Pour utiliser ton propre son :

1. Ouvre **Settings → General → Notifications**.
2. Clique sur **Choose sound** sous **Custom sound** : MP3, WAV, OGG, M4A, MP4 ou WebM, jusqu'à 10 Mo.

Le son se joue sur chaque appareil connecté à ce serveur. Tu peux l'écouter, le remplacer ou le supprimer. Si Marinara ne peut pas lire le fichier, il joue la tonalité intégrée. Le fichier fait partie des sauvegardes et des exports de profil.

**Background Notifications** couvre les messages de Conversation que les personnages envoient d'eux-mêmes. **Generation Completion Notifications** couvre les réponses que tu lances toi-même en Conversation, en Roleplay et en Game Mode. Les deux fonctionnent quand Marinara est ouvert mais pas au premier plan. Elles n'affichent jamais le contenu des messages. **Notification position** choisit si les messages d'erreur et les autres avis apparaissent en haut ou en bas.

<a id="get-notifications-on-your-phone-while-marinara-is-closed"></a>
#### Recevoir des notifications quand Marinara est fermé

**Notifications push (ntfy)** atteint le téléphone même avec tous les onglets et l’app Android fermés. Le serveur utilise ntfy, service gratuit avec app Android et iPhone.

Installe d’abord ntfy. Ouvre Marinara sur son ordinateur serveur ou dispose du secret administrateur sur cet appareil. Voir [Accès distant](../REMOTE_ACCESS.md).

1. Active **Envoyer des notifications push** dans **Settings → Général → Notifications**. Marinara crée un **Sujet** aléatoire, canal privé des notifications.
2. Touche **Ouvrir dans ntfy** ou **Copier** et abonne-toi au sujet dans ntfy.
3. Touche **Envoyer une notification de test**. Le téléphone montre « Marinara test notification ».

Deux interrupteurs choisissent les événements :

- **Messages envoyés spontanément par les personnages** : messages spontanés Conversation, écrits même sans appareil connecté.
- **Réponses lancées avant de fermer Marinara, encore inachevées à la fermeture** : seulement si tu as fermé ou quitté avant l’enregistrement. Sinon les notifications de Marinara suffisent.

La notification donne l’auteur et « Open Marinara to read it. ». **Afficher un aperçu du message** envoie plutôt jusqu’aux 200 premiers caractères. Un appui ouvre le chat à **Adresse à ouvrir**, l’adresse utilisée à l’activation. Change-la si le téléphone utilise une autre adresse.

> **Note :** Avec `ntfy.sh`, titres et aperçus passent par un serveur public ; connaître le sujet suffit pour les lire. Clique **Nouveau sujet** s’il a fuité. Pour tout garder chez toi, héberge ntfy et saisis son adresse dans **Serveur ntfy**. Un serveur local fonctionne.

Si le test échoue, Marinara explique pourquoi. Le plus souvent, le serveur ne peut pas atteindre **Serveur ntfy**.

## L'onglet Chatting

### Message Box et Editing & Swipes

| Réglage | Section | Ce qu'il fait |
| --- | --- | --- |
| **Send on Enter** | Message Box | Choisit quels modes envoient quand tu appuies sur Enter. |
| **Keep guidance after regenerating** | Message Box | Laisse ta consigne dans le champ de message après une régénération guidée. Activé par défaut. |
| **Add CYOA choices to the message box instead of sending them** | Message Box | Met un choix cliqué dans ton champ de message pour que tu puisses le modifier d'abord. |
| **Quick replies** | Message Box | Ajoute des actions de brouillon à côté du bouton d'envoi. Voir [Génération guidée et Impersonate](../chats/guided-and-impersonate.md). |
| **Speech-to-text microphone** | Message Box | Affiche un bouton de microphone dans les champs de saisie du chat. |
| **Show characters in Persona pickers** | Message Box | Liste tes personnages dans les sélecteurs de persona pour que tu puisses en incarner un. |
| **Up Arrow edits last message** | Editing & Swipes | Appuie sur Up Arrow dans un champ vide pour modifier ton dernier message. |
| **Double-click edits messages** | Editing & Swipes | Double-clique sur un message Roleplay pour le modifier. |
| **Intuitive swipe navigation** | Editing & Swipes | Passe d'un swipe à l'autre (plusieurs réponses gardées sur un message) avec les touches fléchées ou un balayage tactile. |
| **Reroll past the newest swipe** | Editing & Swipes | Génère une nouvelle réponse quand tu dépasses le swipe le plus récent. |
| **Swipe gestures on touch screens** | Editing & Swipes | Les swipes de la nouvelle disposition sur téléphone et tablette. Voir [Gestes tactiles](../chats/messages.md#touch-gestures). Activé par défaut. |
| **Guide swipes/regens with chat input** | Editing & Swipes | Utilise ton brouillon comme consigne quand tu régénères. |
| **Always show swipe menu in Conversation** / **in Roleplay** | Editing & Swipes | Garde les flèches de swipe visibles au lieu de les afficher seulement au survol. |

La section **Responses** a **Type out replies as they arrive (streaming)**, **Streaming speed**, **Trim incomplete sentences from the response**, **Ajouter une nouvelle ligne avant le texte de Continuer à écrire** (activé par défaut) et **Messages per page**. Voir [Envoyer des messages et le streaming](../chats/sending-and-streaming.md). **Thinking** a **Show Thinking In Messages** et **Don't Collapse Thinking**. Pour les actions sur les messages, voir [Actions sur les messages](../chats/messages.md).

### Text Formatting

Ces règles changent le traitement du texte du chat dans **Settings → Chatting → Text Formatting**. **Bold dialogue in quotes** et **Convert LaTeX symbols** changent seulement l'apparence du texte, donc tes messages enregistrés restent identiques. **Quote style** réécrit les guillemets du texte que tu saisis et enregistres.

| Réglage | Ce qu'il fait |
| --- | --- |
| **Bold dialogue in quotes** | Affiche en gras le texte entre guillemets. Activé par défaut. |
| **Convert LaTeX symbols** | Affiche les commandes mathématiques LaTeX sous forme de symboles. Le code n'est pas touché. Activé par défaut. |
| **Force Solid Colors for Inline Names** | Affiche les noms de personnages dans les messages avec une seule couleur unie au lieu d'un dégradé. |
| **Quote style** | **Straight** garde les guillemets simples (par défaut). **Typographic** les réécrit en guillemets et apostrophes courbes. |

#### Dialogues entre guillemets en gras

Quand ce réglage est activé, les mots entre guillemets dans `"I missed you," she said.` apparaissent en gras. Désactive-le pour garder la couleur du dialogue sans le gras.

#### Convertir les symboles LaTeX

Certains modèles écrivent les maths en commandes LaTeX. Quand ce réglage est activé, `\rightarrow`, `\neq`, `\times` et `\alpha` s'affichent comme `→`, `≠`, `×` et `α`.

#### Charger les images d'autres sites dans les messages

Cet interrupteur se trouve dans **Settings → Advanced → Security**. Désactivé par défaut. Quand il est désactivé, une image d'un autre site dans un message, une salutation ou l'aperçu d'une fiche affiche le nom du site et un bouton **Load image**. Cela empêche un message de contacter d'autres sites de lui-même. Sélectionne **Load image** pour afficher cette image. Marinara garde ton choix sur tous tes appareils. Active le réglage pour afficher toutes les images tout de suite. Les images stockées dans Marinara, comme les images de galerie, les avatars et les sprites, s'affichent toujours.

### Message Info

Ces interrupteurs sont dans **Settings → Chatting → Message Info**. Tous sont désactivés par défaut, sauf **Show context usage** et **Show "older messages not sent" note**.

| Interrupteur | Ce qu'il fait |
| --- | --- |
| **Show message timestamps** | Affiche la date et l'heure sur chaque message. |
| **Show model name on messages** | Indique quel modèle a écrit chaque réponse. |
| **Show token usage on messages** | Affiche le nombre de tokens du prompt et de la réponse pour chaque message. |
| **Show context usage** | Indique à quel point la fenêtre de contexte était pleine lors de la dernière requête mesurée, dans les sélecteurs de connexion et les réglages des chats Game. |
| **Show message numbers** | Affiche un numéro sur chaque message. |
| **Show "older messages not sent" note** | Affiche une note sous la réponse la plus récente quand des messages plus anciens n'ont pas tenu dans le prompt. Une réponse coupée ou vide affiche toujours sa propre note. |

**Include reasoning in exports** et **Include private notes in exports** sont dans **Settings → Data → Chat Exports**. Voir [Exporter et importer des chats](../chats/export-import.md).

## L'onglet Advanced

| Section | Ce qu'elle contient | Pour en savoir plus |
| --- | --- | --- |
| **Updates** | **Release Channel**, **Check for Updates** et **Refresh App** | [Mettre à jour Marinara Engine](../UPGRADING.md) |
| **Server** | **Restart Server** | |
| **Timeouts & Retries** | Le délai d'attente pour les backends lents, et **Retry failed provider calls** | [Référence de configuration du serveur](../CONFIGURATION.md) |
| **Custom Request Parameters** | Des contrôles réutilisables pour les champs de requête propres aux fournisseurs | [Paramètres de génération](../prompts/generation-parameters.md) |
| **Lorebooks** | **Stable lorebook picks** et **Lorebook activation stats** | [Interrupteurs de fonctions](../configuration/features.md) |
| **Security** | Le secret administrateur, **Allow custom Agent imports**, **Allow third-party extension imports** et **Load images from other websites in messages** | [Accès à distance](../REMOTE_ACCESS.md#the-admin-secret-and-privileged-actions) |
| **Access** | La connexion à distance, **Add a device** et ce que ce serveur laisse entrer | [Accès à distance](../REMOTE_ACCESS.md) |
| **Multiplayer** | Jouer ensemble dans un chat sur plusieurs appareils (en cours de développement) | [Référence de configuration du serveur](../CONFIGURATION.md) |
| **Troubleshooting** | **Copy Support Diagnostics**, **Debug mode** (consigne les données échangées avec le modèle dans la console du serveur), **Open Console** et **Show tap timings** (afficher les temps de réponse aux appuis) | [Résoudre les problèmes de Marinara Engine](../TROUBLESHOOTING.md#the-app-feels-slow-on-a-phone-or-tablet) |

## Synchronisation des réglages entre appareils

Marinara enregistre la plupart des réglages sur le serveur, donc ils te suivent d'un navigateur et d'un appareil à l'autre.

1. Tu changes un réglage dans **Settings**.
2. Environ une seconde plus tard, Marinara l'enregistre sur le serveur.
3. Un autre navigateur qui ouvre le même serveur charge ces réglages.

La modification la plus récente gagne. Si tu ouvres Marinara sur un deuxième appareil peu après un changement, sa copie plus ancienne peut remplacer ta modification. Attends un moment avant de changer d'appareil.

Deux réglages ne se synchronisent jamais. Définis-les à nouveau sur chaque appareil, dans **Settings → Appearance → Fonts & Text Size** :

- **Display Size**, la taille du texte de l'interface
- **Chat Font Size**, la taille du texte du chat

Voir [Réglages d'apparence](../appearance/appearance-settings.md). Si le serveur est injoignable, l'application continue de fonctionner avec tes réglages locaux et réessaie à ta prochaine modification.

## Guides associés

- [Réglages d'apparence](../appearance/appearance-settings.md)
- [Actions sur les messages](../chats/messages.md)
- [Où Marinara enregistre tes données](../data/where-data-is-stored.md)
- [Résoudre les problèmes de Marinara Engine](../TROUBLESHOOTING.md)
