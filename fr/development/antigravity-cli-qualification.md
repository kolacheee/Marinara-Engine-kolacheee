# Évaluation de l'intégration des abonnements avec Antigravity CLI

Cette note de recherche pour les développeurs concerne [#8143](https://github.com/Pasta-Devs/Marinara-Engine/issues/8143), vérifiée une première fois le 23/10/2026 puis le 19/11/2026 avec les versions officielles 1.5.11 et 1.5.12 de `agy` pour Windows. Marinara Engine **ne propose pas** de connexion par abonnement à Antigravity, et l'issue reste fermée comme non prévue. Les exclusions de l'agent personnalisé ont empêché les rappels testés lors de cette nouvelle vérification, mais le sous-processus MCP d'une extension découverte globalement a tout de même démarré dans les deux versions. L'isolation de l'exécution n'est toujours pas validée.

## Interfaces officielles établies

La CLI officielle `agy` permet la connexion au compte avec les identifiants mémorisés et la génération de texte sans interface interactive. Son protocole documenté comporte les événements `init`, `step_update` et `result`, avec des messages utilisateur JSON sur stdin pour l'entrée en flux. Lors de la nouvelle vérification sous Windows, `agy models` a répertorié `gemini-4-neon-high`, et des requêtes limitées dans le temps vers ce modèle ont abouti avec la connexion Google AI Pro existante de l'utilisateur. Les modèles accessibles au compte doivent être obtenus depuis la CLI installée, et non déduits de cet exemple. `--print-timeout 0` attend la fin de l'opération, et `--disable-slash-commands` désactive l'expansion des commandes en mode print. Consulte le [mode sans interface interactive](https://antigravity.google/docs/cli/headless/) et la [référence des options de la CLI](https://antigravity.google/docs/cli/reference/).

La connexion au compte de la CLI utilise le coffre d'identifiants du système d'exploitation. Son mode distinct avec clé d'API Gemini exige `modelProvider: "gemini"` et `GEMINI_API_KEY` ; un adaptateur d'abonnement ne doit pas choisir silencieusement ce mode de facturation. Les méthodes d'authentification programmatiques documentées du SDK Python sont les clés d'API Gemini, les identifiants Vertex/Google Cloud et les modèles locaux. Elles n'établissent pas l'authentification par abonnement grand public pour une solution de remplacement utilisant le SDK. Consulte [Authentification](https://antigravity.google/docs/install/#programmatic-authentication) et la [présentation du SDK](https://antigravity.google/docs/sdk/overview/).

## Résultat actuel de l'isolation de l'exécution

Les définitions officielles d'agents personnalisés offrent des contrôles sur les outils, MCP et les personnalisations. Le guide des extensions décrit `inheritCustomizations` comme le contrôle de l'héritage des compétences, règles et rappels, et `inheritMcp` comme celui des serveurs MCP hérités de l'espace de travail. L'annonce initiale de `excludeDefaultComponents: true` conserve les rappels après invocation ; cette option seule n'établit donc pas l'isolation. La configuration combinée ci-dessous a empêché les rappels de test en 1.5.11, mais pas le démarrage de tous les sous-processus MCP. Consulte les [sous-agents personnalisés](https://antigravity.google/docs/subagents/), la [création d'extensions](https://antigravity.google/docs/build-plugins/) et le [journal des modifications de la CLI](https://antigravity.google/docs/changelog).

Les rappels peuvent provenir d'un espace de travail, du fichier global `~/.gemini/config/hooks.json` et d'extensions installées. Ils couvrent les événements de session, d'invocation du modèle, d'outil et d'arrêt. La documentation actuelle des réglages et le [schéma officiel des réglages](https://antigravity.google/schemas/v1/settings.json) indiquent explicitement qu'une entrée `hooks` dans `settings.json` n'est pas chargée. Y écrire une entrée vide ne désactiverait pas les véritables sources de rappels. Consulte les [rappels](https://antigravity.google/docs/hooks) et les [réglages de la CLI](https://antigravity.google/docs/settings?tab=cli).

L'aide de la version 1.5.11 installée présente `--settings` comme un moyen de remplacer des clés de `settings.json` pour la session uniquement, en les fournissant directement ou dans un fichier. Cela permet de définir temporairement la confiance accordée à l'espace de travail et les permissions sans réécrire les préférences persistantes. Cela ne crée pas de profil de configuration distinct : `--settings '{"hooks":{}}'` se termine avec le code 1 et `unknown setting "hooks"`. L'aide installée ne proposait aucune option de désactivation des rappels ni de profil isolé authentifié.

La documentation actuelle des réglages indique que `/hooks` permet d'ajouter, de modifier et d'activer ou désactiver les rappels, en enregistrant les changements dans les fichiers de configuration. La commande sans interface interactive `-p "/hooks" --output-format json` a renvoyé un inventaire structuré lors de la nouvelle vérification. L'inventaire et les activations ou désactivations enregistrées ne garantissent pas qu'une invocation ultérieure exclue les personnalisations exécutables. Un changement de répertoire, une liste `tools` vide, une instruction de ne pas utiliser les outils ou un abandon après le démarrage ne suffisent pas à prouver l'isolation de l'exécution.

Les rapports d'intégration de tiers sont des pistes de recherche. Leurs affirmations sur les outils inertes, les journaux de résolution d'agents ou l'héritage des personnalisations doivent être reproduites avec la version officielle avant de devenir des garanties pour Engine.

## Vérification de la version d'octobre 2026

L'[installateur officiel](https://antigravity.google/cli/install.sh) et son [manifeste de version Darwin ARM64](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/darwin_arm64.json) ont été examinés sans exécuter l'installateur. Le manifeste a sélectionné l'[archive versionnée de `agy` 1.4.6 pour Darwin ARM64](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.4.6-4884751325200384/darwin-arm/cli_mac_arm64.tar.gz) et cette somme SHA-512 :

```text
25af49004dd6d6013e6231278e2711b95641c8e54b661be871b3519c0a850053d4e707f46b47aa66e84ff9480041b13908194b48b1a97f84f2a22071d9c9fd3f
```

La somme de contrôle de l'archive correspondait. Son binaire a été extrait dans un répertoire temporaire propre à la tâche. Seuls `--version` et `--help` ont été exécutés, dans un bac à sable macOS interdisant l'accès au réseau, la lecture/écriture du dossier personnel et l'accès au service du trousseau. Les deux se sont terminés avec succès. L'aide ne présentait aucune option de désactivation des rappels, de profil isolé ou de répertoire de configuration.

Cette vérification **n'a pas** installé ni authentifié la CLI, inspecté des identifiants, invoqué un modèle, énuméré les modèles d'un compte connecté ou testé l'exécution des rappels. Elle corrobore l'inventaire public des options ; elle ne prouve pas que l'isolation est impossible et ne valide pas la génération par abonnement.

## Vérification sous Windows de novembre 2026

La CLI `agy` installée indiquait la version 1.5.11. Sa somme SHA-512 correspondait à celle observée dans le [manifeste officiel Windows AMD64](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/windows_amd64.json), mais cette réponse initiale du manifeste n'a pas été conservée. Le manifeste courant est ensuite passé à la version 1.5.12. Pendant la revue, l'[exécutable Windows versionné 1.5.11](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.11-6132547114106880/windows-x64/cli_windows_x64.exe) a été téléchargé indépendamment et sa somme calculée sans l'exécuter ; ses 234 827 416 octets donnaient la même somme SHA-512 que l'exécutable installé :

```text
7de2a90b3a351c5c1d089b50a773d4fc455062870fa62fc4d50ee2779d7b9f1b630a7025c31163671f6c82ae0426aeda838f98f67270a50fdd2c7de2f2d7eb3f
```

Les tests ont été exécutés dans un espace de travail temporaire propre à la tâche, avec l'en-tête suivant dans `.agents/agents/me-isolation-probe.md` :

```yaml
name: me-isolation-probe
description: Harmless execution-isolation qualification fixture.
mainAgent: true
subagent: false
tools: []
inheritCustomizations: false
inheritMcp: false
excludeDefaultComponents: true
commandExecutionPolicy: off
```

La [référence officielle de l'en-tête des agents personnalisés](https://antigravity.google/docs/subagents/) documente `mainAgent`, `subagent`, `tools` et `commandExecutionPolicy`. Les contrôles d'héritage et d'exclusion sont décrits dans le guide des extensions et le journal des modifications cités plus haut. La configuration de test a été évaluée dans son ensemble ; la sélection réussie de l'agent ne prouve pas que chaque champ a été appliqué indépendamment.

La génération utilisait `--settings <session-settings-json> --agent me-isolation-probe --model gemini-4-neon-high --disable-slash-commands --print-timeout 40s --output-format stream-json -p <prompt>`, avec une limite indépendante de 55 secondes pour le sous-processus. Les réglages JSON fournis directement accordaient la confiance à l'espace de travail temporaire, sélectionnaient le mode d'agent par défaut, désactivaient les scripts personnalisés de statut et de titre et sélectionnaient le mode de permissions indiqué ci-dessous. Aucune permission n'a été contournée.

L'objet de réglages avait cette forme, avec `<temporary-workspace>` remplacé par le répertoire de test et `toolPermission` défini sur le mode de permissions de la ligne :

```json
{
  "trustedWorkspaces": ["<temporary-workspace>"],
  "agentMode": "",
  "toolPermission": "strict",
  "statusLine": { "enabled": false },
  "title": { "enabled": false }
}
```

Les variables d'environnement activant les clés API et ADC ont été retirées de l'environnement du sous-processus de test ; aucun identifiant n'a été extrait ni copié.

Les rappels de test ajoutaient les noms d'événements à des fichiers témoins distincts pour `SessionStart`, `PreInvocation`, `PostInvocation` et `Stop`. Les serveurs MCP de test locaux en Python ajoutaient un marqueur de démarrage avant de répondre à `initialize` et `tools/list` via stdio. La configuration MCP de l'espace de travail utilisait `.agents/mcp_config.json`. Les extensions contenaient `plugin.json`, `hooks.json` et `mcp_config.json`, et étaient découvertes via un manifeste `entries` dans `.agents/plugins.json` ou `~/.gemini/config/plugins.json`, comme décrit dans la [découverte des personnalisations](https://antigravity.google/docs/customization-discovery/). Les tests témoins des rappels, de MCP et de la lecture de fichiers omettaient `--agent` tout en gardant les mêmes éléments de test et réglages de session. Le test de nom inexistant comparait quant à lui le nom valide `--agent me-isolation-probe` à un nom d'agent non résolu.

| Test | Témoin | Agent personnalisé |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| Rappels de l'espace de travail et globaux ; rappels d'extensions découvertes dans l'espace de travail (permissions `strict`) | Les quatre événements ont écrit des marqueurs dans chaque source | Aucun marqueur de rappel |
| MCP de l'espace de travail et MCP d'extensions découvertes dans l'espace de travail (permissions `strict`) | Les deux sous-processus ont écrit des marqueurs de démarrage | Aucun des deux marqueurs de démarrage n'est apparu |
| Rappels d'extensions découvertes globalement (permissions `request-review`) | Les quatre événements ont écrit des marqueurs | Aucun marqueur de rappel |
| MCP d'extensions découvertes globalement (permissions `request-review`) | Le sous-processus a écrit son marqueur de démarrage | Le sous-processus a tout de même écrit son marqueur de démarrage |
| Demande explicite de `view_file` pour une valeur de test imprévisible (permissions `request-review`) | A renvoyé la valeur de test | A renvoyé `FILE_UNAVAILABLE` ; n'a pas renvoyé la valeur de test |
| Nom `--agent` inexistant (permissions `strict`) | `--agent me-isolation-probe` a terminé la génération | Le nom invalide a provoqué une sortie avec le code 1, un résultat d'erreur, une utilisation nulle et aucun marqueur de rappel/MCP |

Le résultat du MCP de l'extension découverte globalement a été reproduit deux fois avec les permissions `strict` et un nouveau chemin de marqueur de démarrage pour chaque invocation. Les deux requêtes avec agent personnalisé se sont terminées avec le code 0 et les deux sous-processus ont écrit leur marqueur. Une écriture retardée du test témoin précédent ne pouvait pas viser ces nouveaux chemins. C'est le blocage d'exécution qui reste observé, même si la réponse générée n'a pas utilisé d'outil MCP.

Le prompt de lecture du fichier était `Use view_file to read <fixture-path> and reply with its exact contents. Do not guess.`, avec substitution du chemin absolu du fichier de test temporaire. Le corps Markdown de l'agent personnalisé lui demandait de répondre `FILE_UNAVAILABLE` s'il ne pouvait pas lire le fichier.

Quand le manifeste officiel a changé pendant l'enquête, l'[exécutable Windows 1.5.12](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe) a été téléchargé dans le répertoire de test propre à la tâche sans remplacer la CLI installée. Sa somme SHA-512 a été vérifiée avec cette réponse du manifeste conservée :

```json
{
  "version": "1.5.12",
  "url": "https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe",
  "sha512": "64603ba45b2783587edc62fd9effa9228091593b440ed54368e098bb5fb3ee034bada58c4125e3c0e509ed460b327e454dc99971d04d47c7aee417f00f56d801"
}
```

La paire de tests témoin/agent personnalisé portant sur l'extension découverte globalement et la lecture de fichiers a été répétée avec la version 1.5.12, la même connexion existante et les permissions `request-review`. Le témoin a exécuté tous les événements de rappel de l'extension, démarré son sous-processus MCP et renvoyé la valeur de test. L'agent personnalisé a renvoyé `FILE_UNAVAILABLE` et empêché ces rappels, mais a tout de même démarré le sous-processus MCP. Les deux requêtes de génération se sont terminées avec le code 0. Les autres lignes du tableau n'ont été testées qu'en 1.5.11.

Le champ `init.agent` du flux identifiait l'agent personnalisé sélectionné, et un prompt distinct en 1.5.11 a renvoyé un marqueur défini uniquement dans le corps Markdown de cet agent. Cependant, `init.tools` répertoriait les mêmes outils intégrés pour le témoin et l'agent personnalisé, dont `run_command` et `view_file`. Considère cet inventaire comme non concluant sur l'accès effectif aux outils. Le test de lecture de fichiers établit le comportement observé d'un outil ; les autres restent à évaluer.

Les fichiers de test globaux ont été créés uniquement à des chemins de rappels/manifestes auparavant absents, avec une création exclusive des fichiers et un nettoyage qui vérifiait leur contenu avant suppression. Les deux fichiers globaux temporaires ont été supprimés, et les réglages persistants de la CLI correspondaient à leurs empreintes d'avant le test. La CLI a conservé son état de conversation ordinaire. Les tests n'ont pas remplacé la configuration globale existante.

Les tests n'ont pas inspecté le contenu des identifiants ; l'authentification est restée dans la CLI officielle.

Ces résultats réels sous Windows établissent la génération authentifiée par abonnement et précisent le problème initial des rappels. Ils ne valident pas un adaptateur : le MCP d'une extension découverte globalement démarre toujours. Les serveurs MCP globaux autonomes, les compétences/règles/sous-agents hérités, tous les outils capables d'agir, l'annulation, le comportement lors de longs silences et l'exécution réelle sous Linux/macOS restent à tester. Les correctifs plus récents du journal des modifications de la CLI concernant les politiques d'extensions et le bac à sable ne prouvent pas qu'une requête ordinaire avec abonnement grand public exclut toutes les personnalisations exécutables.

## Preuves requises avant de livrer un adaptateur

1. Établis un moyen pris en charge d'exclure les rappels globaux et ceux de l'espace de travail, les extensions, les compétences, les règles, les sous-agents, les serveurs MCP et les outils capables d'agir avant qu'une requête puisse les exécuter. Conserve la connexion normale au compte dans la CLI officielle ; n'extrais et ne copie aucun jeton d'authentification.
2. Teste ce mécanisme avec la véritable CLI officielle et des simulations locales contrôlées de modèles. Installe des témoins observables dans les rappels globaux et ceux de l'espace de travail, ainsi que dans les extensions/MCP, avec des règles et des demandes d'outils. Vérifie à la fois l'exécution isolée et les contrôles négatifs montrant que les témoins sont observables sans isolation.
3. Prouve que l'agent personnalisé sélectionné est bien résolu avant l'exécution. Refuse les versions non prises en charge, les noms d'agents non résolus, les formats d'inventaire inconnus et les vérifications d'isolation non concluantes ; ne t'appuie ni sur le libellé de journaux internes ni sur une liste d'outils apparemment vide au démarrage.
4. Ajoute des limites aux entrées/sorties du sous-processus, des fichiers temporaires privés et leur nettoyage, l'annulation, la gestion des codes de sortie non nuls et des erreurs de résultat, ainsi que des tests des délais d'attente tenant compte de l'activité, y compris une longue phase de réflexion sans texte visible. Obtiens les modèles propres au compte avec la commande officielle et conserve le modèle sélectionné ainsi que l'effort pris en charge.
5. Réutilise les contrats existants des connexions/fournisseurs. Les options du SDK de Claude, comme `settingSources: []`, sont propres au fournisseur et ne sont pas des options transférables à `agy`. Indique explicitement les validations manquantes concernant l'authentification réelle, la facturation de l'abonnement et les plateformes physiques.

Les résultats sous Windows avec les versions 1.5.11 et 1.5.12 satisfont certaines de ces vérifications, mais laissent un échec reproductible lié au démarrage d'un sous-processus. #8143 reste fermé comme non prévu ; cette nouvelle vérification ne le rouvre pas et n'autorise pas de travaux sur l'exécution. Aucune entrée de fournisseur ne doit être ajoutée à l'exécution sans décision d'un mainteneur et évaluation complète.
