# SillyTavernから移ってきたら

SillyTavernで使っていた機能の多くは、Marinara Engine(以下Marinara)にもあります。名前が違う場合もあります。表で見慣れた言葉を探し、**Show me**(案内する)を押すとアプリ内の該当する場所が開きます。名前を押すとガイドを読めます。

SillyTavernでの呼び方を検索(**Ctrl+K**、スマートフォンではタイトルをタップ)に入力することもできます。「chat completion preset」「world info」「regex」「author's note」は、いずれもMarinaraの対応する機能につながります。

キャラクター、チャット、プリセット、World Infoを移すには、[SillyTavernからのインポート](importing-from-sillytavern.md)を参照してください。チャットはメッセージの日付、作者のメモ、ペルソナを保持し、プリセットはサンプラー設定を保持します。

## 同じ機能のMarinaraでの呼び方

| SillyTavernでの名前 | Marinaraでの名前 | 場所 | |
| ------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------- |
| Chat Completionプリセット、AI Response Configuration(サンプラー) | [プリセット](../prompts/presets.md) | Library → **Presets**(プリセット)。Temperature、Top P/K、Min P、各ペナルティーはプリセットの**Parameters**(パラメーター)にあります | [案内する](#show-presets) |
| Prompt Manager | [プリセットのセクション](../prompts/presets.md) | Library → **Presets**でプリセットを開く → **Sections**(セクション) | [案内する](#show-presets) |
| 保存済みのチャット設定、チャットのデフォルト設定 | [設定プロファイル](../chats/settings-profiles.md) | Library → **Settings profiles**(設定プロファイル)、または新しいRoleplay → **Use a Profile**(プロファイルを使う) | [案内する](#show-settingsProfiles) |
| World Info、World Book | [ロアブック](../lorebooks/overview.md) | Library → **Lorebooks**(ロアブック) | [案内する](#show-lorebooks) |
| Author's Note | [作者のメモ](../roleplay/getting-started.md) | Chat Settings (Roleplay) | [案内する](#show-authorsNotes) |
| Regex | [正規表現スクリプト](../extending/regex-scripts.md) | Library → **Regex scripts**(正規表現スクリプト) | [案内する](#show-regexScripts) |
| グループチャット | [グループチャット](../chats/group-chats.md) | チャットに2人以上のキャラクターを追加 | [案内する](#show-groupChats) |
| キャラクターカード、代替の挨拶 | [キャラクターカード](../characters/import-export.md) | Library → **Characters**(キャラクター) → **Import**(インポート)。Roleplayチャットの開始時に代替の挨拶を選びます | |
| クイック返信、STscript | [クイック返信とスラッシュコマンド](../chats/guided-and-impersonate.md) | **Send**(送信)の隣、または`/`を入力 | [案内する](#show-quickReplies) |
| 拡張機能(Summarize、Image Generationなど) | [エージェント](../agents/agents-overview.md) | Library → **Agents**(エージェント)で追加し、チャットごとにオン | [案内する](#show-agents) |
| Summarize、Vector Storage、Data Bank | [Memory Recallと要約](../agents/memory.md) | Chat Settings → **Memory Recall** | [案内する](#show-memory) |
| API接続、接続プロファイル | [接続](../connections/connecting-to-a-provider.md) | Library → **Connections**(接続) | [案内する](#show-connections) |
| プロンプトの内訳 | [プロンプトをのぞく](../chats/peek-prompt.md) | 最新のAIの返信 → **Peek prompt**(プロンプトをのぞく) | [案内する](#show-peekPrompt) |
| チェックポイント、分岐 | [分岐](../chats/branches.md) | メッセージ → **Branch from here**(ここから分岐) | [案内する](#show-branches) |
| スワイプ、再生成 | [スワイプ](../chats/messages.md) | 返信の下の矢印、またはタッチ画面でスワイプ | [案内する](#show-swipes) |
| ペルソナ管理 | [ペルソナ](../characters/personas.md) | Library → **Personas**(ペルソナ) | [案内する](#show-personas) |
| UIテーマ、カスタムCSS | [テーマとCSSテーマ](../appearance/custom-css-themes.md) | Settings → **Appearance**(外観) | [案内する](#show-themes) |

**Show me**は、可能な場合はページを開くか、その手順を開始します。チャット内にある機能(Peek promptや記憶機能)では、先にチャットを開いてください。開いていない場合はガイドが開きます。

## 使い方が異なる機能

- **インストラクトテンプレートとコンテキストテンプレートはありません。** Marinaraはチャットメッセージを送り、モデルのサーバーがそのモデル専用のテンプレートを適用します。そのため、SillyTavernの**Advanced Formatting**に相当する選択はありません。ストーリー文字列の役割はプリセットのセクションが担います。
- **サンプラー。** プリセットの設定は、そのプリセットを使うチャットの初期値になります。接続やチャットで設定した値が優先されます。最大応答長とコンテキストサイズは接続で設定します。Top Aと反復ペナルティーの設定はありません。
- **作者のメモ。** 返信のたびに、指定した深さでチャットに挿入されます。**Post-processing messages**(メッセージの後処理)が**Apply**(適用、デフォルト)の場合、近くのユーザーメッセージの中に入れて送られます。SillyTavernの頻度、位置、ロールの設定に相当するものはありません。**Peek prompt**(プロンプトをのぞく)で挿入位置を確認できます。
- **グループチャット。** Roleplayでは、デフォルトで1人のナレーターが全キャラクターを演じるため、トークンを節約できます。SillyTavernのようにキャラクターが順番に返信するようにするには、Chat Settings → **Group Chat**(グループチャット)を開いてモードを切り替えてください。SillyTavernからインポートしたグループは、最初から**Individual**(個別)モードを使います。
- **キー操作。** チャットではEnterで改行し、**Ctrl+Enter**で送信します。Enterで送信するには、Settings → **Chatting**(チャットの動作)で**Send on Enter**(Enterで送信)をオンにしてください。矢印キーでスワイプを切り替えるには、同じタブの**Intuitive swipe navigation**(直感的なスワイプ操作)をオンにする必要があります。
- **クイック返信。** Marinaraでは、**Send**(送信)の隣にある、1クリックで使える操作(なりきり返信やガイド付き返信)を指します。SillyTavernのQuick Replyセットはインポートされません。

- **3つのチャットモード。** Marinaraはチャットを**Conversation**(DMのようなメッセージのやり取り)、**Roleplay**(地の文を含む長いシーン)、**Game**(ゲームマスターがルールのある世界を進行)に分けています。新しいチャットではモードを選び、設定にはそのモードで使うものだけが表示されます。
- **チャットの開始。** 新しいチャットでは短いセットアップが開きます。よく使う設定を設定プロファイルとして保存すると、次回は**Use a Profile**(プロファイルを使う)から**Apply & Start**(適用して開始)を選ぶだけです。プロファイルに星を付けると、そのモードの新しいチャットのデフォルトになります。
- **検索ですべてを探す。** **Ctrl+K**でチャット、キャラクター、設定、ガイドを探したり、コマンドを実行したり、Professor Mariの助けを借りて質問への答えを得たりできます。
- **Professor Mari。** Marinaraの内蔵アシスタントはアプリについての質問に答え、キャラクター、ロアブック、エージェントを作れます。ホーム画面から開いてください。

## 関連ガイド

- [SillyTavernからのインポート](importing-from-sillytavern.md)
- [設定プロファイル](../chats/settings-profiles.md)
- [チャット設定](../chats/chat-settings.md)
