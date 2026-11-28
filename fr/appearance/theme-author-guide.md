# Guide de création de thèmes

Ce guide s'adresse aux personnes qui créent ou partagent leurs propres thèmes. La première partie t'accompagne dans la création de ton premier thème, sans avoir besoin de savoir coder. La suite sert de référence : chaque couleur, image et partie qu'un thème peut modifier, et les règles de sécurité que chaque thème respecte. Pour choisir, essayer, importer ou retirer un thème, consulte [Thèmes CSS personnalisés](custom-css-themes.md).

**Version 1 du contrat des jetons** (`--mari-tokens-version: 1` sur `:root`). Les noms de ce guide continuent de fonctionner d'une version à l'autre. Quand l'un d'eux doit changer, le numéro de version augmente et le changement figure dans les [Modifications](#changes) à la fin. Tout le reste (les autres variables `--ov-*`, `--mari-*` et `--marinara-*`, les classes Tailwind, la structure des éléments) est interne et peut changer à chaque mise à jour.

## Ton premier thème, pas à pas

Un thème est une courte liste de réglages écrits en CSS, le langage des pages web pour les couleurs et les polices. Tu n'as pas besoin de connaître le CSS pour commencer. Chaque ligne ressemble à `--name: value;` : un **jeton** (un réglage nommé qui commence par `--`), un deux-points, la valeur et un point-virgule.

1. Ouvre **Bibliothèque → Réglages → Apparence** et clique sur **Thèmes CSS** dans la rangée de sections.
2. Pour modifier un thème de départ, télécharge celui qui te plaît depuis **Parcourir la galerie de thèmes**, retrouve-le dans **Thèmes de départ** et clique sur **Cloner et modifier** (l'icône de copie). Marinara crée ta propre copie, nommée par exemple "Petal OS (ma copie)", et l'ouvre dans l'éditeur. Les thèmes de départ restent en lecture seule, donc l'original est toujours disponible. Pour partir de zéro, clique plutôt sur **Nouveau thème**. Son modèle contient des lignes entre `/*` et `*/`, qui sont désactivées. Supprime ces marques autour d'une ligne pour l'activer.
3. Saisis un nom dans le champ du nom.
4. Change une couleur. Trouve une ligne comme `--primary: #3fae7a;` et remplace la couleur. `#3fae7a` est un code de couleur hexadécimal. N'importe quel sélecteur de couleur sur le web peut t'en donner un. Des noms comme `teal` fonctionnent aussi.
5. Laisse **Aperçu** activé. L'application change pendant que tu écris, donc tu vois immédiatement chaque modification.
6. Regarde sous l'éditeur. **Aucun problème CSS trouvé.** signifie que le CSS est correct. Sinon, chaque problème apparaît avec son numéro de ligne, par exemple un `;` ou un `}` manquant.
7. Clique sur **Enregistrer**. Ton nouveau thème s'active et Marinara demande **Garder ce thème ?** Clique sur **Garder le thème** dans les 15 secondes, sinon l'ancienne apparence est rétablie.

Les jetons que l'on modifie le plus souvent en premier :

| Jeton | Ce qu'il colore |
| ---------------- | -------------------------------------------- |
| `--background`   | La page derrière tout le reste |
| `--foreground`   | Le texte principal |
| `--primary`      | Les boutons, les liens et les surbrillances |
| `--card`         | Les cartes et les panneaux |
| `--sidebar`      | Les barres latérales des chats et de la Bibliothèque |
| `--border`       | Les lignes autour des éléments |
| `--mari-font-ui` | La police de l'application, par exemple `"Georgia", serif` |

Un petit thème :

```css
:root {
  --mari-tokens-version: 1;
  --primary: #3fae7a;
  --mari-selected-tint: var(--primary);
  --mari-font-ui: "Inter", system-ui, sans-serif;
}

[data-theme="dark"] {
  --background: #0f1712;
  --card: color-mix(in srgb, #0f1712 80%, transparent);
  --sidebar: #0b120e;
}
```

`:root { … }` contient les réglages de toutes les palettes de couleurs. `[data-theme="dark"] { … }` contient les réglages du mode Sombre uniquement, et `[data-theme="light"] { … }` ceux du mode Clair uniquement. Pour voir la liste complète des jetons pendant ton travail, ouvre **Référence des variables CSS** sous l'éditeur, ou lis [Jetons de couleur](#colour-tokens) ci-dessous.

### Ajouter des images et des polices

Ouvre **Images et détails de partage (auteur, version, miniature, polices)** sous l'éditeur et clique sur **Ajouter des images**. Clique sur le nom d'une image pour l'insérer dans ton CSS à l'emplacement du curseur. Consulte [Images](#pictures) et [Images de fond](#backdrops) pour savoir où placer les images.

Les images et les polices doivent être intégrées au thème. Un thème ne peut rien charger depuis un autre site web : un lien vers une image ou une police Google Font dans ton CSS ne fonctionnera donc pas.

### Demander à Professor Mari de créer les illustrations

Si tu as configuré un modèle d'image dans **Connexions** (Codex, NovelAI, ComfyUI, un modèle d'image OpenAI, etc.), Professor Mari peut créer les images d'un thème pour toi et les y intégrer. Demande-le-lui simplement, par exemple "crée un fond de ciel nocturne pour mon thème Harbor" ou "donne un cadre en laiton aux cartes de l'accueil".

1. Professor Mari travaille uniquement sur tes propres thèmes. Pour un thème de départ, clique d'abord sur **Cloner et modifier**, puis demande-lui de travailler sur la copie.
2. Elle écrit elle-même le prompt de l'image – le texte envoyé à l'IA – et le transmet à ton modèle d'image exactement tel quel. Tes profils de style d'image et tes préfixes de prompt (généralement configurés pour les illustrations de personnages) sont exclus, pour éviter qu'une demande de fond produise un portrait.
3. Professor Mari regarde elle-même chaque image (les petites sont agrandies, les parties transparentes apparaissent sur du gris) avant de la décrire, et tu la vois avant toute modification. Demande plusieurs versions parmi lesquelles choisir (jusqu'à 4 à la fois), ou des corrections comme "recadre sur la moitié supérieure", "rends le fond blanc transparent" ou "réduis sa taille". Chaque correction crée une nouvelle version et les précédentes sont conservées.
4. Quand tu acceptes, Professor Mari enregistre l'image dans ton thème (en WebP, comme **Ajouter des images**) et l'insère dans le CSS du thème. Elle apparaît dans **Images et détails de partage** comme toute image que tu aurais ajoutée toi-même.

Les ornements dessinés, comme les rails, les clôtures et les boutons d'envoi, sont des images SVG. Professor Mari peut les recolorer directement, sans ton modèle d'image, et ils restent nets.

Chaque image prend le temps nécessaire à ton modèle d'image, souvent entre une demi-minute et une minute et demie. Si ta connexion d'image utilise ton propre workflow ComfyUI, le texte intégré à ce workflow est tout de même envoyé.

### Partager ton thème

1. Dans **Images et détails de partage**, remplis **Auteur**, **Version** (par exemple `1.0`), **Description** et **Miniature**, puis choisis **Conçu pour** (Sombre, Clair ou les deux). Pour suggérer tes couleurs et ta police avec le thème, clique sur **Utiliser mon apparence actuelle** dans **Réglages**. Enregistre.
2. Clique sur **Exporter** (l'icône d'envoi) sur la ligne de ton thème. Marinara enregistre un seul fichier `.json` contenant le CSS, les images et les polices.
3. Si tu as utilisé des illustrations ou des polices créées par quelqu'un d'autre, ouvre le fichier dans un éditeur de texte et ajoute les crédits et une licence. Consulte [Fichiers de thème](#theme-files).
4. Envoie ce fichier. L'autre personne l'importe avec **Importer un fichier** et voit ton nom, les crédits et la liste de tout ce que le thème modifie avant de l'installer.

### En cas de problème

Marinara garde la barre supérieure, les barres latérales, <kbd>Ctrl</kbd>+<kbd>K</kbd> et la zone de message utilisables quoi que fasse un thème. Si ton thème masque, déplace ou recouvre l'un de ces éléments, Enregistrer t'indique ce qui ne va pas. Tu peux quand même choisir **Enregistrer quand même**, mais Marinara désactive le thème dans un onglet dès qu'il perturbe l'un d'eux. Pour retrouver ton apparence normale à tout moment, appuie trois fois sur <kbd>Esc</kbd>, ajoute `?safe` à la fin de l'adresse, ou appuie sur <kbd>Ctrl</kbd>+<kbd>K</kbd> et saisis "Thème personnalisé".

Les thèmes de départ sont de bons exemples pour apprendre. Clone-en un et lis son CSS pour voir comment il utilise les jetons et les points d'ancrage des parties décrits ci-dessous.

## Comment un thème prend la priorité

Le CSS propre à l'application se trouve dans des couches de cascade, déclarées au tout début de `index.html` :

```
mari-protected, mari-theme-important, theme, base, components, utilities, mari-app, mari-pickers
```

- Un thème est **sans couche**, donc un simple sélecteur du thème l'emporte sur toute règle de l'application sans `!important`,
  quelle que soit la spécificité de cette règle.
- `mari-pickers` contient les sélecteurs d'Apparence (arrière-plan, accent, polices, couleurs du chat). Cette couche se trouve
  au-dessus des valeurs par défaut de l'application et sous le thème : les couleurs du thème priment donc sur les sélecteurs, et
  Apparence indique à l'utilisateur quand un thème remplace la valeur d'un sélecteur.
- `!important` fonctionne toujours dans un thème. Ces règles sont copiées dans `mari-theme-important`, qui
  l'emporte sur les règles `!important` de l'application.
- `mari-protected` maintient en place la barre supérieure, la barre latérale des chats, celle de la Bibliothèque et Ctrl+K.
  Un thème peut modifier leur style (couleurs, polices, bordures, rayons, ombres), mais pas les masquer, les déplacer, les réduire ni
  les recouvrir. S'il essaie, le thème est désactivé dans cet onglet et l'utilisateur en connaît la raison.
- Une transition peut attendre au plus une seconde avant de démarrer (`transition-delay`, ou la deuxième durée
  dans `transition`). Un thème qui retarde davantage une modification est refusé, pour que rien ne puisse apparaître longtemps
  après la vérification de l'écran. Les animations peuvent utiliser n'importe quel délai.

Le retour en arrière fonctionne toujours : `?safe` dans l'URL, **Échap trois fois**, ou Ctrl+K > "Thème personnalisé"
désactive le thème. Un nouveau thème demande "Garder ce thème ?" et rétablit l'apparence précédente après 15 secondes.

## Jetons de couleur

### Base (chaque style visuel les définit)

`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`,
`--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`,
`--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`,
`--border`, `--input`, `--ring`, `--radius`, `--sidebar`, `--sidebar-foreground`, `--sidebar-border`,
`--sidebar-accent`, `--sidebar-accent-foreground`.

Les valeurs sont des couleurs CSS complètes (`#1b1530`, `rgb(…)`, `oklch(…)`). Les triplets HSL bruts comme
`270 25% 8%` (la convention shadcn) ne sont **pas** valides ici.

Définis les modes clair et sombre séparément avec `[data-theme="light"]` et `[data-theme="dark"]`.

### Nouvelle disposition

| Jeton | Utilisation |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `--ov-line`                                                      | Les lignes fines et les bordures des panneaux |
| `--ov-text`, `--ov-muted`, `--ov-dim`                            | Le texte, le texte secondaire, le texte estompé |
| `--ov-accent`                                                    | Les touches d'accent (`--primary` par défaut) |
| `--ov-hover`, `--ov-active-bg`                                   | Les fonds au survol et à l'appui |
| `--ov-mode-conversation`, `--ov-mode-roleplay`, `--ov-mode-game` | Les couleurs des modes de chat dans la barre latérale des chats et les éditeurs |
| `--ov-serif`                                                     | La police des titres (suit `--mari-font-heading`) |
| `--mari-selected-tint`                                           | Les lignes, pastilles et interrupteurs sélectionnés. Neutre (`--foreground`) par défaut ; utilise `var(--primary)` pour une sélection teintée de la couleur d'accent |
| `--mari-selected-bg`, `--mari-selected-ring`                     | Dérivés de la teinte (10% et 18%) |

### Jetons de thème (v1)

Chacun utilise par défaut l'apparence de l'application. Le mode clair a ses propres valeurs lisibles.

| Jeton | Utilisation |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `--mari-font-ui`                                                                                         | La police de toute l'application |
| `--mari-font-heading`                                                                                    | Les titres des pages et des sections |
| `--mari-font-chat`                                                                                       | Le texte des messages dans les chats Roleplay et Conversation |
| `--mari-mode-conversation`, `--mari-mode-roleplay`, `--mari-mode-game`                                   | Les pastilles de l'accueil, les chats récents, le lanceur de nouveau chat, les surtitres des widgets de l'accueil |
| `--mari-home-pink`, `--mari-home-violet`                                                                 | Les autres accents des widgets de l'accueil |
| `--mari-status-online`, `--mari-status-idle`, `--mari-status-dnd`, `--mari-status-offline`               | Les points et les libellés de présence |
| `--mari-gauge-ok`, `--mari-gauge-warn`, `--mari-gauge-danger`                                            | Les jauges du jeu et les barres de PV. La couleur propre au widget reste prioritaire dans son état normal ; le danger utilise toujours le jeton |
| `--mari-game-combat`, `--mari-game-combat-text`                                                          | Le bouton Combat du jeu |
| `--mari-stage-empty-bg`                                                                                  | Le plateau du jeu avant le chargement d'une image de scène (tout `background`, dégradés compris) |
| `--mari-scrim`                                                                                           | Le fond assombri derrière Ctrl+K |
| `--mari-user-avatar-placeholder`                                                                         | Ton avatar quand tu n'as pas d'image (un dégradé) |
| `--mari-art-saturation-1`, `--mari-art-lightness-1`, `--mari-art-saturation-2`, `--mari-art-lightness-2` | Le dégradé des cartes sans image. Chaque carte conserve sa teinte ; règle ces valeurs (en pourcentages) pour atténuer les dégradés |
| `--mari-app-backdrop`                                                                                    | Une image ou un dégradé derrière toute l'application, dessiné une seule fois (voir ci-dessous) |
| `--mari-accent-fx-animation`                                                                             | L'animation de Pulsation de l'accent ou du Mode RGB quand l'un est activé, sinon `none` |

### Jetons de thème ajoutés en v1.1

Ils n'ont aucune valeur tant qu'un thème n'en définit pas : le réglage de l'utilisateur s'applique donc jusque-là.

| Jeton | Utilisation |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-text-outline`                                                                                                                                                                                                        | Le contour du texte des messages, par exemple `0` pour le désactiver ou `1px #3b2a1a`. Sinon, c'est le réglage Contour du texte de l'utilisateur |
| `--mari-dialogue-color`                                                                                                                                                                                                      | La couleur des dialogues quand le personnage ou le persona n'en a pas (leur propre couleur reste prioritaire) |
| `--mari-chat-font-size`                                                                                                                                                                                                      | La taille du texte des messages. Le minimum d'Accessibilité s'applique toujours |
| `--mari-composer-placeholder`                                                                                                                                                                                                | L'espace réservé de la zone de message, sous forme de chaîne entre guillemets : `"> waiting for user input..."`. Définis-le sur `:root` ou sur une zone de saisie, comme `[data-composer="game"]`. Le texte demandant des clés ou des mots de passe est ignoré |
| `--mari-page-veil`                                                                                                                                                                                                           | Une couleur appliquée sur les Réglages, la Bibliothèque, les éditeurs et la Documentation pour que les textes longs restent lisibles sur une image de fond. `transparent` par défaut |
| `--mari-page-floor` | La feuille presque opaque sur laquelle repose chaque page entière au-dessus d'une image de fond. Par défaut `color-mix(in srgb, var(--background) 94%, transparent)` ; `transparent` la retire |
| `--mari-top-bar-bg`                                                                                                                                                                                                          | Une valeur `background` complète pour la barre supérieure : une image, un dégradé ou plusieurs couches. `--mari-top-bar-rendering: pixelated` garde le pixel art net. Les onglets et les icônes restent toujours au-dessus et visibles |
| `--mari-top-bar-plate`, `--mari-top-bar-plate-radius`                                                                                                                                                                        | Sur une illustration de la barre supérieure, chaque onglet, onglet de chat ouvert, bouton d'icône et le logo reposent sur une plaque pour rester lisibles. Ces jetons définissent sa couleur et le rayon de ses coins (`0.5rem` par défaut) ; règle le rayon sur `0` pour des boutons carrés en pixel art. |
| `--mari-tab-row-strip-bg`, `--mari-tab-row-strip-height`, `--mari-tab-row-strip-room` | Une bande sous les onglets de la barre supérieure (bandeau défilant, clôture) passe sur la rangée du groupe lorsqu’elle est visible (`:root[data-ov-tabrow]` ; rangée : `[data-tab-row]`). Définis sur `[data-tab-row]` le `background`, la hauteur et la place prise dessous (par défaut la hauteur ; `0px` la place derrière). `[data-mari-part="tab-row-strip"]` peut être animé. Retire toi-même la bande de la barre sous `:root[data-ov-tabrow]`. |
| `--mari-msg-head-rule`                                                                                                                                                                                                       | La ligne sous le nom dans les messages Roleplay (une valeur `border-bottom`, comme `none` ou `2px dashed currentColor`) |
| `--mari-home-widget-border`, `--mari-home-widget-border-width`, `--mari-home-widget-radius`, `--mari-home-widget-bg`                                                                                                         | Le cadre et la surface de chaque widget de l'accueil, Professor Mari comprise |
| `--mari-home-widget-font`, `--mari-home-widget-title-font`, `--mari-home-widget-title-size`, `--mari-home-widget-title-color`, `--mari-home-widget-eyebrow-size`, `--mari-home-widget-text-size`, `--mari-home-widget-muted` | La typographie des widgets de l'accueil. Les widgets grandissent en hauteur quand le texte a besoin de place au lieu de le couper |
| `--mari-home-widget-eyebrow-color`, `--mari-home-widget-action-size`, `--mari-professor-sprite-scale`                                                                                                                        | Le petit libellé au-dessus des titres des widgets, le texte du bouton Demander de Professor Mari et la taille de son image (1 = valeur d'origine) |
| `--mari-home-wash`                                                                                                                                                                                                           | La teinte que l'accueil applique sur une image de fond (par défaut : 65% de la couleur des cartes) ; `transparent` montre l'illustration à pleine intensité |
| `--mari-home-art`                                                                                                                                                                                                            | `none` masque les images d'origine des cartes de l'accueil ; elles se chargent à la demande, donc les images masquées ne sont jamais téléchargées. Ce sont de petites images dans chaque carte (Quoi de neuf, Autour de la table), pas un fond d'accueil : l'illustration derrière l'accueil est le fond de l'application |
| `--mari-ambient` (et `-opacity`, `-blend`, `-animation`)                                                                                                                                                                    | La superposition ambiante : voir Superposition ambiante |
| `--mari-icon-send`, `--mari-icon-stop`, `--mari-icon-attach`, `--mari-icon-emoji`                                                                                                                                            | Une image à la place de l'icône de la zone de message (une valeur `background-image`) |
| `--mari-cursor`, `--mari-cursor-pointer`                                                                                                                                                                                     | Un pointeur sous forme d'image (une valeur `cursor` complète). Il prime sur Curseur de souris personnalisé tant que le thème est activé |

### Jetons de thème ajoutés en v1.4

Comme les jetons de la v1.1, ceux du premier groupe n'ont aucun effet tant qu'un thème ne les définit pas.

| Jeton | Utilisation |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-message-time`                                                                          | La couleur des heures des messages (`[data-mari-part="time"]`) dans tous les modes de chat |
| `--mari-chat-wash`                                                                             | La teinte sur le fond d'un chat Roleplay, sous forme de valeur `background` complète. Celle d'origine est sombre, blanc lavande en mode Clair. `none` la retire |
| `--mari-lore-constant`, `--mari-lore-selective`, `--mari-lore-normal`                          | Les points d'état des entrées de lorebook |
| `--mari-toast-font-size`                                                                       | La taille du texte des notifications temporaires (qui utilisent déjà `--mari-font-ui`) |
| `--mari-home-shortcut-size`, `--mari-home-shortcut-desc-size`                                  | Les lignes de raccourcis Découvrir l'application et Communauté de l'accueil. Si seul `--mari-home-widget-text-size` est défini, elles le suivent, avec des descriptions à 0,85 fois cette taille |
| `--mari-min-ui-text`                                                                           | Un minimum pour les plus petits textes de l'application (libellés de 9 à 12 px, compteurs, pastilles). Les jetons Tailwind `--text-xs`, `--text-sm` et `--text-base` peuvent aussi être définis |
| `--mari-user-avatar-image`                                                                     | Une image pour ton avatar quand le persona n'en a pas. Sans jeton, l'espace réservé affiche désormais l'image du persona s'il en a une |
| `--mari-focus-frame`, `--mari-window-title`, `--mari-ambient-placement`, `--mari-ambient-mask` | Des emplacements, voir ci-dessous |

Ceux-ci remplacent des valeurs auparavant fixes dans l'application et utilisent l'apparence d'origine par défaut :

| Jeton | Utilisation |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-chrome-accent`                                                              | Le soulignement de l'onglet actif, les cadres des éditeurs, les menus de sélection et les écrans de connexion |
| `--mari-chrome-muted`                                                               | Le texte secondaire gris dans les panneaux, les barres latérales et l'accueil (par défaut : 58% du texte de l'interface) |
| `--mari-resource-accent`, `--mari-resource-<type>`                                  | Les couleurs de la Bibliothèque par type : `characters`, `personas`, `lorebooks`, `presets`, `connections`, `agents`, `settings`, `backgrounds`, `browser` |
| `--mari-ctrlk-conversation`, `--mari-ctrlk-roleplay`, `--mari-ctrlk-game`           | Les couleurs des lignes de Ctrl+K par mode |
| `--mari-game-combat-bg`, `--mari-game-combat-bg-hover`, `--mari-game-combat-border` | Le bouton Combat de Game Mode (les deux fonds sont des valeurs `background` complètes, donc les dégradés fonctionnent ; ajoute aussi une couche de couleur unie) |
| `--mari-accent-text`                                                                | L'accent utilisé pour un petit texte ou une icône (onglets actifs, libellés de section, liens). Par défaut : l'accent, assombri en mode Clair et éclairci en mode Sombre juste assez pour être lisible |
| `--mari-top-bar-plate-active`                                                       | La plaque derrière un contrôle actif de la barre supérieure quand celle-ci contient une illustration (par défaut : la plaque mélangée à 20% d'accent) |
| `--mari-chat-header-bg`                                                             | Le fondu derrière l'en-tête Conversation (par défaut : la couleur de la page à 88%, puis transparente ; `none` sous une image de fond de l'application) |
| `--mari-home-hero-padding`, `--mari-home-widget-glow`                               | Les marges intérieures de la salutation de l'accueil et la lueur derrière l'en-tête d'un widget de l'accueil |

L'application publie aussi `--mari-top-bar-height` sur `<html>` (la hauteur réelle de la barre supérieure, qui
change quand un thème la rend plus haute), pour qu'un thème puisse ménager de l'espace sous elle pour ses propres couches.

### Jetons de thème ajoutés en v1.5

Pour les longues réponses et les éléments qui nécessitaient auparavant des classes internes. Chacun est sans effet tant qu'un thème
ne le définit pas, sauf lorsqu'une valeur d'origine est indiquée.

| Jeton | Utilisation |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-chat-column`                                       | La colonne Roleplay partagée par les messages et la zone de message (58rem par défaut). Le réglage Réglages du chat → Largeur de la zone de chat du lecteur reste prioritaire |
| `--mari-message-measure`                                   | La longueur maximale d'une ligne de message, par exemple `68ch` (Roleplay et Conversation) |
| `--mari-chat-line-height`                                  | L'interligne du texte des messages dans tous les modes de chat (1,5 par défaut). Accessibilité → Interligne reste prioritaire |
| `--mari-dialogue-weight`                                   | La graisse du discours entre guillemets (`[data-mari-part="dialogue"]`), par exemple `400` pour éviter qu'un long discours forme un bloc en gras |
| `--mari-dialogue-color`                                    | S'affiche désormais aussi quand les couleurs `--mari-chat-*` du thème activent la coloration du chat, tout comme les couleurs que le thème donne à l'italique et aux liens |
| `--mari-paragraph-gap`                                     | L'espace entre les paragraphes au lieu d'une ligne vide, par exemple `0.85em` |
| `--mari-pinned-speaker`, `--mari-pinned-speaker-bg`        | `on` : la ligne du nom d'une longue réponse Roleplay reste en haut du chat pendant son défilement (ordinateur et tablette). Le fond est celui de la bulle par défaut |
| `--mari-pinned-speaker-top`, `--mari-pinned-speaker-bleed` | La position de la ligne épinglée (par défaut : le bord supérieur du chat visible) et sa distance de dépassement du texte (1rem par défaut) |
| `--mari-phone-avatar`                                      | `hidden` : les téléphones suppriment la colonne d'avatar en Roleplay, pour que la réponse occupe toute la largeur |
| `--mari-mini-avatar-size`, `--mari-mini-avatar-ring`       | La petite image près du nom sur téléphone (**Photos de profil sur téléphone : Mini**, par défaut) : sa taille et son contour sous forme de `box-shadow`. Elle correspond à `[data-mari-part="mini-avatar"]` avec `data-role` (`user`, `assistant`) |
| `--mari-phone-convo-avatar`                                | `full` : les chats Conversation conservent la colonne d'avatar complète sur téléphone, même si l'utilisateur a choisi **Mini** |
| `--mari-vn-fade`                                           | Le fondu en bas de la zone de texte VN quand la suite du paragraphe est plus bas (1,75rem par défaut, `0` le désactive) |
| `--mari-message-actions`, `--mari-swipe-counter`           | La couleur des outils sous un message et de son compteur de swipes "2 / 5" |
| `--mari-card-art-placeholder`                              | Un `background` complet pour les cartes sans image de la Bibliothèque, à la place du dégradé à teinte aléatoire |
| `--mari-chat-row-art-opacity`                              | L'image du chat ouvert derrière sa ligne dans la barre latérale des chats (0,14 par défaut ; `0` la masque) |
| `--mari-chrome-accent`, `--mari-chrome-accent-gradient`    | Atteignent désormais aussi les surfaces qui lisent l'accent depuis `<html>` (les onglets Convo / Roleplay / Game, les bordures de l'interface) |
| `--mari-focus-frame-outset`                                | La distance de dépassement du cadre de focus au-delà de sa surface (une longueur, au plus 2rem ; voir Emplacements) |
| `--mari-scrim`                                             | La couche sombre derrière les boîtes de dialogue |
| `--mari-confirm-scrim`                                     | La couche claire et transparente derrière les courtes boîtes de dialogue de confirmation (garde-la discrète pour que les thèmes lumineux restent doux) |

L'application publie aussi `--mari-center-x` sur `<html>` quand un thème a une superposition ambiante : le
centre horizontal du panneau de chat, pour qu'un masque puisse dégager la colonne de lecture, que les barres latérales
soient ouvertes ou non. `--mari-gutter-mask` l'utilise.

## Images

Un thème contient ses images dans `images` dans le fichier de thème, et son CSS les utilise par leur nom :

```css
:root {
  --mari-app-backdrop: url("theme:night.webp");
}
[data-mari-part="home-widget"] {
  border-image: url("theme:frame.webp") 24 fill / 24px stretch;
}
```

- Les images comptent dans le budget de 6 Mio du package, pas dans la limite de 256 Kio du CSS, ce qui laisse la place aux illustrations en taille réelle.
- Dans l'éditeur, ouvre **Images et détails de partage** et appuie sur **Ajouter des images**. Les PNG et JPEG sont
  enregistrés en WebP à l'entrée (sans perte pour les petites images, pour que le pixel art et les cadres à 9 tranches restent nets ;
  au plus 2 560 px sur le côté le plus long). Clique sur le nom d'une image pour insérer `url("theme:name")` à l'emplacement du curseur.
- L'import d'un thème fait de même : les images intégrées sous forme d'URL `data:` sont déplacées du CSS
  vers `images`, les PNG et JPEG fixes deviennent des WebP, et l'aperçu liste chaque image avec sa taille
  (avec une case "Garder plutôt les fichiers d'origine").
- Les noms `theme:` retrouvent aussi les `backgrounds` du thème par leur nom : une illustration fournie pour la galerie
  des fonds de chat peut donc aussi servir dans le CSS, que l'utilisateur l'ajoute à la galerie ou non.
- À l'application du thème, chaque image devient une courte URL `blob:` de même origine : rien n'est
  téléchargé, et une image utilisée à plusieurs endroits n'est décodée qu'une fois.
- Les GIF, APNG, WebP animés et SVG avec `<animate>` comptent comme des images animées. L'aperçu d'import
  le signale et, avec Réduire les animations activé, ils s'affichent sous forme de leur première image.

## Images de fond

Définis `--mari-app-backdrop` sur `:root` pour afficher une illustration derrière l'application :

```css
:root {
  --mari-app-backdrop: url("theme:city.webp");
  --mari-app-backdrop-position: bottom center;
  --mari-app-backdrop-rendering: pixelated;
}
```

Elle est dessinée une seule fois, sur sa propre couche fixe sous toute l'application (`[data-mari-part="app-backdrop"]`, pour que
les décorations de l'accueil et la palette claire ne la masquent jamais), et apparaît aussi derrière les chats : les surfaces Roleplay,
Conversation et Game Mode deviennent transparentes et le fond de chat d'origine s'efface. Un
fond choisi par l'utilisateur pour un chat reste affiché au-dessus. Les panneaux conservent `--card` et
`--sidebar` : rends-les translucides si tu veux voir l'illustration derrière eux, et utilise
`--mari-page-veil` pour teinter les pages entières. Pour donner aux pages leur propre panneau, personnalise
`[data-mari-part="page"]` (voir Points d'ancrage) : il contient chaque page de la Bibliothèque, les éditeurs, les Réglages et la Documentation, donc
Lorebooks reçoit le même panneau que Personnages. Au-dessus d'une image de fond, chaque page entière repose aussi sur une feuille presque opaque de ton `--background` (`--mari-page-floor`, 94 % par défaut), pour que les longues listes et les éditeurs restent lisibles. Donne à `--mari-page-floor` une autre couleur, ou `transparent` pour laisser passer davantage l'image. Un thème qui stylise `[data-mari-part="page"]` avec `!important` remplace cette feuille par son propre panneau.

| Jeton | Valeur par défaut |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-app-backdrop`            | Une image ou un dégradé |
| `--mari-app-backdrop-size`       | `cover` (essaie `auto` ou `64px` pour des motifs répétés) |
| `--mari-app-backdrop-position`   | `center` |
| `--mari-app-backdrop-repeat`     | `no-repeat` |
| `--mari-app-backdrop-attachment` | `fixed` |
| `--mari-app-backdrop-rendering`  | `auto` (`pixelated` pour le pixel art) |
| `--mari-app-backdrop-layers`     | Une valeur `background` complète à plusieurs couches, comme `url(city.webp) bottom / 100% auto no-repeat, radial-gradient(#fff3 1px, transparent 1px) 0 0 / 12px 12px, #fbe3ef`. Elle prime sur les jetons pour image unique |

Les images personnalisées sont la partie la plus souple d'un thème : images de fond, bandeau de la barre supérieure, cadres des widgets
de l'accueil et des messages (`border-image`, ou un `background` sur n'importe quel point d'ancrage), motifs répétés
et polices pixel intégrées sont tous contenus dans le fichier de thème et listés dans l'aperçu d'import.
Le réglage Apparence > Accessibilité > Intensité des illustrations du thème de l'utilisateur atténue l'image de fond et la superposition
ambiante, et Contraste élevé les limite à 25% ou moins ; un thème ne peut annuler ni l'un ni l'autre.

## Superposition ambiante

`--mari-ambient` accepte une valeur `background` complète pour une couche au-dessus du chat et des pages, mais
**sous** la barre supérieure et les deux barres latérales : pluie, feuilles qui tombent, lignes de balayage, vignettage.

```css
:root {
  --mari-ambient: url("theme:leaves.webp") 0 0 / 512px repeat;
  --mari-ambient-opacity: 0.6;
  --mari-ambient-animation: leaves-fall 30s linear infinite;
}
@keyframes leaves-fall {
  to {
    background-position: 0 1024px;
  }
}
```

`--mari-ambient-blend` définit un `mix-blend-mode`, et `[data-mari-part="ambient"]::before` et
`::after` sont disponibles pour deux couches supplémentaires. Cette couche ne capte jamais les clics, s'immobilise avec Réduire
les animations (ses images deviennent fixes) et doit rester en grande partie transparente : un thème dont la couche ambiante
masquerait le chat est désactivé. Utilise-la plutôt qu'un `body::after` en plein écran, que
le mécanisme de protection considère comme un élément recouvrant l'application.

La couche reste immobile quand personne ne peut la voir : lorsque l'application est en arrière-plan (un autre onglet
ou une autre application a le focus) et, sur téléphone et tablette, quand une page complète, comme une page de la Bibliothèque, un éditeur ou
les Réglages, recouvre le chat. Les animations infinies ailleurs dans un thème se mettent aussi en pause en arrière-plan. Elles
reprennent là où elles s'étaient arrêtées : ne synchronise donc rien d'important avec elles.

Le fond propre à un chat est un `<img data-mari-part="backdrop">`. Celui d'origine (aucun fond choisi)
a aussi `data-default-background="true"`, pour qu'un thème puisse remplacer uniquement celui-là :

```css
img[data-mari-part="backdrop"][data-default-background] {
  opacity: 0 !important;
}
```

## Météo

Quand l'histoire a une météo (Réglages > Apparence > Effets > Effets météo dynamiques, avec l'agent World State
activé), l'application dessine de la pluie, de la neige, du brouillard, des pétales, des étoiles, un soleil ou une lune au-dessus du chat. Un thème peut tout
personnaliser avec les jetons `--mari-weather-*`, et changer ses propres illustrations selon la météo.

Tu découvres cette fonction ? [La météo dans ton thème](theme-weather.md) t'accompagne pas à pas, avec des images.

```css
:root {
  --mari-weather-style: pixel; /* every drop and flake lands on a pixel grid */
  --mari-weather-pixel-size: 3px;
  --mari-weather-rain-color: #ffaacd;
  --mari-weather-petal-image: url("theme:petal-a.png") url("theme:petal-b.png");
  --mari-weather-petal-size: 3;
  --mari-weather-tint-strength: 0.4;
}
:root[data-theme="dark"] {
  --mari-weather-moon: none; /* the night backdrop already has a moon */
}
```

L'application se charge toujours de tout dessiner. Elle lit ces jetons au chargement du thème, lors d'un changement de palette
de couleurs et quand tu modifies le thème, vérifie chaque valeur et ignore tout ce qu'elle ne
comprend pas. La météo de jour et de nuit (ou propre à un chat) fonctionne donc comme tout autre jeton.

| Jeton | Valeurs |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-weather-style`           | `smooth` (par défaut) ou `pixel` : la couche est dessinée en basse résolution puis agrandie sans flou, et les particules deviennent des cellules carrées |
| `--mari-weather-pixel-size`      | 2 à 6 (px par cellule), 3 par défaut |
| `--mari-weather-<kind>-color`    | Une couleur simple (`#hex`, un nom de couleur, `rgb()`, `hsl()`), sans dégradé ni image |
| `--mari-weather-<kind>-image`    | Jusqu'à 4 images du thème, `url("theme:a.png") url("theme:b.png")` ; chaque particule en choisit une. En style lisse, les feuilles, pétales et cendres tournent en tombant |
| `--mari-weather-<kind>-size`     | De 0,5 à 3 fois la taille. En style pixel, l'image est dessinée à sa taille multipliée par cette valeur, donc le pixel art conserve ses pixels (pixel de l'illustration = taille x 1 px) |
| `--mari-weather-<kind>-shape`    | `round` ou `square` (style lisse ; des carrés pour une "neige de données" ou des étincelles) |
| `--mari-weather-amount`          | De 0,25 à 1 : un thème peut réduire la densité de la météo, jamais l'augmenter |
| `--mari-weather-speed`           | De 0,5 à 1,5 fois la vitesse |
| `--mari-weather-strength`        | De 0,5 à 1,5 fois l'intensité d'affichage des particules (pluie fine sur une ville sombre) |
| `--mari-weather-tint-strength`   | De 0 à 1 fois la teinte du ciel d'origine (bleue sous la pluie, sombre la nuit) |
| `--mari-weather-rain-length`     | De 0,5 à 3 fois la longueur des traînées de pluie |
| `--mari-weather-sun`, `-moon`    | `none` quand ton image de fond contient déjà son propre soleil ou sa propre lune |
| `--mari-weather-lightning-color` | La couleur du flash. Son intensité et son rythme conservent les valeurs douces de l'application, adaptées aux personnes épileptiques |
| `--mari-weather-lightning-bolt`  | `on`, `none` ou 0,5-3 (largeur) : un éclair ramifié sur le côté gauche ou droit à chaque flash, qui s'estompe avec lui |

