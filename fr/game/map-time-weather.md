# Game Mode : carte, heure et météo

Utilise le panneau de carte pour voir où se trouve ton équipe et pour la déplacer. Ce guide couvre aussi les systèmes qui suivent l'évolution du monde autour de l'équipe : le jour et l'heure, la météo et le moral de l'équipe.

## Le panneau de carte

Le Game Mode affiche un panneau de carte sur l'écran de jeu. Il indique le nom de la carte en cours, le jour de jeu et une icône de ciel pour le moment de la journée.

- **Sur un ordinateur**, la carte s'affiche directement dans un panneau, lisible d'un coup d'œil. Tu peux le faire glisser et le verrouiller en place. Pour le fonctionnement des panneaux déplaçables, voir [Game Mode : widgets HUD](hud-widgets.md).
- **Sur un téléphone**, touche **Map** (carte) pour ouvrir le panneau. Son bouton commence près du coin supérieur gauche et peut être déplacé dans le chat. Utilise **Lock window** (verrouiller la fenêtre) pour garder le bouton en place, et **Close** (fermer) pour y revenir. La position est enregistrée avec le chat. La carte sur téléphone suit le style des widgets du chat choisi dans **Settings → Appearance → Chat Buttons & Windows** (Paramètres → Apparence → Boutons et fenêtres du chat), et son bouton reste séparé du menu à trois points **Chat tools** (outils du chat).

