# La météo dans ton thème

Quand une histoire mentionne la météo, Marinara la dessine par-dessus le chat : pluie, neige, brouillard, feuilles mortes, pétales, étoiles, soleil ou lune. Ton thème peut donner à tous ces éléments l'apparence de ton choix. Tu peux changer la couleur de la pluie, faire tomber la neige sous forme de carrés pixelisés, remplacer les feuilles par des images que tu as dessinées ou griser ton arrière-plan quand il pleut.

Ce guide t'accompagne pas à pas. Il te faut d'abord un thème à toi. Si tu n'en as pas encore, le [Guide de création de thèmes](theme-author-guide.md) te montre comment en créer un en quelques minutes. Sa section [Météo](theme-author-guide.md#weather) présente une version de référence abrégée de cette page.

## Fonctionnement de la météo

La météo vient de l'histoire. Dans un chat Roleplay ou Game Mode, l'agent **World State** (état du monde) suit la météo et le moment de la journée, par exemple « pluie torrentielle » et « nuit ». Marinara lit ces mots et choisit quoi dessiner : des traînées pour « pluie », des flocons pour « neige », des étoiles et une lune pour « nuit », etc.

C'est toujours l'application qui se charge du dessin. Ton thème ne dessine rien. Il définit quelques tokens `--mari-weather-` (des réglages nommés, comme `--primary`) que l'application lit pour dessiner la météo à ta façon. Les thèmes restent ainsi sûrs : aucun élément d'un thème ne peut exécuter de code et les propres réglages de l'utilisateur, comme la réduction des animations, ont toujours la priorité.

### À l'intérieur, la météo reste dehors