Types : `rain`, `snow`, `hail`, `fog`, `dust`, `leaf` (temps venteux), `petal` (floraison), `ember`, `ash`,
`sand`, `firefly`, `star`, `aurora`, ainsi que `sun` et `moon` (couleur, taille et une image).

### Des illustrations qui suivent la météo

Pendant l'affichage de la météo d'un chat, `<html>` porte deux mots issus de listes fixes (jamais le texte de l'histoire) :

| Attribut           | Valeurs                                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `data-mari-weather` | `clear`, `cloudy`, `rain`, `storm`, `snow`, `hail`, `fog`, `sand`, `ash`, `embers`, `wind`, `blossom`, `aurora` |
| `data-mari-sky`     | `dawn`, `day`, `dusk`, `night`                                                                                  |
| `data-mari-shelter` | `indoors` ou `outdoors` (absent quand l'application ne peut pas le déterminer)                                                       |

À l'intérieur, l'application ne dessine ni particules, ni nappes de brouillard, ni soleil, ni lune, ni étoiles, seulement la teinte et le flash
d'éclair : les jetons météo d'un thème ne sont donc visibles qu'à l'extérieur. Les attributs sont définis que Réduire les animations et effets d'ambiance soit activé ou non (changer d'image de fond n'est pas une animation), et
retirés quand le chat n'a pas de météo ou que l'utilisateur la désactive. Utilise-les pour griser un fond
ensoleillé sous la pluie, ou pour effacer ta propre couche ambiante afin qu'elle ne double pas la météo :

```css
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:street-overcast.webp");
}
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

### Ce qui reste au choix de l'utilisateur

- Un thème ne peut pas activer ou désactiver la météo ; c'est l'interrupteur de l'utilisateur qui décide.
- Réduire les animations et effets d'ambiance (ou le réglage de réduction des animations de l'appareil) supprime tout affichage météo.
- Effets graphiques réduits retire la teinte, les lueurs et le voile de coucher de soleil, et affiche 60% des particules.
- Intensité des illustrations du thème atténue la météo d'un thème comme son image de fond, et Contraste élevé la limite à 25% ou moins.
- Sur tous les appareils, la météo cesse d'être dessinée quand un panneau, un éditeur ou Professor Mari recouvre le chat.

Petal OS (météo en pixels et pétales personnalisés), NEON//GRID (pluie à traînées cyan) et Lantern Path (feuilles
peintes, fonds qui grisent par mauvais temps) sont des exemples complets : utilise **Cloner et modifier** sur l'un d'eux pour lire son CSS.

## Effets d'accent

Pulsation de l'accent et Mode RGB animent quelques touches d'accent dans la nouvelle disposition ("+ Nouveau", les boutons principaux,
la vignette d'avatar de l'assistant) avec un filtre CSS. Rien n'est réécrit à chaque image. Un thème peut :

- activer Pulsation de l'accent pour ses utilisateurs avec `:root { --marinara-theme-accent-pulse: enabled; }` ;
- ajouter ses propres éléments avec `animation: var(--mari-accent-fx-animation);`.

Les deux s'arrêtent avec `prefers-reduced-motion` et le réglage "Réduire les animations et effets d'ambiance" de l'application.

## Points d'ancrage

### Sur `<html>`

| Attribut | Valeurs |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `data-theme`                    | `dark`, `light` |
| `data-visual-theme`             | `default` (Marinara), `sillytavern` (Dottore), `stage` |
| `data-overhaul`                 | `on` (nouvelle disposition, ordinateur), `mobile` (nouvelle disposition, téléphone et tablette) ; absent dans l'ancienne disposition |
| `data-custom-theme`             | L'identifiant du thème actif |
| `data-seasonal-theme`           | L'apparence saisonnière, lorsqu'elle est activée |
| `data-mari-accent-fx`           | `pulse` ou `rgb` pendant un effet d'accent |
| `data-chat-id`                  | L'identifiant du chat ouvert |
| `data-chat-open-mode`           | Le mode du chat ouvert : `roleplay`, `conversation`, `game` |
| `data-chat-tags`                | Les tags du chat ouvert, en minuscules avec les espaces remplacées par `-` : personnalise une histoire avec `:root[data-chat-tags~="horror"]` |
| `data-mari-chat-art-behind`     | Présent quand le fond du chat est affiché derrière les panneaux latéraux (`--mari-chat-art` est l'image) |
| `data-marinara-reduced-effects` | Présent quand les animations ambiantes sont réduites |
| `data-mari-a11y-line-height`    | Présent quand l'utilisateur a augmenté l'interligne (`--mari-a11y-line-height`) |
| `data-mari-a11y-letter-spacing` | Présent quand l'utilisateur a augmenté l'espacement des lettres (`--mari-a11y-letter-spacing`) |
| `data-mari-a11y-focus`          | Présent quand les contours de focus renforcés sont activés |
| `data-mari-contrast`            | `more` quand le contraste élevé est activé (choix de l'utilisateur ou demande de l'appareil) |
| `data-mari-cvd-safe`            | Présent quand les couleurs adaptées au daltonisme sont activées |
| `data-mari-weather`             | La météo de l'histoire pendant son affichage : `rain`, `snow`, `fog`… (voir [Météo](#weather)) |
| `data-mari-sky`                 | `dawn`, `day`, `dusk` ou `night` pendant l'affichage de la météo de l'histoire |
| `data-mari-shelter`             | `indoors` ou `outdoors` pendant l'affichage de la météo de l'histoire, quand l'application peut le déterminer d'après le lieu |

### Zones

`[data-component="…"]` nomme les grandes zones : `AppShell`, `TopBar`, `ChatSidebar`, `ChatSidebarSlot`,
`RightPanelDesktop`, `RightPanelDesktopSlot`, `CenterContent`, `GlobalOmnibar`, `OverhaulLibraryNav`,
`OverhaulSettingsPage`, `OverhaulLibraryPage`, `OverhaulCardGallery`, `OverhaulEditorHead`,
`OverhaulEditorRail`.

### Parties

| Sélecteur | Description |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[data-mari-part="message"]`                                                           | Une ligne de message dans tous les modes de chat : toute la largeur du chat, contenant l'avatar, la ligne du nom et la bulle. Colore la bulle (`bubble` ci-dessous), pas cette ligne, sinon chaque bulle se retrouve dans un second encadré. Porte aussi `data-message-id` et `data-message-role` (`user`, `assistant`, `system`, …), ainsi que les données du message ci-dessous |
| `[data-mari-part="bubble"]`                                                            | La bulle du message elle-même, en Roleplay et en mode Conversation (`.mari-rp-bubble` / `.texting-bubble`). Le fond, la bordure, le rayon et l'ombre se définissent ici |
| `[data-mari-part="message"][data-latest]`                                              | La dernière réponse du personnage |
| `[data-mari-part="message"][data-streaming]`                                           | Une réponse en cours d'écriture |
| `[data-mari-part="avatar"]`, `[data-mari-part="header"]`, `[data-mari-part="actions"]` | Dans un message : l'avatar, la ligne du nom et les outils du message |
| `[data-mari-part="reasoning"]`, `[data-mari-part="reasoning-text"]`                    | L'interrupteur (ou l'encadré) du raisonnement et son texte, avec le même point d'ancrage sur ordinateur et sur téléphone |
| `[data-mari-part="composer"]`                                                          | La zone de message. `data-composer` vaut `roleplay`, `conversation` ou `game` |
| `[data-mari-part="home-art"]`                                                          | Les images d'origine des cartes de l'accueil |
| `[data-mari-part="message"][data-vn]`                                                  | La boîte de dialogue du visual novel : un message avec les mêmes données (personnage, rôle, index), plus les parties `avatar` et `header` à l'intérieur |
| `[data-mari-part="vn-sprite"]`                                                         | Une couche vide derrière la boîte de dialogue VN, qui atteint le bas de la scène. Elle porte `data-vn-speaker` (le nom du locuteur sous forme de slug, ou son rôle), `data-vn-speaker-role`, `data-character` et `data-character-id` pour le locuteur actuel, pour qu'un thème puisse y placer son image. `[data-roleplay-vn-media]` porte les mêmes attributs |
| `[data-mari-part="message"][data-game-narration]`                                      | La boîte de narration de Game Mode. `data-message-role` vaut `narrator`, ou `assistant` avec `data-character` et `data-character-name` pendant qu'un personnage parle ; `data-segment-type` et `data-expression` décrivent la ligne actuelle |
| `[data-mari-part="app-backdrop"]`, `[data-mari-part="ambient"]`                        | Les couches de fond et d'ambiance. Leur place dans la page est fixe ; personnalise-les avec les jetons |
| `[data-mari-part="home-widget"]`                                                       | Une carte de widget de l'accueil, Professor Mari comprise. Son cadre porte `data-home-widget-id` (`recent`, `professor`, `whats-new`, `character-library`, …). À l'intérieur : `home-widget-eyebrow`, `home-widget-title`, `home-widget-text` |
| `[data-mari-part="top-bar"]`                                                           | La barre supérieure sur tous les appareils. Le second côté de la vue partagée a sa propre barre fine avec les mêmes points d'ancrage (`[data-component="TopBar"]`, `.ov-tab`, `.ov-tab__label`, `.ov-icon-btn`), marquée `[data-split-bar]`, pour que les illustrations et polices de la barre supérieure s'y appliquent aussi |
| `[data-mari-part="page-title"]`                                                        | Le grand titre d'une page principale : chaque section de la Bibliothèque (Personnages, Lorebooks, Connexions, Agents…), les Réglages, les Extensions et la Documentation. Personnalise les titres avec ce point d'ancrage unique pour les harmoniser sur toutes les pages |
| `[data-mari-part="backdrop"]`                                                          | L'image de fond d'un chat (voir Images de fond) |
| `[data-mari-part="stage-empty"]`                                                       | Le plateau du jeu sans image de scène |
| `[data-mari-part="time"]`                                                              | L'heure d'un message dans tous les modes de chat |
| `[data-mari-part="chat-header"]`                                                       | L'en-tête Conversation (`data-chat-mode="conversation"`) |
| `[data-mari-part="game-hud"]`, `[data-mari-part="game-tools"]`                         | Le panneau flottant de carte et d'équipe de Game Mode et la rangée d'outils de narration |
| `[data-mari-part="avatar-placeholder"]`                                                | Le cercle d'avatar vide ; `data-role` vaut `user` ou `assistant` |
| `[data-mari-part="header"][data-placement]`                                            | Sur les messages Roleplay : `outside` (nom au-dessus de la bulle) ou `inside` |
| `[data-mari-part="home-widget-glow"]`                                                  | La lueur derrière l'en-tête d'un widget d'accueil |
| `[data-mari-part="dialogue"]`                                                          | Le discours entre guillemets dans un message |
| `[data-mari-part="paragraph-gap"]`                                                     | La ligne vide entre deux paragraphes (elle devient un bloc quand `--mari-paragraph-gap` est défini) |
| `[data-mari-part="vn-text"]`, `vn-counter`, `vn-nav`                                   | La zone de texte VN (`data-more-below` tant que le défilement continue), le compteur "3 / 9" et les boutons Précédent / Suivant (`data-direction`) |
| `[data-mari-part="card-art"]`                                                          | L'image d'une carte de la Bibliothèque ; `data-placeholder` quand elle n'en a pas |
| `[data-mari-part="page"]`                                                              | La surface sur laquelle repose chaque page complète : chaque page de la Bibliothèque (Personnages, Lorebooks, Presets, Scripts regex, Connexions, Agents, Outils personnalisés), chaque éditeur, les Réglages et la Documentation. Dessine un panneau ou une feuille ici, pas sur la classe propre à une page, pour donner à chaque page la même surface lisible. Les chats et l'accueil ne sont pas à l'intérieur |
| `[data-mari-part="chat-row-art"]`                                                      | L'image du chat ouvert derrière sa ligne dans la barre latérale |
| `[data-mari-part="avatar-placeholder"]`                                                | Désormais partout où un avatar vide apparaît : lignes Conversation, lignes de chat (initiales), sélecteur de persona, zone de message et Game Mode |
| `.ov-lrow__dot[data-status]`                                                           | Un point d'entrée de lorebook : `constant`, `selective` ou `normal` |
| `[data-chat-row]`                                                                      | Une ligne dans la barre latérale des chats ; `data-selected="true"` sur le chat ouvert |
| `[data-chat-mode]`                                                                     | La surface du chat, par mode |
| `.mari-messages-scroll`                                                                | La liste défilante des messages |
| `.mari-rp-bubble`, `.mari-rp-bubble--user`, `.mari-message-assistant`                  | Les bulles Roleplay et Conversation |
| `.mari-window`, `.mari-drawer`                                                         | Les fenêtres détachables et les panneaux coulissants |

### Emplacements

Ils apparaissent uniquement quand le thème actif les demande, pour que la page d'origine ne contienne aucune partie supplémentaire.

- **Cadre de focus.** `--mari-focus-frame` accepte une valeur `border-image` complète, par exemple
  `url("theme:frame.png") 24 fill / 24px / 6px stretch`, et la dessine sur ce qui retient
  l'attention du lecteur : la dernière réponse, Ctrl+K, une boîte de dialogue ouverte et les chats récents de l'accueil. Ajoute
  `data-mari-focus-surface` à tout autre élément (dans un modèle de message) pour l'encadrer aussi.
  Depuis la v1.5, le cadre ne dépasse de sa surface qu'avec `--mari-focus-frame-outset` (au plus
  2rem), et pas du tout quand la valeur contient `fill`, pour ne pas recouvrir le chat ; un débordement écrit
  dans `--mari-focus-frame` est ignoré. Le cadre est un `border-image` : une propriété raccourcie `border` placée plus loin dans
  ton CSS sur le même élément le réinitialise, donc utilise plutôt `border-color`, `border-width` et `border-style`
  à cet endroit.
