# Game Mode : carte, heure et météo

Utilise le panneau de carte pour voir où se trouve ton équipe et pour la déplacer. Ce guide couvre aussi les systèmes qui suivent l'évolution du monde autour de l'équipe : le jour et l'heure, la météo et le moral de l'équipe.

## Le panneau de carte

Le Game Mode affiche un panneau de carte sur l'écran de jeu. Il indique le nom de la carte en cours, le jour de jeu et une icône de ciel pour le moment de la journée.

- **Sur un ordinateur**, la carte s'affiche directement dans un panneau, lisible d'un coup d'œil. Tu peux le faire glisser et le verrouiller en place. Pour le fonctionnement des panneaux déplaçables, voir [Game Mode : widgets HUD](hud-widgets.md).
- **Sur un téléphone**, touche **Map** (carte) pour ouvrir le panneau. Son bouton commence près du coin supérieur gauche et peut être déplacé dans le chat. Utilise **Lock window** (verrouiller la fenêtre) pour garder le bouton en place, et **Close** (fermer) pour y revenir. La position est enregistrée avec le chat. La carte sur téléphone suit le style des widgets du chat choisi dans **Settings → Appearance → Chat Buttons & Windows** (Paramètres → Apparence → Boutons et fenêtres du chat), et son bouton reste séparé du menu à trois points **Chat tools** (outils du chat).

### Vue en grille et vue en nœuds

Marinara choisit la vue selon le type de lieu que la carte représente. Tu ne changes pas de vue à la main.

- La vue **en grille** convient aux zones ouvertes comme une région ou une ville. Elle affiche des cases colorées selon le terrain : herbe, forêt, eau, montagne, désert, neige, ville, route et grotte.
- La vue **en nœuds** convient aux zones fermées comme les donjons et les intérieurs. Elle affiche les lieux sous forme de cercles reliés par des lignes. Un lieu non découvert affiche un point d'interrogation. Une ligne en pointillés est un chemin que tu n'as pas encore parcouru, et une ligne pleine un chemin que tu as déjà emprunté.

## Déplacer ton équipe

Seuls certains lieux peuvent être choisis. Sur une carte en grille, une case doit être adjacente à ton équipe et déjà découverte. Sur une carte en nœuds, un nœud doit être relié au lieu où tu te trouves, ou déjà découvert. Les autres cases et nœuds ne font rien quand tu cliques dessus.

1. Clique sur une case de la grille, ou sur un nœud d'une carte en nœuds.
2. Une pastille **Map position:** (position sur la carte) apparaît au-dessus de la zone de saisie, avec le nom du lieu.
3. Rédige ton message et envoie-le. Marinara ajoute une courte ligne du type `*moves to <place>*` au début de ton message.

Pour annuler, clique sur le bouton d'effacement (X) de la pastille **Map position:**. Son infobulle indique **Clear destination** (effacer la destination).

Sur un téléphone, touche un nœud une fois pour le sélectionner, puis touche **Set destination** (définir la destination) dans le pied de page. Un nœud marqué **You are here** est le lieu où tu te trouves.

Si ça n'a pas marché, vérifie que la case est adjacente à ton équipe et découverte, ou que le nœud est relié à l'endroit où tu es.

### Zoomer, changer de carte et générer des cartes

- **Zoomer.** Utilise **Zoom in** (plus) et **Zoom out** (moins) dans le coin supérieur droit. Le zoom va de 75 % à 180 %, par paliers de 25 %.
- **Changer de carte.** Quand une partie compte plus d'une carte ou région, un menu déroulant en haut du panneau te permet d'en consulter une autre. La carte où tu te trouves porte la mention **(Current)**.
- **Générer une carte.** Clique sur le bouton en forme de baguette **Generate another map** (générer une autre carte), dans le coin supérieur gauche, pour remplacer la carte en cours par une nouvelle. Une partie sans carte affiche **No map yet** et un bouton **Generate** (générer) qui fait la même chose.

## Régler le jour et l'heure à la main

La commande de jour et d'heure se trouve en haut du panneau de carte. Elle affiche **Day** (jour) suivi d'un nombre, plus une icône de ciel.

