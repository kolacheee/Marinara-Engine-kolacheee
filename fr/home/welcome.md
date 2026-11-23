# Démarrer avec Marinara Engine

Marinara Engine est une application pour discuter et faire du roleplay avec des personnages IA. Elle tourne sur ton propre ordinateur. Ce guide présente l'écran d'accueil et les étapes jusqu'à ton premier chat.

## Lancer ton premier chat

Avant de commencer : il te faut une clé API (un code secret, un peu comme un mot de passe) d'un service d'IA, ou le **Built-in model** (modèle intégré) décrit plus bas.

1. Installe Marinara Engine et ouvre l'application dans ton navigateur. Choisis ta plateforme dans [Installation de Marinara Engine](../INSTALLATION.md).
2. Ajoute une connexion : une clé API pour un service d'IA, ou le **Modèle intégré**. Voir [Se connecter à un fournisseur d'IA](../connections/connecting-to-a-provider.md).
3. Choisis les modèles que la connexion doit utiliser. Le même guide explique comment.
4. Crée ou importe un personnage. Ouvre **Library → Characters** (Bibliothèque → Personnages) en cliquant sur **Library** en haut à droite, puis clique sur **New character** (nouveau personnage), ou sur **Import** (importer) pour récupérer une fiche depuis un fichier. Voir [Créer et modifier des personnages](../characters/creating-and-editing-characters.md).
5. Clique sur **Conversation**, **Roleplay** ou **Game** sur l'accueil. Tu peux aussi ouvrir tes chats : clique sur **Bibliothèque** en haut à droite, choisis **Chats** en haut de la barre latérale, puis l'onglet **Convo**, **Roleplay** ou **Game**, et clique sur **Nouveau**.
6. La page de configuration s'ouvre dans le nouvel onglet. Choisis un personnage et l'option **Contenu**, puis clique sur **Démarrer le Roleplay** (ou **Commencer à discuter** pour une Conversation, **Créer le monde** pour un Game Mode).

Ce que tu vois : le nouveau chat s'ouvre, et tu peux écrire ton premier message.

Si tu n'as encore aucune connexion, Marinara ouvre d'abord la fenêtre d'ajout de connexion.

Marinara n'inclut pas d'IA en ligne. La plupart des gens se connectent à un service en ligne. Tu peux aussi télécharger le **Built-in model**, un petit modèle qui tourne sur ton ordinateur sans clé API. Il convient aux petites tâches d'assistance, pas à ton chat principal. Voir [Configuration du modèle intégré](../connections/local-model.md).

À la première ouverture de Marinara, une courte visite guidée démarre. Voir [Le tutoriel de première ouverture](tutorial.md). Tu bloques sur une étape ? Demande à Professor Mari, l'assistante intégrée : [Professor Mari, ton assistante intégrée](professor-mari.md).

## Trouver ton chemin

Marinara a deux emplacements fixes, qui restent à leur place quel que soit le thème utilisé :

- **La barre supérieure.** À gauche, **Accueil** et un onglet pour chaque chat, personnage ou page que tu ouvres. À droite, le bouton de recherche (ou <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>⌘</kbd>+<kbd>K</kbd> sur un Mac) trouve ou ouvre n'importe quoi : un chat, un personnage, un réglage, un guide ou une question pour Professor Mari. À côté se trouvent **Réglages du chat** quand un chat est ouvert, **Documentation** pour ces guides, et **Bibliothèque**, qui affiche ou masque la barre latérale.
- **La barre latérale** à droite, avec un sélecteur **Chats | Bibliothèque** en haut. **Chats** liste tes chats sous les onglets **Convo**, **Roleplay** et **Game** (voir [Gérer ta liste de chats](../chats/managing-chats.md)). **Bibliothèque** liste **Personnages**, **Personas**, **Lorebooks**, **Presets**, **Scripts regex**, **Connexions**, **Agents** et **Outils personnalisés**, puis **Paramètres** et **Extensions**. Choisis-en un pour ouvrir sa page au milieu.