- **Titres de fenêtre.** Définir `--mari-window-title` (n'importe quelle valeur, comme `on`) ajoute une ligne de titre en
  haut de chaque message, widget d'accueil et zone de message : `[data-mari-part="window-title"]` avec
  `data-window` (`message`, `home-widget`, `composer`, et depuis la v1.5 `narration`, `omnibar`,
  `window` et `dialog`), contenant `window-title-text` (le locuteur,
  le titre du widget ou "Message") et un `window-buttons` vide pour tes décorations `_ [] X`.
- **Aperçus des lignes de chat.** Définir `--mari-chat-row-preview` (n'importe quelle valeur, comme `on`) ajoute la dernière
  ligne de chaque chat sous son nom dans la liste Chats : `[data-mari-part="chat-row-preview"]` avec
  `data-role` (`user`, `assistant`, `narrator`…), commençant par `[data-mari-part="chat-row-preview-who"]`
  ("Toi :" pour tes propres lignes, ou le nom du locuteur dans un chat de groupe). Elle s'efface devant la ligne d'état
  en direct ("écrit…", "Brouillon non envoyé"), pour qu'une ligne de chat n'en affiche jamais deux. Sans ce jeton, elle n'est ni récupérée
  ni dessinée.
- **Ambiance derrière les cartes.** `--mari-ambient-placement: behind-cards` déplace la couche ambiante sous
  les messages, les widgets d'accueil et les panneaux (toujours au-dessus de l'image de fond), plutôt qu'au-dessus du chat.
  `--mari-ambient-mask` (une valeur `mask` complète) définit la zone où elle apparaît, et
  `--mari-ambient-mask: var(--mari-gutter-mask)` dégage le milieu de la fenêtre pour que la pluie tombe
  dans les marges latérales, pas sur le texte. `--mari-gutter-clear` définit la demi-largeur dégagée (26rem).

### Données des messages

Chaque message indique son auteur, son numéro et le temps qu'il a pris, sous forme d'attributs pour les sélecteurs
et `attr()`, et de variables CSS pour `content:` et `counter()` :

| Attribut | Variable | Valeur |
| --------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `data-character-id`   |                    | L'identifiant du personnage (absent sur tes propres messages) |
| `data-character-name` | `--mari-msg-char`  | Le nom affiché (`--mari-msg-char` est une chaîne entre guillemets) |
| `data-character`      |                    | Le nom en minuscules, avec les espaces remplacées par `-`, pour les sélecteurs : `[data-character="captain-faye"]` |
| `data-message-index`  | `--mari-msg-index` | Le numéro du message affiché par "Afficher les numéros de message" |
| `data-gen-ms`         | `--mari-msg-gen`   | Le temps de génération en ms (`--mari-msg-gen` est une chaîne comme `"3.2s"`) |

```css
[data-mari-part="message"] [data-mari-part="header"]::after {
  counter-reset: msg var(--mari-msg-index);
  content: "#" counter(msg) " · " var(--mari-msg-gen, "");
}
```

### Modèle de message (HTML)

Quand le CSS ne suffit pas, par exemple pour un encadré d'état contenant le nom du locuteur et le numéro du message, un
fichier de thème peut contenir un petit modèle HTML par rôle. Il est rempli pour chaque message et affiché
dans un encadré à la fin du message, `[data-mari-part="message-extra"]`, dont ton CSS définit le style et
la position :

```json
"templates": {
  "assistant": "<div class=\"status\"><b>{{char}}</b> · entry #{{index}} · {{gen}}</div>",
  "user": "<div class=\"status\">> {{char}} @ {{time}}</div>"
}
```

Clés : `message` (tous les rôles), `assistant`, `user`, `narrator` (le modèle propre au rôle prime sur
`message`). Champs : `{{char}}`, `{{role}}`, `{{index}}`, `{{gen}}`, `{{time}}`, `{{date}}` ; les champs inconnus
restent vides. Chaque modèle fait au plus 4 000 caractères. Marinara conserve les balises de texte et de mise en page
(`div`, `span`, `p`, `b`, `i`, `ul`, `table`, `details`, `progress`, …) avec les attributs `class`, `title`,
`role` et `data-*`, et retire les scripts, les styles, les `style` intégrés, les liens, les images, les formulaires et
les attributs d'événement. Un modèle dont le texte demande des clés ou des mots de passe est écarté.

Le HTML nécessite l'accord de l'utilisateur : un thème avec un modèle ne peut être installé que si **Réglages →
Apparence → Thèmes CSS → Autoriser les thèmes avec HTML** est activé (désactivé par défaut). L'aperçu d'import le
signale, et quand l'interrupteur est désactivé, un thème installé s'affiche sans son HTML.

## Apparence propre à chaque chat

Réglages du chat > Thème donne à un chat son propre thème ("Apparence par défaut" désactive les thèmes personnalisés pour
ce chat). Dans un chat avec exactement un personnage, ce choix peut devenir la valeur par défaut du personnage
pour ses autres chats en tête-à-tête ; les chats de groupe et les équipes de Game Mode ne reprennent jamais le choix par défaut d'un membre.
La section Thème indique d'où vient l'apparence actuelle : le chat, le personnage ou l'application.
Les Réglages, la Bibliothèque, les éditeurs et la Documentation utilisent toujours le thème de l'application, et `data-chat-id` et
`data-chat-tags` ne sont sur `<html>` que lorsque le chat lui-même est affiché.

Les tags sont le moyen portable de personnaliser certaines histoires au sein d'un même thème :
`:root[data-chat-tags~="noir"] { --primary: #c9a227; }`. Ajoute des tags dans Réglages du chat > Nom du chat
("+ Ajouter un tag"), depuis le bouton de tags d'une ligne de chat (ou "Tags" dans le menu d'appui long sur écran tactile).
Les tags sont en minuscules, avec les espaces remplacées par `-` dans l'attribut : "Noir Mystery" correspond donc à `noir-mystery`.

