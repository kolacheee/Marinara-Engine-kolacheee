# Réglages d'apparence

L'onglet **Appearance** (apparence) change l'aspect de Marinara : les couleurs, la taille du texte, l'espacement, les arrière-plans ainsi que les boutons et les fenêtres du chat. Les onglets **Conversation**, **Roleplay** et **Game** à côté règlent le style de chaque mode de chat.

Tu cherches autre chose ?

- Une apparence toute faite ou ton propre thème : [Thèmes CSS personnalisés](custom-css-themes.md).
- Une autre police : [Polices personnalisées et Google Fonts](fonts.md).
- Une image d'arrière-plan pour le chat : [Bibliothèque d'arrière-plans](chat-backgrounds.md).
- L'apparence propre à un personnage dans le chat : [Guide du thème CSS de fiche](card-css-theming.md).

## Ouvrir les réglages d'apparence

1. Ouvre **Library → Settings** (Bibliothèque → Paramètres).
2. Clique sur l'onglet **Appearance**.
3. Clique sur le nom d'une section dans la rangée sous les onglets pour y accéder directement, ou fais défiler la page.

| Onglet | Sections |
| --- | --- |
| **Appearance** | **Theme**, **Fonts & Text Size**, **Accessibility**, **Text Colors**, **Layout**, **Effects**, **Backgrounds**, **Chat Buttons & Windows**, **CSS Themes** |
| **Conversation** | **Conversation Layout**, **Conversation Background** |
| **Roleplay** | **Tracker Panel**, **Roleplay Messages**, **Avatars**, **Visual Novel** |
| **Game** | **Game Text**, **Game Art**, **Game Assets** |

