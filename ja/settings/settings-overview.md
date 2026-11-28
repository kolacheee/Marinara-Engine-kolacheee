# 設定の概要

**Settings**(設定)のどこに目的のコントロールがあるのかを調べ、**General**タブを設定し、設定がデバイス間で同期する仕組みを学びます。

## Settingsを開く

**Library → Settings**を開きます。右上の**Library**をクリックし、Libraryの一覧の下にある**Settings**をクリックしてください。<kbd>Ctrl</kbd>+<kbd>K</kbd>(Macでは<kbd>⌘</kbd>+<kbd>K</kbd>)を押して、`streaming`や`font`などの設定名を入力し、その設定へ直接移動することもできます。スマートフォンでは、右上のスタックボタンの奥にあるLibrary内にSettingsがあります。

ページ上部の**Search all settings**では、名前から設定を探せます。`delete`、`streaming`、`quotes`のような語句を入力すると、Marinaraが該当するセクションまで移動します。画面の言語での名前でも英語の名前でも一致します。

Settingsには9つのタブがあります。タブの下にあるボタンの列から、開いているタブの各セクションへ移動できます。このガイドで**Settings → Chatting → Message Box**のように書かれている場合は、**Chatting**タブの**Message Box**セクションという意味です。

### やりたいこと

| やりたいこと | 移動先 |
| --- | --- |
| 言語を変える | **Settings → General → Language** |
| 文字を大きくする | **Settings → Appearance → Fonts & Text Size** |
| テーマや色を変える | **Settings → Appearance → Theme**、または**Settings → Appearance → CSS Themes**にある既製の外観 |
| 通知音を設定する | **Settings → General → Notifications** |
| 削除の確認を止める | **Settings → General → Confirmations & Help** |
| ツアーをもう一度見る | **Settings → General → Confirmations & Help → Walkthroughs** |
| クイック返信を追加する | **Settings → Chatting → Message Box** |
| 画面を触ってスワイプする操作をオフにする | **Settings → Chatting → Editing & Swipes** |
| SillyTavernからインポートする | **Settings → Data → SillyTavern Import** |
| バックアップを取る | **Settings → Data → Backup & Restore** |
| データを削除する | **Settings → Data → Delete Data** |
| Marinaraをアップデートする | **Settings → Advanced → Updates** |
| スマートフォンからMarinaraを使う | **Settings → Advanced → Access**と**Security** |
| タップの反応が遅い理由を調べる | **Settings → Advanced → Troubleshooting → Show tap timings**(設定 → 詳細設定 → トラブルシューティング → タップの所要時間を表示) |
| スマートフォンでメッセージの横に表示される画像を変える | **Settings → Appearance → Conversation → Profile pictures on phones**(設定 → 外観 → Conversation → スマートフォンのプロフィール画像) |

### 各タブの内容

