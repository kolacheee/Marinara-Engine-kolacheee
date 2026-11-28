# Génération guidée et Impersonate

Deux façons d'orienter un chat. La génération guidée pointe la prochaine réponse dans une direction sans publier de message visible. Impersonate fait écrire ta propre réponse par le modèle. Le menu Quick replies (réponses rapides) place les deux à côté de **Send** (envoyer).

## Orienter une réponse avec /guided

Ton indication reste hors personnage. Elle façonne la réponse, mais ne s'affiche pas comme un message du chat.

1. Saisis `/guided` suivi de ton indication dans le champ de message.
2. Appuie sur <kbd>Enter</kbd> ou clique sur **Send**.

Le modèle écrit sa prochaine réponse en suivant ton indication. Par exemple :

```text
/guided make him admit he is lying
```

Tu peux saisir `/narrator`, `/narrate` ou `/nar` à la place de `/guided`. Dans un chat de groupe, vise un seul personnage avec `respond as`, `reply as` ou `respond for` :

```text
/guided respond as Alice make her admit she is lying
```

## Guider une régénération

Cette méthode reprend le texte de ton champ de message comme indication ponctuelle pour une régénération.

1. Ouvre **Settings → Chatting → Editing & Swipes** (Paramètres → Chat → Édition et swipes) et active **Guide swipes/regens with chat input** (guider les swipes et les régénérations avec la saisie du chat). Ce réglage est désactivé par défaut.
2. Dans un chat, saisis une indication dans le champ de message, sans l'envoyer.
3. Clique sur **Regenerate** (régénérer) sur le message de l'IA. Quand le champ contient du texte, le bouton s'intitule **Regenerate (guided)**.

Ton indication reste ensuite dans le champ : tu peux l'ajuster et régénérer de nouveau. Pour qu'elle soit plutôt effacée, désactive **Keep guidance after regenerating** (garder la consigne après la régénération) dans **Settings → Chatting → Message Box** (Paramètres → Chat → Zone de saisie).

Si ça n'a pas marché : le bouton doit s'intituler **Regenerate (guided)**. S'il affiche seulement **Regenerate**, le réglage est désactivé ou le champ est vide.

<a id="read-stored-guidance"></a>

## Relire la consigne enregistrée

Marinara enregistre l'indication qui a façonné une réponse.

1. Clique sur l'icône **Stored guidance** (consigne enregistrée), un parchemin, sur le message de l'IA.
2. Une fenêtre intitulée **Stored guidance** affiche l'indication.

La fenêtre précise d'où vient l'indication : **/guided**, **Guided regenerate** ou **Game start** (la configuration de Game Mode). Pour les indications issues de `/guided` et de la régénération guidée, **Copy /guided** (copier la commande /guided) copie une commande `/guided` prête à l'emploi, que tu peux coller dans un autre chat.

## Écrire ta réponse avec Impersonate

Impersonate fait écrire ton prochain message par le modèle, avec la voix de ton persona. Le persona est le personnage que tu incarnes, inscrit sous la forme `{{user}}`. Voir [Personas utilisateur](../characters/personas.md).

Avant de commencer : Impersonate ne fonctionne que dans les chats Roleplay. En mode Conversation, tu vois "Impersonate is not available in Conversation mode." Il n'est pas non plus disponible en Game Mode.

1. Saisis `/impersonate` dans le champ de message. Ajoute une indication derrière si tu veux.
2. Appuie sur <kbd>Enter</kbd> ou clique sur **Send**.

Le modèle publie un message utilisateur dans la peau de ton persona. Par exemple, ceci écrit un message qui pose une question sur la météo :

```text
/impersonate ask about the weather
```

L'alias court est `/imp`. **Regenerate** fonctionne sur un message écrit par Impersonate : tu peux donc en obtenir une autre version.

Un message publié compte comme ton tour : les agents et les trackers s’exécutent comme pour un message que tu écris, sauf si **Ignorer les agents** est activé. Choisir une option CYOA avec **Utiliser le CYOA comme direction** activé demande aussi la réponse du personnage juste après. Pour lire et modifier le message avant tout cela, fais plutôt écrire un brouillon à Impersonate.

### Écrire d’abord un brouillon

Le brouillon va dans la zone de message plutôt que dans le chat. Il n’est pas enregistré et rien ne s’exécute avant son envoi : ni réponse du personnage, ni agents, ni trackers, ni changement de l’état du monde.

1. Ouvre **Réglages du chat** dans un chat Roleplay et trouve la section **Incarner**.
2. Règle **Destination du résultat** sur **Brouillon de message**. Le réglage par défaut est **Publier**.
3. Tape `/impersonate`, suivi d’une consigne si tu le souhaites, puis appuie sur <kbd>Enter</kbd>.

Le brouillon s’affiche progressivement dans la zone de message. Une ligne au-dessus indique **Rédaction de ton prochain message…** pendant la rédaction ; clique sur **Arrêter** à cet endroit ou sur le bouton d’arrêt dans la zone pour garder le texte déjà écrit. Une fois terminé, modifie le texte et clique sur **Envoyer**. Jusqu’à l’envoi, la ligne propose :

| Bouton | Effet |
| --- | --- |
| **Refaire** | Réécrit le brouillon avec la même consigne et remplace celui de la zone de message. |
| **Annuler** | Jette le brouillon et rétablit le contenu précédent de la zone. |

La rédaction continue si tu changes de chat ou d’onglet. À ton retour, le brouillon se trouve dans la zone de message du chat concerné. Chaque chat a son propre brouillon.

Pour choisir une seule fois sans modifier le réglage :

| Commande | Effet |
| --- | --- |
| `/impersonate_draft` | Écrit un brouillon. Aussi `/impd` et `/imp_draft`. |
| `/impersonate_post` | Publie le message. Aussi `/impp` et `/imp_post`. |