Une partie VN a la carte de scène décrite ici. La carte du monde, les villes et les cartes de donjon appartiennent aux parties Overworld, qui ne sont pas encore disponibles (voir [VN ou Overworld](getting-started.md#vn-or-overworld)).

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

Dans une partie avec un monde, le temps passe aussi tout seul :

- Tant que la carte du monde est au premier plan et que la partie attend ton action, une minute de jeu passe toutes les cinq secondes réelles. L'horloge s'arrête pendant que le GM (le maître du jeu) écrit, tant que tu n'as pas lu sa réponse, quand la vue de scène est au premier plan et quand l'application est en arrière-plan.
- Une marche sur la carte du monde fait passer les jours que prend son itinéraire.
- Quand le Game Master (GM) dit que des jours passent (un voyage, un repos long, une attente), l'horloge avance de ces jours. Une réponse régénérée ne la fait pas avancer de nouveau. Règle le jour à la main si le nouveau récit prend un temps différent.

## La météo

Le jeu suit la météo avec des calculs fixes, pas avec l'IA. On trouve par exemple le ciel dégagé, les nuages, la pluie, l'orage, la neige, le blizzard, le brouillard, la canicule et la tempête de sable. La météo influence la façon dont le GM décrit chaque scène.

Dans une partie avec un monde généré, la météo vient du climat à l'endroit où l'équipe se trouve sur la carte :

- **Le terrain autour de l'équipe.** Les déserts sont secs et il y pleut rarement, les jungles sont humides et chaudes, les étendues enneigées sont froides, et les montagnes sont plus froides et plus brumeuses que les vallées en contrebas.
- **La latitude et la mer.** Sur une carte du monde entier, le haut et le bas sont proches des pôles, et le milieu est proche de l'équateur. La distance à la mer compte aussi : les côtes ont des hivers doux, et les lieux loin à l'intérieur des terres ont des étés chauds et des hivers rigoureux.
- **La saison locale.** Au sud de l'équateur, l'été tombe pendant l'hiver du calendrier. Près de l'équateur, l'année comporte une saison humide et une saison sèche plutôt qu'un hiver.
- **Une météo qui se déplace.** Les systèmes météorologiques traversent la carte au fil des heures et des jours : le ciel ne passe donc pas d'une canicule au brouillard d'un seul coup, et les lieux proches partagent la même météo. Dans les climats chauds, les averses et les orages se forment l'après-midi.

Quand l'histoire ou le GM demande une météo que le lieu ne peut pas avoir à ce moment-là, comme de la neige dans un désert chaud en été, le jeu utilise la météo possible la plus proche (un vent froid et violent, dans ce cas). Le GM est informé du climat et de ce qui ne peut pas s'y produire.

Une partie sans monde généré déduit le climat du nom du lieu, comme "désert", "port" ou "montagne".

### Des lieux soustraits aux lois de la nature

Une malédiction, un dieu ou une autre grande puissance peut figer l'environnement d'un lieu : une ville plongée dans une nuit sans fin, une forêt maintenue en automne, une vallée sous une neige qui ne fond jamais. Le GM impose ce verrouillage dans l'histoire, et il l'emporte sur le climat et l'horloge jusqu'à ce que le GM le lève :

- **La météo.** Le lieu garde la météo imposée, même si son climat ne pourrait jamais la produire, comme de la neige dans un désert.
- **La saison.** Le lieu reste dans une saison tandis que le reste du monde avance.
- **La lumière.** Il y fait toujours nuit, jour ou crépuscule. L'éclairage de la scène et les effets météo suivent, et la carte du monde teinte les terres concernées.

Un monde peut commencer avec des verrouillages déjà en place. Quand tu construis un monde à partir de tes lorebooks, tout lieu que le lore décrit comme soustrait aux lois de la nature, par exemple "Sallow Vale est toujours en automne" ou "Gotham ne voit jamais le soleil", est verrouillé dès le premier jour. Il en va de même pour un verrouillage décrit par l'univers. Le GM est informé de ces lieux et peut toujours lever un verrouillage dans l'histoire.

Un verrouillage couvre le lieu et tout ce qu'il contient : verrouiller une région verrouille donc aussi ses villes. Quand plusieurs verrouillages se chevauchent, le lieu le plus proche l'emporte : une ville dans une région maudite peut ainsi garder sa propre météo. Un verrouillage peut aussi couvrir le monde entier. La scène ne peut pas lever un verrouillage en demandant une autre météo ; seul le GM le peut.

Pour voir la météo à l'écran, active le réglage **Dynamic weather effects (rain, snow, fog, etc.)** dans les réglages d'apparence. Il est actif par défaut. Des particules de pluie, de neige et de brouillard apparaissent alors par-dessus le jeu et suivent la météo et le moment de la journée. Voir [Réglages d'apparence](../appearance/appearance-settings.md).

## Le moral de l'équipe

Le jeu tient un score de moral d'équipe caché, de 0 à 100. Il comporte cinq niveaux, du plus bas au plus haut : Broken, Low, Steady, High et Inspired.

Le moral monte quand tu gagnes un combat, termines une quête ou trouves un trésor. Il baisse quand tu perds un combat, rates une quête ou perds un allié. Avec le temps, il revient peu à peu vers le milieu. Il n'apparaît pas sous forme de nombre. Il teinte la façon dont le GM décrit l'humeur de ton équipe. Il ne modifie pas tes jets de dés.

## La carte du monde et les autres cartes Overworld

Les sections ci-dessous décrivent les parties **Overworld**, qui ne sont pas encore disponibles. Elles ne s'appliquent que si ton serveur a activé la fonction.

<a id="the-overworld"></a>

### La carte du monde

Une partie avec un monde généré (voir [Créer un monde](getting-started.md#making-a-world)) s'ouvre sur l'**overworld**, la carte du monde : le sol du monde dessiné comme une carte en pixels derrière la narration, avec les forêts, les collines, les côtes et les mers, les routes et les voies entre les localités, chaque localité dessinée selon sa taille, et ton équipe. Les plus grands lieux sont nommés, tout comme celui où tu te trouves. Fais glisser la carte pour regarder autour.

1. Touche ou clique sur une localité, ou choisis-la dans **Places** (lieux), où les plus proches viennent en premier, avec la durée du trajet.
2. Lis sa taille et le trajet depuis l'endroit où tu es : des jours ou des heures, et par quelles voies.
3. Clique sur **Walk there** (y aller). L'équipe suit les voies du monde par l'itinéraire le plus rapide, et les jours de marche passent aussitôt sur l'horloge.

Ton prochain tour indique au GM où tu es allé, combien de temps cela a pris et par quelles voies, pour qu'il raconte l'arrivée. Une deuxième marche avant ton prochain tour reprend là où la première s'est arrêtée.

Les grottes, les mines, les cryptes et les ruines situées à quelques pas d'une localité sont dessinées comme des **sites**. Un nouveau monde en a un ou deux dans chaque région, nommés d'après la localité voisine ("Hollin Caves", "Ashby Ruins"). **Walk there** suit les voies jusqu'à sa localité, puis continue à pied hors de la route. Sur un site, **Enter** (entrer) ouvre sa carte (voir [Donjons, grottes et stations](#dungeons-caves-and-stations)). Un site important pour l'histoire reste **fermé** (estompé, sans trajet ni entrée) jusqu'à ce que le GM l'ouvre. Un outil de création de mondes peut aussi cacher un site jusque-là, ou l'ouvrir dès le départ.

Un lieu en ruine est dessiné en ruine. À la nuit tombée, la carte s'assombrit et les fenêtres s'allument. Chaque famille d'univers (la fantasy, le wuxia, l'époque moderne, les années 1920, la science-fiction, les terres dévastées) a ses propres tuiles. Un kit sans famille dessine des tuiles simples.

Pour changer de vue, utilise **Show the scene** (afficher la scène) et **Show the overworld** (afficher la carte du monde) dans **Game controls** (contrôles du jeu), qui se trouve sur téléphone dans le menu à trois points **Chat tools**. La partie se souvient de ton choix. Un combat et la relecture d'une session utilisent leurs propres écrans.

### Les packs de tuiles

Les packs de tuiles contiennent la palette et chaque tuile (chaque type de sol, les localités selon leur taille, l'équipe, ainsi que les rues, les toits et les habitants d'une ville) sous forme de rangées de pixels. Chaque famille d'univers a un pack intégré. Ouvre **Library → Agents** (Bibliothèque → Agents) et trouve **Tile packs** (packs de tuiles) pour :

- choisir le pack avec lequel chaque univers est dessiné : **Built in** (intégré) désigne son propre pack,
- utiliser **Import a tile pack** (importer un pack de tuiles) avec un fichier `.tilepack.json`,
- utiliser **Export** (exporter) pour partager un pack, ou **Remove** (retirer) pour le supprimer, ce qui ramène tout univers dessiné avec ce pack à ses propres tuiles.

Un pack n'a besoin que des tuiles qu'il change, et tout ce qu'il omet est dessiné simplement. Un pack qui nomme une tuile que Marinara ne dessine pas garde le reste et indique ce qu'il a laissé de côté.

<a id="the-town"></a>

### La ville

Dans une localité, choisis-la sur la carte du monde puis **Enter** pour voir la ville. Elle est disposée à partir du monde : des rues et une place, les lieux que le monde ou l'histoire y placent (nommés sur leurs bâtiments), une grande salle dans un lieu plus important, des ateliers pour les métiers qui font la réputation du lieu, et des habitations. Les habitants sont là où l'heure les place : au travail le jour, sur la place au crépuscule, chez eux la nuit.

Choisis un bâtiment ou la place, ou fais ton choix dans **Places in town** (lieux en ville), pour voir qui s'y trouve et à combien de minutes c'est. **Walk there** fait traverser la ville par les rues, en contournant les bâtiments et tout ce qu'une disposition manuelle a peint, en passant par ses ponts. Les minutes passent sur l'horloge, et ton prochain tour indique au GM où l'équipe est allée et qui s'y trouve. Une visite dans un lieu nommé, comme une auberge que l'histoire a ajoutée, en fait le lieu actuel de l'équipe. **Leave town** (quitter la ville) ramène à la carte du monde. La partie se souvient de la vue où tu étais.

Une ville peut être **disposée à la main** avec un éditeur de monde comme Pixelforge, dans le cadre des modifications manuelles du monde.

- Les bâtiments peuvent être déplacés sur d'autres parcelles. Un bâtiment déplacé sur la parcelle d'un autre échange sa place avec lui, et chaque bâtiment donne toujours sur une rue.
- Le sol peut être peint de rues, de pavés, de terrain dégagé, d'arbres ou d'un puits, mais jamais sous un bâtiment, devant sa porte, au milieu de la place ou sous un étal de marché.
- Qui vit et travaille où ne change jamais, et la durée de la marche vers un bâtiment déplacé se compte depuis sa nouvelle porte.
- L'éditeur refuse une disposition qui ne convient pas à la ville et explique pourquoi. Les lieux que l'histoire ajoute en cours de partie trouvent toujours une parcelle.
- Une disposition peut aussi placer des bâtiments hors des parcelles, peindre des champs, des chemins de terre, de l'eau enjambée de ponts, et des haies, et placer des décorations. La vue de la ville les dessine tous (les décorations seulement avec un pack d'images qui les contient).

<a id="dungeons-caves-and-stations"></a>

### Donjons, grottes et stations

Quand l'histoire passe sous terre ou à bord, le GM peut ouvrir une **carte du lieu** : un donjon, une grotte ou une station, dessiné par-dessus la scène. Elle est disposée à partir de la partie et du nom du lieu : le même lieu a donc toujours les mêmes salles, et y revenir garde la carte telle qu'elle était. Le GM choisit une apparence parmi onze : grottes de roche, de glace, de cristal et de lave ; une crypte, des égouts et un temple ; et les couloirs, le laboratoire, le pont moteur et la serre hydroponique d'une station. Avec un pack de tuiles pour cette apparence, la carte utilise ses graphismes. Sans pack, elle est en couleurs simples.

Un lieu de la ville où l'équipe peut descendre (une grotte, une mine, une crypte, des égouts ou une ruine d'après son nom, ou en science-fiction une épave ou un bunker) affiche **Go down** (descendre) quand l'équipe s'y trouve.

- Il ouvre la même carte à chaque fois, et en sortir ramène l'équipe en ville.
- Si l'équipe est sur une autre carte, quitte d'abord celle-ci.
- Un lieu peut aussi avoir une carte faite à la main avec un éditeur de monde comme Pixelforge. **Go down** ouvre alors cette carte, quel que soit le nom du lieu, dessinée avec le pack qu'elle nomme. Sur une telle carte, la sortie est là où l'équipe est entrée, les éléments de décor ne bloquent jamais le passage, et des personnes se tiennent sur des emplacements nommés aux heures que la carte leur donne. Le GM est informé de qui s'y trouve.

Clique sur un endroit de la carte, ou utilise les flèches du clavier, pour t'y rendre par le chemin le plus court. Les minutes passent sur l'horloge (environ une minute tous les trente pas), et ton prochain tour indique au GM de quelle zone à quelle zone l'équipe a marché. L'étiquette en haut indique la zone actuelle. **Show the scene** et **Show the map** (afficher la carte), dans **Game controls**, font passer de la scène à la carte et inversement.

Pour sortir, reviens à la sortie (un escalier, une échelle ou une trappe) et choisis **Leave** (sortir). Le GM peut aussi fermer la carte quand l'histoire quitte le lieu. Régénérer un tour qui a ouvert une carte, s'y est déplacé ou l'a quittée remet la carte dans l'état d'avant ce tour.

## Guides associés

- [Game Mode : premiers pas](getting-started.md)
- [Game Mode : widgets HUD](hud-widgets.md)
- [Réglages d'apparence](../appearance/appearance-settings.md)