Pour repartir de zéro, clique sur **Reset Appearance** (réinitialiser l'apparence) en haut de **Theme**. Ce bouton ramène l'apparence aux valeurs par défaut de Marinara, efface l'arrière-plan du chat en cours et désactive tout thème personnalisé.

Dans la disposition classique, ces sections se trouvent dans l'onglet **Appearance**, derrière quatre boutons : **App**, **Conversation**, **Roleplay** et **Game**.

## Thème

| Réglage | Rôle |
| --- | --- |
| **Visual Style** (style visuel) | **Default (Marinara)** est un look rétro Y2K avec des effets de halo. **SillyTavern** est un rendu épuré et minimaliste. Ce choix ne change que l'apparence et n'a rien à voir avec l'import depuis SillyTavern. **Stage** reprend les tons prune, laiton et cramoisi de la nouvelle disposition. |
| **New layout (UI overhaul preview)** (nouvelle disposition, aperçu de la refonte de l'interface) | Activé par défaut. Désactive-le pour revenir à la disposition classique. Ces guides décrivent d'abord la nouvelle disposition. |
| **Look on this device** (apparence sur cet appareil) | **Same as my other devices** (comme sur mes autres appareils, valeur par défaut) partage ton style visuel, tes couleurs, ta police et ton thème personnalisé avec tous tes appareils. **Only this device** (uniquement cet appareil) donne à cet appareil sa propre apparence, par exemple un thème clair sur ton téléphone et sombre sur ton ordinateur. |
| **Color Scheme** (jeu de couleurs) | **Dark** (valeur par défaut), **Light**, **Follow system** ou **Follow time of day**, qui change selon l'horloge de cet appareil aux heures que tu choisis. |
| **Custom Mouse Pointer** (curseur de souris personnalisé) | Activé par défaut. Affiche le curseur aux couleurs d'accentuation de Marinara. Désactive-le pour retrouver le curseur du système, ou pour laisser un thème personnalisé le définir. |
| **Accent Color** (couleur d'accentuation) | Les boutons, les icônes actives, les contours de focus, les surbrillances et les bordures. Par défaut : **Marinara Gradient**, un dégradé de rose, d'orange et de cyan. |
| **Accent Pulse** (pulsation de l'accent) | Éclaircit et assombrit doucement l'accentuation, ou fait défiler les couleurs d'un dégradé. Activé par défaut sur ordinateur et désactivé sur téléphone. |
| **RGB Mode** (mode RGB) | Fait défiler l'accentuation dans une palette arc-en-ciel. La couleur enregistrée dans **Accent Color** ne change pas. Désactivé par défaut. |

**Couleur d'accentuation** accepte une couleur unie ou un dégradé, un fondu progressif entre deux couleurs ou plus. Clique sur **Rétablir la valeur par défaut** pour revenir à la valeur par défaut. L'arrière-plan de l'application suit le mode sombre ou clair, et un thème personnalisé peut définir le sien. Un seul des réglages **Pulsation de l'accent** et **Mode RGB** peut être activé à la fois.

## Polices et taille du texte

- **Font** (police) choisit la police de l'application. Voir [Polices personnalisées et Google Fonts](fonts.md).
- **Display Size** (taille d'affichage) fixe la taille de texte de base de toute l'application sur cet appareil. Le changement s'applique aussitôt.

| Choix | Taille |
| --- | --- |
| **Tiny** | 12 px |
| **Small** | 14 px |
| **Medium** | 16 px |
| **Default** | 17 px |
| **Large** | 19 px |
| **Huge** | 22 px |
| **Extra large** | 26 px |
| **Extra extra large** | 30 px |
| **Maximum** | 34 px |

- **Chat Font Size** (taille du texte du chat) est un curseur qui règle la taille du texte des messages, de 12 px à 72 px. Par défaut : 16 px.

## Accessibilité

| Réglage | Rôle |
| --- | --- |
| **Line spacing** (espacement des lignes) | L'espace entre les lignes des messages et des textes longs : **Default**, **Relaxed (1.6)**, **Loose (1.8)** ou **Double (2.0)**. Les menus et les boutons gardent leur taille. |
| **Letter spacing** (espacement des lettres) | L'espace entre les lettres partout : **Default**, **A little wider**, **Wider** ou **Widest**. |
| **High contrast** (contraste élevé) | Renforce le texte, les bordures et les couleurs de focus. **Follow system** l'active lorsque ton appareil demande plus de contraste. |
| **Strong focus rings** (contours de focus renforcés) | Ajoute un contour épais à l'élément sélectionné au clavier. <kbd>Tab</kbd> propose aussi des liens **Skip to content**. |
| **Reduce motion** (réduire les animations) | Arrête les animations, les transitions, **Accent Pulse** et les effets de thème. Ce réglage s'active tout seul lorsque ton appareil demande moins d'animations. |
| **Theme art strength** (intensité des illustrations du thème) | Règle la visibilité de l'image d'arrière-plan et de la surcouche d'un thème personnalisé (pluie, feuilles, lignes de balayage). Réduis-la si les illustrations d'un thème rendent le texte difficile à lire. |
| **Colour-blind-safe colours** (couleurs adaptées au daltonisme) | Utilise du bleu et de l'orange au lieu du vert et du rouge pour les points d'état, les jauges et les boutons Delete. |

## Couleurs du texte

- **Chat Text Color** (couleur du texte du chat) est la couleur principale du texte des messages. Par défaut : `#d4d4d4` en Dark et `#1a1025` en Light.
- **Default Dialogue Color** (couleur par défaut des dialogues) colore les dialogues entre guillemets quand un personnage ou un persona n'a pas sa propre Dialogue Highlight Color. Les couleurs des fiches ont la priorité. Tant que **Apply preset colors** (appliquer les couleurs du preset) est activé dans **Chat Buttons & Windows**, les dialogues prennent la couleur de texte de ce style.
- **Chat Chrome Text Color** (couleur du texte de l'interface du chat) définit le texte des contrôles autour du chat : les widgets de tracker, les libellés de dossier, les descriptions de réglages et les fenêtres ouvertes depuis les boutons du chat. Mêmes valeurs par défaut que **Chat Text Color**.
- **Text Outline / Stroke** ajoute un contour pour que le texte reste lisible sur les arrière-plans chargés. Règle la couleur et une largeur (**Width**) de 0 à 5 px. Par défaut : 0,5 px, et 0 supprime le contour.

## Disposition

- **Desktop sidebar width** (largeur de la barre latérale sur ordinateur) règle la largeur des deux barres latérales sur ordinateur. **Reset width** (réinitialiser la largeur) la rétablit. Les téléphones gardent leur disposition.
- **Show Android status bar** (afficher la barre d'état Android) affiche la barre d'état du téléphone dans l'application Android.

## Effets

- **Dynamic weather effects (rain, snow, fog, etc.)** (effets météo dynamiques : pluie, neige, brouillard, etc.) est activé par défaut. Il affiche la météo selon celle de l'histoire et le moment de la journée, et nécessite que l'agent **World State** soit activé pour le chat. Voir [Agents : des aides IA pour tes chats](../agents/agents-overview.md).
- **Reduce Ambient Animations & Effects** (réduire les animations et effets d'ambiance) arrête les animations décoratives, les particules, les aperçus qui tournent et l'apparition progressive du texte.

- **Afficher les jets de dés en texte** (désactivé par défaut) affiche chaque jet sous forme de courte ligne avec les dés, leurs résultats et le total, au lieu de dés animés. Les jets ont toujours lieu et le modèle comme le jeu reçoivent leurs résultats. Cela vaut dans tous les modes de chat, y compris pour les dés des tests de compétence.
- **Reduced paint effects** (effets de rendu réduits) aplatit les panneaux transparents et les ombres coûteux pour que les appareils plus lents restent fluides.

## Arrière-plans

Cette section contient le sélecteur **Chat Background** (fond du chat) et le curseur **Background Blur** (flou de l'arrière-plan). Le sélecteur affiche l'arrière-plan du chat en cours (ou **Default background**) et tes choix récents. Clique sur l'image ou sur **Browse library** (parcourir la bibliothèque) pour en choisir un autre. La section contient aussi :

- **Conversation background image opacity** (opacité de l'image d'arrière-plan en Conversation) : la visibilité de l'arrière-plan du chat en mode Conversation.
- **Chat background behind side panels** (arrière-plan du chat derrière les panneaux latéraux) : étend l'arrière-plan du chat ouvert, en l'adoucissant, derrière les barres latérales et la barre supérieure.
- **Chat List Backgrounds** (fonds dans la liste des chats) : affiche l'arrière-plan de chaque chat sous forme de bandeau atténué derrière sa ligne, dans la liste des chats. Choisis **Active & Hovered**, **Every Row** ou **Off**.

Voir [Bibliothèque d'arrière-plans](chat-backgrounds.md).

## Boutons et fenêtres du chat

**Chat widget style** (style des widgets du chat) règle l'apparence des boutons, des fenêtres et des sections déplaçables du chat. Choisis **Default**, **Dottore** (bleu glacé, métal pâle et coins coupés) ou **Prof. Mari** (cadres de livre d'histoires bordés d'or). Ce choix réinitialise les contrôles en dessous.

| Contrôle | Rôle |
| --- | --- |
| **Font** | **Preset font**, **App font**, **Sans serif**, **Storybook serif** ou **Technical monospace**. |
| **Shape** (forme) | **Preset shape**, **Rounded**, **Square**, **Cut corners** ou **Arched**. |
| **Button size (px)** (taille des boutons en pixels) | Change la taille des boutons déplaçables du chat et de leurs icônes. Saisis une valeur de 32 à 96, ou laisse le champ vide pour la valeur par défaut. |
| **Border & Buttons Color** (couleur des bordures et des boutons), **Background Color**, **Text Color** (couleur du texte) | Les trois couleurs principales. Réinitialise l'une d'elles pour qu'elle suive le preset et Dark ou Light. |
| **Apply preset font** (appliquer la police du preset), **Apply preset shape** (appliquer la forme du preset), **Apply preset colors** | Étend aussi le style aux messages, aux champs de saisie et aux contrôles du chat. Désactivé par défaut. |

Professor Mari peut créer un style de chat personnalisé pour toi. Demande-le-lui dans son chat.

## Thèmes CSS

Des thèmes tout faits, ainsi que ceux que tu crées ou importes. Voir [Thèmes CSS personnalisés](custom-css-themes.md).

## Onglet Conversation

- **Chat Layout** (disposition du chat, dans **Conversation Layout**) change l'aspect des messages en mode Conversation, avec un aperçu en direct. **Linear** (valeur par défaut) affiche des lignes façon chat. **Bubbles** affiche des bulles façon messagerie.
- **Avatar Shape** (forme de l'avatar) vaut **Circular** ou **Square**. La taille de l'avatar ne change pas.
- **Photos de profil sur téléphone** définit les images à côté des messages sur téléphone, dans tous les modes de chat. **Mini** (par défaut) place une petite image près de chaque nom, avant le nom d'un personnage et après le tien, pour que les messages gardent toute la largeur. **Complètes** conserve la colonne d'images, et **Désactivées** n'affiche aucune image. Les tablettes et les ordinateurs affichent toujours l'image complète.
- **Conversation Theme** (thème de Conversation, dans **Conversation Background**) définit un dégradé de deux couleurs derrière tous les chats Conversation. Les onglets **Dark** et **Light** gardent chacun leur propre dégradé. C'est la valeur par défaut de tous les chats Conversation, pas un réglage chat par chat.

Les interrupteurs du menu des swipes se trouvent dans **Settings → Chatting → Editing & Swipes** (Paramètres → Chat → Modification et swipes).

## Onglet Roleplay

**Tracker Panel** habille le panneau des statistiques, de la tenue et du lieu à côté des chats Roleplay. Voir [HUD et trackers en Roleplay](../roleplay/hud-and-trackers.md).

**Roleplay Messages**

| Réglage | Rôle | Par défaut |
| --- | --- | --- |
| **Chat position** (position du chat) | L'emplacement des messages et de la zone de saisie sur un écran large : **Left**, **Center** ou **Right**. Sur téléphone, le chat garde toute la largeur. | **Center** |
| **Custom chat width** (largeur de chat personnalisée) | Définit ta propre largeur pour la colonne des messages. | Désactivé |
| **Roleplay Messages Background Opacity** (opacité du fond des messages de roleplay) | Baisse-la pour laisser l'arrière-plan transparaître à travers les bulles de message. Elle prend le pas sur les couleurs transparentes des fiches et des presets. | 90 % |
| **Stretch Messages** (étirer les messages) | Chaque message occupe toute la largeur de la ligne, pour aligner les messages courts sur les longs. | Désactivé |
| **Hide line under names** (masquer la ligne sous les noms) | Retire la fine ligne sous les noms. | Désactivé |

**Avatars**

| Réglage | Rôle | Par défaut |
| --- | --- | --- |
| Style d'avatar | **None**, **Small Circles**, **Small Rectangles**, **Glued Side Panel** ou **Faded Side Panel**, un portrait large qui se fond dans le message. | **Small Circles** |
| **Scrollable Avatars** | Garde les avatars visibles pendant que tu fais défiler un long message. | Désactivé |
| **Narrator's Cycling Avatars** (avatars changeants du narrateur), **Narrator's Avatar Borders** (bordures de l'avatar du narrateur) | Règlent l'apparence de l'avatar du narrateur. | |
| **Message avatar scale** (échelle des avatars des messages) | De 75 % à 250 %. | 100 % |
| **Default sprite scale** (échelle par défaut des sprites) | De 50 % à 175 %. La taille de sprite propre à un chat reste prioritaire. | 100 % |

**Visual Novel**

**Visual Novel display** (affichage visual novel) affiche un paragraphe terminé à la fois, avec un portrait de dialogue et tes sprites (les images des personnages sur le plateau). Il définit l'affichage des nouveaux Roleplays et de ceux qui n'ont pas leur propre choix. **Auto-play VN paragraphs** (lecture automatique des paragraphes VN), avec le réglage **Paragraph delay** (délai entre paragraphes), **Dialogue portrait scale** (échelle du portrait de dialogue) et **Full-body sprite scale** (échelle des sprites en pied), règle la lecture.

**Show Thinking In Messages** (afficher le raisonnement dans les messages) et **Don't Collapse Thinking** (ne pas replier le raisonnement) se trouvent dans **Settings → Chatting → Thinking** (Paramètres → Chat → Raisonnement).

## Onglet Game

**Game Text**

- **Instantly reveal game text** (afficher instantanément le texte du jeu) supprime l'effet de saisie progressive.
- **Mouse-wheel + click navigation** (navigation à la molette et au clic) permet d'avancer dans l'histoire avec la souris.
- **Game narration speed** (vitesse de narration du jeu) et **Game auto-play segment delay** (délai entre les segments en lecture automatique) règlent la vitesse d'affichage et de progression du texte.
- **Game Dialogue Display** (affichage des dialogues en Game Mode) : **Classic Dialogue Box** (valeur par défaut) affiche un segment, les lignes plus anciennes se trouvant dans **Logs** (journaux). **History Above Dialogue Box** affiche les segments précédents au-dessus de la boîte.
- **Game text effects** (effets de texte du jeu, activé par défaut) anime les mots dramatiques, l'emphase en MAJUSCULES, les apartés et les balises d'effet de texte. Désactive-le pour un texte simple.

**Game Art** propose deux curseurs : **Dialogue portrait scale** (de 75 % à 175 %, 100 % par défaut) et **Full-body sprite scale** (de 75 % à 275 %, 135 % par défaut).

**Game Assets** est décrit dans [Ressources de jeu](../game/game-assets.md).

## Les réglages qui restent sur cet appareil

La plupart des réglages d'apparence se synchronisent avec tes autres appareils. **Display Size** et **Chat Font Size**, non. Ils sont enregistrés dans le navigateur que tu utilises. Pour donner une apparence entièrement différente à un appareil, utilise **Look on this device** dans **Theme**. Pour savoir ce qui se synchronise, voir [Vue d'ensemble des paramètres](../settings/settings-overview.md).

## Guides associés

- [Thèmes CSS personnalisés](custom-css-themes.md)
- [Polices personnalisées et Google Fonts](fonts.md)
- [Bibliothèque d'arrière-plans](chat-backgrounds.md)
- [Guide du thème CSS de fiche](card-css-theming.md)
- [Vue d'ensemble des paramètres](../settings/settings-overview.md)