Définir n'importe quelle variable `--mari-chat-*` (par exemple `--mari-chat-bg`, `--mari-chat-text`,
`--mari-chat-radius`, `--mari-chat-font-family`) active automatiquement le style correspondant de la surface
du chat ; l'utilisateur n'a pas besoin des interrupteurs "Appliquer … du preset" pour voir les couleurs de chat du thème.

## Jour et nuit

Réglages > Apparence > Jeu de couleurs peut suivre le système ou l'heure de la journée (Clair à partir de 07:00,
Sombre à partir de 19:00 par défaut, les deux étant réglables). Dans les deux cas, seul `data-theme` sur `<html>` change,
donc un thème obtient une apparence de jour et de nuit en personnalisant les deux :

```css
:root[data-theme="light"] {
  --mari-app-backdrop: url("theme:day.webp");
}
:root[data-theme="dark"] {
  --mari-app-backdrop: url("theme:night.webp");
}
```

La palette est déterminée sur chaque appareil selon sa propre horloge (elle n'est pas synchronisée), donc un téléphone et un PC
situés à des endroits différents affichent chacun la bonne apparence. Un fichier de thème peut suggérer le changement lui-même :
`"settings": { "colorScheme": "time", "dayStart": "07:00", "nightStart": "19:00" }` (ou
`"system"`). L'aperçu d'import le propose comme tout autre réglage.

## Fichiers de thème

L'export enregistre un thème dans un seul fichier JSON :

```json
{
  "kind": "marinara.theme",
  "formatVersion": 2,
  "name": "Forest Glass",
  "author": "You",
  "version": "1.2",
  "description": "Deep greens with frosted panels.",
  "colorScheme": "dark",
  "thumbnail": "data:image/webp;base64,…",
  "settings": { "colorScheme": "dark", "visualStyle": "stage", "accent": "#3fae7a", "fontFamily": "Georgia" },
  "fonts": [{ "family": "My Display", "src": "data:font/woff2;base64,…" }],
  "images": [{ "name": "frame.webp", "src": "data:image/webp;base64,…" }],
  "backgrounds": [{ "name": "forest.webp", "src": "data:image/webp;base64,…" }],
  "css": ":root { --primary: #3fae7a; }"
}
```

Les crédits (v1.5) vont dans le même fichier et s'affichent dans la liste des thèmes (le bouton (i)) et l'aperçu
d'import :

```json
{
  "license": "CC BY 4.0",
  "labels": ["High legibility", "No motion"],
  "credits": [{ "what": "Backdrops", "by": "Jane Doe", "license": "CC BY 4.0", "url": "https://example.com" }],
  "fonts": [{ "family": "My Display", "src": "…", "license": "OFL-1.1", "credit": "Fraunces by Undercase Type" }]
}
```

`labels` contient jusqu'à quatre tags courts (40 caractères chacun) affichés sous le nom du thème. Une police ou
un crédit sous licence `OFL-1.1` renvoie au texte de la SIL Open Font License fourni avec l'application. Les images de plus
de 1 920 px de large (ou 2 560 px sur le côté le plus long) sont réduites à l'import du thème.

Seuls `kind`, `name` et `css` sont obligatoires. `templates` est décrit dans Modèle de message. Clés de `settings` : `colorScheme` (`dark`, `light`, `time` ou `system`), `dayStart`, `nightStart`, `visualStyle`, `accent`,
`accentLight`, `background`, `backgroundLight`, `fontFamily`, `accentPulse`, `fontSize` (Taille
d'affichage en px : 12, 14, 16, 17, 19, 22, 26, 30 ou 34) et `reduceMotion` (true ou false). L'import affiche d'abord un
aperçu avec les réglages suggérés cochés, sauf Style visuel, Pulsation de l'accent, Taille d'affichage et
Réduire les animations, que l'utilisateur coche s'il les veut ; il choisit aussi d'ajouter ou non les
arrière-plans à sa galerie. Les images de moins de 4 Kio restent intégrées au CSS et apparaissent dans une seule pastille "petites icônes".
Les polices se chargent avec le thème (sous forme de règles `@font-face`) et disparaissent avec lui. Importer un thème portant le même
nom qu'un thème installé propose de le mettre à jour, et une mise à jour n'ajoute pas deux fois le même arrière-plan à la
galerie. La limite CSS est de 256 Kio de texte CSS ; les images, la miniature, les polices et les arrière-plans
disposent ensemble de 6 Mio. Une image qui dépasse la limite est écartée individuellement, avec sa taille indiquée, et le reste
du thème s'installe quand même. Les fichiers `.css` simples, `{ "name", "css" }` et l'ancien
export `marinara.theme-folder` s'importent toujours.

## Garder un thème rapide

Sur les téléphones et les tablettes, surtout les iPad avec Safari, un CSS lent se ressent à chaque appui. La plupart des thèmes fonctionnent bien ;
voici les pratiques qui ont ralenti des thèmes pendant les tests :

- **`:has()` sur un parent qui définit ensuite le style de ses enfants**, comme `.panel:has(> .row) > *` ou
  `body:has(.open) .chat *`. Le navigateur revérifie alors toute la page à chaque lettre saisie et
  à chaque mot affiché au fil de l'écriture. Place `:has()` sur l'élément que tu personnalises (`.row:has(> img)`), ou utilise
  plutôt un point d'ancrage `data-mari-part`.
- **`backdrop-filter` sur beaucoup d'éléments à la fois**, comme chaque message ou chaque ligne de chat. Un ou deux
  panneaux dépolis conviennent ; un flou sur chacune de cent lignes, non. Utilise plutôt une couleur transparente.
- **Animer la disposition** (`width`, `height`, `top`, `margin`) ou de grandes ombres `box-shadow`. Anime `opacity`
  et `transform`, ou `background-position` sur la couche ambiante.

**Réglages → Avancé → Dépannage → Afficher les temps de réponse aux appuis** indique combien de temps prend chaque appui sur cet
appareil, avec et sans ton thème. Compare les deux pour repérer une règle lente.

## Accessibilité

Réglages > Apparence > Accessibilité applique les choix de l'utilisateur pour l'interligne, l'espacement des lettres, les contours de focus,
le contraste élevé, les couleurs adaptées au daltonisme et un minimum de 12 px pour le texte des messages. Les valeurs sont
écrites dans la couche `mari-protected` sous forme de valeurs littérales sur chaque élément (lib/accessibility-css.ts), donc
un thème ne peut pas les annuler, même en redéfinissant des variables. Tant qu'une option est désactivée, un thème peut définir :

| Jeton | Utilisation |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| `--mari-focus-ring-color`                              | Le contour de focus normal de l'application (`--primary` par défaut) |
| `--mari-cvd-good`, `--mari-cvd-warn`, `--mari-cvd-bad` | Les couleurs d'état et de jauge quand tu veux ta propre paire bleu/orange |

Avec des illustrations, trois autres choix priment sur un thème :

- **Intensité des illustrations du thème** (0-100%) atténue l'image de fond et la superposition ambiante.
- **Contraste élevé** rend aussi les surfaces opaques dans les couleurs propres à la palette (`--background`, `--card`,
  `--popover`, `--sidebar`, `--secondary`, `--muted`, `--mari-rp-bubble-bg`, le voile de page, la teinte de
  l'accueil, ses widgets et la plaque de la barre supérieure) et limite les illustrations du thème à 25% ou moins, pour que le texte ne repose jamais sur
  une image pastel. Les couleurs qu'un thème écrit sous forme de valeurs littérales sur ses propres sélecteurs ne changent pas, donc
  privilégie les jetons.
- **Réduire les animations** affiche les images animées sous forme de leur première image et arrête la superposition ambiante.
  Les couleurs forcées (Contraste élevé de Windows) masquent les illustrations et les cadres `border-image`.

Utilise les jetons d'état et de jauge ci-dessus plutôt que des verts et rouges fixes, et l'interrupteur de couleurs adaptées au daltonisme
s'appliquera aussi à ton thème. Les liens d'accès rapide (`.mari-skip-link`) restent accessibles quoi que fasse un thème.
L'aperçu d'import indique à l'utilisateur quand un thème tente de modifier l'un de ces éléments.

## Sécurité

- La barre supérieure (y compris son état de masquage automatique en plein écran), la barre latérale des chats et ses lignes, la
  barre latérale de la Bibliothèque, Ctrl+K et la zone de message peuvent être restylisés, mais pas masqués, déplacés, recouverts, estompés,
  rendus invisibles par un filtre ou impossibles à cliquer. Le mécanisme de protection les mesure avec et sans le thème après son
  chargement, à 2,5 s et 10 s, à l'ouverture d'un chat ou d'un panneau, au changement de palette de
  couleurs, au redimensionnement et au début ou à la fin d'une animation propre au thème, et désactive le
  thème dans cet onglet quand il perturbe l'un de ces éléments.
- Les images comptent (protection v3). Tout ce qui est dessiné sur un onglet, une icône, une ligne de chat ou la zone de
  message est détecté au centre du contrôle, avec ou sans `pointer-events: none` et quelle que soit sa taille ; une couche
  qui le masque (une couleur, un dégradé ou une image dont les pixels à cet endroit sont majoritairement opaques) est considérée comme
  un recouvrement. C'est aussi le cas d'un débordement `border-image` qui empiète sur un contrôle et d'un `mask` d'image appliqué dessus.
  Dans la barre supérieure, chaque `::before` et `::after` est placé sous les libellés et les icônes, et
  les masques, `list-style-image` et `border-image-outset` ne s'appliquent pas. L'image de fond et la superposition
  ambiante ne comptent jamais : elles sont placées sous les barres par construction.
- Protection v4 (itération 4). Le contrôle de contraste lit les couches derrière le texte dans l'ordre de dessin (un remplissage `border-image`,
  puis chaque couche de fond depuis le dessus, puis la couleur), pondère chacune selon la portion de
  texte qu'elle recouvre réellement (taille, position et répétition), et échantillonne une image uniquement sous le texte.
  Une ligne fine ou un petit ornement de coin ne compte plus, et un voile sombre sur une page claire est
  considéré comme sombre. La barre supérieure et la zone de message sont vérifiées plus strictement : leur texte doit conserver
  un contraste de 3:1 à l'endroit le moins contrasté s'il l'avait auparavant. Une image sur le `::before` ou
  le `::after` d'un contrôle qui recouvre ce contrôle est considérée comme un recouvrement dans la barre supérieure, les lignes de chat et la
  zone de message. Une image en `position: fixed` sur un pseudo-élément déclenche un avertissement dans l'éditeur ; utilise
  plutôt `position: absolute`, `--mari-ambient` ou `--mari-app-backdrop`. Quand une illustration de barre supérieure est
  trouvée sur un pseudo-élément, les onglets et les icônes reçoivent leurs plaques comme avec `--mari-top-bar-bg`.
- Contraste sur les illustrations : quand une image se trouve derrière du texte, la protection lit ses couleurs au lieu
  de sauter la vérification.
- Texte du chat (v1.5) : la protection échantillonne les dernières lignes visibles du chat et désactive le thème
  s'il en recouvre la moitié (recouvrement par un pseudo-élément, ambiance opaque derrière les cartes ou
  cadre de focus dont le débordement empiète sur le texte). Une ligne que la disposition du thème déplace hors de l'écran
  ne compte pas, pas plus qu'une ligne de nom que le thème épingle au-dessus de la réponse.
- Le texte qu'un thème ajoute avec `content:` est affiché dans l'aperçu d'import.
- Règles sur le texte des thèmes (audit de sécurité, novembre 2026). Chaque chaîne qu'un thème peut afficher est vérifiée avant
  l'application du thème, quelle que soit sa provenance (fichier, éditeur, Professor Mari, sauvegarde, choix propre à un chat) :
  les chaînes de `content:` et `quotes`, les propriétés personnalisées (donc `content: var(--x)` compte),
  les symboles `@counter-style`, l'espace réservé de la zone de message, les modèles de message (mots et `title`) et
  le texte des images SVG. Le texte qui demande des clés, des mots de passe, des identifiants ou des détails de compte,
  se fait passer pour l'application ("piraté", "RCE", "alerte de sécurité", "vérifié par Marinara", "appeler
  l'assistance"), contient un numéro de téléphone ou une adresse web, ou dépasse 80 lettres et chiffres dans une seule
  déclaration est refusé : le thème ne peut pas être installé, et un thème installé n'est pas appliqué. Les lettres
  ressemblantes, les accents, les caractères sans largeur, les espacements et l'écriture 1337 sont d'abord normalisés. Les chaînes dans les
  sélecteurs, `font-family` et les noms de zones de grille ne comptent pas. Le nom, l'auteur, la description
  et les crédits du thème ne peuvent pas non plus demander de secrets ni prétendre être officiels (les adresses web y sont acceptées).
- URL : en plus du nettoyage du texte (liste d'autorisation pour url(), pas de `@import`, polices data: uniquement), la
  feuille de style est analysée par le navigateur avant d'être appliquée, et toute adresse autre que les images propres
  au thème, les images et polices data: intégrées, `#fragments` et `about:invalid` entraîne le refus du
  thème. `src()` suit les règles de url(), et un `image-set(` laissé ouvert à la fin est écarté.
- Les couleurs suggérées dans un fichier de thème (`settings.accent`, `background` et leurs équivalents clairs) doivent être
  des couleurs simples ou des dégradés : pas de `url()`, de `image-set()` ni de quoi que ce soit qui sorte de la valeur.
- Les images SVG sont reconstruites à partir d'une liste d'autorisation avant utilisation : pas de `<script>`, de `<foreignObject>`, de `<a>`,
  d'attributs d'événement, de liens externes, de `<?xml-stylesheet?>` ni d'entités DOCTYPE, et leur CSS est
  nettoyé comme celui d'un thème. Les images matricielles qui dépasseraient 8 192 px de côté ou 40 mégapixels après décodage
  sont refusées.
- Les jetons météo sont lus selon une liste d'autorisation : noms de jetons connus, nombres limités à leur plage,
  mots issus de listes fixes et couleurs simples (pas de `url()`, de dégradés ni de fonctions autres que celles des couleurs).
  Les images météo doivent appartenir au thème (les adresses de même origine créées par l'application pour
  elles, après reconstruction du SVG et limitation de taille) ; toute autre adresse est ignorée. Rien de ce qu'écrit un thème
  n'est exécuté, et le flash d'éclair conserve l'intensité et le rythme de l'application.
- Les modèles de message ne peuvent pas utiliser de rôles créant une boîte de dialogue, un menu ou une annonce, ni les attributs
  `data-` propres à l'application ou ses noms de classes `mari-`/`ov-`.
- L'essai d'un thème ("Garder ce thème ?") se fait uniquement dans cet onglet : les autres appareils ne le reçoivent qu'après
  Garder le thème. Sans réponse, l'ancienne apparence est rétablie ; survoler la barre ou lui donner le focus suspend le compte à rebours. Appuyer trois fois sur Échap
  désactive les thèmes personnalisés dans l'onglet ; un appui sur Échap qui ferme Ctrl+K, un menu ou une boîte de dialogue de
  l'application ne compte pas.

## Modifications

- **Mini images sur téléphone, animations plus discrètes** (du 12 au 14/11/2026, contrat toujours en version 1) :
  `--mari-mini-avatar-size`, `--mari-mini-avatar-ring` et `--mari-phone-convo-avatar` pour la
  petite image près du nom sur téléphone ; `--mari-chat-row-preview` ajoute la dernière ligne de chaque chat dans la
  liste Chats ; une transition peut attendre au plus une seconde ; la couche ambiante et les animations infinies
  restent immobiles quand personne ne peut les voir ; [Garder un thème rapide](#keeping-a-theme-fast).

- **Texte d'accent lisible et point d'ancrage de barre partagée** (11/11/2026, contrat toujours en version 1) :
  l'accent utilisé pour les petits textes s'assombrit légèrement en mode Clair et s'éclaircit en mode Sombre pour rendre les libellés lisibles,
  tandis que les boutons conservent l'accent complet ; `--mari-accent-text` permet de définir toi-même cette couleur de texte.
  `[data-mari-part="top-bar"]` est la barre supérieure sur chaque appareil, et le second côté de la vue partagée possède
  sa propre barre avec les mêmes points d'ancrage `[data-component="TopBar"]` (plus `[data-split-bar]`), pour que les
  illustrations, polices et couleurs d'onglets de la barre supérieure du thème s'y appliquent. `--mari-game-combat-bg` et `-bg-hover` sont des valeurs
  `background` complètes, donc les dégradés fonctionnent.

- **Point d'ancrage de surface de page** (10/11/2026, contrat toujours en version 1) : `[data-mari-part="page"]`
  est la surface unique sur laquelle reposent chaque page de la Bibliothèque, les éditeurs, les Réglages et la Documentation, pour qu'un thème puisse leur
  donner à tous le même panneau.

- **Galerie de thèmes et éclairs** (09/11/2026, contrat toujours en version 1) : les thèmes de départ
  se téléchargent à la demande depuis la galerie de thèmes ; `--mari-weather-lightning-bolt` (`on`, `none` ou une largeur
  de 0,5 à 3) dessine un éclair ramifié sur un côté de l'écran à chaque flash d'orage.

- **Météo du thème** (novembre 2026, contrat toujours en version 1) : jetons `--mari-weather-*` (style
  pixel, couleurs, images, taille, vitesse, quantité, intensité, teinte, désactivation du soleil et de la lune),
  `data-mari-weather` et `data-mari-sky` sur `<html>`, et mise en pause de la météo sous les panneaux qui la recouvrent.
  Petal OS, NEON//GRID et Lantern Path les utilisent.

- **Itération 6 et audit de sécurité** (novembre 2026, aucun nouveau jeton, contrat toujours en version 1) : les
  thèmes de départ sont en lecture seule, et **Cloner et modifier** crée une copie modifiable (depuis le 9 novembre, ils
  se téléchargent à la demande depuis la galerie de thèmes au lieu d'être fournis avec l'installation) ; les crédits,
  la licence et les étiquettes apparaissent dans l'aperçu d'import et derrière le bouton (i) ; l'essai d'un thème se fait
  uniquement dans cet onglet jusqu'à **Garder le thème** ; les règles sur le texte des thèmes, la vérification des URL, la reconstruction des SVG et la vérification
  des couleurs suggérées sont décrites dans [Sécurité](#safety).

- **v1.5** (itération 5 des thèmes, longues réponses) : `--mari-chat-column`, `--mari-message-measure`,
  `--mari-chat-line-height`, `--mari-dialogue-weight`, `--mari-paragraph-gap`, locuteur épinglé,
  `--mari-phone-avatar`, parties et fondu de la zone de texte VN, `--mari-message-actions`,
  `--mari-swipe-counter`, `--mari-card-art-placeholder`, `--mari-chat-row-art-opacity`,
  `--mari-focus-frame-outset`, `--mari-scrim` et `--mari-center-x` ; parties dialogue, paragraph-gap,
  card-art et chat-row-art et espaces réservés d'avatar partout ; titres de fenêtre sur la narration,
  Ctrl+K, les fenêtres et les boîtes de dialogue ; l'accent de l'interface atteint les éléments dont le style dépend de la racine ; la protection vérifie le texte du chat ;
  crédits, licence et étiquettes du thème, avec le texte de l'OFL fourni ; les grandes images sont réduites à l'import.

- **v1.4** (itération 4 des thèmes) : protection v4 (fonds superposés, zone dessinée, contrôle strict de la barre supérieure et de la
  zone de message, recouvrements par pseudo-éléments) ; `fontSize` et `reduceMotion` dans les fichiers de thème et
  réglages suggérés cochés dans l'aperçu d'import ; jetons pour les heures des messages, la teinte Roleplay, l'accent
  de l'interface et le texte atténué, les couleurs de la Bibliothèque et de Ctrl+K, Combat, les notifications temporaires, les points de lorebook, les raccourcis de l'accueil,
  une taille de texte minimale et l'avatar de l'utilisateur ; `--mari-top-bar-height` et `--mari-top-bar-plate-active` ;
  parties time, chat-header, game-hud, game-tools, avatar-placeholder et home-widget-glow ; emplacements pour le cadre
  de focus, le titre de fenêtre, l'ambiance derrière les cartes et le masque des marges latérales.

- **v1.3** (itération 3 des thèmes, images) : `images` dans le fichier de thème et `url("theme:name")` ; la
  limite CSS ne compte que le texte CSS ; WebP à l'import ; image de fond sur sa propre couche ; `--mari-page-veil`
  conservé sur une image de fond ; propriétés raccourcies `!important` avec `var()` conservées ; superposition ambiante ; icônes
  et curseur sous forme d'images ; `--mari-home-wash`, `--mari-home-art` et davantage de jetons pour les widgets de l'accueil ; points d'ancrage du dialogue VN, de l'emplacement
  de sprite VN et de la narration de Game Mode ; les fichiers de thème peuvent suggérer Suivre l'heure de la journée ; protection v3.

- **v1.2** : emplacement de modèle de message (`templates` dans le fichier de thème, `[data-mari-part="message-extra"]`),
  accord de l'utilisateur avec "Autoriser les thèmes avec HTML".

- **v1.1** : points d'ancrage de message dans tous les modes de chat avec personnage, index et temps de génération ; parties avatar,
  header, actions et reasoning ; `--mari-composer-placeholder` ; image de fond v2 (taille, position,
  répétition, rendu pixelisé, couches) visible aussi derrière les chats ; `--mari-page-veil` ; `--mari-top-bar-bg` ;
  `--mari-text-outline`, `--mari-dialogue-color`, `--mari-chat-font-size`, `--mari-msg-head-rule` ;
  jetons des widgets d'accueil, avec Professor Mari comme `home-widget`. `--mari-stage-empty-bg` est désormais un
  `background` (les dégradés fonctionnent).
- **v1.0.1** : protection v2, valeurs d'Accessibilité protégées, vérification du texte ajouté. L'installation est tout ou rien,
  les arrière-plans intégrés s'installent, Retour rétablit aussi les réglages appliqués par un thème, les polices du thème apparaissent
  dans la liste Police, les références `url(#id)` sont conservées, et les noms des polices intégrées sont lus depuis la police.
- **v1** (premier contrat publié) : jetons de thème, points d'ancrage des parties, image de fond et effets d'accent ci-dessus.
