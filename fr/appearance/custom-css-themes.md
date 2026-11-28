# Thèmes CSS personnalisés

Un thème change toute l'apparence de Marinara : les couleurs, les polices, les images et la forme des panneaux. Marinara propose une galerie de thèmes de départ prêts à l'emploi que tu peux télécharger. Tu peux aussi importer un thème partagé par quelqu'un ou créer le tien.

Pour un changement rapide sans aucun thème, voir les [Réglages d'apparence](appearance-settings.md) ou les [Styles de fenêtres de chat prêts à utiliser](#ready-made-chat-window-styles). Pour créer ton propre thème, le [Guide de création de thèmes](theme-author-guide.md) t'accompagne pas à pas.

## Ce qu'est un thème personnalisé

Un thème est un bloc de CSS, le code que les pages web utilisent pour les couleurs, les polices et les espacements, accompagné des images et des polices qu'il fournit. Les thèmes sont enregistrés sur ton serveur Marinara : un thème que tu installes apparaît donc sur tous les appareils qui s'y connectent. Un seul thème peut être actif à la fois, et tu peux en garder autant que tu veux.

## Où trouver les thèmes

Ouvre **Library → Settings → Appearance** (Bibliothèque → Réglages → Apparence) et clique sur **CSS Themes** (thèmes CSS) dans la rangée de sections. Dans la disposition classique, le chemin est **Settings → Addons → Theme Library** (Réglages → Extensions → Bibliothèque de thèmes).

La section contient :

- Les boutons **Create Theme** (créer un thème) et **Import File** (importer un fichier) en haut.
- L'interrupteur **Allow themes with HTML (I accept the risk)** (autoriser les thèmes avec du HTML, j'accepte le risque), désactivé par défaut. Voir [Thèmes avec du HTML](#themes-with-html).
- La liste **Installed Themes** (thèmes installés) : **Default Theme** (thème par défaut), puis tes propres thèmes, puis les thèmes de départ que tu as téléchargés.
- L'option **Browse the theme gallery** (parcourir la galerie de thèmes) : les thèmes de départ que tu peux télécharger.

## Thèmes de départ

Les thèmes de départ ne font pas partie de l'installation et ne prennent donc aucune place avant que tu en choisisses un. Ils se trouvent dans la galerie de thèmes, et Marinara ne télécharge un thème que lorsque tu le sélectionnes.

1. Clique sur **Browse the theme gallery** sous **Installed Themes**. Marinara a besoin d'une connexion à Internet pour cette opération.
2. Chaque thème affiche un aperçu, une courte description, sa taille et ses tags.
3. Clique sur **Download** (télécharger) à côté de ceux qui te plaisent. Ils apparaissent sous **Starter themes** (thèmes de départ) dans **Installed Themes**, prêts à être activés.

| Thème | Apparence |
| --- | --- |
| **Apogee Lounge** | Le salon d'observation d'un paquebot spatial des années 1970, avec une géante gazeuse par la fenêtre et des messages sur des panneaux moulés. |
| **Crepuscular** | Un almanach de la mer nocturne : des silhouettes encapuchonnées veillent sur une falaise sous une lune attentive (elles mangent des pancakes), avec les messages le long d'une seule colonne de registre réglée. |
| **Dewglass** | Du verre brillant des années 2000 : les messages sont des gouttes de gel sur un lagon ensoleillé ou une nuit d'aurore. |
| **Granite Watch** | Un poste de commandement de la guerre froide sous la montagne : les réponses s'impriment sur du papier de téléimprimeur et les widgets sont accrochés à des planchettes. |
| **Gutterlight** | Une ville gothique sous la pluie, dessinée comme une bande dessinée policière, avec des cases encrées et des cartouches de texte. |
| **Lantern Meadow** | Calme et très lisible, sans animation. |
| **Lantern Path** | Une colonne de lecture avec des animations douces. |
| **Maple's Bramble Cottage** | Un chalet douillet, avec une colonne de lecture pour les longues réponses. |
| **MARI to the Moon** | Un terminal de trading : chaque réponse est un ticket d'ordre, la barre du haut fait défiler un bandeau boursier et la liste des chats est une liste de surveillance. |
| **NEON//GRID** | Du cyberpunk néon, conçu pour les longues réponses. |
| **Petal OS** | Un bureau rétro ludique avec des polices pixelisées. |
| **Quiet Iris** | Une intelligence de vaisseau sereine : des instruments en graphite mat, un seul objectif rouge ambré, et chaque chat amarré le long d'une seule colonne lumineuse. |
| **Rosalind's Folio** | Une mise en page de livre de contes avec des touches de visual novel. |
| **Sanguine Keep** | Un château gothique au clair de lune : velours cramoisi et dorures la nuit, marbre pâle le jour, avec des portraits dans des fenêtres en lancette et des messages sur des panneaux de reliquaire. |
| **Swiss Poster** | Un design d'affiche sobre et épuré, sans animation. |
| **Under Sail** | Le pont d'un voilier en mer : chaque message est une voile de toile suspendue à une vergue en bois. |
| **Velvet Casket** | Goth pastel le jour et goth traditionnel la nuit, avec des messages en forme de cercueil. |

Chaque thème de départ propose une version Dark et une version Light. Les petits tags sous chaque nom, comme **No motion** (sans animation) ou **High legibility** (lisibilité élevée), t'indiquent à quoi t'attendre.

Quand la galerie propose une version plus récente d'un thème téléchargé, celui-ci affiche **Update** (mettre à jour) dans la liste de la galerie. Clique dessus pour obtenir la nouvelle version.

Les thèmes de départ téléchargés sont en lecture seule, afin de toujours rester tels qu'ils ont été conçus. Chacun possède quatre boutons :

- **(i) Credits and licences** (crédits et licences) : les auteurs des illustrations et des polices, ainsi que les conditions de leur réutilisation.
- **Clone + Edit** (cloner et modifier), l'icône de copie : crée ta propre copie, par exemple "Petal OS (my copy)", et l'ouvre dans l'éditeur.
- **Export** (exporter), l'icône de téléversement : enregistre le thème dans un fichier.
- **Remove** (supprimer), l'icône de corbeille : retire le thème de cette installation. Tu peux le retélécharger depuis la galerie à tout moment.

Tu peux aussi obtenir les fichiers de thèmes sans passer par l'application : ils se trouvent dans le dossier `themes` de la galerie de thèmes sur GitHub ([branche kolacheee-themes](https://github.com/kolacheee/Marinara-Engine-kolacheee/tree/kolacheee-themes/themes)). Télécharge un fichier `.json` depuis cette page et utilise **Import File**.

## Activer un thème

1. Clique sur le nom d'un thème dans **Installed Themes**. Le thème s'active dans cet onglet du navigateur.
2. Une barre affiche **Keep this theme?** (garder ce thème ?) et lance un compte à rebours de 15 secondes. Pointer la barre interrompt le compte à rebours.
3. Clique sur **Keep theme** (garder le thème) pour le conserver. Il apparaît maintenant aussi sur tes autres appareils. Clique sur **Go back** (revenir), ou laisse le compte à rebours se terminer, pour retrouver ton apparence précédente.

Clique sur **Default Theme** pour désactiver les thèmes personnalisés. **Reset Appearance** (réinitialiser l'apparence), en haut de **Settings → Appearance → Theme** (Réglages → Apparence → Thème), désactive aussi le thème.

Pour utiliser un thème différent sur un seul appareil, règle d'abord **Look on this device** (apparence sur cet appareil) sur **Only this device** (cet appareil uniquement) dans **Settings → Appearance → Theme**.

### Retrouver ton apparence habituelle

Si un thème rend Marinara difficile à utiliser, chacune de ces actions le désactive dans l'onglet :

- Appuie trois fois sur <kbd>Esc</kbd>.
- Ajoute `?safe` à la fin de l'adresse dans ton navigateur.
- Appuie sur <kbd>Ctrl</kbd>+<kbd>K</kbd> et saisis "Custom theme".

Marinara protège aussi la barre supérieure, les barres latérales, <kbd>Ctrl</kbd>+<kbd>K</kbd> et la zone de message. Un thème peut les remettre en forme, mais s'il en masque, déplace ou recouvre un, Marinara désactive le thème dans cet onglet et t'en indique la raison.

## Importer un thème

1. Clique sur **Import File**.
2. Choisis un fichier de thème `.json` ou `.css`.
3. Un aperçu affiche le nom du thème, son auteur, sa version, ses images et sa taille, ainsi que ses crédits et sa licence. Il indique tout ce que tu dois savoir avant l'installation, comme la présence d'images animées, le texte ajouté par le thème ou les éléments qui ne fonctionneront pas.
4. Choisis ce que tu veux importer avec lui. L'aperçu propose les réglages recommandés par le thème, tels que sa palette de couleurs, sa couleur d'accentuation et sa police, la plupart étant cochés. Il peut aussi ajouter les arrière-plans du thème à ta galerie d'arrière-plans de chat.
5. Clique sur **Install and try it** (installer et essayer) pour l'activer immédiatement, ou sur **Install** (installer) pour l'ajouter à la liste.

Si tu as déjà un thème du même nom, l'aperçu propose de le mettre à jour ou de **Keep both** (garder les deux). Quand tu reviens en arrière après avoir essayé un thème, Marinara rétablit aussi tous les réglages qu'il avait modifiés.

Un thème ne peut pas être installé s'il écrit du texte qui demande des mots de passe ou des clés, ou s'il se fait passer pour Marinara. Ne saisis jamais une clé ou un mot de passe à la demande d'un thème.

### Thèmes avec du HTML

Certains thèmes ajoutent une petite boîte HTML à chaque message, appelée modèle de message. Marinara en retire les scripts, les liens, les images et les formulaires, mais le HTML provenant de quelqu'un d'autre pourrait tout de même t'induire en erreur. Ces thèmes ne s'installent que lorsque **Allow themes with HTML (I accept the risk)** est activé. Quand l'interrupteur est désactivé, un thème installé s'affiche sans son HTML.

## Créer un thème

Clique sur **Create Theme**, ou sur **Clone + Edit** pour un thème de départ afin de commencer à partir d'une apparence déjà réussie. L'éditeur contient un champ de nom, une grande zone de CSS, **Preview** (aperçu) et **Save** (enregistrer). Un nouveau thème s'active quand tu l'enregistres et affiche **Keep this theme?**.

Le [Guide de création de thèmes](theme-author-guide.md#your-first-theme-step-by-step) propose une procédure pas à pas pour ton premier thème.

### Créer un thème avec Professor Mari

Tu n'as pas besoin d'écrire toi-même du CSS. Demande à Professor Mari avec des mots simples, par exemple "crée-moi un thème d'automne chaleureux qui fonctionne sur mon téléphone" ou "qu'est-ce qui ne va pas avec mon thème Harbor ?". Elle dispose d'un manuel pour concevoir et examiner les thèmes, et elle le suit :

1. **Elle se met d'abord d'accord avec toi sur l'idée.** Elle te demande l'ambiance souhaitée, le mode clair ou sombre (ou les deux), tes appareils et si tu veux des images et de la météo, puis résume le style en une phrase, comme "des capsules de verre dépoli sur un décor marin".
2. **Elle le crée sans l'activer.** Elle t'indique où l'essayer : sélectionne-le dans **Thèmes CSS** et appuie sur **Garder le thème** dans les 15 secondes. Si tu lui demandes de l'activer elle-même, ton onglet demande aussi **Garder ce thème ?** et revient en arrière si personne ne répond.
3. **Elle te demande de regarder.** Professor Mari ne voit pas ton écran ; elle indique donc des endroits précis à vérifier, en mode clair et sombre, et demande une capture d'écran de tout ce qui semble anormal. Si Marinara a désactivé le thème, transmets-lui le message : il indique la raison, et elle corrige le problème.
4. **Elle peut créer ses images.** Avec un modèle d'image configuré dans Connexions, elle crée des décors, des cadres et des icônes, te montre chacun d'eux d'abord et l'enregistre dans le thème quand tu acceptes. Elle peut aussi recolorer les ornements dessinés (images SVG) d'un thème. Voir [Demander à Professor Mari de créer les visuels](theme-author-guide.md#ask-professor-mari-to-make-the-art).

Pour examiner un thème, elle liste ce qui manque de cohérence (formes de coins mélangées, ombres, libellés difficiles à lire), écran par écran, et ne change rien tant que tu n'as pas indiqué quoi corriger.

Professor Mari travaille uniquement sur tes propres thèmes. Les thèmes de départ sont en lecture seule : clique d'abord sur **Cloner et modifier** sur l'un d'eux et demande-lui de travailler sur la copie. C'est toi qui ajoutes les polices, les crédits et les miniatures sous **Images et détails de partage (auteur, version, miniature, polices)**.

## Modifier, exporter et supprimer tes thèmes

Tes propres thèmes ont trois boutons sur leur ligne :

- **Edit theme CSS** (modifier le CSS du thème), l'icône de code, ouvre l'éditeur. La modification ne change pas le thème actif.
- **Export**, l'icône de téléversement, télécharge un fichier `.json` que tu peux partager ou importer ailleurs.
- **Remove**, l'icône de corbeille, supprime le thème après confirmation. Cette action est irréversible : exporte-le d'abord si tu penses en avoir besoin plus tard.

## Un thème pour un seul chat

Un chat peut avoir son propre thème :

1. Ouvre le chat, puis **Chat Settings** (réglages du chat).
2. Dans **Theme** (thème), choisis un thème. **Follow the app** (suivre l'application) utilise le thème de ton application, tandis que **Default look (no custom theme)** (apparence par défaut, aucun thème personnalisé) désactive les thèmes pour ce chat.
3. Dans un chat avec un seul personnage, coche **Use it for every chat with this character** (l'utiliser pour tous les chats avec ce personnage) afin d'en faire le thème de ce personnage.

Les réglages et la bibliothèque utilisent toujours le thème de l'application.

## Qui peut modifier les thèmes

Sur l'ordinateur qui exécute Marinara, aucun secret n'est nécessaire. Depuis un autre appareil, comme un téléphone, il faut le secret d'administration pour créer, importer, cloner, modifier et supprimer des thèmes. Saisis-le dans **Settings → Advanced → Security** (Réglages → Avancé → Sécurité). Aucun secret n'est nécessaire pour choisir un thème déjà installé par quelqu'un. Voir [Le secret d'administration](../REMOTE_ACCESS.md#the-admin-secret-and-privileged-actions).

## Styles de fenêtres de chat prêts à utiliser

Avant de commencer : aucun CSS n'est nécessaire.

1. Ouvre **Settings → Appearance → Chat Buttons & Windows** (Réglages → Apparence → Boutons et fenêtres du chat).
2. Sous **Chat widget style** (style des widgets du chat), choisis un style.

| Style | Apparence |
| --- | --- |
| **Default** | L'apparence d'origine. |
| **Dottore** | Des cadres d'instruments bleu glacé, des bordures en métal clair et des coins coupés. |
| **Prof. Mari** | Des cadres de conte bordés d'or, des bleus de pierres précieuses et des Primo-gemmes sur les titres des fenêtres. Ses boutons ont le même fond que ses fenêtres. |

Chaque style a sa propre police, fonctionne en mode clair et sombre, et habille ensemble les boutons, les fenêtres et les sections repliables. Choisir un style réinitialise **Font** (police), **Shape** (forme) et les trois couleurs. Les positions de tes fenêtres ne changent pas.

Tu peux changer ces éléments séparément :

- **Font** et **Shape** suivent le style (**Preset font**, **Preset shape**) jusqu'à ce que tu en choisisses d'autres.
- **Border & Buttons Color** (couleur des bordures et des boutons) change les contours et les icônes des boutons. Les icônes utilisent la première couleur d'un dégradé.
- **Background Color** (couleur de fond) remplit les boutons, les fenêtres, les sections repliables et les champs modifiables.
- **Text Color** (couleur du texte) change le texte des widgets. Les dégradés apparaissent sur les titres et les étiquettes, et les champs modifiables utilisent la première couleur.

Chaque couleur propose un sélecteur de couleur pour une couleur unie et une option de dégradé. **Reset color** (réinitialiser la couleur), à côté d'un contrôle, revient aux couleurs claires ou sombres du style. Les écussons décoratifs gardent leurs couleurs d'origine.

### Étendre le style au chat

Trois interrupteurs sous les sélecteurs de couleur étendent le style. Chacun est désactivé au départ et fonctionne seul. En désactiver un rétablit le style habituel du chat pour cette partie, et choisir un autre style conserve tes choix d'interrupteurs.

| Interrupteur | Ce qu'il applique |
| --- | --- |
| **Apply preset font** (appliquer la police du preset) | La police des widgets, pour les messages, les champs de saisie et les contrôles du chat. |
| **Apply preset shape** (appliquer la forme du preset) | La forme du cadre, pour les messages Roleplay (classique et visual novel), la boîte de dialogue Game, les champs de saisie et les contrôles. Les messages Conversation gardent leur propre forme. |
| **Apply preset colors** (appliquer les couleurs du preset) | Les couleurs de bordure, de fond et de texte de ces zones, y compris les messages Conversation. Tes couleurs et dégradés personnalisés s'appliquent aussi. Les dialogues entre guillemets gardent la Dialogue Highlight Color (couleur de surbrillance des dialogues) propre à chaque personnage ou persona. Un message composé de HTML, comme la carte mise en forme d'un agent, garde les couleurs de texte qu'il définit lui-même. |

Les boutons d'historique, **Load More** (en charger plus) et **Show older** (afficher les plus anciens), suivent les interrupteurs comme les autres contrôles du chat. En Game Mode, les interrupteurs s'appliquent aussi aux apartés, aux widgets du HUD, au panneau de carte, aux fiches de personnage, aux journaux, à l'inventaire, aux panneaux de combat et aux boîtes de dialogue. Professor Mari peut aussi créer des thèmes personnalisés pour ces zones.

Un thème personnalisé peut toujours remplacer les styles. Les variables de fenêtres et de tiroirs de la section [Habiller les fenêtres et tiroirs du chat](#styling-chat-windows-and-drawers) ont la priorité sur les couleurs du style. Utilise `--mari-window-font-family` pour la police des fenêtres, `--mari-drawer-radius` pour les coins des sections et `--mari-window-ornament: none` pour masquer l'ornement du titre. Pour retirer toute la décoration du style, choisis d'abord **Default**.

## Pour les créateurs de thèmes

Le reste de ce guide est une référence pour les personnes qui écrivent le CSS de leurs thèmes à la main. Commence par le [Guide de création de thèmes](theme-author-guide.md), qui répertorie tous les tokens stables, les points d'ancrage des éléments et les règles de sécurité.

## Les thèmes et le CSS de fiche

Marinara propose deux façons d'ajouter du CSS personnalisé, et les deux peuvent être actives en même temps.

- Un thème personnalisé repeint toute l'application. Il a le droit de redéfinir les variables fondamentales de Marinara, d'employer `!important` et d'employer `position: fixed`.
- Le CSS de fiche est intégré dans une fiche de personnage ou de persona et s'active chat par chat. Il est nettoyé plus sévèrement : il ne peut pas redéfinir les variables fondamentales, `!important` est retiré, et `position: fixed` devient `position: absolute`. Il met en forme les messages du chat, pas l'application entière. Voir le [Guide du CSS de fiche](card-css-theming.md).

## Limites de taille et de nom

Un nom de thème peut atteindre 200 caractères. Le CSS peut peser jusqu'à 256 Kio, mesurés en octets UTF-8. Au-delà, le thème est refusé à l'enregistrement comme à l'import. Le CSS des thèmes personnalisés est aussi nettoyé avant de s'appliquer : les styles qui chargent un fichier depuis un autre site web ne fonctionnent pas. Intègre plutôt une image ou une police sous forme d'URI `data:`.

## La référence des variables CSS

L'éditeur de thème contient une section dépliable **CSS Variable Reference** (référence des variables CSS). Clique dessus pour voir les variables les plus utiles à redéfinir. Un thème modifie l'application en donnant une valeur à ces variables dans un bloc `:root`. La référence liste ces variables :

| Variable | Ce qu'elle règle |
| --- | --- |
| `--background` | Arrière-plan de la page |
| `--foreground` | Texte principal |
| `--primary` | Accentuation et boutons |
| `--primary-foreground` | Texte sur la couleur primaire |
| `--secondary` | Cartes et champs de saisie |
| `--card` | Arrière-plan des cartes |
| `--border` | Bordures |
| `--muted-foreground` | Texte atténué |
| `--sidebar` | Arrière-plan de la barre latérale |
| `--sidebar-border` | Bordure de la barre latérale |
| `--marinara-shell-edge-border` | Bord gauche et droit du cadre |
| `--destructive` | Erreur et suppression |
| `--popover` | Arrière-plan des menus déroulants |
| `--accent` | Surbrillance au survol |

Un thème peut définir n'importe quelle variable CSS utilisée par Marinara, pas seulement celles-ci. Certains effets ont leurs propres variables. Par exemple, `--marinara-theme-accent-pulse: enabled` demande l'animation de pulsation de l'accentuation.

## Habiller les fenêtres et tiroirs du chat

Sur ordinateur, **Chat Settings** (réglages du chat) s'ouvre dans une fenêtre déplaçable. Ses sections repliables sont appelées **drawers** (tiroirs). Un tiroir peut se détacher dans sa propre fenêtre, puis se réduire à un petit bouton déplaçable, appelé **bubble** (bulle).

D'autres outils du chat utilisent aussi ces fenêtres et boutons, notamment Game controls, Session, Volume, Game Assets, les chats connectés et les contrôles de packages. Sur téléphone, la plupart des fenêtres s'ouvrent en panneaux sur toute la largeur ; Echo Chamber reste une fenêtre compacte que tu peux déplacer et redimensionner. Les outils sortis de Chat Settings figurent dans le menu déplaçable à trois points **Chat tools** (outils du chat) ; les boutons des trackers restent séparés.

Les classes, attributs de données et variables ci-dessous permettent à un thème d'habiller ces éléments ensemble. Les règles de ton thème remplacent les valeurs par défaut sans `!important`.

### Classes

| Élément | Classe |
| --- | --- |
| Fenêtre | `.mari-window` |
| Barre de titre | `.mari-window__header` |
| Titre et son icône | `.mari-window__title-row` |
| Titre | `.mari-window__title` |
| Boutons de la barre de titre (Reset View, étoile de disposition favorite, Tracker Panel, épingler, verrouiller, fermer, Put back) | `.mari-window__controls` (chaque bouton est `.mari-window__control`) |
| Contenu de la fenêtre | `.mari-window__body` |
| Bords et coins de redimensionnement | `.mari-window__resize-handle` |
| Repère de coin visible quand le pointeur ou le focus est dans une fenêtre | `.mari-window__resize-grip` |
| Tiroir | `.mari-drawer` |
| En-tête et titre du tiroir | `.mari-drawer__header`, `.mari-drawer__title` |
| Icône, compteur et **?** du tiroir | `.mari-drawer__icon`, `.mari-drawer__count`, `.mari-drawer__help` |
| Aperçu d'un tiroir replié (petit widget du tracker) | `.mari-drawer__summary` |
| Boutons près de la flèche et bouton de détachement du tiroir | `.mari-drawer__actions`, `.mari-drawer__popout` |
| Flèche et contenu du tiroir | `.mari-drawer__arrow`, `.mari-drawer__body` |
| Aperçu qui suit le pointeur pendant le détachement d'un tiroir | `.mari-drawer-ghost` |
| Bouton d'une fenêtre réduite (bulle) | `.mari-window-bubble` |
| Résumé en direct qu'une bulle affiche à la place de son icône (bannière de World State) | `.mari-window-bubble__banner` |
| Ligne visible quand une bulle déplacée s'aligne sur une autre | `.mari-window-snap-guide` |
| Point visible pendant le travail des agents (bouton Chat Settings, fenêtre Trackers) | `.mari-agents-running-dot` |

### Attributs de données

- `data-window` identifie une fenêtre et sa bulle : `chat-settings`, `trackers`, les fenêtres de contrôles `control:game`, `control:session`, `control:volume`, `control:assets`, `control:connected-chat`, `control:package:<package>` et `control:beholder:<package>`, et `drawer:<window>:<drawer>` pour un tiroir détaché, par exemple `drawer:chat-settings:chat-name`.
- `data-drawer` identifie un tiroir, par exemple `chat-name`. Certains noms commencent par le mode du chat, comme `roleplay-agents` ou `conversation-agents`. Les trackers utilisent `tracker-world`, `tracker-persona`, `tracker-characters`, `tracker-quests`, `tracker-inventory`, `tracker-custom` et `agent-activity`.
- `data-presentation` vaut `"window"` sur une fenêtre d'ordinateur ou `"sheet"` sur un panneau de téléphone.
- `data-pinned` et `data-locked` valent `"true"` quand la fenêtre est épinglée ou verrouillée.
- `data-window-control` identifie chaque bouton de la barre de titre : `"pin"`, `"lock"`, `"close"` ou `"put-back"`. Un bouton d'épinglage ou de verrouillage enfoncé possède aussi `aria-pressed="true"`.
- `data-chat-settings-control` identifie les boutons supplémentaires de la barre de titre de Chat Settings : `"reset-view"`, `"favorite-layout"` et `"tracker-panel"`. L'étoile favorite possède `aria-pressed="true"` et une icône remplie quand la disposition actuelle correspond à la favorite enregistrée.
- `data-edge` vaut `"n"`, `"s"`, `"e"`, `"w"`, `"ne"`, `"nw"`, `"se"` ou `"sw"` sur chaque poignée de redimensionnement.
- Le bouton de bascule d'un tiroir ouvert, dans `.mari-drawer__header`, possède `aria-expanded="true"`.
- `data-drawer-control="pop-out"` marque le bouton de détachement d'un tiroir.
- `data-outside="true"` marque un aperçu de glissement assez éloigné de sa fenêtre pour se détacher au relâchement.
- `data-axis` vaut `"x"` sur un guide d'alignement vertical et `"y"` sur un guide horizontal.
- `data-detached` vaut `"true"` quand un tiroir apparaît dans sa propre fenêtre, sur cette fenêtre et sur le tiroir qu'elle contient. La fenêtre d'un tiroir détaché est identifiée par `data-window="drawer:<window>:<drawer>"`, par exemple `data-window="drawer:chat-settings:chat-name"`, et `data-drawer-host` indique sa fenêtre d'origine.
- `data-dragging` vaut `"true"` sur un tiroir pendant le déplacement de son titre, et `data-drop-target` vaut `"true"` sur une fenêtre quand un tiroir détaché est maintenu au-dessus, prêt à y revenir.
- Une bulle possède le `data-window` de sa fenêtre et `data-minimized="true"`, par exemple `.mari-window-bubble[data-window="control:volume"]`. Les fenêtres de contrôles sont nommées `control:game`, `control:session`, `control:volume`, `control:assets`, `control:connected-chat`, `control:package:<package>` et `control:beholder:<package>`. `data-dragging` vaut `"true"` sur une bulle pendant son déplacement. Une bulle qui affiche un résumé en direct à la place de son icône, comme un tracker World State réduit, possède `data-banner="true"` et s'élargit à la taille du résumé.
- Une bulle verrouillée possède `data-locked="true"`, y compris le bouton Chat Settings. Elle ouvre toujours sa fenêtre, mais ne peut pas être déplacée tant que la fenêtre n'est pas déverrouillée. Utilise `.mari-window-bubble[data-locked="true"]` pour donner un aspect distinct à ces boutons.
- Sur téléphone, les fenêtres possèdent `data-presentation="sheet"`, comme leurs bulles, qui sont un peu plus grandes. La bulle de Tracker Panel est `.mari-window-bubble[data-tracker-panel-toggle="bubble"]`.
- Le bouton Chat Settings est aussi une bulle : `.mari-window-bubble[data-chat-settings-button]`, avec `data-open="true"` quand Chat Settings est ouvert.
- Une section détachée se réduit à une bulle avec `data-drawer-host` (sa fenêtre d'origine), et le bouton **Put back** (remettre en place) de sa fenêtre est `[data-window-control="put-back"]`.

### Variables

Chaque variable reprend les couleurs communes des contrôles du chat si elle n'est pas définie. Un thème ne doit donc définir que celles qu'il veut changer.

| Variable | Ce qu'elle contrôle |
| --- | --- |
| `--mari-window-bg` | Fond de fenêtre |
| `--mari-window-text` | Texte de fenêtre |
| `--mari-window-border`, `--mari-window-border-width` | Bordure de fenêtre |
| `--mari-window-radius` | Arrondi des coins de fenêtre |
| `--mari-window-shadow` | Ombre de fenêtre |
| `--mari-window-backdrop-filter` | Flou derrière la fenêtre |
| `--mari-window-header-bg`, `--mari-window-header-text`, `--mari-window-header-border` | Couleurs de la barre de titre |
| `--mari-window-header-padding` | Espacement de la barre de titre |
| `--mari-window-control-color`, `--mari-window-control-color-hover`, `--mari-window-control-bg-hover` | Boutons de la barre de titre, dont l'étoile favorite |
| `--mari-window-control-color-active`, `--mari-window-control-bg-active` | Boutons de la barre de titre enfoncés, dont épinglage, verrouillage et étoile favorite remplie |
| `--mari-window-control-radius`, `--mari-window-control-gap` | Arrondi et espacement des boutons |
| `--mari-window-focus-ring` | Contour du focus clavier, et contour de la fenêtre où un tiroir va revenir |
| `--mari-window-resize-handle-size` | Largeur des bords de redimensionnement |
| `--mari-window-bubble-size`, `--mari-window-bubble-radius`, `--mari-window-bubble-shadow` | Taille, arrondi et ombre des bulles |
| `--mari-window-bubble-bg`, `--mari-window-bubble-bg-hover`, `--mari-window-bubble-border` | Fond et bordure des bulles |
| `--mari-window-bubble-text`, `--mari-window-bubble-text-hover` | Couleur de l'icône de bulle |
| `--mari-window-snap-guide` | Couleur du guide d'alignement |
| `--mari-drawer-bg`, `--mari-drawer-border` | Fond et séparateur du tiroir |
| `--mari-drawer-header-bg`, `--mari-drawer-header-bg-hover` | Couleurs de l'en-tête du tiroir |
| `--mari-drawer-header-padding`, `--mari-drawer-body-padding-inline`, `--mari-drawer-body-padding-bottom` | Espacement du tiroir |
| `--mari-drawer-title-color`, `--mari-drawer-icon-color`, `--mari-drawer-arrow-color` | Texte et icônes de l'en-tête du tiroir |
| `--mari-drawer-count-bg`, `--mari-drawer-count-text` | Compteur du tiroir |

Définis une variable dans `:root` pour changer toutes les fenêtres, ou sur un sélecteur pour en changer une :

```css
:root {
  --mari-window-radius: 0.5rem;
  --mari-window-bubble-bg: #3b0764;
}

[data-window="chat-settings"] .mari-drawer[data-drawer="chat-name"] {
  --mari-drawer-border: transparent;
}
```

## Habiller les messages, les champs de saisie et les contrôles du chat

Les trois interrupteurs **Apply preset** permettent aussi à un thème personnalisé d'utiliser le design des widgets dans le reste du chat. Un thème peut remplacer chaque partie avec les variables ci-dessous. Demande à Professor Mari un thème de chat assorti si tu préfères ne pas écrire le CSS toi-même.

| Élément | Classe |
| --- | --- |
| Cadres des messages Roleplay et Game, apartés de Game, widgets du HUD, panneau de carte et fiches de personnage, et champs de saisie du chat | `.mari-chat-style-surface` |
| Journaux, inventaire, panneaux de combat, choix et boîtes de dialogue de Game ; les panneaux ont aussi l'attribut `data-game-section` avec leur nom, par exemple `logs`, `inventory` ou `combat-actions` | `.mari-game-section.mari-chat-style-surface` |
| Contenu de Game dans une fenêtre, comme l'onglet Journal, qui suit les couleurs de la fenêtre | `.mari-game-section` |
| Messages Conversation (police et couleurs uniquement) | `.mari-chat-style-conversation` |
| Texte des messages Conversation sans cadre | `.mari-chat-style-text` |
| Contrôles du chat, y compris Calls et les contrôles de groupe de Conversation | `.mari-chat-style-control` |
| Boutons d'historique : **Load More**, **Show older**, **Show newer** (afficher les plus récents), **Latest** (les plus récents) et, dans les journaux de Game, **Older** (plus anciens), **All** (tous) et **Show more older logs** (afficher plus d'anciens journaux). Ils ont aussi `.mari-chat-style-control` | `.mari-chat-history-pager` |
| Un message composé de HTML, comme la carte mise en forme d'un agent. Les couleurs de texte définies à l'intérieur sont conservées quand **Apply preset colors** est activé | `.mari-html-content` |

| Variable | Ce qu'elle contrôle |
| --- | --- |
| `--mari-chat-font-family` | Police des zones de chat correspondantes |
| `--mari-chat-bg` | Fond du cadre ; accepte une couleur ou un dégradé |
| `--mari-chat-text` | Couleur unie et lisible du texte |
| `--mari-chat-border` | Contour du cadre ; accepte une couleur ou un dégradé |
| `--mari-chat-border-color` | Couleur unie de repli pour la bordure |
| `--mari-chat-radius` | Arrondi du cadre, sauf pour les messages Conversation |
| `--mari-chat-control-bg`, `--mari-chat-control-bg-hover` | Fonds des boutons du chat |
| `--mari-chat-control-color`, `--mari-chat-control-radius` | Couleur des icônes et arrondi des boutons du chat |
| `--mari-chat-input-bg` | Fond des champs modifiables |

Par exemple, avec **Apply preset font** et **Apply preset colors** activés :

```css
:root {
  --mari-chat-font-family: Georgia, serif;
  --mari-chat-bg: #251e29;
  --mari-chat-text: #f4e8dc;
  --mari-chat-border: linear-gradient(100deg, #d6aa66, #dda0b2);
}
```

Les variables non définies suivent les réglages et le preset des widgets. L'interrupteur correspondant doit être activé pour que ces variables s'appliquent via le style intégré. Les messages Conversation gardent leur propre forme même quand **Apply preset shape** est activé. Les thèmes personnalisés peuvent aussi cibler directement les classes ; garde les contours de focus, les menus et le contenu des messages hors de tout découpage décoratif.

Sur téléphone, le menu à trois points se déploie en boutons ronds. Son déclencheur est `[data-chat-tools-menu-button]`, la pile ouverte est `[data-chat-tools-menu]`, et chaque élément de liste porte `data-chat-tools-menu-item` avec l'ID de sa fenêtre. Les boutons d'outils utilisent `.mari-window-bubble.mari-chat-tools-button` et `data-chat-tools-menu-tool` avec ce même ID. La pile n'a pas de cadre de fenêtre ; ses boutons suivent les couleurs des widgets et la taille des boutons, indépendamment des trois interrupteurs pour le reste du chat, tout en gardant leur forme ronde.

<a id="styling-character-sheets"></a>
## Styliser les fiches de personnage

La fiche d’un système de règles a le même aspect dans Roleplay et Game. Ces classes et attributs permettent à un thème de la styliser.

| Partie | Classe | Attributs de données |
| --- | --- | --- |
| Fiche entière | `.mari-ruleset-sheet` | `data-ruleset` (ID du système, comme `local/my-rules`), `data-rank-display` (`value`, `label`, `dots`, `roman` ou `number`), `data-editing="true"` pendant l’édition |
| Titre et bouton **Modifier la fiche** | `.mari-ruleset-sheet__header` | |
| Onglets | `.mari-ruleset-sheet__tabs` | Chacun possède `data-tab-id` et `aria-selected` |
| Titre de groupe | `.mari-ruleset-sheet__heading` | |
| Champ en haut | `.mari-ruleset-sheet__field` (dans `.mari-ruleset-sheet__fields`) | `data-field`, ou `data-derived` pour une valeur calculée |
| Caractéristique | `.mari-ruleset-sheet__ability` (dans `.mari-ruleset-sheet__abilities`) ; score et valeur du test : `__ability-score` et `__ability-value` | `data-ability` ; le groupe possède `data-section` |
| Réserve, comme Santé | `.mari-ruleset-sheet__pool` (dans `.mari-ruleset-sheet__pools`) | `data-pool` ; le groupe possède `data-pool-group` |
| Jauge | `.mari-ruleset-sheet__track` (dans `.mari-ruleset-sheet__tracks`) | `data-track` ; une jauge de blessures a aussi `data-wound="true"` |
| États | `.mari-ruleset-sheet__conditions` | |
| Compétence entraînée ou sauvegarde | `.mari-ruleset-sheet__rank` (dans `.mari-ruleset-sheet__trained`, par groupe dans `.mari-ruleset-sheet__rank-group`) ; rang, ou valeur du test avec `data-rank-display="value"` : `__rank-value` ; valeur à côté sur téléphone : `__rank-check` ; pratique : `__practice` | `data-skill` ou `data-save`, `data-tier` (ID du palier), `data-rank` (`0` non entraîné, `1` palier suivant, etc.) |
| Compétence ou sauvegarde en édition | `.mari-ruleset-sheet-editor__rank` | `data-skill` ou `data-save`, `data-tier`, `data-rank` |
| Liste, comme Équipement | `.mari-ruleset-sheet__list` ; chaque ligne : `.mari-ruleset-sheet__list-row` | `data-list` ; une ligne cochée possède `data-marked="true"` |

Cet exemple affiche le rang 2 d’un système par deux étoiles. Ajoute une paire de règles pour chaque rang à changer. Réserve-le aux rangs affichés en points, noms, chiffres romains ou nombres : avec des valeurs de test, `__rank-value` contient cette valeur et la masquerait.

```css
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value {
  font-size: 0;
}
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value::after {
  content: "★★";
  font-size: 0.6875rem;
}
```

## Guides associés

- [Guide de création de thèmes](theme-author-guide.md)
- [La météo dans ton thème](theme-weather.md)
- [Guide du CSS de fiche](card-css-theming.md)
- [Réglages d'apparence](appearance-settings.md)
- [Référence de configuration du serveur](../CONFIGURATION.md)
- [Accès à distance : connexion et liste d'autorisation d'IP](../REMOTE_ACCESS.md)