1. Clique sur la commande **Day**.
2. Saisis un numéro de jour de 1 à 9999.
3. Choisis un moment de la journée : **Dawn**, **Morning**, **Afternoon**, **Evening**, **Night** ou **Midnight**.
4. Clique en dehors ou appuie sur <kbd>Enter</kbd> pour enregistrer.

C'est un réglage manuel, distinct de l'horloge automatique. L'horloge peut aussi afficher **Noon** d'elle-même, mais Noon ne fait pas partie des choix manuels.

## Comment le temps passe

L'horloge de jeu repose sur des calculs fixes, pas sur l'IA. Chaque nouvelle partie commence au jour 1, à 08:00. Chaque action fait avancer l'horloge :

| Action | Temps ajouté |
| --- | --- |
| Parler | 15 minutes |
| Explorer | 30 minutes |
| Un round de combat | 5 minutes |
| Un repos court | 1 heure |
| Un repos long | 8 heures |
| Un voyage | 2 heures |

Quand l'horloge dépasse minuit, le numéro du jour augmente de un.

## La météo

Le jeu suit la météo avec des calculs fixes, pas avec l'IA. On trouve par exemple le ciel dégagé, les nuages, la pluie, l'orage, la neige, le blizzard, le brouillard, la canicule et la tempête de sable. La météo influence la façon dont le GM décrit chaque scène.

Quand l'histoire ou le GM demande une météo que le lieu ne peut pas avoir à ce moment-là, comme de la neige dans un désert chaud en été, le jeu utilise la météo possible la plus proche (un vent froid et violent, dans ce cas). Le GM est informé du climat et de ce qui ne peut pas s'y produire.

Une partie sans monde généré déduit le climat du nom du lieu, comme "désert", "port" ou "montagne".

### Des lieux soustraits aux lois de la nature

Une malédiction, un dieu ou une autre grande puissance peut figer l'environnement d'un lieu : une ville plongée dans une nuit sans fin, une forêt maintenue en automne, une vallée sous une neige qui ne fond jamais. Le GM impose ce verrouillage dans l'histoire, et il l'emporte sur le climat et l'horloge jusqu'à ce que le GM le lève :

- **La météo.** Le lieu garde la météo imposée, même si son climat ne pourrait jamais la produire, comme de la neige dans un désert.
- **La saison.** Le lieu reste dans une saison tandis que le reste du monde avance.
- **La lumière.** Il y fait toujours nuit, jour ou crépuscule. L'éclairage de la scène et les effets météo suivent.

Un verrouillage couvre le lieu et tout ce qu'il contient : verrouiller une région verrouille donc aussi ses villes. Quand plusieurs verrouillages se chevauchent, le lieu le plus proche l'emporte : une ville dans une région maudite peut ainsi garder sa propre météo. Un verrouillage peut aussi couvrir le monde entier. La scène ne peut pas lever un verrouillage en demandant une autre météo ; seul le GM le peut.

Pour voir la météo à l'écran, active le réglage **Dynamic weather effects (rain, snow, fog, etc.)** dans les réglages d'apparence. Il est actif par défaut. Des particules de pluie, de neige et de brouillard apparaissent alors par-dessus le jeu et suivent la météo et le moment de la journée. Voir [Réglages d'apparence](../appearance/appearance-settings.md).

## Le moral de l'équipe

Le jeu tient un score de moral d'équipe caché, de 0 à 100. Il comporte cinq niveaux, du plus bas au plus haut : Broken, Low, Steady, High et Inspired.

Le moral monte quand tu gagnes un combat, termines une quête ou trouves un trésor. Il baisse quand tu perds un combat, rates une quête ou perds un allié. Avec le temps, il revient peu à peu vers le milieu. Il n'apparaît pas sous forme de nombre. Il teinte la façon dont le GM décrit l'humeur de ton équipe. Il ne modifie pas tes jets de dés.

## Guides associés

- [Game Mode : premiers pas](getting-started.md)
- [Game Mode : widgets HUD](hud-widgets.md)
- [Réglages d'apparence](../appearance/appearance-settings.md)