Avec **Réponses rapides** activé, le menu à côté de **Envoyer** propose aussi les deux : **Incarner** suit le réglage et la seconde action fait l’inverse. Un brouillon peut partir d’une zone vide ; le modèle choisit alors ce que tu dis.

Avec **Utiliser le CYOA comme direction** activé et **Destination du résultat** sur **Brouillon de message**, cliquer sur une option CYOA écrit un brouillon avec cette option comme consigne. Les options restent affichées jusqu’à l’envoi.

### Les réglages d'Impersonate

Ces réglages s’appliquent à chaque `/impersonate` dans tous tes chats, sur toutes les fenêtres et tous les appareils. Ouvre **Réglages du chat** dans un chat Roleplay et trouve **Incarner**. Voir [Réglages du chat](chat-settings.md) pour ouvrir le panneau.

| Contrôle | Ce qu'il fait |
| --- | --- |
| **Destination du résultat** | **Publier** ajoute immédiatement le message au chat. **Brouillon de message** l’écrit dans la zone de message pour que tu le modifies et l’envoies toi-même. Voir [Écrire d’abord un brouillon](#write-a-draft-first). Par défaut : **Publier**. |
| **Prompt Template** (modèle de prompt) | Une instruction facultative envoyée à chaque impersonation. Laissé vide, le champ utilise le prompt propre au chat, ou la valeur par défaut intégrée. Il accepte `{{user}}`, `{{persona_description}}` et `{{impersonate_direction}}`, des espaces réservés que Marinara remplace par du vrai texte. Choisis **Built-in default** (valeur par défaut intégrée) pour lire la valeur par défaut, **Copy built-in default to edit** (copier la valeur par défaut intégrée pour la modifier) pour partir d'une copie, **Save as** (enregistrer sous) pour garder un modèle nommé, et **Delete template** (supprimer le modèle) pour en retirer un. |
| **Preset** | Un preset de prompt réservé aux réponses d'Impersonate. Par défaut : **Use chat default** (utiliser la valeur par défaut du chat). Voir [Presets](../prompts/presets.md). |
| **Connection** (connexion) | Le modèle des réponses d'Impersonate, par exemple un modèle moins cher ou plus rapide. Par défaut : **Use chat default**. Tu peux aussi choisir **Random**. Voir [Se connecter à un fournisseur d'IA](../connections/connecting-to-a-provider.md). |
| **Ignorer les agents** | Ignore les agents (trackers, routeurs de lorebook et aides similaires) pendant impersonate. Cela accélère la génération et évite de modifier l’état du monde. Désactivé par défaut. Un brouillon les ignore toujours. Voir [Agents](../agents/agents-overview.md). |
| **Send Public Faces** (envoyer les faces publiques) | Dans les chats Roleplay, un personnage qui a une **Public Face** (face publique) apparaît dans le prompt d'Impersonate avec seulement son nom et sa face publique, pour que ta réponse ne connaisse que ce que tu pourrais savoir. Cela remplace tout le reste de ce qu'envoie sa fiche : Description, Personality, Backstory, Appearance, Scenario, System Prompt, les exemples de dialogue, les attributs RPG, Post-History Instructions et Depth Prompt. Un personnage dont la face publique est vide garde sa fiche complète. Les macros que tu places dans un preset ou un modèle de prompt d'Impersonate, comme `{{description}}`, envoient toujours ce qu'elles désignent. **Régénérer** conserve le réglage utilisé pour écrire le message. Désactivé par défaut. Voir [Onglet Card](../characters/creating-and-editing-characters.md#card-tab). |
| **Use CYOA as direction** (utiliser le choix CYOA comme indication) | Un clic sur une option CYOA (choose your own adventure, l'aventure dont tu es le héros) l'utilise comme indication d'Impersonate au lieu de la publier. Désactivé par défaut. Si **Add CYOA choices to the message box instead of sending them** (ajouter les choix CYOA à la zone de saisie au lieu de les envoyer) est activé dans **Settings → Chatting → Message Box**, un clic ajoute seulement le texte à ton champ de message, et ce réglage n'a aucun effet. |

### Définir un prompt pour un seul chat

1. Saisis `/impersonate_prompt` suivi de ton prompt entre guillemets.
2. Appuie sur <kbd>Enter</kbd>.

```text
/impersonate_prompt "You will now play as my OC:"
```

Pour revenir à la valeur par défaut, saisis `/impersonate_prompt reset`. L'alias est `/imp_prompt`.

## Ajouter des Quick replies à côté de Send

Les Quick replies ajoutent des alternatives à **Send** en un clic : plus besoin de saisir une commande slash.

1. Ouvre **Settings → Chatting → Message Box**.
2. Active **Quick replies**. Ce réglage est désactivé par défaut.
3. Déplie-le pour choisir les actions affichées. Une fois le réglage activé, les trois actions sont actives par défaut.

| Action | Ce qu'elle fait |
| --- | --- |
| **Post only** (publier seulement) | Ajoute ton message saisi au chat, sans réponse. La commande `/send <message>` fait la même chose. |
| **Guide reply** (guider la réponse) | Envoie ton texte saisi comme indication `/guided`. |
| **Incarner** | Génère une réponse de ton persona en prenant ton texte comme consigne. Suit **Destination du résultat** ; dans Roleplay, une seconde action à côté fait l’inverse (**Incarner en brouillon** ou **Incarner et publier**). Masqué dans les chats Conversation. |

Quand une seule action est active, son bouton se place à côté de **Send**. Quand plusieurs le sont, elles se regroupent dans un bouton à trois points (**Quick replies**) qui ouvre un menu.
