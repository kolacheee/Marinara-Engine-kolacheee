# Arrière-plans créés par Illustrator

L’agent **Illustrator** peut peindre des arrière-plans pour ton histoire : à la demande, à chaque nouveau lieu, des versions pluie, neige ou brouillard quand la météo change, et des versions aube, jour, coucher du soleil ou nuit quand l’heure change. Ce guide couvre ces possibilités et la réutilisation des images existantes.

Pour les images que tu téléverses et choisis à la main, voir [Bibliothèque d'arrière-plans](../appearance/chat-backgrounds.md). Pour savoir comment un chat choisit l'image à afficher (l'agent Background, les lieux épinglés et les images de galerie), voir [Des arrière-plans qui suivent l'histoire](../roleplay/backgrounds.md).

## Avant de commencer

- Installe **Illustrator** depuis **Bibliothèque → Agents**. Voir [Agent Illustrator](illustrator-agent.md).
- Attribue-lui un modèle d'image : définis la tâche **Images** dans l'encadré **Tâches** de la page Connexions, ou choisis-en un sur l'écran **Ouvrir la configuration** d'Illustrator. Voir [Fournisseurs de génération d'images et configuration](image-providers.md).

Les arrière-plans peints fonctionnent dans les chats Roleplay et Game Mode, pas en mode Conversation. En mode Conversation, l'application indique "Scene background generation is available in Roleplay and Game modes."

## Peindre un arrière-plan maintenant

1. Ouvre **Réglages du chat** avec le bouton à curseurs du chat, puis déplie **Galerie**.
2. Clique sur **Arrière-plan**. Le bouton affiche **Génération...** pendant le traitement.
3. Une fois terminée, la nouvelle image est ajoutée à ta bibliothèque d'arrière-plans et affichée derrière le chat. "Fond généré." le confirme.

Tu n'as pas besoin d'ajouter Illustrator au chat pour cela. Il s'exécute une seule fois et ne lance aucune exécution automatique.

Marinara construit le prompt à partir de la scène : dans une partie, cela inclut le genre, le cadre, le lieu, la météo et le moment de la journée. L'image utilise la taille de canevas **Arrière-plans**, soit 1 280 par 720 pixels, sauf si tu la modifies sous **Paramètres → Médias → Génération d'images**.

Si ça n'a pas marché : "Choose an image generation connection for the Illustrator agent, or mark one as the default image connection." signifie qu'aucun modèle d'image n'a été trouvé. Définis-en un comme indiqué sous **Avant de commencer**. Si le bouton **Arrière-plan** manque, Illustrator n'est pas installé.

## Un nouvel arrière-plan pour chaque nouveau lieu

Avec ce réglage activé, Illustrator peint un arrière-plan quand l'histoire arrive dans un lieu qui n'en a pas, l'enregistre dans ta bibliothèque et l'affiche.

1. Ajoute **Illustrator** au chat : ouvre **Réglages du chat → Agents**, active **Activer les agents**, puis ajoute **Illustrator** depuis **Agents divers**.
2. Sur la carte **Illustrator**, active **Générer les arrière-plans de scène**.

Illustrator examine la scène selon son **Intervalle de génération d'images** (tous les 5 messages, sauf si tu le modifies). Pour qu'il vérifie chaque réponse, utilise les [vérifications par un modèle de décision](#check-every-reply-with-a-decision-model). En Game Mode, l'interrupteur **Illustrator de Game** couvre aussi les arrière-plans.

### Réutiliser les images que tu as déjà

Avant de peindre un nouveau lieu, Illustrator cherche une image que tu as déjà, dans cet ordre :

1. Un arrière-plan épinglé à ce lieu, dans le chat ou dans la galerie d'un personnage. Voir [Épingler un arrière-plan à un lieu](../roleplay/backgrounds.md#pin-a-background-to-a-place).
2. Une image de la bibliothèque dont le nom, ou un tag d'au moins deux mots, apparaît dans le lieu de World State. Par exemple, `generated-guest-bedroom.png`, ou une image avec le tag `guest bedroom`, convient à "Smith House, guest bedroom".
3. Sans lieu dans World State, le nom du lieu écrit par le modèle de prompt d'Illustrator est comparé de la même façon.

La casse, les accents et "'s" ne comptent pas, et le nom le plus précis l'emporte sur un simple `bedroom.png`. Si une image convient, elle est affichée (avec la météo de l'histoire, si cette version existe) et rien n'est peint. Seul un lieu sans correspondance reçoit une nouvelle image.

Si aucun nom ne correspond et que tu as activé **Réutiliser un arrière-plan de la bibliothèque qui ressemble au lieu** sur la carte Illustrator, un [modèle de décision capable de lire les images](../connections/decision-models.md#features-that-look-at-pictures) examine jusqu'à 4 images de la bibliothèque qui partagent un mot avec le lieu et affiche celle qui correspond. Une nouvelle image n'est créée que si aucune ne convient. Ce réglage est désactivé par défaut et grisé sans un tel modèle.

Pour qu'un lieu conserve son image, donne au fichier le nom du lieu (`kitchen.png` pour "Kitchen"), ou ajoute-lui un tag d'au moins deux mots, comme `smith house kitchen` (voir [Ajouter un tag à un arrière-plan](../appearance/chat-backgrounds.md#tag-a-background)). Les tags d'un seul mot comme `kitchen` ou `night` sont ignorés ici, car ils décrivent généralement l'apparence d'une image.

## Versions météo des arrière-plans

Avec ce réglage activé, l'arrière-plan suit la météo de l'histoire. Quand il commence à pleuvoir à l'auberge, Illustrator repeint son arrière-plan avec de la pluie aux fenêtres. À l'intérieur, la pluie animée tombe uniquement derrière les vitres, jamais à travers la pièce.

1. Ouvre **Réglages du chat → Agents → Illustrator**.
2. Active **Weather Versions of Backgrounds** (versions météo des arrière-plans).

Il faut un modèle d'image capable de partir d'une image. La plupart le peuvent, notamment OpenAI, Gemini, NovelAI et ComfyUI avec une entrée d'image. Avec un modèle qui ne le peut pas, l'image reste telle quelle.

Voici ce qui se passe :

- Chaque combinaison d'image et de météo est peinte **une seule fois**. Quand la météo revient, ou que l'histoire retourne à l'auberge sous la pluie, la version enregistrée s'affiche de nouveau sans frais.
- La version est enregistrée à côté de l'original sous le nom `name--wx-rain.png`. Les autres types sont `storm`, `snow`, `blizzard`, `hail`, `fog`, `sand`, `ash`, `embers`, `blossom` et `aurora`, ainsi que `clear` pour une copie sans intempéries d'une image créée au départ par mauvais temps. Une météo inhabituelle reçoit une version nommée avec les mots de l'histoire : une pluie de météores donne `name--wx-meteor-shower.png`.
- Un temps dégagé, ensoleillé, nuageux, venteux et les autres conditions légères gardent l'image de base.
- La météo est lue depuis l'agent **World State**, ou depuis une vérification par un modèle de décision (ci-dessous).
- Cela couvre tous les arrière-plans de ta bibliothèque, que tu les aies choisis, que l'agent Background l'ait fait ou qu'Illustrator les ait peints, ainsi que les lieux épinglés et les arrière-plans de galerie qui suivent un personnage. L'agent **Background** choisit parmi tes images de base, et la version météo correspondante s'affiche quand elle existe.

### Fenêtres : où tombe la météo animée

La première fois qu'une image d'intérieur reçoit une version météo, Illustrator demande aussi au modèle d'image où se trouvent les fenêtres. Il enregistre la réponse sous forme d'un petit masque noir et blanc, partagé par toutes les versions météo de cette pièce. La météo animée (traits de pluie, flocons, pétales) est alors dessinée uniquement sur les vitres.

- Une pièce sans fenêtres ne reçoit aucune météo animée, seulement la couleur de la météo et les éclairs.
- Une aurore, une pluie de météores et les autres météos sans précipitations restent immobiles : l'image les montre, et rien ne bouge par-dessus.
- Les masques sont conservés dans `backgrounds/weather-masks`, dans ton dossier de données.

### Refaire une image météo ou ses fenêtres

Quand le chat affiche une version météo, **Réglages du chat → Agents → Illustrator** présente une ligne sous **Weather Versions of Backgrounds** qui porte le nom de la météo, par exemple **This rain picture** (cette image de pluie) :

- **Remake picture** (refaire l'image) repeint cette version météo à partir de l'image de base.
- **Remake windows** (refaire les fenêtres) demande de nouveau le masque des fenêtres au modèle d'image. Utilise ce bouton quand la pluie tombe sur les coussins ou manque une fenêtre.
- **No moving weather** (aucune météo animée) désactive le masque pour cette pièce. Ses versions météo affichent uniquement la couleur de la météo et les éclairs. **Remake windows** le rétablit.

Si ça n'a pas marché : vérifie que World State affiche une **Météo** pour le chat (ou que la vérification météo ci-dessous est activée), et que **Illustrator** est ajouté au chat avec un modèle d'image.

## Versions des arrière-plans selon l’heure

Avec cette option, l’arrière-plan suit l’horloge de l’histoire. Quand la nuit tombe à l’auberge, Illustrator la repeint de nuit : ciel sombre dehors, lampes et bougies allumées. Le lieu, l’agencement et la caméra restent les mêmes ; seule la lumière change.

1. Ouvre **Réglages du chat → Agents → Illustrator**.
2. Active **Versions horaires des fonds**.

Comme les versions météo, cela nécessite un modèle capable de partir d’une image.

Voici ce qui se passe :

- Il existe quatre moments : **Aube**, **Journée**, **Coucher du soleil** et **Nuit**. L’heure de World State décide : une heure chiffrée (`7:40 PM`, `21:15`) prime, sinon des mots comme « crépuscule », « minuit » ou « tôt le matin ». Avant 5 h et dès 20 h, c’est la nuit ; de 5 à 7 h, l’aube ; de 7 à 17 h, le jour ; de 17 à 20 h, le coucher du soleil.
- Une image est censée montrer l’heure à laquelle elle a été peinte. Illustrator la mémorise pour ses propres images. Pour les autres, un mot d’heure dans le nom ou un tag compte (`tavern-night.png`, `#sunset`) ; sinon, elles sont considérées comme diurnes. Une image diurne reçoit une version nocturne, et une image peinte de nuit une version diurne, jamais une seconde version nocturne.
- Chaque combinaison d’image et d’heure est peinte **une seule fois**, puis réaffichée gratuitement. Les versions sont enregistrées près de l’original sous `name--tod-night.png` (aussi `--tod-dawn`, `--tod-day` et `--tod-sunset`).
- Si les versions météo sont aussi activées, une image couvre les deux : la pluie de nuit donne `name--wx-rain--tod-night.png`, peinte une fois depuis l’image simple. Quand seule la météo change, l’heure reste la même, et inversement.
- L’heure est vérifiée après chaque réponse, pas seulement à l’intervalle d’Illustrator : l’image nocturne apparaît dès que l’horloge de World State atteint la nuit. Cela concerne seulement l’heure ; un nouveau lieu attend toujours le passage d’Illustrator ou la vérification de lieu ci-dessous.
- La teinte du ciel, le soleil, la lune et les étoiles superposés s’effacent sur une version horaire, puisque l’image a déjà son propre ciel.
- Sans heure de World State, une vérification par un modèle de décision peut la déterminer (ci-dessous).

Lorsqu’une version horaire est affichée, la même ligne que pour les images météo apparaît, par exemple **Cette image par temps Nuit**, avec **Recréer l'image**.

Dans la bibliothèque, les versions sont sous leur image simple : sa carte indique leur nombre et, à l’ouverture, les liste sous **Versions météo et horaires**.

## Vérifier chaque réponse avec un modèle de décision

Illustrator n'examine normalement la scène qu'à son intervalle d'exécution : un nouveau lieu peut donc attendre quelques réponses avant de recevoir son arrière-plan. Un [modèle de décision](../connections/decision-models.md), un petit modèle qui répond par oui ou non, peut plutôt vérifier chaque réponse.

Avant de commencer : choisis un modèle de décision dans **Valeurs par défaut** sur la page Connections, puis active **Générer les arrière-plans de scène**, **Variantes météo des arrière-plans**, **Versions horaires des fonds** ou toute combinaison.

1. Ouvre **Réglages du chat → Agents → Illustrator**.
2. Sous **Vérifications du modèle de décision**, choisis une vérification comme **La scène s'est déplacée vers un nouveau lieu**, **La météo a changé** ou **Le moment de la journée a changé**, ou toutes celles activées, comme **Nouveau lieu, changements de météo et de moment de la journée**. Seules les vérifications correspondant à des options actives sont listées. Par défaut : **Désactivé**.

Après chaque réponse :

- La vérification du lieu demande si le dernier message déplace la scène vers un nouveau lieu. Un oui donne un arrière-plan au lieu, en réutilisant si possible une image que tu as déjà. Le modèle de prompt ne rédige un nouvel arrière-plan qu'après un oui.
- La vérification météo demande si la météo change dans le dernier message. Un oui affiche ou peint la version météo de l'arrière-plan actuel. Sans météo dans World State, le modèle de décision choisit aussi le type de météo.
- La vérification horaire demande si l’heure change dans le dernier message. Un oui affiche ou peint la version horaire de l’arrière-plan actuel. Sans heure de World State, le modèle de décision choisit aussi l’aube, le jour, le coucher du soleil ou la nuit.
- Les vérifications ajoutent seulement des occasions d'agir. Les exécutions propres à Illustrator et les changements de lieu de World State comptent toujours.
- Sans réponse (pas de modèle, délai dépassé ou erreur), la vérification est ignorée.

Si ça n'a pas marché : sans modèle de décision choisi, la liste est grisée et indique où en choisir un.

## Relire le prompt avant son envoi

1. Ouvre **Settings → Media → Generation Defaults** (Paramètres → Médias → Valeurs de génération par défaut).
2. Active **Expose media prompts before sending** (afficher les prompts médias avant l'envoi).

Une fenêtre **Examiner le prompt image** s'ouvre alors avant chaque requête d'image, y compris pour les arrière-plans peints. Modifie le prompt et le prompt négatif, puis clique sur **Générer** pour envoyer ou sur **Annuler** pour arrêter. Le texte que tu saisis est envoyé exactement tel quel.

## Guides associés

- [Des arrière-plans qui suivent l'histoire](../roleplay/backgrounds.md) : l'image affichée par un chat, les lieux épinglés et les arrière-plans de galerie.
- [Bibliothèque d'arrière-plans](../appearance/chat-backgrounds.md) : téléverser, taguer et organiser les images, et régler le flou.
- [Agent Illustrator](illustrator-agent.md) : les illustrations de scène, les clips et l'intervalle d'exécution.
- [La galerie du chat](../chats/chat-gallery.md) : la section Galerie et ses boutons.
- [Modèles de décision](../connections/decision-models.md)
