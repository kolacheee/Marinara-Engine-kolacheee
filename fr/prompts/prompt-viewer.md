# Visualiseur de prompts

Le visualiseur de prompts place côte à côte preset, lorebooks, personnages et persona, puis montre le prompt qu’ils composent dans l’ordre d’envoi de Marinara. Clique sur une partie pour la modifier sur place. Les modifications sont enregistrées dans le véritable preset, lorebook, fiche ou persona et apparaissent aussitôt dans les autres éditeurs.

Il vient de l’extension AIO Prompt Viewer and Editor de kolache et fait désormais partie de la nouvelle disposition.

<a id="opening-it"></a>
## L’ouvrir

- **Ordinateur :** le bouton du visualiseur (🥞) dans la barre supérieure, juste après Search.
- **Téléphone ou tablette :** touche le compteur d’onglets pour ouvrir All Tabs, puis le bouton du visualiseur (🥞) à côté de **+**.
- **Partout :** ouvre Search et saisis `prompt viewer`.

Il s’ouvre dans son propre onglet. Changer d’onglet conserve tes choix et modifications non enregistrées ; le fermer demande confirmation s’il reste une modification.

<a id="the-three-columns"></a>
## Les trois colonnes

| Colonne | Utilité |
| --- | --- |
| **Sources** | Choisis un preset, un ou plusieurs lorebooks, un personnage (plusieurs pour un groupe) et un persona. Coche les entrées ou dossiers à inclure dans le prompt. **+** crée un élément ; le crayon ouvre ses réglages. |
| **Prompt** | Ta sélection dans l’ordre d’assemblage : sections du preset, entrées à leurs positions et profondeurs, personnage et persona dans leurs marqueurs. **Validate** cherche les balises XML non fermées et les `{{macros}}` cassées. Glisse les sections pour réordonner le preset. |
| **Editor** | Les champs de la partie sélectionnée. **Enregistrer** enregistre ; **Annuler** abandonne la modification. |

Sur téléphone ou tablette verticale, les colonnes se trouvent derrière **Sources / Prompt / Editor**. Cliquer sur un bloc ouvre Editor.

<a id="inspect-summaries-and-settings"></a>
## Inspect, Summaries et Settings

Les boutons en haut ouvrent ces vues dans la page ; **Retour** revient aux colonnes.

- **Inspecter** montre le prompt tel qu’il serait envoyé au modèle. Avec un chat ouvert, **Include history** demande le prompt exact (macros résolues, historique ajusté) ; **Omit history** montre la structure avec un emplacement pour le chat. Copie-le en texte ou liste JSON de messages.
- **Summaries** exporte tous les résumés de chats de la bibliothèque en Markdown ou JSON, y compris les entrées désactivées. Aucun chat ne doit être ouvert.
- **Settings** règle le traitement de l’historique par Inspect, le nombre de tours d’un chat sans connexion, les badges de Prompt et les couleurs d’Inspect.

<a id="what-it-does-not-show"></a>
## Ce qui n’est pas affiché

- Les agents sont absents de la colonne Prompt ; Inspect les inclut, car il interroge l’Engine.
- Historique, résumés, exemples de dialogue et données des agents sont des emplacements dans Prompt : leur contenu n’existe que lorsqu’un chat s’exécute.
- Le comportement d’un groupe par tour (qui répond, « Respond only as… ») est décrit, pas construit, tant qu’aucun chat n’est ouvert.
