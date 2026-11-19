# Sauvegarder et restaurer Marinara

Fais une copie de tes données Marinara Engine, puis remets-la en place plus tard. Fais-le avant une mise à jour, un changement d'appareil ou [l'effacement de tes données](clearing-data.md).

## Laquelle choisir

| Option | Ce qu'elle crée | À utiliser pour |
| --- | --- | --- |
| **Download Backup** (télécharger la sauvegarde) | Un `.zip` avec toutes tes données et tes fichiers. | Une copie complète de tout. |
| **Export Profile** (exporter le profil) | Un fichier plus petit avec les données de ton compte (personnages, chats, lorebooks et plus). | Une copie sans secrets, ou des fichiers pour d'autres outils. |

Un `.zip` est un seul fichier qui en contient beaucoup d'autres. Les deux options et la restauration sont dans **Settings → Data → Backup & Restore** (Paramètres → Données → Sauvegarde et restauration).

**Avant de commencer :** sur l'ordinateur qui exécute Marinara, ces outils fonctionnent tout de suite. Depuis un téléphone, une tablette ou tout autre appareil, définis le secret d'administration sur le serveur et saisis la même valeur dans **Settings → Advanced → Security** (Paramètres → Avancé → Sécurité). Le secret d'administration est un mot de passe dans le fichier `.env` du serveur, sous le nom `ADMIN_SECRET`. Voir la section "Privileged APIs (ADMIN_SECRET)" de la [référence de configuration du serveur](../CONFIGURATION.md) et l'[accès à distance](../REMOTE_ACCESS.md).

## Download Backup

1. Ouvre **Settings → Data**.
2. Dans **Backup & Restore**, clique sur **Download Backup**. Le bouton affiche **Creating backup…**.
3. Enregistre le fichier quand ton navigateur le demande, ou trouve-le dans ton dossier Téléchargements.

Le `.zip` contient :