Sur un ordinateur, tu peux aussi afficher deux pages côte à côte. Voir [Vue partagée](tabs-and-drafts.md#split-view-two-pages-at-once).

Sur un téléphone ou une tablette, **Accueil** se trouve en haut à gauche et **Bibliothèque** (le bouton en forme de pile) en haut à droite. Bibliothèque fait glisser la barre latérale par-dessus la page, avec le même sélecteur **Chats | Bibliothèque** ; sa vue Bibliothèque contient **Paramètres**, **Documentation** et **Tous les onglets** en bas. Touche le titre dans la barre supérieure pour effectuer une recherche, et le bouton numéroté pour voir tes onglets ouverts. Voir [Onglets, vue partagée et modifications non enregistrées](tabs-and-drafts.md) et [Gestes tactiles](../chats/messages.md#touch-gestures).

## L'écran d'accueil en un coup d'œil

L'accueil s'affiche quand aucun chat n'est ouvert. En haut se trouvent un message de bienvenue, le numéro de version et les boutons **Conversation**, **Roleplay** et **Game**, qui lancent chacun un nouveau chat dans ce mode. Si aucun modèle n'est encore configuré, **Connect a model to start chatting** (connecter un modèle pour commencer à discuter) ouvre la page Connections. **Professor** ouvre Professor Mari dans son propre onglet, une application installée (comme Story Writer) ajoute aussi un bouton ici, et **Widgets** organise les cartes en dessous.

Dans la disposition classique (désactivée sous **Settings → Appearance → Theme → New layout** (Paramètres → Apparence → Thème → Nouvelle disposition)), l'accueil ressemble plutôt à un navigateur web, avec des onglets, une barre de recherche et des marque-pages pour **Discord**, **Support**, **Credits**, **Documentation**, **Tutorial**, **FAQ**, **Achievements** et **Widgets**.

## Choisir un mode de chat

Tu choisis un mode quand tu lances un chat.

- **Conversation** : un simple chat avec l'IA, présenté comme une messagerie. Voir [Mode Conversation : premiers pas](../conversation/getting-started.md).
- **Roleplay** : une histoire avec un ou plusieurs personnages. L'application suit la scène, comme le lieu et l'heure. Voir [Mode Roleplay : premiers pas](../roleplay/getting-started.md).
- **Game** : un jeu solo. L'IA joue le Game Master (le maître du jeu), qui raconte l'histoire. Tu as des compagnons de route (ton équipe), des jets de dés, des cartes et des quêtes. Voir [Game Mode : premiers pas](../game/getting-started.md).

## Les widgets de l'accueil

Les widgets sont de petites cartes que tu peux afficher, masquer et déplacer.

1. Clique sur **Widgets** sur l'accueil. La fenêtre **Home Widgets** (widgets de l'accueil) s'ouvre. Elle liste les widgets sous **Built-in** (intégrés), **Agents** et **Personal** (personnels).
2. Clique sur le bouton en forme d'œil à côté d'un widget pour l'afficher ou le masquer. Un widget que tu affiches de nouveau prend la première place libre de l'accueil.
3. Pour déplacer un widget, fais glisser la poignée dans son coin supérieur droit. Sur ordinateur, la poignée apparaît quand tu pointes sur le widget.

Ta disposition est enregistrée dans ce navigateur. Les widgets personnels ont aussi des boutons pour les modifier ou les supprimer. Dans la disposition classique, **Browser chrome** (habillage du navigateur), en bas de la fenêtre, propose un seul interrupteur : **Show URL bar** (afficher la barre d'URL) affiche ou masque la barre de recherche de l'accueil sur un ordinateur.

Professor Mari peut te créer un widget personnel si tu le lui demandes. Les agents installés peuvent aussi ajouter des widgets.

## Référence : les widgets intégrés

| Widget | Ce qu'il fait | Affiché au départ |
| --- | --- | --- |
| **Professor Mari** | **Ask Professor Mari** (demander à Professor Mari) ouvre son chat. | Oui |
| **Recent chats** (chats récents) | Tes derniers chats. Clique sur l'un d'eux pour le rouvrir. Quand il est vide : **Your chats will show here**. | Oui |
| **À essayer** | Les trois prochaines petites choses à essayer, une fonctionnalité à la fois. Quand tu les as toutes essayées ou que tu désactives les conseils, le widget affiche à la place **Documentation**, **Revoir le tutoriel** et **Lire la FAQ**. Voir [À essayer](#things-to-try). | Oui |
| **What's New** (nouveautés) | **See what's new** (voir les nouveautés) et **Read release notes** (lire les notes de version). | Oui |
| **Community** (communauté) | Des liens vers **Discord**, **Support** et **Credits**. | Oui |
| **Character Library** (bibliothèque de personnages) | Une nouvelle sélection de tes personnages chaque jour. | Non |
| **Discovery desk** (bureau des découvertes) | Les agents que tu n'as pas installés. **Browse agents** (parcourir les agents) ouvre le catalogue. | Non |
| **Character of the Day** (personnage du jour) | Un personnage de ta bibliothèque, avec **Start a chat** (lancer un chat) et **View character** (voir le personnage). | Non |
| **Clock & calendar** (horloge et calendrier) | La date et l'heure du jour. | Non |
| **Achievements** | Tes derniers succès et ceux qui sont les plus proches. Le réglage Achievements doit être activé. | Non |

## À essayer

Le widget **À essayer** te propose les trois prochaines fonctionnalités à essayer. Chaque tâche s'appuie sur la précédente : une image de galerie devient un sticker, puis tu envoies ce sticker dans un chat.

- Clique sur une tâche pour ouvrir l'endroit correspondant dans l'application. S'il n'y en a pas, son guide s'ouvre.
- Clique sur la coche pour la marquer comme terminée, ou sur la croix pour la passer. Une tâche passée ne réapparaît jamais.
- La plupart des tâches se cochent toutes seules quand Marinara voit que tu les as faites, par exemple un chat dans ce mode ou une étiquette de sticker. Coche les autres toi-même.
- **Tout voir** liste toutes les tâches par parcours, avec **Me montrer**. Les tâches d'un parcours apparaissent quand celles dont elles dépendent sont terminées. Les parcours sous **Uniquement dans cette disposition** couvrent les fonctionnalités de la nouvelle disposition.
- Terminer un parcours débloque son succès **Explorateur**.

Le widget suit le réglage **Conseils sur les fonctionnalités** dans **Paramètres > Général > Confirmations et aide**. Quand les conseils sont désactivés, il affiche les liens vers les guides. La progression est enregistrée dans ce navigateur.

### Les bases de l'IA et Pour aller plus loin

**Tout voir** propose deux onglets supplémentaires :

- **Les bases de l'IA** : une courte visite pour ceux qui découvrent l'IA. Elle explique ce qu'est un modèle, les types utilisés par Marinara, les tokens et le contexte, et t'aide à configurer un modèle si tu le souhaites (tu peux passer cette étape). Elle se termine avec Professor Mari. Elle est proposée une seule fois, dans une petite fenêtre après le tutoriel d'accueil. Voir [Les bases de l'IA](ai-basics.md).
- **Pour aller plus loin** : des réglages dont le choix n'est pas évident et des fonctions peu connues, comme le CSS dans les Notes du créateur d'une fiche. Les groupes que tu utilises le plus sont présentés en premier.

Chaque étape ouvre son guide au passage utile, mis en évidence, avec une carte en dessous qui l'explique simplement. Clique sur **Compris** pour la cocher ; dans Les bases de l'IA, cela ouvre l'étape suivante. Une fois le parcours Essentiel terminé, la dernière ligne du widget te propose un guide approfondi. Terminer Les bases de l'IA ou un groupe de guides approfondis débloque un succès **Explorateur** ; terminer tous les guides approfondis en débloque un de plus. La fenêtre qui propose la visite respecte elle aussi le réglage **Conseils sur les fonctionnalités**.

## Où trouver de l'aide

- Pose tes questions à Professor Mari sur l'écran d'accueil.
- Ouvre **Tout voir** dans le widget **À essayer**, puis **Lire la FAQ**, pour des réponses rapides.
- Clique sur **Docs** dans la barre supérieure pour ouvrir les guides intégrés.
- Clique sur **Discord** dans le widget **Community** pour rejoindre la communauté, ou sur **Support** pour soutenir le projet.

Si quelque chose est cassé, voir [Résoudre les problèmes de Marinara Engine](../TROUBLESHOOTING.md).

## Guides associés

- [Installation de Marinara Engine](../INSTALLATION.md)
- [Se connecter à un fournisseur d'IA](../connections/connecting-to-a-provider.md)
- [Créer et modifier des personnages](../characters/creating-and-editing-characters.md)
- [Le tutoriel de première ouverture](tutorial.md)
- [Onglets, vue partagée et modifications non enregistrées](tabs-and-drafts.md)
- [Professor Mari, ton assistante intégrée](professor-mari.md)