Quand l'histoire se déroule à l'intérieur, par exemple dans une auberge, une chambre ou une pièce de World Maps, l'application ne fait pas pleuvoir sur tout l'écran. Elle ne garde que la couleur de la météo et le flash des éclairs, et la pièce reste au sec. L'application détermine si la scène est à l'intérieur à partir du lieu de World State ("Tideglass Inn, Brinewatch") ou du type de lieu de World Maps. Quand elle ne peut pas le déterminer, la météo s'affiche comme d'habitude. Avec **Weather Versions of Backgrounds** (versions météo des arrière-plans) activé (voir [Versions météo des arrière-plans](../media/scene-backgrounds.md#weather-versions-of-backgrounds)), l'image d'arrière-plan montre elle-même la pluie sur les fenêtres, et la météo animée revient, dessinée uniquement sur les vitres. Le style météo de ton thème s'y applique aussi.

### La météo sans thème

Voici une nuit pluvieuse sans thème : de fines traînées pâles sur un voile bleu foncé. Les images plus bas montrent le même chat avec trois thèmes de départ.

## Afficher la météo pendant que tu travailles

Tu n'as pas besoin d'attendre qu'il pleuve dans l'histoire. Tu peux régler toi-même la météo.

1. Ouvre **Library → Settings → Appearance** (Bibliothèque → Paramètres → Apparence), puis vérifie que **Dynamic weather effects** (effets météo dynamiques) est activé (sous **Effects** (effets)) et que **Reduce Ambient Animations & Effects** (réduire les animations et effets d'ambiance) est désactivé.
2. Ouvre un chat Roleplay, puis **Chat Settings → Agents** (Paramètres du chat → Agents) et active **World State**.
3. Ouvre le tracker **World State**. Sur ordinateur, il se trouve dans le Tracker Panel. Sur téléphone, touche le bouton **World State**.
4. Clique sur la valeur **Weather** (météo) et saisis un mot décrivant la météo, comme `heavy rain`. Clique sur **Time** (heure) et saisis `night`.
5. La météo démarre aussitôt. Le chat possède maintenant son propre onglet dans la barre supérieure.

Pendant que tu travailles sur ton thème, Paramètres occupe le centre de la fenêtre et la météo se met en pause derrière. Enregistre ton thème, puis clique sur l'onglet du chat dans la barre supérieure pour voir le résultat. Pour essayer une autre météo, modifie les mots de l'étape 4. Le tableau sous **Quels mots produisent quelle météo** ci-dessous les répertorie tous.

> **Astuce :** verrouille la valeur Weather (mode verrouillage dans le tracker) pour empêcher l'IA de la modifier pendant tes essais. Consulte [HUD et trackers de Roleplay](../roleplay/hud-and-trackers.md).

## Ta première apparence météo, pas à pas

Donnons une couleur à la pluie et allongeons ses traînées, comme le fait le thème de départ NEON//GRID.

1. Ouvre **Library → Settings → Appearance → CSS Themes** (Bibliothèque → Paramètres → Apparence → Thèmes CSS) et clique sur **Edit theme CSS** (modifier le CSS du thème), l'icône de code, sur ton thème.
2. Cherche la ligne `:root {` vers le début de ton CSS. Si ton thème n'en contient pas, ajoute `:root {` sur une nouvelle ligne et `}` sur la ligne suivante.
3. Ajoute ces lignes à l'intérieur, avant le `}` :

```css
--mari-weather-rain-color: #3ff0ff;
--mari-weather-rain-length: 2.2;
--mari-weather-strength: 1.4;
```

4. Clique sur **Save** (enregistrer). Si Marinara te demande **Keep this theme?**, clique sur **Keep theme** (garder le thème).
5. Clique sur l'onglet de ton chat de test dans la barre supérieure. La pluie est désormais cyan, ses traînées sont environ deux fois plus longues et elles ressortent davantage.

Voici l'effet de chaque ligne :

- `--mari-weather-rain-color` définit la couleur des gouttes de pluie. Toutes les couleurs conviennent : un code hexadécimal comme `#3ff0ff`, un nom comme `skyblue` ou `rgb(63 240 255)`.
- `--mari-weather-rain-length` allonge ou raccourcit les traînées. `1` correspond à la longueur normale, tandis que `2.2` donne un peu plus du double.
- `--mari-weather-strength` rend toutes les particules plus visibles (au-dessus de `1`) ou moins visibles (en dessous de `1`).

### Le résultat

Voici la même nuit pluvieuse dans NEON//GRID, qui utilise ces trois lignes et quelques autres.

### Choisir les couleurs du jour et de la nuit

Des couleurs qui rendent bien sur un arrière-plan sombre peuvent disparaître sur un arrière-plan clair. Place les couleurs du jour dans un bloc `[data-theme="light"]` et celles de la nuit dans un bloc `[data-theme="dark"]`, comme pour n'importe quelle autre couleur :

```css
:root[data-theme="light"] {
  --mari-weather-rain-color: #1aa7c4;
  --mari-weather-snow-color: #22b8d6;
}
:root[data-theme="dark"] {
  --mari-weather-rain-color: #3ff0ff;
  --mari-weather-snow-color: #7af7ff;
}
```

## Quels mots produisent quelle météo

Chaque type de météo possède un nom court. Tu utilises ce nom dans le token, comme `snow` dans `--mari-weather-snow-color`.

| Quand l'histoire dit | L'application dessine | Nom dans les tokens |
| --- | --- | --- |
| pluie, averse | Des traînées de pluie | `rain` |
| tempête, tonnerre, éclairs | Une forte pluie accompagnée d'éclairs | `rain` (flash : `lightning-color`, foudre : `lightning-bolt`) |
| neige, grésil, blizzard, gel, froid | Des flocons de neige | `snow` |
| grêle | Des grêlons | `hail` |
| brouillard, brume, voile | De légers bancs de brouillard au bas de l'écran, au-dessus d'une brume au sol | `fog` |
| sable, tempête de poussière | Du sable emporté par le vent | `sand` |
| cendres, fumée, volcanique | Des cendres qui tombent | `ash` |
| feu, braises, brasier | Des braises qui montent | `ember` |
| vent, brise, rafales | Des feuilles qui tombent | `leaf` |
| fleurs de cerisier, pétales | Des pétales qui tombent | `petal` |
| aurore, aurore boréale | Des rubans d'aurore | `aurora` |
| ciel dégagé, soleil, nuages, tout autre temps | Quelques particules flottantes | `dust` |
| nuit (le moment) | Des étoiles et des lucioles | `star`, `firefly` |
| crépuscule, soirée (le moment) | Des lucioles | `firefly` |
| matin, journée, crépuscule (ciel dégagé) | Le soleil | `sun` |
| nuit (ciel dégagé) | La lune | `moon` |

Les étoiles n'apparaissent pas pendant les nuits brumeuses ou enneigées, et les lucioles évitent la pluie. Le soleil et la lune ne s'affichent que lorsque le ciel est dégagé.

## Modifier la couleur, la taille et la forme

Chaque type du tableau accepte les trois mêmes réglages. Place le nom du type au milieu du token.

| Token | Effet | Valeurs |
| --- | --- | --- |
| `--mari-weather-snow-color` | La couleur | Une couleur unie : `#fff0f7`, `white`, `rgb(...)`, `hsl(...)` |
| `--mari-weather-snow-size` | La taille de chaque particule | De `0.5` (moitié) à `3` (trois fois) |
| `--mari-weather-snow-shape` | Des points ronds ou de petits carrés | `round` ou `square` |

Remplace `snow` par n'importe quel autre nom du tableau, comme `--mari-weather-ember-color` ou `--mari-weather-leaf-shape`.

Exemple : de la « neige de données » pour un thème de style informatique, avec de petits carrés cyan à la place des flocons.

```css
:root {
  --mari-weather-snow-color: #7af7ff;
  --mari-weather-snow-shape: square;
  --mari-weather-snow-size: 1.2;
}
```

Les formes ne s'appliquent pas à la pluie, au brouillard ni à l'aurore, qui conservent leur propre aspect. Pour le brouillard, `--mari-weather-fog-color` teinte à la fois les bancs qui dérivent et la brume au sol, tandis que `--mari-weather-tint-strength` rend cette brume plus fine ou plus épaisse.

## Utiliser tes propres images

Au lieu de points et de traînées, chaque type peut tomber sous forme d'images que tu as créées : feuilles d'érable, pétales de sakura, étoiles en papier, petits flocons en pixel art.

1. Dessine ou trouve de petites images avec un arrière-plan transparent, par exemple au format PNG. Garde-les petites : une feuille d'environ 24 à 64 pixels de large suffit largement. Toute image plus grande est réduite à 160 pixels sur son côté le plus long.
2. Dans l'éditeur de thème, ouvre **Pictures and sharing details** (images et détails de partage), puis clique sur **Add pictures** (ajouter des images). Ajoute jusqu'à quatre images pour un même type.
3. Dans ton CSS, répertorie-les dans le token `-image` du type en les séparant par une espace :

```css
:root {
  --mari-weather-leaf-image: url("theme:leaf-1.png") url("theme:leaf-2.png") url("theme:leaf-3.png");
  --mari-weather-leaf-size: 0.8;
}
```

4. Enregistre, ouvre ton chat de test et règle sa météo sur `windy`. Tes feuilles dérivent maintenant vers le sol et chacune choisit l'une de tes images.

Conseils pour les images :

- Clique sur le nom d'une image sous **Pictures and sharing details** pour insérer son `url("theme:...")` dans ton CSS à l'emplacement du curseur, afin de ne pas avoir à saisir son nom.
- Une image conserve le nom de fichier que tu as ajouté, extension comprise, par exemple `leaf-1.png`. Utilise exactement le nom affiché dans la liste.
- Une image est dessinée avec ses propres couleurs : le token `-color` n'a donc aucun effet pour ce type.
- Utilise `-size` pour toutes les agrandir ou les réduire. Le style lisse fait aussi varier légèrement leur taille afin qu'elles ne soient pas toutes identiques.
- Les feuilles, les pétales et les cendres tournent doucement pendant leur chute en style lisse. Les autres types restent droits.
- Les images doivent se trouver dans ton thème. Tout lien vers une image d'un autre site web est ignoré.

Le thème de départ Lantern Path utilise ainsi quatre feuilles peintes.

## Style pixel

Le style pixel place toute la couche météo sur une grille composée de gros pixels carrés, afin de l'accorder aux thèmes en pixel art. Les gouttes de pluie, les flocons et les étoiles deviennent de petits blocs bien nets.

```css
:root {
  --mari-weather-style: pixel;
  --mari-weather-pixel-size: 3px;
  --mari-weather-petal-image: url("theme:wx-petal-1.png") url("theme:wx-petal-2.png");
  --mari-weather-petal-size: 3;
}
```

- `--mari-weather-style: pixel` active le style pixel. `smooth` (ou l'absence de ce réglage) correspond à l'apparence normale.
- `--mari-weather-pixel-size` définit la taille de chaque bloc, de `2px` à `6px`. `3px` est un bon point de départ.
- En style pixel, tes images sont dessinées à leur propre taille multipliée par `-size`. Dessine ton pixel art à raison d'un pixel par pixel du dessin et définis `-size` sur le même nombre que la taille de pixel, afin que les pixels de ton dessin s'alignent sur ceux de la météo. Petal OS dessine des pétales de 11 pixels à la taille `3`.
- En style pixel, les images ne tournent pas pendant leur chute et sont dessinées sans transparence progressive (elles apparaissent et disparaissent en trois étapes nettes), afin que le pixel art reste précis.

### Exemple : Petal OS

Voici le thème de départ Petal OS pendant une nuit fleurie. Les pétales sont ses propres dessins de 11 pixels et les étoiles reposent sur la même grille de 3 px.

## Le soleil et la lune

Le soleil et la lune acceptent une couleur, une taille et une image, comme n'importe quel autre type :

```css
:root {
  --mari-weather-sun-color: #ffe9a8;
  --mari-weather-moon-color: #ffe2f0;
  --mari-weather-moon-size: 1.5;
}
```

Si ton arrière-plan comporte déjà une lune peinte, désactive celle de l'application pour éviter d'en avoir deux :

```css
:root[data-theme="dark"] {
  --mari-weather-moon: none;
}
```

`--mari-weather-sun: none` produit le même effet pour le soleil.

## Atténuer ou renforcer la météo

Ces réglages modifient toute la couche météo à la fois :

| Token | Effet | Valeurs |
| --- | --- | --- |
| `--mari-weather-amount` | Le nombre de particules qui tombent | De `0.25` (un quart) à `1` (normal). Un thème peut raréfier la météo, mais jamais ajouter davantage de particules. |
| `--mari-weather-speed` | La vitesse de chute des éléments | De `0.5` (demi-vitesse) à `1.5` |
| `--mari-weather-strength` | La visibilité des particules | De `0.5` (discrètes) à `1.5` (marquées) |
| `--mari-weather-tint-strength` | Le voile coloré par-dessus le chat (bleu sous la pluie, sombre la nuit) | De `0` (aucun) à `1` (normal) |
| `--mari-weather-lightning-color` | La couleur du flash de l'éclair | Une couleur unie. Le flash reste doux et lent pour ne pas présenter de danger pour les personnes photosensibles. |
| `--mari-weather-lightning-bolt` | Dessine un éclair ramifié à chaque flash, dans la couleur de l'éclair | `on` ou une largeur de `0.5` à `3`. `none` (valeur par défaut) conserve seulement le flash. |

Pour un thème de lecture calme, essaie `--mari-weather-amount: 0.5;` et `--mari-weather-tint-strength: 0.3;`.

### Éclairs ramifiés

Par défaut, un orage fait seulement clignoter l'écran. Ajoute `--mari-weather-lightning-bolt` pour dessiner un véritable éclair ramifié à chaque flash :

```css
:root {
  --mari-weather-lightning-color: #e8f2ff;
  --mari-weather-lightning-bolt: 1.2;
}
```

L'éclair frappe le long du bord gauche ou droit de l'écran, jamais au milieu où se trouve le texte du chat. Il se divise en plusieurs branches et brille dans la couleur choisie. Il apparaît uniquement pendant le flash de l'application et s'estompe avec lui : un thème ne peut donc ni ajouter de flashs ni les accélérer. En style pixel, l'éclair est dessiné sous forme de blocs sur la grille de pixels. La plupart des thèmes de départ utilisent des éclairs : Apogee Lounge, Crepuscular, Dewglass, Gutterlight, MARI to the Moon, Sanguine Keep, Under Sail et Velvet Casket. Granite Watch et Quiet Iris les désactivent, car leur décor se trouve en intérieur.

## Adapter ton arrière-plan à la météo

Les illustrations de ton thème peuvent elles aussi changer avec la météo. Lorsqu'un chat affiche la météo, Marinara ajoute à la page deux mots que ton CSS peut vérifier :

- `data-mari-weather` vaut `clear`, `cloudy`, `rain`, `storm`, `snow`, `hail`, `fog`, `sand`, `ash`, `embers`, `wind`, `blossom` ou `aurora`.
- `data-mari-sky` vaut `dawn`, `day`, `dusk` ou `night`.

La valeur correspond toujours à l'un des mots ci-dessus, jamais au texte même de l'histoire. Ces attributs disparaissent quand le chat n'a aucune météo ou que l'utilisateur la désactive.

### Exemple : Lantern Path sous la pluie

Lantern Path remplace sa forêt ensoleillée par une forêt grise et couverte lorsqu'il pleut. À gauche : un matin dégagé. À droite : le même chat sous la pluie.

### Remplacer ton arrière-plan

Pour obtenir le même résultat, ajoute un bloc qui s'applique uniquement à la pluie ou aux orages et attribue-lui une seconde image d'arrière-plan :

```css
:root {
  --mari-app-backdrop: url("theme:forest-sunny.webp");
}
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:forest-overcast.webp");
}
```

Voici comment le lire : `:root[data-mari-weather="rain"]` signifie « uniquement quand il pleut ». La virgule signifie « ou ».

- Si ton thème définit `--mari-app-backdrop-layers` au lieu de `--mari-app-backdrop`, modifie aussi `--mari-app-backdrop-layers` dans le bloc météo, car il prend la priorité sur l'image unique.
- Pour tenir également compte du jour et de la nuit, ajoute le schéma : `:root[data-theme="dark"][data-mari-weather="rain"]` signifie « une nuit pluvieuse en mode Dark ».
- `data-mari-sky` fonctionne de la même manière, par exemple `:root[data-mari-sky="dusk"]` pour une version de ton illustration au coucher du soleil.

### Ne pas doubler la météo

Si ton thème possède sa propre surcouche d'ambiance avec des feuilles qui tombent ou de la pluie (`--mari-ambient`), elle peut se superposer à la météo de l'histoire. Désactive-la dès qu'une vraie météo tombe :

```css
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

Cette règle signifie : « lorsqu'il y a une météo et qu'elle n'est ni dégagée ni nuageuse, masque la surcouche d'ambiance ».

Ta propre superposition de feuilles qui tombent ou de pluie peut aussi rester dehors. `data-mari-shelter` vaut `indoors` ou `outdoors` pendant que la météo s'affiche (et est absent quand l'application ne peut pas le déterminer) :

```css
:root[data-mari-shelter="indoors"] {
  --mari-ambient: none;
}
```

## Ce qui reste au choix de l'utilisateur

Ton thème modifie l'apparence de la météo, jamais son affichage :

- Un thème ne peut pas activer ou désactiver la météo. Le réglage **Dynamic weather effects** dans Paramètres en décide.
- Quand **Reduce Ambient Animations & Effects** est activé, ou lorsque l'appareil est réglé pour réduire les animations, aucune météo n'est dessinée. Les arrière-plans continuent à suivre `data-mari-weather`, car remplacer une image ne crée aucun mouvement.
- **Reduced paint effects** (effets visuels réduits) supprime le voile et les lueurs, et dessine moins de particules.
- **Theme art strength** (intensité des illustrations du thème) estompe ta météo comme ton arrière-plan, tandis que **High contrast** (contraste élevé) la garde discrète.
- La météo se met en pause lorsqu'un panneau, un éditeur ou Mari recouvre le chat, afin d'économiser la batterie.

## Si cela n'a pas fonctionné

- **Rien n'a changé.** Vérifie que le token se trouve à l'intérieur d'un bloc `{ }` et se termine par `;`. Vérifie son orthographe : il s'écrit `--mari-weather-rain-color`, avec `color` à l'américaine.
- **Une valeur est ignorée.** Les nombres situés hors de la plage d'un token sont ramenés à la limite la plus proche et les valeurs que l'application ne comprend pas sont rejetées. Les couleurs doivent être unies : les dégradés et `url()` sont ignorés.
- **Mes images ne s'affichent pas.** L'image doit figurer dans la liste des images de ton thème et son nom dans `url("theme:...")` doit lui correspondre exactement, avec la bonne extension (`.webp` ou `.png`).
- **Aucune météo ne s'affiche.** Vérifie que **World State** est activé pour le chat, que la valeur Weather contient un mot du tableau, que **Dynamic weather effects** est activé et que **Reduce Ambient Animations & Effects** est désactivé.
- **La météo s'affiche en Roleplay, mais pas en Conversation.** C'est normal. Elle s'affiche uniquement dans les chats Roleplay et Game Mode.

## S'inspirer des thèmes de départ

Chaque thème de départ de la galerie de thèmes met la météo en valeur. Télécharge-en un, clique sur **Clone + Edit** (cloner et modifier) et fais défiler son CSS jusqu'à la partie marquée `Weather` pour voir comment il s'y prend.

- **NEON//GRID** : de longues traînées de pluie cyan, une « neige de données » carrée, des étincelles magenta pour les feuilles et les pétales. Sa surcouche de pluie peinte s'efface lorsque la vraie météo tombe.
- **Petal OS** : un style pixel sur une grille de 3 px, ses propres pétales pixelisés, une pluie rose pâle la nuit et rouge baie foncé le jour, ainsi qu'une ville qui grise par mauvais temps.
- **Lantern Path** : ses propres feuilles peintes, des lucioles chaleureuses, pas de soleil de l'application (l'arrière-plan peint sa propre lumière) et des arrière-plans qui deviennent couverts ou enneigés avec la météo.
- **Dewglass** : ses propres bulles de savon en guise de particules, des flocons de cristal dessinés par du code, une pluie turquoise, des éclairs cyan et des arrière-plans de lagon qui deviennent couverts, gelés ou brumeux.
- **Velvet Casket** : un orage différent le jour et la nuit : des éclairs roses et une pluie lilas le jour, des éclairs blanc-violet et une pluie argentée sur le cimetière la nuit, avec ses propres chauves-souris et pétales de rose dans le vent.
- **Gutterlight** : une pluie froide de bande dessinée, du papier journal déchiré dans le vent, un smog jaune sodium et un arrière-plan d'orage où l'eau ruisselle des gargouilles au moment où les éclairs frappent.
- **Under Sail** : un grain en mer avec des éclairs blanc-bleu le long du gréement, du brouillard marin, de la neige sur le bastingage et les enfléchures, ainsi que des plumes de mouette dans le vent.
- **Apogee Lounge** : la météo spatiale vue à travers la baie vitrée du salon. Un orage devient une tempête ionique dans une nébuleuse avec des éclairs de plasma violets, la pluie devient des traînées de micrométéorites, la neige un champ de glace et le brouillard une brume de nébuleuse. Un masque maintient le tout derrière la vitre.
- **Granite Watch** : un thème d'intérieur où la météo reste aussi discrète que le permet un thème. La pluie ressemble à des gouttes provenant des conduits, la neige à de la poussière de plâtre, les éclairs sont désactivés et le flash de l'application est teinté comme le vacillement d'une lampe. Consulte ce thème pour découvrir comment atténuer la météo dans un décor intérieur.
- **Quiet Iris** : un autre thème d'intérieur, mais avec un hublot. La météo n'apparaît qu'à travers la vitre, le fond passe à une version avec de la pluie, du givre ou du brouillard sur le hublot, les éclairs sont désactivés et la baie s'assombrit un peu pendant un orage.
- **MARI to the Moon** : la météo des marchés vue par la fenêtre de la salle de trading. La pluie tombe en ticks verts, un orage est un krach avec des éclairs rouges et des écrans rouges, la neige est une pluie de pièces et de diamants, le vent emporte des billets, les fleurs lancent de petites fusées et le brouillard est du FUD sur la ligne d'horizon.
- **Sanguine Keep** : la météo vue par les fenêtres du château. Un pochoir par fond garde la pluie, la neige, les pétales, les feuilles et les éclairs dans le verre des fenêtres de la grande salle (ou de la tour d'escalier sur téléphone), jamais sur la pierre.
- **Crepuscular** : la même mer lue à travers un almanach. La neige est du sucre glace, la poussière des miettes, les lucioles des yeux qui veillent, le vent emporte des bouts de papier, les éclairs sont de fines branches gravées et la veillée continue sous les parapluies. En intérieur, la mer se voit à travers un vitrail au plomb.

## Guides associés

- [Guide de création de thèmes](theme-author-guide.md)
- [Thèmes CSS personnalisés](custom-css-themes.md)
- [HUD et trackers de Roleplay](../roleplay/hud-and-trackers.md)
- [Paramètres d'apparence](appearance-settings.md)
