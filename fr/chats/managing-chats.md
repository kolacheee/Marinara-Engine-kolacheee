# Gérer la liste des chats

Tes chats se trouvent dans la barre latérale à droite, sous **Chats**. Clique sur **Bibliothèque** en haut à droite pour afficher ou masquer la barre latérale, puis choisis **Chats** dans le sélecteur en haut (l'autre côté est **Bibliothèque**). Sur un téléphone ou une tablette, touche le bouton en forme de pile en haut à droite ; la barre latérale glisse par-dessus la page avec le même sélecteur. Sers-toi de la liste des chats pour lancer, retrouver, trier, organiser et supprimer des chats.

## La liste des chats et les onglets de mode

En haut se trouvent **Importer**, **Nouveau dossier**, **Sélectionner des chats** et **Nouveau**. Sur un téléphone, tous sauf **Nouveau** sont dans le menu **⋯** à côté. Sous ces boutons se trouvent trois onglets de mode, chacun indiquant combien de chats il contient (sur un téléphone, le premier affiche **Conversation**). Chaque onglet n'affiche que les chats de ce mode.

| Onglet | Mode |
| --- | --- |
| **Convo** | Conversation : un chat façon messagerie. |
| **Roleplay** | Roleplay : une scène avec des personnages et un suivi de l'univers. |
| **Game** | Game : un jeu de rôle solo mené par l'IA. |

Chaque ligne affiche le nom du chat et les avatars de ses personnages. Dans les chats Conversation, un point de couleur sur un avatar indique le statut de ce personnage. Un badge rouge indique le nombre de messages non lus. Une ligne avec une petite icône de branche et un nombre correspond à un chat qui a plusieurs branches, regroupées sur une seule ligne. Voir [Branches de chat](branches.md). Sur un ordinateur, passer le pointeur sur une ligne affiche un aperçu du chat et ses boutons **Renommer le chat** et **Tags du chat**.

Les chats épinglés sont en tête de liste. Pour en épingler un, fais un clic droit dessus (ou balaie-le vers la gauche sur un écran tactile) et choisis **Épingler**.

## Créer un chat

Avant de commencer : ajoute au moins un compte dans **Connections** (Connexions). Voir [Se connecter à un fournisseur d'IA](../connections/connecting-to-a-provider.md).

1. Clique sur l'onglet du mode voulu.
2. Clique sur **Nouveau** en haut de la liste. Son infobulle est **New Conversation**, **New Roleplay** ou **New Game**, selon l'onglet. Tu peux aussi en lancer un depuis **Conversation**, **Roleplay** ou **Game** sur l'accueil.

Marinara crée et ouvre le chat. **Chat Settings** (réglages du chat) et un assistant de configuration s'ouvrent à côté. Tant que tu n'as pas terminé la configuration, le chat reste absent de la liste. Si tu quittes la configuration et choisis de le garder, il apparaît sous le nom **Configuration inachevée**, pour que tu puisses y revenir. Le chat porte d'abord le nom **New Conversation**, **New Roleplay** ou **New Game**. Si tu as enregistré un profil de réglages par défaut marqué d'une étoile pour Conversation ou Roleplay, Marinara l'applique au nouveau chat. Voir [Profils de réglages](settings-profiles.md).

Si ça n'a pas marché : sans compte enregistré, la fenêtre **Add account** (ajouter un compte) s'ouvre à la place d'un chat. Choisis un service, clique sur **Connect** (connecter), puis choisis un modèle. La marche à suivre complète se trouve dans [Se connecter à un fournisseur d'IA](../connections/connecting-to-a-provider.md).

## Importer un chat

Tu peux importer un historique de chat `.jsonl` depuis SillyTavern ou Marinara.

1. Clique sur l'onglet du mode dans lequel le chat doit atterrir.
2. Clique sur le bouton **Import** (importer), la flèche de téléchargement, en haut de la liste. Son libellé est **Import SillyTavern or Marinara chat JSONL**.
3. Choisis ton fichier `.jsonl`.

Marinara crée le chat, l'ouvre et affiche **Imported N messages**. Pour les formats d'export et l'export en lot, voir [Exporter et importer des chats](export-import.md).

Si ça n'a pas marché : un petit message en bas de l'écran affiche **Import failed** avec la raison. Seuls les fichiers `.jsonl` sont acceptés.

## Renommer un chat

Le nom du chat n'est là que pour toi. Il n'est pas envoyé au modèle.

1. Ouvre le chat, puis ouvre **Chat Settings**.
2. Dans **Chat Name** (nom du chat), clique sur le nom actuel.
3. Saisis le nouveau nom, puis appuie sur <kbd>Enter</kbd> ou clique sur la coche.

Voir [Vue d'ensemble des Chat Settings](chat-settings.md) pour savoir comment ouvrir le panneau.

## Supprimer un chat

1. Fais un clic droit sur la ligne du chat et choisis **Supprimer**. Sur un écran tactile, balaie la ligne vers la gauche, ou appuie longuement dessus, puis touche **Supprimer**.
2. Dans la boîte de dialogue **Delete Chat** (supprimer le chat), clique sur **Delete** (supprimer).

La suppression est définitive. Elle interrompt aussi toute réponse encore en cours d'écriture pour ce chat. Pour en supprimer plusieurs à la fois, voir [Sélectionner plusieurs chats](#selecting-multiple-chats).

Si le chat a plusieurs branches, la boîte de dialogue indique combien et propose deux choix :

- **Delete This Branch Only** (supprimer seulement cette branche) retire la branche sur laquelle tu as cliqué.
- **Delete All N branches** (supprimer les N branches) retire toutes les branches du groupe.

Pour gérer les branches sans supprimer le chat, voir [Branches de chat](branches.md).

Le réglage global de l'application **Confirm before deleting** (confirmer avant de supprimer) contrôle ces boîtes de dialogue. Il est activé par défaut. Il se trouve dans **Settings → General → Confirmations & Help** (Paramètres → Général → Confirmations et aide).

## Les dossiers de chat

Les dossiers regroupent des chats à l'intérieur d'un onglet de mode.

1. Ouvre un onglet qui contient au moins un chat.
2. Clique sur **Nouveau dossier** (le bouton en forme de dossier en haut de la liste). Le dossier s'appelle **unnamed** (puis **unnamed 2**, **unnamed 3**).

| Pour faire ceci | Fais cela |
| --- | --- |
| Renommer un dossier | Double-clique dessus ou touche-le deux fois, ou sélectionne-le et appuie sur <kbd>F2</kbd>. Un nom vide est ignoré. |
| Supprimer un dossier | Clique sur le bouton en forme de corbeille sur la ligne du dossier. Une boîte de dialogue **Delete Folder** apparaît quand le dossier contient des chats. Les chats remontent au niveau supérieur et ne sont pas supprimés. |
| Réordonner les dossiers | Fais glisser un dossier vers le haut ou vers le bas. Le menu de tri passe sur **Custom** (personnalisé). |
| Déplacer un chat dans un dossier | Fais glisser la ligne du chat sur le dossier. Sur un écran tactile, appuie d'abord sur le chat pendant une demi-seconde environ. |
| Sortir un chat d'un dossier | Fais-le glisser sur la zone vide sous les dossiers. |

Quand plusieurs chats sont sélectionnés, en faire glisser un déplace toute la sélection. Les chats hors dossier sont listés sous les dossiers.

## Rechercher, trier et filtrer

### Retrouver un chat par son nom

Chaque onglet a un champ de recherche. Son texte indicatif est **Search conversations**, **Search roleplays** ou **Search games**. Saisis un mot. La recherche porte sur les noms des chats, leurs tags et les noms des personnages, pas sur le texte des messages.

### Filtrer par tag

Clique sur **Tags** (le bouton en forme de tag à côté du champ de recherche). Choisis un ou plusieurs tags, ou **Sans tag**. Le bouton indique combien tu en as choisi. Un chat et ses branches ne comptent qu'une fois. Ajoute des tags à un chat avec **Tags du chat** sur sa ligne, ou **Tags** dans son menu de clic droit ou de balayage.

### Retrouver un message dans tous les chats

Appuie sur <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> (<kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> sur un Mac), ou cherche cette fonction avec le bouton de recherche dans la barre supérieure. La recherche parcourt tous les chats et peut filtrer par mode, personnage, expéditeur et date.

### Trier

Le menu de tri (**Sort chats**) propose ces options :

| Option | Ordre |
| --- | --- |
| **Custom** | L'ordre de tes dossiers. |
| **Manual order** | Les chats dans l'ordre où tu les fais glisser. Au clavier, sélectionne un chat et appuie sur <kbd>Alt</kbd>+<kbd>Up</kbd> ou <kbd>Alt</kbd>+<kbd>Down</kbd>. |
| **Recent** | Les plus récemment actifs en premier. C'est l'option par défaut. |
| **Newest** | Les plus récemment créés en premier. |
| **Oldest** | Les plus anciens en premier. |
| **De A à Z** et **De Z à A** | Par nom. |

La liste affiche d'abord 40 chats, puis ajoute les 40 suivants quand tu fais défiler vers la fin.

## Quand la liste s'actualise

Pour que l'application reste rapide, la liste des chats ne se recharge pas en permanence :

- Elle s'actualise immédiatement quand tu crées, modifies ou supprimes un chat sur cet appareil.
- Les modifications faites depuis un autre appareil (un chat commencé sur ton téléphone, par exemple) apparaissent quand tu reviens dans l'application depuis une autre application ou un autre onglet du navigateur : la liste s'actualise une fois à ce moment-là.
- Le serveur ne peut pas envoyer spontanément les modifications à ton appareil. Si deux appareils sont ouverts côte à côte, passe dans une autre application puis reviens pour voir les modifications de l'autre appareil.

## Sélectionner plusieurs chats

1. Clique sur le bouton en forme de coche, **Select chats** (sélectionner des chats), en haut de la liste.
2. Clique sur chaque chat voulu. Les lignes affichent une case à cocher au lieu d'ouvrir le chat.
3. Utilise la barre en bas, qui indique combien de chats sont sélectionnés.

**Export** (exporter) télécharge les chats sélectionnés dans un seul fichier `.zip` de fichiers `.jsonl`. **Delete** te demande de confirmer dans une boîte de dialogue **Delete Chats**, puis les supprime. Clique de nouveau sur le bouton en forme de coche pour quitter le mode sélection. Changer d'onglet efface aussi la sélection.

## Les chats récents sur l'écran d'accueil

L'écran d'accueil comporte un widget **Recent chats** (chats récents) avec tes derniers chats. Chacun affiche son nom, un badge de mode et son dernier message. Clique sur un chat pour l'ouvrir. Sans aucun chat, le widget affiche **Your chats will show here**. Voir [Les widgets de l'accueil](../home/welcome.md#home-widgets).
