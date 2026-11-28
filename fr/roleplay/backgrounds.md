# Des arrière-plans qui suivent l'histoire

Un chat Roleplay affiche une image de scène en pleine page derrière tes messages. Elle peut rester la même ou changer au fil de l'histoire : l'agent **Background** (arrière-plan) choisit parmi tes images, les lieux que tu épingles affichent toujours leur propre image, et les images de la galerie d'un personnage le suivent dans chaque chat. Quand l'image change, Marinara passe en fondu de l'ancienne à la nouvelle.

La génération d'images n'est nécessaire pour aucune de ces fonctions. Sans modèle d'images, tu choisis parmi les images que tu téléverses, et sans aucune image, l'arrière-plan est une couleur unie.

## Les arrière-plans en bref

| Tu veux | Utilise | Guide |
| --- | --- | --- |
| Une image derrière ce chat | **Fond du chat** | [Fixer un arrière-plan pour un seul chat](#set-a-background-for-one-chat) |
| Que l'image change avec la scène | L'agent **Background** | [Laisser l'agent Background choisir](#let-the-background-agent-pick) |
| Qu'un lieu ait toujours la même apparence | Un lieu épinglé | [Épingler un arrière-plan à un lieu](#pin-a-background-to-a-place) |
| La chambre d'un personnage dans chaque chat où il figure | Un arrière-plan de galerie | [Des arrière-plans qui suivent un personnage](#backgrounds-that-follow-a-character) |
| De nouvelles images pour les nouveaux lieux, la météo et l’heure | L’agent **Illustrator** | [Arrière-plans créés par Illustrator](../media/scene-backgrounds.md) |
| Téléverser, taguer et trier tes images, ou les flouter | La bibliothèque d'arrière-plans | [Bibliothèque d'arrière-plans](../appearance/chat-backgrounds.md) |

Quand l’histoire arrive quelque part, Marinara choisit dans cet ordre : un arrière-plan épinglé à ce lieu dans ce chat, puis une image de galerie qui nomme le lieu, puis le choix de l’agent Background. Les lieux épinglés et de galerie ne changent l’image seuls que si Marinara connaît le lieu de l’histoire, grâce à **World State** ou à **World Maps**. Sans l’un ni l’autre, l’agent Background voit quand même les arrière-plans de galerie par leurs lieux. Illustrator ne peint une nouvelle image que si rien ne convient. L’image choisie apparaît dans sa version météo ou horaire si la bibliothèque en possède une pour la météo et l’heure de l’histoire.

## Fixer un arrière-plan pour un seul chat

1. Ouvre le chat. Ouvre ensuite **Settings → Appearance → Backgrounds** (Paramètres → Apparence → Arrière-plans).
2. Sous **Fond du chat**, clique sur **Parcourir la bibliothèque** et choisis une image.

Cela ne modifie que ce chat. Pour revenir à l'arrière-plan par défaut, clique sur **Retirer** à côté de **Fond du chat**. Tu peux aussi en choisir un dans **Réglages du chat → Arrière-plan** dans le chat. Pas encore d'image ? Voir [Importer un arrière-plan](../appearance/chat-backgrounds.md#import-a-background).

## Créer soi-même une version météo ou horaire

Ton image montre la chambre de jour, mais l’histoire y commence la nuit sous la pluie. Inutile d’attendre Illustrator :

1. Ouvre le chat, puis **Réglages du chat → Arrière-plan**.
2. Sous **Créer une version de ce fond**, choisis **Météo** et **Moment de la journée**. **Tel que peint** conserve cet aspect tel qu’il apparaît sur l’image.
3. Clique sur **Créer une version**.

La connexion d’images d’Illustrator repeint l’image à partir de l’original, y compris pour une image de galerie, et le chat affiche la nouvelle version. Elle est enregistrée dans la bibliothèque d’arrière-plans pour être réutilisée sans nouvelle génération. Si elle existe déjà, elle s’affiche immédiatement. La connexion d’images doit pouvoir partir d’une image.

## Laisser l'agent Background choisir

L'agent **Background** s'exécute après chaque réponse. Il lit la scène et choisit, parmi tous tes arrière-plans, l'image qui convient le mieux. Il ne choisit que des images que tu possèdes ; pour en créer de nouvelles, utilise Illustrator.

1. Ouvre ton chat Roleplay et ouvre **Réglages du chat** avec le bouton de curseurs.
2. Ouvre **Agents** et active **Enable Agents** (activer les agents).
3. Ajoute l'agent **Background**.

L’arrière-plan change désormais seul au fil des lieux de l’histoire. L’agent lit du texte, pas des images : il choisit donc selon leur désignation :

- Les **images de la bibliothèque**, d’après leur nom de fichier et leurs tags, même dans les dossiers.
- Les **arrière-plans de galerie** des personnages et du persona du chat, d’après les lieux indiqués (comme `dorm kitchen`) et leur description.
- Les **Lieux épinglés** du chat, d’après le nom de l’image qu’ils épinglent.

Une image de bibliothèque dont le nom n’est qu’une suite aléatoire de lettres et de chiffres (comme `70c60b32-6b8c-….jpg`) et qui n’a aucun tag est exclue : rien n’indique le lieu qu’elle montre. Ajoute un tag de lieu ou un nom clair pour la rendre sélectionnable. Si rien dans la liste ne montre le lieu de la scène, l’agent garde l’image actuelle plutôt que de deviner.

**Réglages du chat → Arrière-plan** explique le choix de l’image actuelle sous son aperçu. La ligne disparaît si tu choisis toi-même une image.

Si cela ne fonctionne pas : avec seulement un ou deux arrière-plans, l’agent choisit toujours ceux-là. Ajoutes-en à ta bibliothèque. S’il est lent, vérifie sa connexion : lorsqu’elle ne traite qu’une requête à la fois, il attend les autres agents, comme Lorebook Keeper.

## Épingler un arrière-plan à un lieu

Utilise cette fonction quand un lieu doit toujours avoir la même apparence : la chambre de John affiche toujours `john-bedroom`, et ta propre chambre affiche toujours `my-bedroom`. Quand l'histoire arrive dans un lieu épinglé, son image s'affiche, quel que soit le choix qu'aurait fait l'agent Background.

1. Ouvre **Réglages du chat** avec le bouton de curseurs dans le chat, puis ouvre **Arrière-plan**.
2. Sous **Pinned places** (lieux épinglés), clique sur **Add place** (ajouter un lieu).
3. Clique sur l'image vide et choisis l'arrière-plan. Saisis le lieu tel que l'histoire l'écrit, par exemple `John's bedroom`.
4. Facultatif : en dessous, ajoute d'autres noms que l'histoire pourrait utiliser, séparés par des virgules, par exemple `John's room, the master bedroom`.

Plus rapide : quand l'histoire se déroule dans un lieu et que la bonne image est affichée, clique sur **Pin this picture to "John's bedroom"** (épingler cette image à la chambre de John).

Les images épinglées ont besoin de savoir où se déroule l'histoire : elles utilisent donc le lieu indiqué par l'agent **World State** (état du monde), ou par World Maps. Le bas de la liste affiche **Story is at** et le lieu, et **Here** marque l'image épinglée utilisée.

### Comment les lieux sont reconnus

- Le nom le plus précis l'emporte. `John's bedroom` et `{{user}}'s bedroom` ne se mélangent jamais, et une image simplement épinglée à `bedroom` ne sert que pour les chambres auxquelles personne n'a épinglé d'image.
- Un ou deux mots intercalés ne gênent pas la reconnaissance : "John's guest bedroom" correspond à `John's bedroom`, sauf si une autre image épinglée nomme exactement ce lieu. La correspondance ne franchit jamais une virgule ni le nom d'un autre propriétaire : "John's house, Mara's bedroom" n'est donc pas la chambre de John.
- `{{user}}` est le nom de ton persona et `{{char}}` celui de n'importe quel personnage du chat : `{{user}}'s bedroom` correspond donc à "Alyssa's bedroom".
- "My" et "our" renvoient à la personne qui a écrit le message. Quand la réponse de John situe l'histoire dans "my bedroom", il s'agit de sa chambre ; "your bedroom" dans sa réponse désigne la tienne. Dans ton propre message, "your bedroom" désigne celle du personnage quand le chat n'en compte qu'un.
- Les majuscules, les accents et les apostrophes ne comptent pas. Les noms correspondent à des mots entiers : `John` ne correspond jamais à "Johnson".
- Avec **World Maps**, choisis plutôt le lieu dans la liste **World Maps place** (lieu World Maps). Un bâtiment épinglé couvre aussi ses pièces qui n'ont pas leur propre image épinglée.

### Ce que change une image épinglée

- L'image s'affiche une fois, à l'arrivée. Si tu choisis un autre arrière-plan à la main pendant que tu es sur place, ton choix reste jusqu'à ce que l'histoire passe à un autre lieu.
- Dans un lieu épinglé, l’agent Background ne peut pas changer l’image et Illustrator n’en peint pas de nouvelle. Avec **Variantes météo des arrière-plans** ou **Versions horaires des fonds** activé, l’image épinglée reçoit quand même sa version pluie, neige, brouillard ou nuit.

Si ça n'a pas marché : vérifie que **Story is at**, sous la liste, affiche le lieu et que l'un des noms associés à l'image épinglée y figure mot pour mot.

## Des arrière-plans qui suivent un personnage

Une image de la **Galerie** d'un personnage ou d'un persona peut être marquée comme arrière-plan. Elle apparaît alors dans chaque chat où figure ce personnage, sans avoir à épingler d'image dans chaque chat.

1. Ouvre **Images → Galerie** du personnage. Clique sur le bouton de tag d'une image et choisis **Use as background** (utiliser comme arrière-plan).
2. Saisis les lieux qu'elle représente, séparés par des virgules, par exemple `{{char}}'s bedroom, {{char}}'s room`. Dans la galerie d'un personnage, `{{char}}` désigne ce personnage ; dans celle d'un persona, `{{user}}` désigne ce persona. Laisse le champ vide si l'image ne représente pas un lieu précis.

Le bouton de tag de l'image affiche alors **Background:** et ses lieux. Clique dessus pour choisir **Edit places** (modifier les lieux) ou **Remove background tag** (retirer le tag d'arrière-plan).

Dans un chat avec ce personnage, **Réglages du chat → Arrière-plan** liste ces images sous **From character and persona galleries** (depuis les galeries des personnages et des personas). Clique sur l'une d'elles pour l'utiliser. Celles qui nomment des lieux fonctionnent aussi comme des lieux épinglés et figurent sous **Pinned places**, avec la mention "In John's gallery, follows them into every chat". Une image épinglée dans le chat lui-même l'emporte sur une image de galerie associée au même lieu.

### Déplacer une image de chat dans la galerie d'un personnage

Un arrière-plan créé par Illustrator dans un chat peut devenir définitivement celui d'un personnage :

1. Ouvre **Réglages du chat → Galerie** dans le chat.
2. Sur l'image, clique sur le bouton en forme de personne (**Add to a character's or persona's gallery**, ajouter à la galerie d'un personnage ou d'un persona) et choisis à qui elle appartient.

Son étiquette d'arrière-plan et ses lieux sont conservés. L'image n'est pas copiée et reste dans cette galerie quand le chat est supprimé. Exporter un personnage au format **Marinara Native** conserve ces étiquettes.

Les arrière-plans de galerie reçoivent aussi des versions météo. La version de pluie ou de neige est enregistrée dans ta bibliothèque d'arrière-plans sous le nom `gallery-…--wx-rain.png`.

## Guides associés

- [Arrière-plans créés par Illustrator](../media/scene-backgrounds.md) : nouveaux lieux, versions météo et horaires, et masques de fenêtres.
- [Bibliothèque d'arrière-plans](../appearance/chat-backgrounds.md) : téléversement, tags, dossiers et flou.
- [Galeries des personnages et des personas](../characters/galleries.md)
- [Mode Roleplay : premiers pas](getting-started.md)
