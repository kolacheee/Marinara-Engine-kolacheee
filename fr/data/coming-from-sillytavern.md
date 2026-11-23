# Passer de SillyTavern à Marinara

La plupart des fonctions que tu utilisais dans SillyTavern existent dans Marinara Engine (Marinara dans la suite), parfois sous un autre nom. Trouve le terme que tu connais dans le tableau, puis appuie sur **Me montrer** pour ouvrir l'endroit correspondant dans l'application, ou sur le nom pour lire son guide.

Tu peux aussi saisir le terme de SillyTavern dans la recherche (**Ctrl+K**, ou touche le titre sur un téléphone). "chat completion preset", "world info", "regex" et "author's note" mènent tous à la fonctionnalité de Marinara.

Pour transférer tes personnages, chats, presets et World Info, voir [Importer depuis SillyTavern](importing-from-sillytavern.md). Les chats gardent les dates de leurs messages, leur note d'auteur et leur persona, et les presets gardent leurs réglages d'échantillonnage.

## La même fonction, sous son nom dans Marinara

| Dans SillyTavern | Dans Marinara | Où | |
| ------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------- |
| Presets Chat Completion, AI Response Configuration (échantillonnage) | [Presets](../prompts/presets.md) | Bibliothèque → **Presets**. Température, Top P/K, Min P et les pénalités sont les **Paramètres** du preset | [Montre-moi](#show-presets) |
| Prompt Manager | [Sections de preset](../prompts/presets.md) | Bibliothèque → **Presets**, ouvre un preset → **Sections** | [Montre-moi](#show-presets) |
| Configurations de chat enregistrées, valeurs par défaut des chats | [Profils de réglages](../chats/settings-profiles.md) | Bibliothèque → **Profils de réglages**, ou Nouveau Roleplay → **Utiliser un profil** | [Montre-moi](#show-settingsProfiles) |
| World Info, World Book | [Lorebooks](../lorebooks/overview.md) | Bibliothèque → **Lorebooks** | [Me montrer](#show-lorebooks) |
| Author's Note | [Notes de l'auteur](../roleplay/getting-started.md) | Réglages du chat (Roleplay) | [Me montrer](#show-authorsNotes) |
| Regex | [Scripts regex](../extending/regex-scripts.md) | Bibliothèque → **Scripts regex** | [Montre-moi](#show-regexScripts) |
| Chats de groupe | [Chats de groupe](../chats/group-chats.md) | Ajoute au moins deux personnages à un chat | [Montre-moi](#show-groupChats) |
| Fiches de personnage, salutations alternatives | [Fiches de personnage](../characters/import-export.md) | Bibliothèque → **Personnages** → **Importer**. Tu choisis une salutation alternative au démarrage d'un chat Roleplay | |
| Réponses rapides, STscript | [Réponses rapides et commandes slash](../chats/guided-and-impersonate.md) | À côté du bouton **Envoyer**, ou saisis `/` | [Me montrer](#show-quickReplies) |
| Extensions (résumé, génération d'images…) | [Agents](../agents/agents-overview.md) | Bibliothèque → **Agents**, puis activation par chat | [Me montrer](#show-agents) |
| Résumé, stockage vectoriel, banque de données | [Rappel de mémoire et résumés](../agents/memory.md) | Réglages du chat → **Memory Recall** | [Me montrer](#show-memory) |
| Connexions API, profils de connexion | [Connexions](../connections/connecting-to-a-provider.md) | Bibliothèque → **Connexions** | [Me montrer](#show-connections) |
| Détail du prompt | [Aperçu du prompt](../chats/peek-prompt.md) | La réponse IA la plus récente → **Voir le prompt** | [Me montrer](#show-peekPrompt) |
| Points de contrôle, branches | [Branches](../chats/branches.md) | Un message → **Créer une branche ici** | [Me montrer](#show-branches) |
| Swipes, nouveau tirage | [Swipes](../chats/messages.md) | Les flèches sous une réponse, ou un balayage sur un écran tactile | [Me montrer](#show-swipes) |
| Gestion des personas | [Personas](../characters/personas.md) | Bibliothèque → **Personas** | [Me montrer](#show-personas) |
| Thèmes d'interface, CSS personnalisé | [Thèmes et thèmes CSS](../appearance/custom-css-themes.md) | Paramètres → **Apparence** | [Me montrer](#show-themes) |

**Me montrer** ouvre la page ou lance l'étape quand c'est possible. Pour les fonctions à l'intérieur d'un chat (aperçu du prompt, mémoire), ouvre d'abord un chat ; sinon, le guide s'ouvre.

## Ce qui fonctionne différemment

- **Pas de modèles instruct ou de contexte.** Marinara envoie des messages de chat, et le serveur du modèle applique le modèle de mise en forme propre à celui-ci : il n'y a donc rien à choisir sous **Advanced Formatting** de SillyTavern. Les sections d'un preset remplacent la chaîne d'histoire.
- **Échantillonnage.** Les réglages d'un preset sont les valeurs de départ des chats qui l'utilisent. Les valeurs définies sur la connexion ou dans un chat l'emportent. La longueur maximale de réponse et la taille du contexte appartiennent à la connexion. Top A et la pénalité de répétition n'ont pas de réglage ici.
- **Note d'auteur.** Elle est insérée dans le chat à sa profondeur à chaque réponse. Quand **Post-traitement des messages** est réglé sur **Appliquer** (par défaut), elle est envoyée dans le message utilisateur voisin. Les réglages de fréquence, de position et de rôle de SillyTavern n'ont pas d'équivalent ici. **Voir le prompt** indique où elle a été placée.
- **Chats de groupe.** En Roleplay, un narrateur fait parler tous les personnages par défaut, ce qui utilise moins de tokens. Pour que chaque personnage réponde à son tour, comme dans SillyTavern, ouvre Réglages du chat → **Chat de groupe** et change de mode. Les groupes importés depuis SillyTavern utilisent déjà le mode **Individuel**.
- **Touches.** Entrée ajoute une nouvelle ligne dans un chat et **Ctrl+Entrée** envoie. Active **Envoyer avec Entrée** dans Paramètres → **En discussion** pour envoyer avec Entrée. Les touches fléchées ne passent d'un swipe à l'autre qu'après activation de **Navigation intuitive entre les swipes** dans le même onglet.
- **Réponses rapides.** Ici, ce sont les actions en un clic à côté de **Envoyer** (incarner ton persona, réponses guidées). Les ensembles de réponses rapides de SillyTavern ne s'importent pas.

- **Trois modes de chat.** Marinara répartit les chats entre **Conversation** (messagerie, comme des messages privés), **Roleplay** (longues scènes avec narration) et **Game** (un maître du jeu dirige un monde avec des règles). Chaque nouveau chat te demande lequel tu veux, et sa configuration ne montre que ce qu'utilise ce mode.
- **Lancer un chat.** Un nouveau chat ouvre une courte configuration. Enregistre une configuration que tu utilises souvent comme profil de réglages, et la suivante se fait en une étape : **Utiliser un profil**, puis **Appliquer et démarrer**. Ajoute une étoile à un profil pour en faire le profil par défaut des nouveaux chats de ce mode.
- **La recherche trouve tout.** **Ctrl+K** trouve les chats, personnages, réglages et guides, exécute des commandes et répond aux questions avec l'aide de Professor Mari.
- **Professor Mari.** L'assistante intégrée de Marinara répond aux questions sur l'application et peut créer des personnages, lorebooks et agents pour toi. Ouvre son chat depuis l'accueil.

## Guides associés

- [Importer depuis SillyTavern](importing-from-sillytavern.md)
- [Profils de réglages](../chats/settings-profiles.md)
- [Réglages du chat](../chats/chat-settings.md)