| タブ | セクション |
| --- | --- |
| **General** | **Language**、**Confirmations & Help**、**Extras**、**Professor Mari**、**Notifications** |
| **Chatting** | **Responses**、**Message Box**、**Editing & Swipes**、**Thinking**、**Text Formatting**、**Message Info** |
| **Appearance** | **Theme**、**Fonts & Text Size**、**Accessibility**、**Text Colors**、**Layout**、**Effects**、**Backgrounds**、**Chat Buttons & Windows**、**CSS Themes**。[外観の設定](../appearance/appearance-settings.md)を参照してください。 |
| **Conversation** | **Conversation Layout**、**Conversation Background** |
| **Roleplay** | **Tracker Panel**、**Roleplay Messages**、**Avatars**、**Visual Novel** |
| **Game** | **Game Text**、**Game Art**、**Game Assets**。[Gameのアセット](../game/game-assets.md)を参照してください。 |
| **Media** | **Generation Defaults**、**Image Generation**、**Video Generation**、**Prompt Overrides**。Illustratorエージェントをインストールするまで、このタブにはダウンロードの選択肢だけが表示されます。[スタイルプロファイル](../media/style-profiles.md)と[プロンプトの上書き](../prompts/prompt-overrides.md)を参照してください。 |
| **Data** | **SillyTavern Import**、**Backup & Restore**、**Chat Exports**、**Storage Cleanup**、**Delete Data**。[Marinaraのバックアップと復元](../data/backup-and-restore.md)と[データの消去とリセット](../data/clearing-data.md)を参照してください。 |
| **Advanced** | **Updates**、**Server**、**Timeouts & Retries**、**Custom Request Parameters**、**Lorebooks**、**Security**、**Access**、**Multiplayer**、**Troubleshooting**。[Advancedタブ](#the-advanced-tab)を参照してください。 |

Personal ExtensionsとExternal ExtensionsはSettingsにはありません。専用ページの**Library → Extensions**にあります。[個人用拡張機能](../extending/personal-extensions.md)を参照してください。

### 従来のレイアウト

**New layout**を**Settings → Appearance → Theme**でオフにしている場合、Settingsは6つのタブがあるパネルになり、同じセクションが別のまとまり方で表示されます。

| 従来のタブ | 新しいレイアウトでの内容 |
| --- | --- |
| **General** | Generalタブに加えて、**Responses**、**Message Box**、**Editing & Swipes**、**Thinking**、**Text Formatting**、**Game Text** |
| **Appearance** | Appearance、Conversation、Roleplayの各タブに加えて、**Game Art**。**App**、**Conversation**、**Roleplay**、**Game**の4つのボタンの奥にあります |
| **Generations** | Mediaタブ |
| **Addons** | **CSS Themes**とPersonal Extensions |
| **Imports** | **SillyTavern Import**、**Game Assets**、プロファイルのインポート |
| **Advanced** | Advancedタブに加えて、**Message Info**、**Backup & Restore**、**Chat Exports**、**Storage Cleanup**、**Delete Data** |

## Generalタブ

| セクション | 制御する内容 |
| --- | --- |
| **Language** | 画面の表示言語と、このガイドの言語。[Language](#language)を参照してください。 |
| **Confirmations & Help** | **Confirm before deleting**、**Hide chat Help button**、**Walkthroughs**。 |
| **Extras** | **Achievements**、**Disable seasonal Marinara themes**、**Music Player**。 |
| **Professor Mari** | **Search and Professor Mari settings**という1つの行があります。Search、クイック回答、Professor Mariの設定を開くには、**Open**をクリックします。[Professor Mari](../home/professor-mari.md)を参照してください。 |
| **通知** | 通知位置、音、ブラウザー・Android通知、ntfy経由のプッシュ。[通知](#notifications)を参照。 |

### Language

| 設定 | 働き |
| --- | --- |
| **Language** | 画面の表示言語を設定します。モデルへのプロンプトやチャットの内容は変わりません。まだ翻訳されていないテキストは英語で表示されます。アラビア語では右から左に読むレイアウトになります。デフォルトは英語です。 |
| **Documentation Language** | 組み込みのガイドの言語を設定します。下記を参照してください。デフォルトは英語です。 |

画面の表示言語は、アラビア語、簡体字中国語、英語、フランス語、ドイツ語、ヒンディー語、日本語、韓国語、ポーランド語、ブラジルポルトガル語、ロシア語、スペイン語です。翻訳を改善したい場合や言語を追加したい場合は、[UIのローカライズ](../development/localization.md)を参照してください。

**Documentation Language**では、英語は最初から入っています。別の言語を選んで**Download & Replace**をクリックします。Marinaraはその言語パックを一度だけダウンロードして、前のパックを削除します。そのため、ダウンロード済みの言語は1つだけです。まだ翻訳されていないガイドは、小さな`EN`バッジ付きで英語のまま開きます。ガイド検索は、選択中の言語で動作します。選んだ言語はアップデート後も引き継がれ、翻訳に変更があったパックは、アップデート後に再取得されます。ダウンロードしたガイドが失われたり壊れたりした場合は、**Fix documentation**ボタンが現れます。このボタンはパックを再ダウンロードします。ダウンロード元に接続できないときは、ガイドを英語に戻します。

### 確認、ヘルプ、その他

| 設定 | 働き |
| --- | --- |
| **Confirm before deleting** | チャット、キャラクター、その他の項目を完全に削除する前に、Marinaraが確認します。デフォルトはオンです。 |
| **Hide chat Help button** | Conversation、Roleplay、Gameのチャットから**Help**ボタンを隠します。デフォルトはオフです。 |
| **Walkthroughs** | **Replay the welcome tour**、このデバイスのウォークスルーの再表示、**Show chat mode tips again**を選べます。[初回チュートリアル](../home/tutorial.md)を参照してください。 |
| **Achievements** | 実績を記録し、解除の通知とAchievementsウィジェットを表示します。[実績](../home/achievements.md)を参照してください。デフォルトはオンです。 |
| **Disable seasonal Marinara themes** | Marinaraの季節限定の外観をオフにします。デフォルトはオフです。 |
| **Music Player** | コンパクトなMusic Playerを表示します。**Music DJ**エージェントが必要です。このエージェントは**Library → Agents**にあり、インストールするまでグレー表示のままです。[音楽](../media/music.md)を参照してください。デフォルトはオンです。 |

**Show Android status bar**と**Open Android launcher**は**Settings → Appearance → Layout**にあり、Androidアプリだけに表示されます。

### Notifications

Marinaraは、通知に標準の音を鳴らします。自分の音を使うには、次の手順に従います。

1. **Settings → General → Notifications**を開きます。
2. **Choose sound**を**Custom sound**の下でクリックします。MP3、WAV、OGG、M4A、MP4、WebMのいずれかで、10 MBまでです。

この音は、このサーバーに接続しているすべてのデバイスで鳴ります。試聴、差し替え、削除ができます。ファイルを読み込めない場合、Marinaraは標準の音を鳴らします。このファイルは、バックアップとプロファイルのエクスポートに含まれます。

**Background Notifications**は、キャラクターが自分から送るConversationのメッセージが対象です。**Generation Completion Notifications**は、Conversation、Roleplay、Game Modeで自分から始めた返信が対象です。どちらも、Marinaraを開いていてもフォーカスが外れているときに動作します。メッセージの中身は表示しません。**Notification position**では、エラーメッセージなどの通知を上と下のどちらに表示するかを選びます。

<a id="get-notifications-on-your-phone-while-marinara-is-closed"></a>
#### Marinaraを閉じてもスマートフォンへ通知する

**プッシュ通知 (ntfy)**は全タブとAndroidアプリを閉じても届きます。サーバーがAndroid・iPhoneアプリのある無料サービスntfy経由で送信します。

先にntfyアプリを入れます。サーバーのコンピューターでMarinaraを開くか、この端末に管理者シークレットが必要です。[リモートアクセス](../REMOTE_ACCESS.md)を参照。

1. **設定 → General → 通知**で**プッシュ通知を送信**をオンにします。専用チャンネルのランダムな**トピック**を作ります。
2. スマートフォンで**ntfy で開く**、または**コピー**してntfyで購読します。
3. **テスト通知を送信**で「Marinara test notification」が届きます。

2つのスイッチで対象を選びます。

- **キャラクターが自発的に送るメッセージ**：Conversationの自発メッセージ。どの端末でも開いていなくてもサーバーは書きます。
- **開始した返信のうち、完了前に Marinara を閉じたもの**：保存前に閉じるかページを離れた返信だけ。開いていれば通常通知が使われます。

通知は送信者と「Open Marinara to read it.」を示します。**メッセージのプレビューを表示**で代わりに冒頭200文字まで送ります。タップすると**開くアドレス**でチャットを開きます。初期値は有効化時のアドレスなので、スマートフォンで異なる場合は変更してください。

> **注意：** `ntfy.sh`ではタイトルとプレビューが公開サーバーを通り、トピックを知る人は読めます。漏れたら**新しいトピック**を選びます。自前に限定するにはntfyサーバーを立て**ntfy サーバー**にアドレスを指定します。LANでも使えます。

テスト失敗時は理由を表示します。よくある原因はMarinaraサーバーから**ntfy サーバー**へ接続できないことです。

## Chattingタブ

### Message BoxとEditing & Swipes

| 設定 | セクション | 働き |
| --- | --- | --- |
| **Send on Enter** | Message Box | Enterキーを押したときに送信するモードを選びます。 |
| **Keep guidance after regenerating** | Message Box | ガイド付きの再生成の後も、指示をメッセージ入力欄に残します。デフォルトでオンです。 |
| **Add CYOA choices to the message box instead of sending them** | Message Box | クリックした選択肢をメッセージ入力欄に入れるので、送信する前に編集できます。 |
| **Quick replies** | Message Box | 送信ボタンの横に、下書きを作る操作を追加します。[ガイド付き生成とImpersonate](../chats/guided-and-impersonate.md)を参照してください。 |
| **Speech-to-text microphone** | Message Box | チャットの入力欄にマイクのボタンを表示します。 |
| **Show characters in Persona pickers** | Message Box | ペルソナの選択画面に自分のキャラクターも並べるので、キャラクターになりきってプレイできます。 |
| **Up Arrow edits last message** | Editing & Swipes | 入力欄が空の状態でUp Arrowを押すと、直前のメッセージを編集できます。 |
| **Double-click edits messages** | Editing & Swipes | Roleplayのメッセージをダブルクリックすると編集できます。 |
| **Intuitive swipe navigation** | Editing & Swipes | 矢印キーや画面のスワイプで、スワイプ(1つのメッセージに残した複数の回答)を切り替えます。 |
| **Reroll past the newest swipe** | Editing & Swipes | いちばん新しいスワイプの先へ進んだときに、新しい返信を生成します。 |
| **Swipe gestures on touch screens** | Editing & Swipes | スマートフォンやタブレットで使う、新しいレイアウトのスワイプ操作です。[タッチ操作](../chats/messages.md#touch-gestures)を参照してください。デフォルトでオンです。 |
| **Guide swipes/regens with chat input** | Editing & Swipes | 再生成のときに、入力欄の下書きを指示として使います。 |
| **Always show swipe menu in Conversation** / **in Roleplay** | Editing & Swipes | マウスカーソルを重ねたときだけでなく、スワイプの矢印を常に表示します。 |

**Responses**セクションには、**Type out replies as they arrive (streaming)**、**Streaming speed**、**Trim incomplete sentences from the response**、**「続きを書く」のテキストの前に改行を入れる**(デフォルトでオン)、**Messages per page**があります。[メッセージの送信とストリーミング](../chats/sending-and-streaming.md)を参照してください。**Thinking**には、**Show Thinking In Messages**と**Don't Collapse Thinking**があります。メッセージの操作については、[メッセージの操作](../chats/messages.md)を参照してください。

### Text Formatting

これらのルールは、**Settings → Chatting → Text Formatting**で、チャットの文章の扱い方を変えます。**Bold dialogue in quotes**と**Convert LaTeX symbols**は見た目だけを変えるので、保存済みのメッセージは変わりません。**Quote style**は、入力して保存する文章の引用符を書き換えます。

| 設定 | 働き |
| --- | --- |
| **Bold dialogue in quotes** | 引用符で囲まれた文章を太字で表示します。デフォルトでオンです。 |
| **Convert LaTeX symbols** | LaTeXの数式コマンドを記号として表示します。コードはそのままです。デフォルトでオンです。 |
| **Force Solid Colors for Inline Names** | メッセージ内のキャラクター名をグラデーションではなく1つの単色で表示します。 |
| **Quote style** | **Straight**はまっすぐな記号のままにします(デフォルト)。**Typographic**は、曲がった引用符とアポストロフィーに書き換えます。 |

#### Bold dialogue in quotes

オンにすると、`"I missed you," she said.`の引用符の中の言葉が太字で表示されます。セリフの色だけを残して太字をやめたいときは、オフにします。

#### Convert LaTeX symbols

モデルによっては、数式をLaTeXのコマンドで書きます。オンにすると、`\rightarrow`、`\neq`、`\times`、`\alpha`が、`→`、`≠`、`×`、`α`として表示されます。

#### Load images from other websites in messages

このスイッチは**Settings → Advanced → Security**にあり、デフォルトでオフです。オフのあいだは、メッセージ、挨拶メッセージ、カードのプレビューにあるほかのWebサイトの画像の代わりに、そのWebサイトの名前と**Load image**ボタンが表示されます。これで、メッセージが勝手にほかのサイトへ接続することはなくなります。**Load image**を選ぶと、その画像が表示されます。Marinaraは、その選択をすべてのデバイスで記憶します。すべての画像をすぐに表示するには、この設定をオンにします。ギャラリーの画像、アバター、スプライトなど、Marinaraに保存されている画像は、常に表示されます。

### Message Info

これらのスイッチは**Settings → Chatting → Message Info**にあります。**Show context usage**と**Show "older messages not sent" note**を除いて、すべてデフォルトでオフです。

| スイッチ | 働き |
| --- | --- |
| **Show message timestamps** | メッセージごとに日付と時刻を表示します。 |
| **Show model name on messages** | 返信を書いたモデルの名前を表示します。 |
| **Show token usage on messages** | メッセージごとに、プロンプトと返信のトークン数を表示します。 |
| **Show context usage** | 最後に計測したリクエストで、コンテキストウィンドウがどれだけ埋まっていたかを、接続の切り替えメニューとGameのチャット設定に表示します。 |
| **Show message numbers** | メッセージごとに番号を表示します。 |
| **Show "older messages not sent" note** | 古いメッセージがプロンプトに収まらなかったときに、最新の返信の下に注記を表示します。途中で切れた返信や空の返信には、それぞれの注記が引き続き表示されます。 |

**Include reasoning in exports**と**Include private notes in exports**は**Settings → Data → Chat Exports**にあります。[チャットのエクスポートとインポート](../chats/export-import.md)を参照してください。

<a id="the-advanced-tab"></a>

## Advancedタブ

| セクション | 内容 | 詳しい情報 |
| --- | --- | --- |
| **Updates** | **Release Channel**、**Check for Updates**、**Refresh App** | [Marinara Engineのアップデート](../UPGRADING.md) |
| **Server** | **Restart Server** | |
| **Timeouts & Retries** | 低速なバックエンドを待つ時間と**Retry failed provider calls** | [サーバー設定リファレンス](../CONFIGURATION.md) |
| **Custom Request Parameters** | プロバイダー固有のリクエスト項目に使える再利用可能なコントロール | [生成パラメーター](../prompts/generation-parameters.md) |
| **Lorebooks** | **Stable lorebook picks**と**Lorebook activation stats** | [機能スイッチ](../configuration/features.md) |
| **Security** | 管理者シークレット、**Allow custom Agent imports**、**Allow third-party extension imports**、**Load images from other websites in messages** | [リモートアクセス](../REMOTE_ACCESS.md#the-admin-secret-and-privileged-actions) |
| **Access** | リモートログイン、**Add a device**、このサーバーが許可する接続 | [リモートアクセス](../REMOTE_ACCESS.md) |
| **Multiplayer** | 複数のデバイスから1つのチャットを一緒にプレイする機能(開発中) | [サーバー設定リファレンス](../CONFIGURATION.md) |
| **Troubleshooting** | **Copy Support Diagnostics**、**Debug mode**(モデルのペイロードをサーバーのコンソールに記録)、**Open Console**、**Show tap timings**(タップの所要時間を表示) | [トラブルシューティング](../TROUBLESHOOTING.md#the-app-feels-slow-on-a-phone-or-tablet) |

## 設定がデバイス間で同期する仕組み

Marinaraはほとんどの設定をサーバーに保存します。そのため、ブラウザーやデバイスを変えても設定はついてきます。

1. **Settings**で設定を変更します。
2. 約1秒後に、Marinaraがその設定をサーバーに保存します。
3. 同じサーバーを開いた別のブラウザーが、その設定を読み込みます。

いちばん新しい変更が優先されます。変更の直後に2台目のデバイスでMarinaraを開くと、そちらの古いコピーが、変更内容を上書きすることがあります。デバイスを切り替える前に、少し待ってください。

同期しない設定が2つあります。**Settings → Appearance → Fonts & Text Size**で、使うデバイスごとに設定し直してください。

- **Display Size**(画面のテキストの大きさ)
- **Chat Font Size**(チャットのテキストの大きさ)

[外観の設定](../appearance/appearance-settings.md)を参照してください。サーバーに接続できないときは、アプリは手元の設定で動き続け、次に変更したときに再送を試みます。

## 関連ガイド

- [外観の設定](../appearance/appearance-settings.md)
- [メッセージの操作](../chats/messages.md)
- [Marinaraがデータを保存する場所](../data/where-data-is-stored.md)
- [トラブルシューティング](../TROUBLESHOOTING.md)
