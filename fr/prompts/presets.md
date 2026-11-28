# Éditeur de presets et gestionnaire de prompts

Un preset est un plan enregistré du prompt, le texte que Marinara envoie au modèle pour chaque réponse. Il décide de ce qui y entre, et dans quel ordre : tes instructions, la fiche de personnage, ton persona, l'historique du chat, les entrées de lorebook et plus encore. Sers-toi du **Preset Editor** (éditeur de presets) pour en construire un, puis attribue-le à un chat.

Les presets construisent le prompt dans les chats **Roleplay**. Les chats **Conversation** et **Game** utilisent plutôt un seul champ de prompt (voir [Les chats Conversation et Game](#conversation-and-game-chats)). Les presets ne demandent aucune clé API (un code secret, un peu comme un mot de passe), mais il te faut quand même un compte opérationnel pour envoyer le prompt. Voir [Se connecter à un fournisseur d'IA](../connections/connecting-to-a-provider.md).

## Attribuer un preset à un chat

Un preset ne fait rien tant qu'un chat ne l'utilise pas. Dans un chat **Roleplay**, utilise l'une ou l'autre des deux méthodes. Pour en choisir un, attribue-le. Pour créer le tien, voir [Créer un preset](#create-a-preset).

Depuis le panneau **Presets** :

1. Ouvre le chat.
2. Dans le panneau **Presets**, repère une ligne de preset. Sur un ordinateur, passe le pointeur sur la ligne pour afficher ses boutons.
3. Clique sur le bouton en forme de coche **Assign to chat** (attribuer au chat). Une coche indique que le preset est utilisé. Clique de nouveau dessus pour annuler l'attribution.

Depuis **Chat Settings** (réglages du chat) :

1. Ouvre le chat, puis **Chat Settings**.
2. Repère **Prompt Preset** (preset de prompt) et choisis un preset dans le menu déroulant.

Si le preset a des variables, la fenêtre **Configure Preset Variables** (configurer les variables de preset) s'ouvre. Voir [Variables de preset](preset-variables.md). Passer à un autre preset efface les choix de variables faits auparavant.

## Créer un preset

1. Ouvre **Library → Presets** (Bibliothèque → Presets). La bibliothèque se trouve à droite.
2. Clique sur **New preset** (nouveau preset). La fenêtre **Create Preset** (créer un preset) s'ouvre.
3. Saisis un **Name** (nom). Ce champ est obligatoire. Ajoute une **Description** si tu veux.
4. Clique sur **Create** (créer). Le preset s'ouvre dans le **Preset Editor**.
5. Construis le prompt dans l'onglet **Sections**.
6. Clique sur **Save** (enregistrer) en haut à droite.

L'éditeur n'enregistre rien tout seul. Clique sur **Save** après chaque modification. Si tu quittes avec des modifications non enregistrées, un avertissement propose **Keep editing** (continuer à modifier), **Discard** (abandonner) et **Save & close** (enregistrer et fermer).

Pour exporter un preset, clique sur l'icône de flèche vers le haut dans la barre du haut (infobulle **Export preset**). Marinara te demande d'abord d'enregistrer si des modifications sont en attente. Pour le supprimer, clique sur l'icône de corbeille.

## La page Presets

**Library → Presets** répertorie tes presets dans un tableau avec les colonnes **Description**, **Sections**, **Author** (auteur), **Default** (par défaut) et **Updated** (mis à jour). En haut se trouvent **Import** (importer : charger un fichier `.json`) et **New preset**. **All** (tous) / **Defaults** (valeurs par défaut) restreint la liste, **Tags** (tags) à côté de la recherche n'affiche que les presets portant les tags que tu choisis (les presets importés portent le tag **Imported** (importé) et leur provenance, par exemple **ST**), **List** (liste) / **Gallery** (galerie) change de vue, et le menu de tri propose **Recently edited** (modifiés récemment), **A to Z** (de A à Z), **Z to A** (de Z à A) et **My order** (mon ordre). Clique sur un preset pour l'ouvrir.

Pour organiser les presets :

- **⋯** au bout d'une ligne (ou un clic droit sur la ligne) propose **Duplicate** (dupliquer), **Move to folder** (déplacer vers un dossier), **Export** (exporter), **Select** (sélectionner) et **Delete** (supprimer). **Duplicate** crée une copie modifiable et l'ouvre : c'est ainsi que tu personnalises un preset intégré. Le preset par défaut ne peut pas être supprimé.
- Fais glisser une ligne au-dessus ou au-dessous d'une autre pour définir ton propre ordre. Le menu de tri passe à **My order**.
- **New folder** (nouveau dossier), l'icône de dossier à côté du titre, regroupe des presets. Fais glisser un preset sur un dossier, ou utilise **Move to folder**.
- **Select**, l'icône de coche à côté du titre, te permet de choisir plusieurs presets, puis d'utiliser **Move to folder**, **Export** (dans un seul fichier `marinara-presets.zip`) ou **Delete** depuis la barre du bas.

Les scripts regex ont leur propre page, [Bibliothèque → Scripts regex](../extending/regex-scripts.md), tout comme les outils personnalisés, [Bibliothèque → Outils personnalisés](../extending/custom-tools.md).

## Dans la disposition classique : le panneau Presets

Le panneau comporte quatre onglets : **Prompts**, **Regex**, **Outils** et **Profiles** (profils). Chaque onglet présente la même rangée de boutons en haut et un champ de recherche. Dans l'onglet **Prompts**, utilise **Créer un preset** pour en créer un, **Importer un preset** pour charger un fichier `.json`, ou **Sélectionner des presets** pour en exporter ou en supprimer plusieurs d'un coup ; **Select all presets** (sélectionner tous les presets) coche tous les presets affichés par la recherche. L'onglet **Regex** contient tes scripts regex ; voir [Scripts regex](../extending/regex-scripts.md#manage-your-scripts). L'onglet **Outils** contient tes outils personnalisés ; voir [Outils personnalisés](../extending/custom-tools.md). L'onglet **Profiles** contient tes profils de réglages du chat ; voir [Profils de réglages](../chats/settings-profiles.md#the-profiles-tab).

- **Search presets** filtre la liste.
- Le menu de tri propose **Ordre manuel**, **A-Z**, **Z-A**, **Plus récents**, **Plus anciens**, **Le plus de tokens** et **Le moins de tokens**. La taille compte le texte propre des sections activées, les instructions qu'un preset envoie toujours. Les sections de marqueur, comme le personnage, le lorebook et l'historique du chat, sont remplies pour chaque chat et ne sont pas comptées. Chaque ligne affiche l'estimation. Avec **Ordre manuel**, fais glisser une ligne, ou appuie sur <kbd>Alt</kbd>+<kbd>Up</kbd> ou <kbd>Alt</kbd>+<kbd>Down</kbd> sur une ligne sélectionnée. Sur un écran tactile, appuie longuement sur une ligne pour la saisir.
- **New Folder** (nouveau dossier) regroupe des presets. Fais glisser un preset sur un dossier, et double-clique ou double-tape sur un dossier pour le renommer.

Chaque ligne affiche le nom, le format d'encapsulation, le nombre de sections et l'auteur. Un badge **DEFAULT** signale le preset par défaut, marqué d'une étoile. Clique sur une ligne pour l'ouvrir.

## Les onglets du Preset Editor

| Onglet | Ce qu'il contient |
| --- | --- |
| **Overview** (vue d'ensemble) | Le nom, la description, le format d'encapsulation et l'auteur. |
| **Sections** | La structure du prompt, bâtie à partir de blocs et de marqueurs. |
| **Prompts** | Les prompts de mode des chats Conversation et Game. |
| **Parameters** (paramètres) | Les réglages de génération de départ. Voir [Paramètres de génération](generation-parameters.md). |
| **Regex** | Les scripts regex liés à ce preset et le réglage **Scoped regex default** (mode par défaut des regex à portée limitée). Voir [Scripts regex](../extending/regex-scripts.md). |

### Onglet Overview

- **Name** est le titre affiché dans le panneau **Presets**.
- **Description** est un court résumé.
- **Wrap Format** (format d'encapsulation) règle la mise en forme des sections (voir [Formats d'encapsulation](#wrap-formats)).
- **Author** est un nom de créateur facultatif, utile quand tu partages un preset.
- **Tags** trient les presets pour le filtre **Tags** de la page Presets. Saisis un tag et appuie sur Enter, ou clique sur le **×** d'un tag pour le retirer.

Deux cartes en lecture seule affichent le nombre de **Sections** et de **Groups** (groupes).

### Onglet Prompts

- **Conversation Mode** est un champ de texte pour le prompt Conversation de ce preset. Laisse-le vide pour utiliser le prompt intégré.
- **Roleplay Mode** n'est pas modifiable ici. Le Roleplay utilise le prompt assemblé à partir de tes **Sections**.
- **Game Mode** est un champ de texte pour le prompt Game de ce preset. Laisse-le vide pour utiliser le prompt intégré.
- **Réglages de l'histoire du jeu** apporte un style d'histoire, un niveau de violence et des limites de contenu à Game Mode. Voir [Réglages de l'histoire du jeu](#game-story-settings).

#### Réglages de l'histoire du jeu

Un preset peut apporter un style d'histoire, un niveau de violence et des limites de contenu à Game Mode, pour que tu n'aies pas à les définir pour chaque partie. Voir [Style de l'histoire, violence et limites de contenu](../game/getting-started.md#story-style-violence-and-content-boundaries).

1. Dans l'onglet **Prompts**, sous **Réglages de l'histoire du jeu**, active **Appliquer les réglages de l'histoire aux jeux qui utilisent ce preset**.
2. Choisis un **Style de l'histoire** et un niveau de **Violence**. **Suivre la classification** garde la violence de chaque partie à la valeur par défaut de sa classification.
3. Facultatif : écris des **Limites de contenu**, une par ligne.
4. Clique sur **Enregistrer**.

Quand tu choisis le preset pour une partie, dans l'assistant de configuration ou dans **Réglages du chat → Preset de prompt**, la partie prend le style d'histoire et la violence du preset. Les limites du preset s'ajoutent à celles que la partie a déjà : aucune limite propre à la partie n'est donc retirée. Les modifications ultérieures du preset ne changent pas les parties qui l'ont déjà choisi. Le réglage est conservé quand tu dupliques, exportes ou importes le preset.

#### Réglages de l'histoire du jeu

Un preset peut apporter un style d'histoire, un niveau de violence et des limites de contenu à Game Mode, pour que tu n'aies pas à les définir pour chaque partie. Voir [Style de l'histoire, violence et limites de contenu](../game/getting-started.md#story-style-violence-and-content-boundaries).

1. Dans l'onglet **Prompts**, sous **Réglages de l'histoire du jeu**, active **Appliquer les réglages de l'histoire aux jeux qui utilisent ce preset**.
2. Choisis un **Style de l'histoire** et un niveau de **Violence**. **Suivre la classification** garde la violence de chaque partie à la valeur par défaut de sa classification.
3. Facultatif : écris des **Limites de contenu**, une par ligne.
4. Clique sur **Enregistrer**.

Quand tu choisis le preset pour une partie, dans l'assistant de configuration ou dans **Réglages du chat → Preset de prompt**, la partie prend le style d'histoire et la violence du preset. Les limites du preset s'ajoutent à celles que la partie a déjà : aucune limite propre à la partie n'est donc retirée. Les modifications ultérieures du preset ne changent pas les parties qui l'ont déjà choisi. Le réglage est conservé quand tu dupliques, exportes ou importes le preset.

Le **Marinara's Universal Preset** intégré fournit le texte du prompt, mais aucun paramètre de génération. Ses anciens réglages enregistrés d'échantillonnage, de raisonnement, de mise en forme et de tokens sont ignorés : ce sont les réglages de ton compte, les remplacements du chat et les valeurs par défaut de l'application qui s'appliquent. Crée une copie modifiable pour le personnaliser.

## Sections et marqueurs

L'onglet **Sections** est l'endroit où tu construis le prompt. Les sections s'assemblent de haut en bas.

1. Clique sur **Add Section** (ajouter une section).
2. Choisis **Prompt Block** (bloc de prompt) ou un marqueur.

Un **Prompt Block** est un texte que tu écris : instructions système, règles de ton, tout ce que tu veux voir dans chaque prompt. Un marqueur n'a pas de texte propre. Marinara le remplit avec le contenu réel du chat au moment d'envoyer le prompt.

| Marqueur | Ce qu'il insère |
| --- | --- |
| **Character Info** | Les détails de la fiche de personnage active. |
| **Persona** | Les détails de ton persona actif. |
| **Chat History** | Les messages du chat. |
| **Historique récent** | Messages récents pris dans **Historique du chat**. Voir [Diviser l’historique avec Recent History](#split-the-history-with-recent-history). |
| **Chat Summary** | Le résumé compilé du chat. |
| **Dialogue Examples** | Les exemples de dialogue du personnage. |
| **Lorebook Marker (All)** | Toutes les entrées de lorebook actives. |
| **Lorebook Marker (Before)** | Les entrées de lorebook réglées pour s'insérer avant. |
| **Lorebook Marker (After)** | Les entrées de lorebook réglées pour s'insérer après. |
| **Memory Recall** | Les souvenirs que [Memory Recall](../agents/memory.md) trouve pour chaque réponse. Sans ce marqueur, ils sont placés juste avant l'historique du chat. |

Une ligne de marqueur affiche un badge **MARKER**. Tu ne peux pas écrire dans la plupart des marqueurs. Utilise **Lorebook Marker (All)**, sauf si tu veux répartir les entrées de lorebook entre avant et après.

Trois marqueurs plus rares :

- **Current Scene Summary** (résumé de la scène en cours) et **Recalled Scenes** (scènes rappelées) placent les résumés produits par Advanced Memory Recall. Sans marqueur **Recalled Scenes**, ils apparaissent avant l'historique du chat. Voir [Mémoire](../agents/memory.md).
- **ID Macro Cards** place les fiches de personnage que tu fais entrer dans un prompt en tapant l'identifiant de fiche d'un personnage entre doubles accolades. Sans ce marqueur, elles vont à l'emplacement par défaut. Voir [Macros de prompt](macros.md).

Sans marqueur **Dialogue Examples** activé, les exemples de dialogue non vides sont ajoutés à **Character Info**, après le scénario, dans le format d'encapsulation du preset. Ajoute le marqueur pour choisir leur emplacement. Marinara ne les inclut jamais deux fois.

Si ton chat a des lorebooks actifs mais que le preset n'a aucun marqueur de lorebook, un avertissement indique : "Add a lorebook marker when this preset should receive active lorebook entries." Ajoutes-en un pour que les entrées parviennent au modèle. Voir [Vue d'ensemble des lorebooks](../lorebooks/overview.md).

Si tu as des agents personnalisés avec l'option "inject as section" activée, le menu d'ajout affiche **Agent Sections** (sections d'agent). Chacune insère la dernière sortie de son agent, et tu peux ajouter tes propres instructions autour.

### Modifier une section

1. Clique sur le nom ou sur la flèche d'une section pour la déplier.
2. Change son **Name** ou son rôle (**System**, **User** ou **Assistant**).
3. Pour un **Prompt Block**, modifie **Content** (contenu). Il accepte les [macros](macros.md), des espaces réservés que Marinara remplace par du vrai texte.
4. Clique sur **Save** en haut à droite.

Les contrôles de la ligne :

- **Duplicate** (dupliquer) copie la section.
- L'icône en forme d'œil l'active ou la désactive.
- **Delete** (supprimer) la supprime.
- Pour réordonner, fais glisser la poignée, utilise les flèches haut et bas, ou fais un appui long sur un écran tactile.

### Groupes

Un groupe réunit plusieurs sections dans un même conteneur.

1. Dans l'onglet **Sections**, clique sur **Groups**, puis sur **New Group** (nouveau groupe).
2. Clique sur le nom du groupe pour le renommer.
3. Déplie une section et choisis le groupe dans son menu déroulant **Group**.

Avec **XML**, un groupe devient une seule balise parente. Avec **Markdown**, il devient un seul titre. Supprimer un groupe ne supprime pas ses sections. Elles perdent seulement leur groupe. Les sections d’un même groupe non contiguës reçoivent chacune leur balise ou titre.

### Position et profondeur

Chaque section a un réglage **Position** dans son éditeur.

- **Ordered (in sequence)** place la section là où elle se trouve dans la liste. C'est le choix habituel.
- **Depth (from end of chat)** la place un certain nombre de messages avant la fin du chat, selon le nombre **Depth** (profondeur). Une profondeur de 0 la place après le dernier message. Sers-t'en pour les rappels que le modèle doit voir près des messages les plus récents.

## Formats d'encapsulation

Le réglage **Wrap Format** de l'onglet **Overview** détermine la façon dont chaque section est encapsulée.

| Format | Résultat |
| --- | --- |
| **XML** | Chaque section est entourée de balises. Les groupes deviennent des balises parentes. C'est la valeur par défaut. |
| **MARKDOWN** | Chaque section reçoit un titre. Les groupes deviennent des titres de niveau supérieur. |
| **NONE** | Aucune encapsulation. Le contenu part tel qu'il est écrit. |

XML convient à la plupart des modèles. N'essaie les autres que si un modèle répond mieux sans balises.

Pour envoyer un seul **Prompt Block** sans sa balise ni son titre, déplie-le et active **Send without wrapper** (envoyer sans encapsulation). La balise d'un groupe peut quand même l'entourer : retire le bloc de son groupe pour l'envoyer sans aucune encapsulation. Les marqueurs gardent toujours leur encapsulation, et l'interrupteur est masqué quand le format est **NONE**.

## Les chats Conversation et Game

Ces chats ne construisent pas de prompt à partir des Sections. Ils utilisent un seul prompt de mode. Dans **Chat Settings**, la section **Prompt Preset** a un menu déroulant **Prompt source** (source du prompt) qui liste tes presets. Il démarre sur **Default conversation prompt** ou **Default game prompt**, ou indique **No presets available** quand tu n'en as aucun. Dans le panneau **Presets**, le bouton d'attribution affiche "Prompt presets are not available in conversation mode."

Sous le menu déroulant, un badge indique d'où vient le prompt.

| Badge | Signification |
| --- | --- |
| **Default** | Le prompt intégré. |
| **Preset** | Le prompt du preset choisi. |
| **Style** | Le prompt du style de prompt du GM (le maître du jeu) sélectionné. Chats Game uniquement. |
| **Custom** | Une modification locale, pour ce chat uniquement. Elle l'emporte sur toutes les autres. |

Le champ de texte montre le prompt utilisé. Modifie-le pour créer une copie locale au chat. Si ton texte correspond exactement au preset ou au prompt par défaut, Marinara considère qu'il n'est pas personnalisé. Tant qu'une modification personnalisée existe, une icône de réinitialisation apparaît (infobulle **Reset to default prompt**).

Les chats Game ajoutent davantage de contrôles. **Style de l'histoire**, **Violence**, **Limites de contenu** et **Consignes de classification** définissent ce que l'histoire de la partie peut contenir. Voir [Les modifier en cours de partie](../game/getting-started.md#change-them-during-a-game). Deux autres contrôles façonnent le prompt. **Style de prompt du GM** ne remplace que le prompt Game, et une modification locale au chat l'emporte toujours. **Instructions supplémentaires** ajoute du texte au prompt Game, jusqu'à 2 000 caractères, par exemple "Écris dans le style de Terry Pratchett."

## Ordonner les sections pour la mise en cache du prompt

La mise en cache du prompt permet à un service de réutiliser le début d'un prompt qu'il a déjà lu : les longs chats coûtent ainsi moins cher et les réponses arrivent plus vite. Le service réutilise le prompt seulement jusqu'au premier texte qui a changé depuis le dernier message. Les souvenirs rappelés changent à presque chaque message : placés avant l'historique du chat, ils empêchent donc la mise en cache de tout l'historique.

Pour les placer toi-même, ajoute un marqueur **Memory Recall** au preset. Fais-le glisser sous **Historique du chat**, ou règle sa **Position** sur **Profondeur (depuis la fin du chat)** pour le placer dans l'historique. Les souvenirs lus avant l'histoire orientent davantage les réponses : le placement par défaut reste donc avant l'historique.

<a id="split-the-history-with-recent-history"></a>
## Diviser l’historique avec Recent History

**Historique récent** envoie les messages récents à sa place et **Historique du chat** les anciens. Les sections entre eux vont entre anciens et nouveaux messages. Utilise-le pour les détails changeants, comme le lieu ou les présents ; les détails fixes restent au-dessus de **Historique du chat**.

1. Dans **Sections**, clique **Ajouter une section**, puis **Historique récent**. Il se place après **Historique du chat**.
2. Développe-le et règle **Messages récents** (défaut 4).
3. Glisse les sections changeantes, comme **Lorebook Marker** ou un agent, entre les deux.
4. Clique **Enregistrer**.

Le modèle lit les changements près des derniers messages et les garde mieux en tête. Les anciens messages restent fixes et réutilisables en cache. Avec Claude et le cache, la marque se place à leur fin.

- **Messages maximum** de **Historique du chat** compte les deux parties. Vide envoie tout.
- Sous **Messages récents**, tous vont dans **Historique récent**.
- **Profondeur (depuis la fin du chat)** compte seulement les messages. Une profondeur supérieure à **Messages récents** touche les anciens et empêche leur réutilisation.
- Sans **Historique du chat**, **Historique récent** envoie tout. Placé avant lui ou en second exemplaire, il n’envoie rien. La ligne avertit dans chaque cas.
- Avec **XML**, anciens : `<chat_history>`, récents : `<recent_history>`, dernier : `<last_message>`.
- Les anciennes versions ignorent **Historique récent** et peuvent refuser ces presets à l’import.

## Blocs de décision et cache de prompts

Une section peut contenir un bloc de décision, `{{#if decision:"..."}}`, pour que cette partie ne soit envoyée que si un énoncé sur le chat est vrai. Voir [Interroger le modèle de décision](conditional-prompts.md#asking-the-decision-model).

Place les blocs de décision qui changent souvent vers la fin du prompt, par exemple dans les instructions après l'historique. Une branche modifiée peut empêcher un fournisseur de réutiliser le prompt à partir de ce point : un changement placé tôt fait donc perdre l'essentiel des économies de cache. Une partie antérieure inchangée peut encore être réutilisée. Ne garde une décision vers le haut que si sa réponse change rarement. Voir [Cache de prompts](conditional-prompts.md#prompt-caching).

Les énoncés des sections et des groupes désactivés ne sont jamais interrogés et ne comptent pas dans **Decision statements per turn** (énoncés de décision par tour).

## Vérifier ce que l'IA a reçu

**Peek Prompt** montre le prompt entièrement assemblé pour un message. C'est le moyen le plus rapide de comprendre une réponse étrange. Voir [Peek Prompt : voir ce que l'IA a reçu](../chats/peek-prompt.md).

## Guides associés

- [Variables de preset](preset-variables.md)
- [Macros de prompt](macros.md)
- [Paramètres de génération](generation-parameters.md)
- [Profils de réglages](../chats/settings-profiles.md)
- [Vue d'ensemble des Chat Settings](../chats/chat-settings.md)
- [Peek Prompt : voir ce que l'IA a reçu](../chats/peek-prompt.md)
