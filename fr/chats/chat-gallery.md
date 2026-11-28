# La galerie du chat

La **Galerie** contient les images et les vidéos d'un chat : illustrations, selfies, arrière-plans peints, images de storyboard et tout ce que tu téléverses. C'est une section des **Réglages du chat**. Sur un ordinateur, tu peux l'ouvrir dans sa propre fenêtre (voir [Vue d'ensemble des réglages du chat](chat-settings.md#popping-a-section-out-into-its-own-window)).

La galerie d'un chat appartient à ce chat. Les images que tu veux garder pour un personnage, quel que soit le chat dans lequel il se trouve, vont dans la galerie du personnage. Voir [Galeries des personnages et des personas](../characters/galleries.md).

## Images et vidéos

La **Galerie** comporte deux onglets, **Images** et **Vidéos**. Chaque onglet affiche le nombre d'éléments qu'il contient. L'onglet **Vidéos** contient les vidéos de scène des chats Roleplay et Game Mode, et les messages vidéo des chats Conversation.

En haut de la section, les boutons d'action n'apparaissent que si la fonctionnalité correspondante s'applique au chat :

- **Illustrer** : lance l'agent Illustrator pour générer ponctuellement une image de scène. Voir [Agent Illustrator](../media/illustrator-agent.md).
- **Selfie** : génère un selfie de personnage en mode Conversation.
- **Arrière-plan** : peint et applique un arrière-plan pour la scène en cours. Voir [Arrière-plans créés par Illustrator](../media/scene-backgrounds.md#paint-a-background-now).
- **Vidéo** : crée une vidéo de scène à partir de la dernière illustration. En mode Conversation, ce bouton envoie plutôt un message vidéo d'un personnage ; voir [Messages vidéo](../conversation/selfies.md#video-messages).
- **Créer un storyboard** : génère des images clés pour le dernier tour de Game Mode ou le dernier épisode Roleplay terminé lorsque Storyboard est actif.
- **Browse Images** (parcourir les images) : ouvre un navigateur d'images enregistrées à insérer.
- **Voir le storyboard** : ouvre le dernier storyboard de Game Mode.

Sous les boutons se trouve la zone de dépôt **Téléverser des images**. Fais-y glisser des images pour ajouter tes propres images à la galerie de ce chat.

### Actions sur chaque image

Passe le pointeur sur une image dans l'onglet **Images**, ou touche-la sur mobile, pour voir ses actions :

- Ouvre l'image en taille réelle (**Ouvrir l'image de la galerie**).
- **Épingler au chat** : épingle l'image au chat sous forme d'image flottante. Fais-la glisser pour la déplacer et utilise la poignée dans son coin pour la redimensionner. Elle conserve sa position et sa taille lorsque tu recharges la page dans ce navigateur. Le bouton de verrouillage à côté du bouton de fermeture empêche de la déplacer ou de la redimensionner tant que tu ne l'as pas déverrouillée.
- **Télécharger l'image** : enregistre l'image sur ton appareil.
- **Animer l'illustration** : transforme cette image en vidéo de scène.
- **Copier le prompt** : copie le prompt d'image enregistré, le texte que Marinara envoie à l'IA pour créer l'image. Si l'image n'a pas de prompt enregistré, le bouton affiche **Aucun prompt enregistré** et est désactivé.
- Le bouton de tag dans le coin supérieur gauche de l'image : **Use as background** (utiliser comme arrière-plan) lui attribue une étiquette d'arrière-plan et te demande quels lieux elle représente, par exemple `John's bedroom`.
- **Add to a character's or persona's gallery** (ajouter à la galerie d'un personnage ou d'un persona), le bouton en forme de personne : conserve l'image dans la galerie du personnage ou du persona, pour qu'elle reste disponible au-delà de ce chat. Son étiquette d'arrière-plan et ses lieux sont conservés, et elle suit ensuite ce personnage dans chaque chat. Voir [Arrière-plans qui suivent un personnage](../roleplay/backgrounds.md#backgrounds-that-follow-a-character).
- **Supprimer l'image de la galerie** : supprime l'image après ta confirmation.

### Régénérer une image

Tu peux générer à nouveau une image sans régénérer la réponse à laquelle elle appartient. Cela fonctionne pour les images de la galerie du chat qui ont un prompt enregistré, comme les illustrations, les selfies et les images de storyboard.

1. Ouvre l'image en taille réelle, depuis la galerie ou depuis le message qui la contient.
2. Clique sur **Régénérer l'image** (le bouton avec une flèche circulaire en haut à droite de l'image).
3. Modifie ce que tu veux dans les champs sous l'image : **Prompt**, **Prompt négatif**, un champ pour chaque personnage sous **Prompts de personnage** si l'image en avait, ainsi que le modèle d'image.
4. Clique sur **Générer l'image**, ou sur **Annuler** pour laisser l'image telle quelle.

La nouvelle image devient la version sélectionnée du message. Les résultats précédents restent dans une seule vignette Gallery avec un compteur. Chaque version garde prompt, prompt négatif et autres détails enregistrés. Les références sont renvoyées depuis les avatars actuels, puis les images d’entrées de lorebook utilisées à l’origine. Stability AI, Arli AI, SD Web UI et Draw Things ne reçoivent pas ces dernières. Certaines anciennes images n’ont pas enregistré les prompts négatifs ou de personnages ; l’éditeur le signale.

<a id="image-versions"></a>
### Versions d’image

Ouvre une image empilée pour choisir une version. Dans une Gallery, les flèches gauche/droite, touches et balayages horizontaux changent de vignette. Depuis un message, tu restes dans sa pile. Les commandes haut/bas, touches et balayages verticaux sur l’image changent de version. Dézoome avant de naviguer. Faire défiler le prompt ne change pas de version.

Clique sur l’image, l’en-tête du prompt ou le bouton de repli pour utiliser Haut/Bas pour les versions. Clique sur le texte ou Copier pour faire défiler le prompt. Les commandes restent visibles pendant régénération et édition. Applique ou efface le masque avant de changer ; les commandes sont suspendues pendant la génération.

Le choix est enregistré et affiché dans le chat après rechargement. Régénérer ou modifier une ancienne version ajoute un résultat à la même pile sans perdre les suivantes. Un chat dérivé garde son propre choix.

Avec **Enregistrer automatiquement les images générées dans les galeries des personnages**, les régénérations et éditions gardent les galeries de personnage et persona d’origine. Elles regroupent aussi les versions. Chaque galerie mémorise son choix sans changer celui du chat. Les entrées partagent les fichiers sans copies supplémentaires. Ouvrir une galerie restaure les versions manquantes d’anciennes piles si l’entrée d’origine pointe encore vers le chat source. Les versions supprimées d’une galerie déjà regroupée restent supprimées.

Dans la Gallery du chat, utilise **Supprimer l'image de la galerie** sur la vignette ou Supprimer dans le visualiseur :

- **Delete this version** retire la version affichée. Si elle était sélectionnée, la plus récente restante apparaît.
- **Delete other versions** garde celle affichée et retire les autres.
- **Delete entire stack** retire toutes les versions et leurs pièces jointes du chat.

La suppression est définitive. **Annuler** garde tout.

## Guides associés

- [Agent Illustrator](../media/illustrator-agent.md) : illustrations et clips de scène.
- [Arrière-plans créés par Illustrator](../media/scene-backgrounds.md) : le bouton **Arrière-plan**, les versions selon la météo et les pochoirs de fenêtre.
- [Galeries des personnages et des personas](../characters/galleries.md)
- [Génération de vidéos de scène](../media/scene-video.md) : transforme une image de la galerie en vidéo.
