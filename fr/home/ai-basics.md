# Les bases de l'IA : modèles, tokens et contexte

Tu découvres le chat avec l'IA ? Cette page explique les quelques termes utilisés dans les autres guides. Tu n'as pas besoin de compte pour la lire. La visite **Les bases de l'IA**, sur l'écran d'accueil, te les présente pas à pas.

## Qu'est-ce qu'un modèle d'IA ?

Un modèle d'IA (aussi appelé grand modèle de langage, ou LLM) est un programme qui a lu énormément de textes et appris à prédire la suite. Quand tu envoies un message, il écrit sa réponse un petit morceau à la fois, en choisissant à chaque fois une suite probable.

Il ne fait pas de recherches pendant qu'il écrit. Tout ce qu'il sait vient de ce qu'il a lu avant la fin de sa création, et de ce que Marinara lui envoie avec ton message. C'est pourquoi un personnage ne connaît que le contenu de sa fiche, du chat et des faits sur ton univers ajoutés par Marinara.

## Où tourne un modèle ?

Marinara est l'application dans laquelle tu discutes. Elle ne contient pas elle-même de gros modèle. Elle envoie ton chat à l'un d'eux :

- **Un service sur internet**, comme OpenRouter, NanoGPT, OpenAI ou Anthropic. Tu y crées un compte, tu obtiens une clé API (un code secret qui permet à Marinara d'utiliser ton compte), et le service fait tourner le modèle. La plupart des services facturent à l'usage. Certains proposent des modèles gratuits.
- **Un modèle sur ton propre ordinateur**, comme le [Modèle intégré](../connections/local-model.md). Il ne demande aucun compte et ne coûte rien, mais il est plus petit et plus lent que ceux des grands services, et c'est ton ordinateur qui fait le travail.

Voir [Se connecter à un fournisseur d'IA](../connections/connecting-to-a-provider.md) pour ajouter l'un ou l'autre.

## Les tokens

Les modèles lisent et écrivent en tokens, de petits morceaux de texte. Un token représente environ trois quarts d'un mot anglais : 100 tokens correspondent donc à environ 75 mots. Les services comptent les tokens pour fixer leurs prix et leurs limites : tu paies généralement les tokens que tu envoies et ceux que tu reçois.

## La fenêtre de contexte

Un modèle ne peut lire qu'un nombre limité de tokens à la fois. Cette limite, c'est sa fenêtre de contexte. À chaque réponse, Marinara envoie au modèle les instructions, la fiche de personnage, ton persona, les faits sur ton univers et tout ce qui peut tenir du chat.

Dans un long chat, les messages les plus anciens ne tiennent plus dans le contexte : le modèle les oublie donc. Marinara peut ramener les éléments importants grâce aux résumés et à Memory Recall. Voir [Memory Recall et résumés de chat](../agents/memory.md).

## Différents modèles pour différentes tâches

Marinara peut utiliser plusieurs types de modèles :

| Type                       | Son rôle                                                                                                               | Nécessaire ?                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Modèle de chat**             | Écrit les réponses.                                                                                                        | Oui, un seul suffit pour commencer.       |
| **Modèle de décision**         | Répond à de petites questions sur le chat : oui ou non, quelle option choisir parmi quelques possibilités, ou quelle quantité. Certains peuvent aussi regarder des images.                                           | Facultatif.                          |
| **Modèle d'embeddings**        | Transforme un texte en nombres qui représentent son sens, pour que Marinara retrouve des faits sur ton univers et des souvenirs par leur sens. Il n'écrit jamais de texte. | Facultatif. Un petit modèle est intégré. |
| **Lecture d'images**          | Un modèle capable de regarder une image et de la décrire.                                                                        | Facultatif.                          |
| **Image, vidéo et voix** | Des services distincts qui créent des images, des clips et de la parole. Un modèle de chat ne le peut pas.                                                | Facultatif.                          |

Tu peux commencer avec un seul modèle de chat pour tout, et ajouter les autres quand une fonction en demande un. Voir [Choisir le modèle de chaque tâche](../connections/connecting-to-a-provider.md#choosing-the-model-for-each-job).

## Prompts et presets

Le prompt, c'est tout le texte que Marinara envoie au modèle pour une réponse. Un preset décide de son contenu et de son ordre. **Voir le prompt**, dans un chat, affiche le prompt exact qui a été envoyé. Voir [Éditeur de presets et gestionnaire de prompts](../prompts/presets.md).

## Guides associés

- [Se connecter à un fournisseur d'IA](../connections/connecting-to-a-provider.md)
- [Modèles de décision](../connections/decision-models.md)
- [Recherche sémantique dans les lorebooks](../lorebooks/semantic-search.md)
- [Professor Mari](professor-mari.md)