- tes données texte enregistrées (personnages, chats, lorebooks, presets, connexions, réglages) ;
- tes fichiers téléversés et générés, comme les avatars, les sprites, les arrière-plans, les images de la galerie, les polices, les emojis et stickers personnalisés, et ton son de notification personnalisé ;
- le fichier `.encryption-key` (clé de chiffrement), quand il existe ;
- une note `RESTORE.txt` sur la restauration manuelle des fichiers (voir [Restaurer à la main](#restore-by-hand)).

Pour les noms des dossiers, voir [Où Marinara enregistre tes données](where-data-is-stored.md).

> **Avertissement :** une sauvegarde contient tes clés API enregistrées et le fichier `.encryption-key` qui les déverrouille. Ne la partage jamais. Garde-la dans un endroit privé.

Sur Android, tu ne peux pas atteindre le dossier de données de l'application. **Download Backup** est donc le moyen de sortir une copie de l'appareil.

Si ça n'a pas marché : si tu vois "Backup preparation timed out after one hour.", réessaie. Si un autre appareil ne peut pas télécharger, vérifie le secret d'administration (voir plus haut).

## Sauvegardes automatiques

Marinara peut faire une sauvegarde complète selon un calendrier, sur l'ordinateur qui l'exécute.

1. Ouvre **Settings → Data → Backup & Restore**.
2. Active **Automatic backups**.
3. Choisis **Daily**, **Weekly** ou **Monthly**.
4. Règle **Automatic backups kept** sur une valeur de 1 à 9999.

Marinara fait la première sauvegarde peu après l'activation. Après chaque exécution, il garde les sauvegardes les plus récentes jusqu'à ton nombre et supprime les plus anciennes. Il ne supprime jamais les sauvegardes que tu as faites avec **Download Backup**.

Les sauvegardes automatiques sont dans le dossier `backups/` à l'intérieur du dossier de données. La plus récente s'appelle `marinara-automatic-backup.zip`. Les plus anciennes ont une date et une heure dans leur nom. Elles ont le même format que **Download Backup**.

Chaque exécution a besoin d'assez d'espace libre pour une archive complète de plus, parce que l'ancienne reste jusqu'à la fin de la nouvelle. Si la place manque, Marinara saute l'exécution et affiche la raison à côté du réglage. Il réessaie quand de l'espace se libère.

> **Astuce :** garde une deuxième copie en dehors du dossier de données. Un disque perdu ou une application effacée supprime aussi les sauvegardes automatiques.

## Exporter un profil

1. Ouvre **Settings → Data → Backup & Restore**.
2. Clique sur **Export Profile**. Une fenêtre avec le même titre s'ouvre.
3. Choisis un format.
4. Ton navigateur télécharge le fichier.

- **Marinara Native** garde tes personnages, personas, chats, lorebooks, presets, agents, thèmes, le code des Personal Extensions et les médias. Il ne restaure pas les clés API, les liens de webhook ni certains réglages de chat (voir [Saisis à nouveau tes clés](#enter-your-keys-again)). Tu peux le restaurer dans Marinara.
- **Compatible JSON** crée un `.zip` de fichiers simples de personnages, de personas et de lorebooks pour d'autres outils. Tu ne peux pas le restaurer dans Marinara.

Un profil natif se télécharge sous le nom `marinara-profile.json`. S'il est trop gros, Marinara propose une archive ZIP à la place. Clique sur **Export ZIP** pour télécharger `marinara-profile.zip`.

Un profil natif conserve les scripts regex, leurs dossiers et le réglage de pause de chaque dossier. Pour partager des scripts individuels au format JSON, voir [Scripts regex](../extending/regex-scripts.md#import-and-replace-scripts).

Un profil natif garde le code des Personal Extensions, mais pas le fait qu'elles soient activées ou approuvées. Chaque extension restaurée arrive désactivée. Vérifie-la à nouveau dans **Library → Extensions** (Bibliothèque → Extensions).

## Restaurer avec Import Profile

**Import Profile** (importer un profil) charge un profil enregistré ou un `.zip` de **Download Backup**.

1. Ouvre **Settings → Data → Backup & Restore**.
2. Sous le bouton, laisse **Tag imported** (tag importé) et **Tag source** (tag de source) cochés pour appliquer les tags **Imported** et **Backup** aux personnages, personas, lorebooks, presets et chats importés. Décoche-les pour tout restaurer exactement comme avant.
3. Clique sur **Import Profile (JSON/ZIP)**.
4. Choisis `marinara-profile.json`, `marinara-profile.zip` ou un `.zip` de sauvegarde. Le bouton affiche **Scanning Profile...**.
5. Lis la fenêtre **Import Profile**. Elle liste ce que Marinara a trouvé. Les éléments déjà présents dans Marinara sont remplacés par les versions du fichier, sauf si tu [ajoutes seulement ce qui manque](#only-add-whats-missing).
6. Clique sur **Import**, ou sur **Cancel** pour arrêter. Le bouton affiche **Importing Profile...**. Marinara enregistre d'abord une copie de sécurité de tes données, puis une barre de progression suit. Quand c'est fini, un message indique que le profil a été importé.

Si ça n'a pas marché :

- Sauf si tu ouvres Marinara à `localhost`, `127.0.0.1` ou `[::1]`, l'import de profil a besoin de HTTPS. L'erreur est "Profile import requires HTTPS outside local development." Ouvre Marinara avec une adresse HTTPS.
- Si un `.zip` n'a pas quelques fichiers média, l'import se termine quand même. Un avertissement liste ce qui manque, et Marinara importe le reste.
- Si le disque est trop plein pour la copie de sécurité, rien n'est importé. L'erreur commence par "Nothing was imported, because a safety copy could not be saved first." Libère environ autant d'espace que ce qu'occupe une sauvegarde complète, puis relance l'import.

Si tu importes deux fois le même profil, Marinara met à jour tes éléments et ne les copie pas. Les profils de versions bien plus anciennes peuvent créer des doublons.

### Ajouter seulement ce qui manque

Pour récupérer quelque chose que tu as supprimé sans perdre les modifications faites depuis, active **Keep my current versions, only add what's missing** (garder mes versions actuelles, ajouter seulement ce qui manque) au-dessus de **Importer un profil (JSON/ZIP)**, puis importe comme indiqué plus haut. Chaque élément et chaque fichier déjà présent dans Marinara reste tel quel, et seul ce que Marinara n'a pas est ajouté. Cela comprend tout ce que tu as supprimé depuis l'enregistrement du fichier, comme des messages individuels ou des entrées de lorebook, pas seulement l'élément que tu voulais récupérer. La mémoire à long terme compte comme un seul élément : si Marinara en a déjà, celle du fichier n'est pas ajoutée.

Rien n'est remplacé, donc Marinara n'enregistre aucune copie de sécurité, et **Undo Last Import** (annuler le dernier import) annule toujours l'import précédent.

Les profils de versions bien plus anciennes ne permettent pas cela : ils ajoutent toujours leurs éléments à côté des tiens, et la fenêtre **Importer un profil** te l'indique.

### Annuler un import

Avant chaque import qui remplace des éléments, Marinara enregistre une copie complète de tes données dans le dossier `backups/` du dossier de données, dans un fichier dont le nom commence par `marinara-before-import-` suivi de la date et de l'heure. À la fin de l'import, la copie de l'import précédent est supprimée : seule la plus récente est donc conservée.

1. Ouvre **Réglages → Données → Sauvegarde et restauration**.
2. Clique sur **Undo Last Import**. La ligne en dessous indique quand la copie de sécurité a été enregistrée.
3. Clique sur **Undo Last Import** dans la boîte de dialogue pour confirmer.

L'annulation remet tes versions des éléments et des fichiers remplacés par le dernier import. Si tu as modifié l'un de ces éléments après l'import, cette modification est perdue. Tout le reste reste tel quel, y compris les éléments ajoutés par l'import. Tu peux annuler un import une seule fois ; la copie de sécurité est ensuite supprimée.

L'annulation ne réactive pas ce que l'import a désactivé par sécurité. Réactive ces éléments à la main :

- ton thème actif ;
- les extensions personnelles (examine-les à nouveau dans **Réglages → Modules**) ;
- les outils personnalisés qui exécutent un script ou un webhook ;
- les souvenirs de Professor Mari.

Si l'import a effacé la clé API d'une connexion, saisis-la à nouveau (voir [Saisis à nouveau tes clés](#enter-your-keys-again)). Redéfinis aussi cette connexion comme connexion par défaut ou de secours si elle l'était.

Les chats de branche remplacés par l'import restent détachés du chat dont ils sont issus. L'import a déjà supprimé ce lien, et l'annulation ne peut pas le rétablir.

Les profils de versions bien plus anciennes ne font qu'ajouter des éléments : Marinara n'enregistre donc aucune copie de sécurité pour eux, et il n'y a rien à annuler.

La copie de sécurité occupe autant d'espace qu'une sauvegarde complète. Pour libérer cet espace sans annuler l'import, clique sur **Delete Safety Copy** (supprimer la copie de sécurité) dans **Réglages → Données → Sauvegarde et restauration**, puis confirme. Tes données restent telles quelles, mais tu ne peux plus annuler cet import. Si un import a été interrompu, **Delete Safety Copy** peut apparaître seul ; la copie ne peut alors pas servir à annuler l'import, mais tu peux toujours la supprimer.

## Saisis à nouveau tes clés

**Import Profile** ne ramène jamais les clés API ni les liens de webhook, même depuis un `.zip` de **Download Backup**. Une clé API est le code secret que te donne un service. Le fichier de profil et le profil dans une sauvegarde ont ces valeurs vides. Après un import sur un nouvel ordinateur, tu dois donc saisir tes clés à nouveau :

1. Ouvre **Library → Connections** (Bibliothèque → Connexions).
2. Ouvre chaque compte que tu utilises, saisis sa clé API et enregistre. Voir [Se connecter à un fournisseur d'IA](../connections/connecting-to-a-provider.md).
3. Saisis à nouveau le lien de webhook sur chaque outil personnalisé qui en utilise un.

Certains réglages de chat avec des adresses ou des clés (Discord, DeepL, Intiface) reviennent aussi vides. Saisis-les à nouveau dans les **Chat Settings** (réglages du chat) de chaque chat.

L'import ne vide jamais les clés que tu as déjà sur la même installation.

## Déménager vers un nouvel ordinateur

1. Installe Marinara sur le nouvel ordinateur et démarre-le. Voir [Installation](../INSTALLATION.md).
2. Ouvre **Settings → Data → Backup & Restore** et clique sur **Import Profile (JSON/ZIP)**.
3. Choisis le `.zip` de **Download Backup** ou ton fichier de profil, puis clique sur **Import**.
4. Saisis à nouveau tes clés API, comme décrit plus haut.

Le fichier de clé dans une sauvegarde ne sert que si tu copies tout le dossier de données à la main, comme ci-dessous.

## Restaurer à la main

Utilise ceci seulement si **Import Profile** ne peut pas être utilisé. Le `.zip` contient un dossier, par exemple `marinara-backup-...`, avec une note `RESTORE.txt`.

1. Arrête Marinara.
2. Dézippe la sauvegarde.
3. Copie les dossiers et le fichier `.encryption-key` du dossier dézippé dans ton dossier de données. Voir [Où Marinara enregistre tes données](where-data-is-stored.md).
4. Démarre Marinara.

Garde le fichier `.encryption-key` avec le dossier `storage`, sinon les clés API enregistrées ne peuvent pas être lues.

La liste **Existing backups** (sauvegardes existantes) dans **Backup & Restore** est normalement vide. Tu n'en as pas besoin.

## Guides associés

- [Où Marinara enregistre tes données](where-data-is-stored.md)
- [Effacer ou réinitialiser tes données](clearing-data.md)
- [Mettre à jour Marinara Engine](../UPGRADING.md)
- [Se connecter à un fournisseur d'IA](../connections/connecting-to-a-provider.md)
- [Accès à distance : connexion et liste d'autorisation d'IP](../REMOTE_ACCESS.md)
