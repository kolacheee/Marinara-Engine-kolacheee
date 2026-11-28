# Vue d'ensemble des lorebooks

Un lorebook est un recueil de faits sur ton univers que l'IA lit quand leurs mots-clés apparaissent dans le chat. Utilises-en un pour les lieux, les factions, les histoires personnelles et les règles, pour ne pas avoir à les répéter dans chaque message.

Chaque lorebook contient des entrées. Une entrée a des mots-clés déclencheurs et un bloc de texte. Quand un mot-clé apparaît dans les messages récents du chat, Marinara ajoute le texte de l'entrée au prompt, le texte envoyé au modèle pour une réponse. Dans d'autres outils, les lorebooks s'appellent aussi World Info.

Par exemple, une entrée avec le mot-clé `Eldoria` et le texte ci-dessous fait connaître la ville à l'IA chaque fois que quelqu'un la mentionne.

```text
Eldoria is a rainy port city ruled by a council of nine merchants.
```

La correspondance par mots-clés fonctionne avec n'importe quel modèle, sans aucune configuration. Pour une correspondance par le sens plutôt que par les mots exacts, voir [Recherche sémantique pour les lorebooks](semantic-search.md).

## Créer un lorebook et ajouter une entrée

1. Ouvre **Library** > **Lorebooks** (Bibliothèque > Lorebooks). La Library se trouve à droite.
2. Clique sur **New** (nouveau, l'icône plus). La fenêtre **Create Lorebook** (créer un lorebook) s'ouvre.
3. Saisis un nom dans le champ **Name** (nom). Ce champ est obligatoire.
4. Ajoute une **Description** si tu veux.
5. Choisis une catégorie dans le menu **Category** (catégorie). La valeur par défaut est **Other**. Si tu comptes lier ce lorebook à un personnage, choisis **Character**, car le sélecteur du personnage n'affiche que cette catégorie.
6. Clique sur **Create Lorebook**. Le nouveau lorebook apparaît dans la liste.
7. Clique sur la ligne du lorebook. L'éditeur pleine page s'ouvre.
8. Clique sur l'onglet **Entries** (entrées).
9. Clique sur **Add Entry** (ajouter une entrée). Une nouvelle ligne d'entrée vide apparaît.
10. Saisis un nom dans la ligne, par exemple `Eldoria`, puis clique sur la ligne pour l'ouvrir.
11. Dans **Primary Keys** (clés principales), tape `Eldoria` et appuie sur <kbd>Enter</kbd>.
12. Dans **Content** (contenu), écris le texte destiné à l'IA.

L'entrée s'enregistre toute seule un instant après que tu as cessé de taper, et **Saved automatically** s'affiche. Désormais, l'entrée rejoint le prompt chaque fois que son mot-clé correspond. Pour les mots-clés, la position et le déclenchement, voir [Les entrées de lorebook : mots-clés, position et déclenchement](entries.md).

Si ça n'a pas marché : vérifie que le lorebook est actif dans le chat (voir plus bas), que son interrupteur **Enabled** (activé) est allumé, et que le mot-clé apparaît dans les derniers messages. Marinara n'examine que le nombre de messages indiqué par le réglage **Scan Depth** (profondeur d'analyse).

## Rendre un lorebook actif dans un chat

Un lorebook n'alimente l'IA que s'il est actif dans le chat ouvert. Il y a trois façons de l'activer.

| Façon | Où la régler | Actif dans |
| --- | --- | --- |
| Global | L'interrupteur **Global** de l'onglet **Overview** (vue d'ensemble) du lorebook | Tous les chats |
| Lié | L'onglet **Overview** du lorebook, ou l'éditeur de personnage ou de persona (le personnage que tu incarnes) | Les chats avec ce personnage ou ce persona |
| Ajouté à un seul chat | **Chat Settings → Lorebooks** (réglages du chat → Lorebooks) | Ce chat uniquement |

Un lorebook ne peut pas être à la fois global et lié. Activer **Global** efface ses liens vers des personnages et des personas au moment de l'enregistrement.

Un lorebook actif a quand même besoin que son interrupteur **Enabled** soit allumé. Pour les liens, voir [Lier des lorebooks à des personnages et à des personas](linking-to-characters.md).

## Les réglages de l'onglet Overview

Ouvre un lorebook et clique sur **Overview** pour régler le comportement du lorebook entier.

| Réglage | Rôle | Par défaut |
| --- | --- | --- |
| **Scan Depth** | Le nombre de messages récents que Marinara examine à la recherche de mots-clés. 0 analyse tout le chat. | 2 |
| **Token Budget** | Le nombre maximal de tokens que ce lorebook peut ajouter à une réponse. 0 signifie aucune limite. | 2048 |
| **Entry Limit** | Le nombre maximal d'entrées que ce lorebook peut ajouter à une réponse. Plage de 1 à 1000. | 100 |
| **Max Depth** | Le nombre de passes supplémentaires pour la récursivité. Affiché seulement quand **Recursive** (récursif) est activé. Plage de 1 à 10. | 3 |

Les tokens sont de petits morceaux de texte que les modèles comptent ; en anglais, un token vaut environ trois quarts de mot. Pour le rôle de chaque limite et le sens de la récursivité, voir [Budgets de tokens et récursivité des lorebooks](token-budgets.md).

L'onglet propose aussi ces interrupteurs.

- **Enabled** active ou désactive le lorebook entier. Il est activé par défaut.
- **Global** rend le lorebook actif dans tous les chats.
- **Recursive** autorise le texte d'une entrée activée à déclencher d'autres entrées. Il est désactivé par défaut.
- **Vectors** (vecteurs) permet aux entrées de correspondre aussi par le sens. Il est désactivé par défaut, et les mots-clés fonctionnent dans les deux cas.

Le panneau **Semantic search (embeddings)** (recherche sémantique), sous les interrupteurs, est traité dans [Recherche sémantique pour les lorebooks](semantic-search.md).

## Donner une image à un lorebook

L'image s'affiche sur la page **Lorebooks** (dans le tableau et les vignettes de la galerie) et dans les sélecteurs de lorebooks.

1. Ouvre le lorebook et clique sur **Book settings** (réglages du livre). **Image** se trouve à côté de **Activé**.
2. Clique sur **Téléverser** (ou **Remplacer**) et choisis un fichier, ou clique sur **Générer avec l'IA** pour créer une couverture avec ta connexion de génération d'images. **Générer avec l'IA** apparaît une fois que tu en as configuré une.
3. Clique sur **Ajuster le recadrage** (ou sur la petite image). Fais glisser le carré sur l'image pour choisir la partie visible, et tire ses coins pour le redimensionner.
4. Clique sur **Enregistrer**.

Une nouvelle image n'est pas recadrée au départ. Pour retirer l'image, ouvre **Ajuster le recadrage** et clique sur **Retirer**.

Dans la disposition classique, l'image se trouve dans la section **Image** en haut de l'onglet **Overview** du lorebook, avec les mêmes boutons.

## La page Lorebooks

Ouvre **Library → Lorebooks** (Bibliothèque → Lorebooks). En haut se trouvent **Parcourir en ligne** (les lorebooks à télécharger depuis Chub, voir [Importer et exporter des lorebooks](import-export.md#download-a-lorebook-from-chub)), **Import** (importer, voir [Importer et exporter des lorebooks](import-export.md)) et **New lorebook** (nouveau lorebook). En dessous :

- **All kinds** (tous les types) limite la liste aux lorebooks **Global**, **World**, **Character**, **NPC** ou **Spellbook**.
- **List** (liste) et **Gallery** (galerie) permettent de passer d'un tableau à des vignettes illustrées.
- Le menu de tri propose **Recently edited** (modifiés récemment), **A to Z**, **Z to A** et **My order** (mon ordre).

Clique sur un lorebook pour l'ouvrir.

### Organiser tes lorebooks

- Le bouton **⋯** à la fin d'une ligne (ou un clic droit sur la ligne) propose **Duplicate** (dupliquer), **Move to folder** (déplacer vers un dossier), **Export**, **Select** et **Delete**. Sur un écran tactile, maintiens la ligne appuyée. **Duplicate** copie le lorebook avec toutes ses entrées et ouvre la copie.
- Fais glisser une ligne au-dessus ou en dessous d'une autre pour définir ton propre ordre. Le menu de tri passe à **My order**.
- **New folder** (nouveau dossier, l'icône de dossier à côté du titre) ajoute un dossier de bibliothèque. Fais glisser un lorebook dessus, ou utilise **Move to folder**. Ces dossiers sont distincts des dossiers d'entrées à l'intérieur d'un lorebook. Clique sur un dossier pour le replier, et utilise son bouton **⋯** pour le renommer ou le supprimer. Supprimer un dossier conserve ses lorebooks.
- **Select** (l'icône de coche à côté du titre) ajoute une case à cocher sur chaque ligne. Choisis des lorebooks, puis utilise la barre du bas : **Move to folder**, **On or off** (activé ou désactivé), **Export** (un fichier `marinara-lorebooks.zip`) ou **Delete**.

## Dans la disposition classique : le panneau Lorebooks

Le panneau classique affiche les mêmes dossiers et le même ordre sous forme de liste. En haut du panneau, **Télécharger** ouvre le Card Browser sur les lorebooks à télécharger, et **Ouvrir la bibliothèque** ouvre la bibliothèque de lorebooks, une vue pleine page de tes lorebooks avec leurs images, leurs descriptions et leur nombre d'entrées. Clique sur un lorebook pour le voir en plus grand ; **Modifier le lorebook** ouvre l'éditeur, et **Actif** active ou désactive le lorebook pour tous les chats.

En dessous, trois boutons-icônes affichent leur nom quand tu passes le pointeur dessus.

- **New** ouvre la fenêtre **Create Lorebook**.
- **Import** (importer) ouvre la fenêtre **Import Lorebook** (importer un lorebook). Voir [Importer et exporter des lorebooks](import-export.md).
- **Select** (sélectionner) active la sélection multiple, pour exporter ou supprimer plusieurs lorebooks d'un coup.

Sous les boutons :

- **Rechercher des lorebooks** filtre par nom, description, nom du personnage ou du persona lié, et tags. `tag:name` fonctionne ici aussi.
- **Tags**, à côté du champ de recherche, affiche uniquement les lorebooks avec tous les tags que tu choisis, ou **Sans tag**. Voir [Tags](../characters/library-organization.md#tags).
- **Sort order** (ordre de tri) propose **Manual order** (ordre manuel), **A-Z**, **Z-A**, **Newest**, **Oldest**, **Le plus de tokens** et **Le moins de tokens**. Les tris par taille utilisent la taille estimée de toutes les entrées d'un lorebook, y compris celles désactivées, qui s'affiche aussi sur chaque ligne. Avec **Manual order**, fais glisser les lorebooks à leur place, ou utilise <kbd>Alt</kbd>+<kbd>Up</kbd> et <kbd>Alt</kbd>+<kbd>Down</kbd>.
- **New Folder** (nouveau dossier) crée un dossier de bibliothèque. Fais glisser un lorebook dessus. Sur téléphone, maintiens le lorebook appuyé, puis fais-le glisser. Ces dossiers n'ont rien à voir avec les dossiers d'entrées à l'intérieur d'un lorebook.

Chaque ligne comporte les boutons **Copy** (copier, duplique le lorebook) et **Delete** (supprimer). Ils apparaissent quand tu passes le pointeur sur la ligne, et restent toujours visibles sur mobile. Un lorebook désactivé affiche un badge **OFF**. Clique sur l'image pour la téléverser ou la remplacer.

<a id="save-a-lorebook-set"></a>
### Enregistrer un ensemble de lorebooks

Un ensemble de lorebooks est un groupe nommé utilisé en commun, par exemple pour un univers. Tu choisis tout le groupe plutôt que chaque lorebook. L’ensemble pointe vers tes lorebooks sans les copier.

1. Dans **Lorebooks**, clique sur **Nouvel ensemble**. Il s’ouvre sous **Ensembles de lorebooks**.
2. Saisis un nom dans **Nom de l'ensemble**.
3. Clique sur **Choisir des lorebooks** et coche les lorebooks. Chaque changement s’enregistre seul.

Pour le modifier, clique dessus sous **Ensembles de lorebooks**. **Supprimer l'ensemble** supprime l’ensemble, mais garde ses lorebooks dans la bibliothèque. Un lorebook supprimé quitte tous les ensembles.

Choisis un ensemble dans **Utiliser un ensemble enregistré**, au-dessus de **Choisir des lorebooks**. Ce champ apparaît dès qu’un ensemble existe :

- À l’étape **Attach Lorebooks** d’un nouveau roleplay.
- Dans les lorebooks sources fixes d’un agent, comme Knowledge Router. Voir [Sources de connaissances : agents de récupération et de routage](../agents/knowledge-sources.md#choose-the-sources).

Choisir un ensemble remplace les lorebooks sélectionnés. Tu peux ensuite en ajouter ou en retirer pour ce chat ou cet agent sans modifier l’ensemble enregistré.

Pour activer ou désactiver des entrées dans un seul chat, ouvre **Réglages du chat → Lorebooks** et clique sur le crayon (**Modifier les entrées du lorebook**) près du lorebook. Les interrupteurs ne changent que ce chat ; les autres modifications changent le lorebook lui-même.

### Les catégories

Une catégorie est une étiquette pour ta bibliothèque. Elle ne change pas le moment où le lorebook s'active. Les onglets sont **All**, **Active** (les lorebooks pertinents pour le chat ouvert), **World**, **Character**, **NPC**, **Spellbook** et **Other**. Tu peux changer la catégorie d'un lorebook dans son onglet **Overview**, où **Other** s'appelle **Uncategorized**.

## Guides associés

- [Les entrées de lorebook : mots-clés, position et déclenchement](entries.md)
- [Budgets de tokens et récursivité des lorebooks](token-budgets.md)
- [Recherche sémantique pour les lorebooks](semantic-search.md)
- [Lier des lorebooks à des personnages et à des personas](linking-to-characters.md)
- [Importer et exporter des lorebooks](import-export.md)
- [Sources de connaissances : les agents Knowledge Retrieval et Knowledge Router](../agents/knowledge-sources.md)
