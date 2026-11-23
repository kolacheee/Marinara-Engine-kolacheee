# Importer depuis SillyTavern

Amène tes données SillyTavern dans Marinara Engine. Importe un fichier à la fois, ou analyse un dossier SillyTavern complet et importe tout d'un coup.

## Ce que tu peux amener

| Données SillyTavern | Dans Marinara |
| --- | --- |
| Characters | Personnages |
| Chats et chats de groupe | Chats |
| Presets | Presets (les sections du prompt et les réglages d'échantillonnage du preset) |
| World Info | Lorebooks (des notes que l'IA lit quand certains mots apparaissent) |
| Backgrounds | Arrière-plans de chat |
| Personas | Personas (le profil qui te représente) |
| Scripts regex | Scripts regex : ceux de chaque fiche, ceux d'un preset et les scripts globaux de `settings.json` (import de dossier) |

## Imports rapides d'un seul fichier

1. Ouvre **Settings → Data → SillyTavern Import** (Paramètres → Données → Import SillyTavern).
2. Clique sur le bouton qui correspond à ton type de fichier.
3. Choisis le fichier. **Importer un personnage**, **Importer un preset** et **Importer un lorebook** ouvrent la même fenêtre que **Importer** dans la bibliothèque, avec les mêmes choix et le même bilan de ce qui a été importé ou non.

| Bouton | Fichier |
| --- | --- |
| **Import Character (JSON/PNG)** (importer un personnage) | Un personnage en `.json` ou `.png`. |
| **Import Chat (JSONL)** (importer un chat) | Un journal de chat en `.jsonl` (un enregistrement JSON par ligne, le format dans lequel SillyTavern enregistre les chats). |
| **Import Preset (JSON)** (importer un preset) | Un preset en `.json`. |
| **Import Lorebook (JSON)** (importer un lorebook) | Un fichier World Info en `.json`. |

Au-dessus des boutons, **Tag imported** (tag importé) et **Tag source** (tag de source), tous deux activés par défaut, ajoutent les tags **Imported** et **ST** à ce que tu importes. Décoche l'une de ces options pour ne pas ajouter le tag correspondant. La fenêtre qui s'ouvre reprend ce choix au départ. Les imports gardent leur propre nom et leur propre description. Un script regex est une règle de recherche et remplacement pour du texte. Voir [Importer et exporter des fiches de personnage](../characters/import-export.md).

Si une fiche de personnage contient un lorebook, la fenêtre Importer un personnage te demande quoi en faire : **Importer le lorebook** le garde comme un lorebook réutilisable, **Importer en masquant** le garde lié au personnage sans l'afficher dans la liste des lorebooks, et **Skip lorebook** importe seulement le personnage.

**Import Chat (JSONL)** crée un chat Roleplay, sauf si le fichier enregistre un autre mode, et l'ouvre. Un court message indique ce qui a été conservé : la note d'auteur, le persona et les messages qui restent masqués à l'IA.

### Importer un chat dans le mode de ton choix

Pour choisir le mode, utilise le bouton d'import en haut de la liste des chats. Son infobulle est **Import SillyTavern or Marinara chat JSONL**. Dans la fenêtre qui s'ouvre, **Ouvrir en** permet de choisir Roleplay ou Conversation pour un fichier SillyTavern. Un export Marinara garde son propre type. Voir [Exporter et importer des chats](../chats/export-import.md).

## Importer un dossier SillyTavern

**Avant de commencer :** l'assistant lit les fichiers sur l'ordinateur du serveur. Si SillyTavern est sur un autre ordinateur, copie d'abord son dossier (celui où tu as installé SillyTavern) sur l'ordinateur de Marinara. Sur l'ordinateur de Marinara, l'assistant fonctionne tout de suite. Depuis un autre appareil, définis le secret d'administration et saisis-le dans **Settings → Advanced → Security** (Paramètres → Avancé → Sécurité). Voir [Sauvegarder et restaurer Marinara](backup-and-restore.md) et la section "Privileged APIs (ADMIN_SECRET)" de la [référence de configuration du serveur](../CONFIGURATION.md).

1. Ouvre **Settings → Data → SillyTavern Import**.
2. Clique sur **Import from SillyTavern Folder**.
3. Choisis ton dossier SillyTavern. Choisis le dossier principal, d'habitude celui qui contient un dossier `data/` ou `public/`. Utilise l'une de ces méthodes :
   - Clique sur **Browse** et choisis le dossier.
   - S'il n'y a pas de sélecteur de dossier (un serveur distant), un navigateur de dossiers intégré s'ouvre. Il liste seulement les dossiers dans le dossier personnel de l'utilisateur qui exécute le serveur. Clique sur **Select This Folder**.
   - Saisis le chemin dans **Chemin du dossier SillyTavern**, par exemple `/home/you/SillyTavern`. Un chemin saisi fonctionne s'il se trouve dans le dossier personnel de l'utilisateur qui exécute le serveur. Si le réglage `IMPORT_ALLOWED_ROOTS` du serveur est défini, il doit plutôt se trouver dans l'un des dossiers indiqués.
4. Clique sur **Scan Folder**. Marinara affiche combien d'éléments il a trouvés dans chaque catégorie.
5. Dans **Choose exactly what to import**, coche les éléments que tu veux. Chaque catégorie a des boutons **All** et **None**, et un bouton **Show** ou **Hide** pour les éléments individuels.
6. Clique sur **Import Selected**. Une barre de progression montre l'élément en cours et un compteur par catégorie.
7. Quand **Import terminé !** apparaît, lis le nombre d'éléments de chaque catégorie et clique sur **Terminé**. Chaque ligne indique combien d'éléments ont été importés et combien ont été ignorés parce que tu les avais déjà. Sous les nombres, **Non importés** liste ce que le dossier contient sans fonctionnalité équivalente ici, et une courte liste indique combien de chats ont gardé leur note d'auteur et leur persona, quels noms d'utilisateur SillyTavern n'avaient pas de persona ici, comment les presets placent World Info et quels réglages de preset ont été laissés de côté.

**Ignorer les éléments déjà présents** (activé par défaut) ignore les personnages, les chats et les personas que tu as déjà, qu'ils viennent d'un précédent import de dossier ou d'imports fichier par fichier. Un persona SillyTavern qui porte le même nom que l'un des tiens n'est pas copié : ses chats sont liés au tien. Les chats importés un par un avant ce changement ne sont pas reconnus et sont importés une seconde fois.

La plupart des éléments sont cochés au départ. Marinara laisse décochés les presets de base de SillyTavern, comme `deterministic`, `neutral` et les presets `universal-*`, et une bannière l'indique. Laisse-les décochés sauf si tu veux des copies.

Si l'analyse trouve des personnages, deux options de plus apparaissent :

**Imported character tags** (par défaut **All tags**) :

- **All tags** garde les tags source.
- **No tags** les ignore.
- **Existing only** garde seulement les tags que tu as déjà.

**Imported regex scripts** (par défaut **Character only**) :

- **Character only** applique les scripts au personnage.
- **Global** les ajoute à **Bibliothèque → Scripts regex** (**Presets → Regex** dans la disposition classique), où tu peux gérer les scripts qui s'exécutent dans plusieurs chats. Voir [Scripts regex](../extending/regex-scripts.md#manage-your-scripts).

Si ça n'a pas marché :

- "Could not find SillyTavern data directory." veut dire que Marinara ne peut pas lire ce dossier. Choisis le dossier principal de SillyTavern.
- "Marinara can only read folders inside your home folder" signifie que le dossier se trouve hors du dossier personnel de l'utilisateur qui exécute le serveur. Déplace le dossier SillyTavern dedans, ou demande à la personne qui gère le serveur d'autoriser son emplacement avec le réglage `IMPORT_ALLOWED_ROOTS`. Si ce réglage est défini, même un dossier choisi avec le sélecteur doit se trouver dans l'un des dossiers indiqués. Voir la [Référence de configuration du serveur](../CONFIGURATION.md).
- Si **Parcourir** reçoit un chemin saisi hors du dossier personnel, le navigateur de dossiers s'ouvre plutôt sur le dossier personnel.
- Si un élément échoue, Marinara l'ignore, garde le reste et le liste sous les avertissements à la dernière étape, par exemple `Character "Foo": error message`.

## Ce qui arrive à tes données

- Les fichiers de chat qui appartiennent à un personnage s'importent comme des branches d'un seul chat. Une branche est une copie d'un chat que tu continues séparément. Chaque chat prend le nom de son fichier SillyTavern, comme lors d'un import individuel. Un fichier encore nommé "New Chat" prend le nom du personnage.
- Les chats de groupe s'importent comme des chats Roleplay en mode **Individuel** : chaque personnage répond à son tour, dans l'ordre de parole de SillyTavern.
- Les messages masqués à l'IA dans SillyTavern restent masqués.
- Les éléments importés gardent la date de dernière modification du fichier source, pas la date de l'import. Chaque message de chat garde la date que SillyTavern lui avait donnée.
- La **Note d'auteur** d'un chat est importée avec sa profondeur. Si SillyTavern utilisait une autre fréquence, position ou un autre rôle, Marinara l'ajoute tout de même à chaque réponse à cette profondeur, et l'import le signale. Une note désactivée dans SillyTavern reste désactivée.
- Un chat est lié au persona que SillyTavern utilisait : celui auquel il était verrouillé, sinon celui qui porte le même nom que l'utilisateur du chat. Importe les personas en même temps, ou crées-en d'abord un de ce nom. S'il n'y a aucune correspondance, le chat n'a pas de persona et l'import nomme le persona manquant.
- Un preset garde les deux emplacements World Info de SillyTavern. **World Info (avant)** et **World Info (après)** deviennent des sections distinctes : les entrées placées après le personnage restent donc après lui. Un preset qui désactive l'une de ces sections exclut les entrées correspondantes, comme SillyTavern. Un preset avec un seul emplacement World Info reçoit une section **World Info** qui envoie les deux. Un preset importé avant ce changement a une seule section **World Info**. Pour le corriger, importe-le à nouveau, ou ajoute **Lorebook Marker (Before)** et **Lorebook Marker (After)** aux emplacements souhaités dans son **Ordre du prompt**, puis retire l'ancienne section **World Info**.
- Les entrées World Info placées autour de la note d'auteur de SillyTavern sont insérées à la profondeur 4 avec le rôle système, là où se trouve la note d'auteur (les entrées après la note suivent immédiatement celles qui la précèdent). Les entrées placées autour des messages d'exemple vont après les définitions des personnages. L'import indique combien ont été déplacées.
- Un preset apporte ses réglages d'échantillonnage : température, Top P, Top K, Min P, pénalités de fréquence et de présence, et effort de raisonnement. Ce sont les valeurs de départ des chats qui utilisent le preset ; les valeurs propres à une connexion ou à un chat l'emportent toujours. La longueur maximale de réponse et la taille du contexte restent sur ta connexion. Top A et la pénalité de répétition n'ont pas de réglage ici et sont laissés de côté.
- Les personnages, personas, lorebooks, presets et chats reçoivent les tags **Imported** et **ST**, sauf si tu décoches **Tag imported** ou **Tag source** au-dessus de **Import Selected**. Leurs noms et descriptions restent inchangés.

## Ce qui ne se transfère pas

L'assistant ne lit que les catégories du premier tableau. Les autres données de SillyTavern, comme les réglages globaux de l'application et les profils de connexion, ne sont pas importées. La liste **Non importés** du résultat de l'import de dossier compte les éléments trouvés sans fonctionnalité équivalente ici : ensembles de réponses rapides, modèles instruct, modèles de contexte et prompts système. Les chats importés avant ce correctif ont reçu l'heure de l'import comme date de leurs messages. Pour en corriger un, supprime-le et importe à nouveau son fichier (lors d'un import de dossier, décoche **Ignorer les éléments déjà présents**).

## Guides associés

- [Importer et exporter des fiches de personnage](../characters/import-export.md)
- [Importer et exporter des lorebooks](../lorebooks/import-export.md)
- [Exporter et importer des chats](../chats/export-import.md)
- [Scripts regex](../extending/regex-scripts.md)
