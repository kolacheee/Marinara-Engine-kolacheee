# Organiser ta bibliothèque de personnages

La page **Characters** (personnages) de la Library, à droite, liste tous les personnages que tu as créés ou importés. Sers-t'en pour rechercher, trier, regrouper des personnages dans des dossiers, marquer des favoris, filtrer par tags, et exporter ou supprimer plusieurs personnages d'un coup.

## La page Characters

Ouvre **Library → Characters** (Bibliothèque → Personnages). La page affiche tes personnages sous forme de fiches avec portrait. En haut :

- **Browse online** (parcourir en ligne) ouvre le [Card Browser](bot-browser.md) pour trouver des personnages sur des sites publics.
- **Import** (importer) récupère un fichier de personnage. Voir [Importer et exporter des fiches de personnage](import-export.md).
- **New character** (nouveau personnage) ouvre la fenêtre **Create Character** (créer un personnage), vide ou à partir d'un modèle. La fiche **New character** de la grille fait la même chose.
- **Search characters or tag:name** (rechercher des personnages ou tag:nom) filtre les fiches (voir [Recherche](#search)).
- **Tags**, à côté du champ de recherche, limite les fiches aux tags que tu choisis (voir [Tags](#tags)).
- **Favoris** et **Modifiés récemment** limitent les fiches affichées. Sur téléphone, ces filtres sont réunis dans une seule liste **Filtrer**.
- Le menu de tri propose **A to Z**, **Z to A**, **Newest** (plus récents), **Oldest** (plus anciens) et **My order** (mon ordre).
- Les trois boutons de taille affichent les fiches en petit, moyen ou grand.
- **New folder** (nouveau dossier), l'icône de dossier, et **Select** (sélectionner), l'icône de coche, se trouvent à côté du titre de la page.

Clique sur une fiche pour ouvrir le personnage. Son bouton **Chat** lance un chat avec ce personnage. Si tu as beaucoup de personnages, clique sur **Load more** (charger plus) en bas.

### Actions d'une fiche

Passe le pointeur sur une fiche et clique sur **⋯** dans son coin supérieur gauche, ou fais un clic droit sur la fiche. Sur un écran tactile, appuie longuement sur la fiche. Le menu propose :

- **Duplicate** (dupliquer) crée une copie du personnage.
- **Move to folder** (déplacer vers un dossier) range le personnage dans un dossier, ou l'en retire avec **No folder** (aucun dossier).
- **Export** (exporter) télécharge le personnage au format natif de Marinara.
- **Select** lance la sélection en choisissant déjà cette fiche.
- **Delete** (supprimer) retire le personnage après confirmation.

### Ton propre ordre

Fais glisser une fiche et dépose-la avant ou après une autre. Le menu de tri passe sur **My order** et conserve cet ordre jusqu'à ce que tu choisisses un autre tri. Choisis de nouveau **My order** pour y revenir. L'option **Manual order** (ordre manuel) du panneau classique correspond au même ordre.

### Dossiers

1. Clique sur **New folder** à côté du titre de la page. Un dossier nommé **unnamed** apparaît au-dessus des fiches.
2. Pour le renommer, clique sur **⋯** sur le dossier et choisis **Rename** (renommer).
3. Fais glisser une fiche sur le dossier, ou utilise **Move to folder** dans le menu de la fiche.

Clique sur le nom d'un dossier pour le replier ou le déplier. Le nombre à côté du nom indique combien de personnages il contient. Dans le menu **⋯** du dossier, **Delete folder** (supprimer le dossier) retire uniquement le dossier : ses personnages reviennent sur la page.

### Exporter ou supprimer plusieurs personnages

1. Clique sur **Select** à côté du titre de la page. Une case à cocher apparaît sur chaque fiche.
2. Clique sur les fiches voulues. Une barre en bas indique combien sont sélectionnées et propose **Select all** (tout sélectionner).
3. Choisis **Move to folder**, **Export** ou **Delete** dans la barre.

**Export** télécharge un seul zip nommé `marinara-characters.zip`. **Delete** te demande d'abord de confirmer. Clique sur **X** dans la barre ou appuie sur <kbd>Esc</kbd> pour arrêter la sélection.

Le tri **Favorites first** (favoris en premier) et la suppression d'un tag sur tous les personnages se trouvent dans le panneau Characters de la disposition classique, décrit plus bas. Passe à cette disposition avec **New layout** (nouvelle disposition) dans **Settings → Appearance → Theme** (Paramètres → Apparence → Thème), et reviens de la même manière.

## Dans la disposition classique : le panneau Characters

Depuis le haut du panneau, tu peux :

- Cliquer sur **Download** (télécharger) pour ouvrir le [Card Browser](bot-browser.md) et trouver des personnages sur des sites publics.
- Cliquer sur **Open Library** (ouvrir la bibliothèque) pour ouvrir une grille plus grande, en pleine page, des mêmes personnages.
- Cliquer sur **New** (nouveau), l'icône plus, pour ouvrir la fenêtre **Create Character** (créer un personnage).
- Cliquer sur **Import** (importer), l'icône de téléchargement, pour importer un fichier de personnage. Voir [Importer et exporter des fiches de personnage](import-export.md).
- Cliquer sur **Select** (sélectionner), l'icône de coche, pour activer le mode sélection et agir en bloc.

La bibliothèque complète conserve la fiche sélectionnée, l'ordre de tri et la position de défilement quand tu ouvres un personnage pour le modifier, puis que tu reviens.

Chaque ligne affiche l'avatar, le nom, une ligne de titre facultative, le créateur et la version, jusqu'à 3 tags et une estimation approximative du nombre de tokens (un token est un petit morceau de texte). Une petite étoile signale un favori. Passe le pointeur sur une ligne pour voir **Duplicate** (dupliquer) et **Delete** (supprimer). Si tu as beaucoup de personnages, clique sur **Load more** (charger plus) en bas pour charger la page suivante.

<a id="search"></a>

## Recherche

Saisis du texte dans le champ de recherche en haut. Le texte indicatif affiche **Search characters or tag:name** (**Search characters/tags** dans la disposition classique). Le texte simple est comparé au nom, au titre, à la description et aux tags d'un personnage, sans tenir compte de la casse. Taper `knight` affiche tous les personnages dont l'un de ces champs contient "knight".

| Recherche | Ce qu'elle trouve |
| --- | --- |
| `male genshin` ou `male,genshin` | Les fiches qui portent ces deux tags exacts. |
| `male "Modern AU"` | Mets entre guillemets un tag qui contient des espaces ou des virgules. |
| `-tag:"slow burn"` | Masque toutes les fiches qui portent ce tag, même si le reste de ta recherche leur correspond. |
| `-vampire` | La même chose, pour un tag d'un seul mot. Tu peux omettre les guillemets. |
| `mage -tag:"villain"` | Les fiches correspondant à "mage", sans celles taguées "villain". |

Les recherches de phrases habituelles fonctionnent toujours. La même recherche fonctionne dans la Character Library en pleine page et pour les personas.

## Tri (disposition classique)

Le menu déroulant de tri du panneau classique propose :

| Option | Ce qu'elle fait |
| --- | --- |
| **Manual order** (ordre manuel) | L'ordre que tu as défini toi-même. |
| **A-Z** | Les noms de A à Z. |
| **Z-A** | Les noms de Z à A. |
| **Newest** (plus récents) | Les créations les plus récentes d'abord. |
| **Oldest** (plus anciens) | Les créations les plus anciennes d'abord. |
| **Favorites** (favoris) | Les favoris d'abord, puis le reste. |

Pour définir un ordre manuel, fais glisser une ligne vers le haut ou vers le bas, ou appuie sur <kbd>Alt</kbd>+<kbd>Up</kbd> ou <kbd>Alt</kbd>+<kbd>Down</kbd> sur une ligne qui a le focus. Dans les deux cas, le tri passe sur **Manual order**.

## Dossiers (disposition classique)

Les dossiers regroupent des personnages liés, par exemple par histoire ou par série, pour qu'une longue liste soit plus facile à parcourir. Ils sont facultatifs, et la nouvelle disposition affiche les mêmes dossiers.

1. Clique sur **New Folder** (nouveau dossier). Un dossier nommé **unnamed** apparaît.
2. Renomme-le : double-clique ou double-tape dessus, ou sélectionne-le et appuie sur <kbd>F2</kbd>. Saisis le nouveau nom et appuie sur <kbd>Enter</kbd>.
3. Fais glisser une ligne de personnage sur le dossier pour l'y ranger. Dès que tu as un dossier, une ligne d'aide indique **Drag and drop characters to folders, double-click or double-tap to rename**.

Pour ressortir un personnage, passe le pointeur sur sa ligne dans le dossier et clique sur le bouton de retrait du dossier, ou fais-le glisser en dehors. Clique sur un dossier pour le déplier ou le replier. Le nombre à côté de son nom indique combien de personnages il contient.

Sur écran tactile, appuie longuement sur une ligne pour la saisir, puis fais-la glisser. Un balayage normal fait toujours défiler la liste.

Pour en déplacer plusieurs à la fois, maintiens une ligne et touche d'autres lignes avec un deuxième doigt pour les emporter en pile. Dépose ensuite la pile sur un dossier.

Pour supprimer un dossier, passe le pointeur dessus et clique sur son bouton corbeille. Un dossier qui contient des personnages te demande de confirmer : **Delete "name"? Its N characters will stay in the library and move out of the folder.** Un dossier vide est supprimé immédiatement. Supprimer un dossier ne supprime jamais les personnages qu'il contient.

## Utiliser un dossier comme liste de participants d'un chat de groupe

Chaque dossier est aussi une liste de participants enregistrée pour les chats de groupe. Quand tu configures un chat avec plusieurs personnages, **Add from Folder** (ajouter depuis un dossier) ajoute en une étape tous les personnages d'un dossier. Voir [Chats de groupe et conversations de groupe](../chats/group-chats.md).

## Favoris et tags

### Favoris

Ouvre un personnage et clique sur son étoile **Favorite** (favori) pour l'activer ou la désactiver. Sur la page Characters, la pastille **Favourites** n'affiche que les favoris. Dans le panneau classique, les favoris affichent une petite étoile, et trois boutons sous le champ de recherche filtrent la liste :

- **All** (tous) affiche tous les personnages.
- **Favs** (favoris) n'affiche que les favoris.
- **Non-favs** (non favoris) n'affiche que les personnages qui ne sont pas en favoris.

Tu peux aussi choisir **Favorites** dans le menu déroulant de tri pour placer les favoris en haut.

### Tags

Les tags sont des étiquettes comme `fantasy` ou `slow burn`. Tu les ajoutes dans l'éditeur de personnage. Voir [Créer et modifier des personnages](creating-and-editing-characters.md#metadata-tab). Les imports ajoutent **Importé** et un tag indiquant l'origine de la fiche, comme **ST** ou **CharX**. Voir [Options d'import](import-export.md#import-options).

Pour filtrer par tag sur la page Personnages :

1. Clique sur **Tags** à côté du champ de recherche. Une liste de tous les tags s'ouvre, avec le nombre de personnages qui portent chacun d'eux.
2. Saisis du texte dans **Rechercher des tags** pour en trouver un, puis clique sur les tags souhaités. Si tu en sélectionnes plusieurs, seuls les personnages qui les portent **tous** s'affichent. **Sans tag** affiche les personnages qui n'ont aucun tag.
3. Le bouton **Tags** indique combien tu en as sélectionné. Clique sur **Effacer** dans la liste pour les retirer.

Les pages **Personas** et **Lorebooks** ont le même bouton **Tags**, et **Presets** en a un aussi. Saisir `tag:name` dans le champ de recherche fonctionne toujours sur chacune de ces pages.

Dans le panneau classique, dès que tes personnages ont des tags, un bouton **Tags** apparaît avec un nombre, par exemple **Tags (12)**. Clique dessus pour déplier la liste complète :

- Clique sur un tag pour l'ajouter comme filtre. Avec plusieurs tags sélectionnés, un personnage correspond s'il porte au moins l'un d'eux.
- Clique sur le X d'un tag pour supprimer ce tag de tous les personnages qui le portent. Une confirmation t'est demandée : **Remove tag "name" from all characters?**
- **Clear** (effacer) apparaît dès qu'un filtre de tag est actif. Clique dessus pour effacer les filtres de tag.

Pour exclure un tag à la place, utilise `-tag:` dans le champ de recherche, comme le montre [Recherche](#search).

<a id="export-or-delete-many-characters"></a>

## Exporter ou supprimer plusieurs personnages (disposition classique)

1. Clique sur **Select** en haut du panneau. Une case à cocher apparaît sur chaque ligne.
2. Clique sur les personnages voulus. L'en-tête du panneau indique combien sont sélectionnés.
3. Sers-toi de la barre d'actions en bas.

La barre d'actions comporte deux boutons :

- **Export** (exporter) télécharge les personnages sélectionnés dans un seul zip nommé `marinara-characters.zip`, au format natif de Marinara.
- **Delete** supprime les personnages sélectionnés. Une confirmation t'est d'abord demandée : **Delete N characters?**

En mode sélection, tu peux aussi faire glisser ensemble les personnages sélectionnés dans un dossier. Pour les formats de fichiers, voir [Importer et exporter des fiches de personnage](import-export.md).

## Guides associés

- [Importer et exporter des fiches de personnage](import-export.md)
- [Créer et modifier des personnages](creating-and-editing-characters.md)
- [Chats de groupe et conversations de groupe](../chats/group-chats.md)
