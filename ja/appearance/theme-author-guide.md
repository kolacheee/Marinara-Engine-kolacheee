# テーマ作者向けガイド

このガイドは、自分でテーマを作ったり共有したりする方向けです。前半では、コードを書いた経験がなくても最初のテーマを作れるよう、手順を説明します。後半はリファレンスとして、テーマで変更できるすべての色、画像、部分と、すべてのテーマに適用される安全上のルールをまとめています。テーマの選択、お試し、インポート、削除については、[カスタムCSSテーマ](custom-css-themes.md)を参照してください。

**トークン仕様バージョン1**(`:root`の`--mari-tokens-version: 1`)。このガイドにある名前は、リリースが変わっても使えます。変更が必要になった場合はバージョンが上がり、末尾の[変更履歴](#changes)に記載されます。それ以外(ほかの`--ov-*`、`--mari-*`、`--marinara-*`変数、Tailwindのクラス、要素の構造)は内部実装で、どのアップデートでも変更される可能性があります。

## 最初のテーマを作る手順

テーマは、Webページの色やフォントを指定する言語であるCSSで書いた、短い設定の一覧です。最初からCSSを知っている必要はありません。各行は`--name: value;`という形で、**トークン**(`--`で始まる名前付きの設定)、コロン、値、セミコロンを並べます。

1. **Library → Settings → Appearance**(ライブラリー → 設定 → 外観)を開き、セクションの並びにある**CSS Themes**(CSSテーマ)をクリックしてください。
2. スターターテーマを変更するには、**Browse the theme gallery**(テーマギャラリーを見る)から好みのテーマをダウンロードし、**Starter themes**(スターターテーマ)で見つけて**Clone + Edit**(複製して編集、コピーのアイコン)をクリックしてください。Marinaraは「Petal OS (自分用コピー)」などの名前で自分用のコピーを作り、エディターで開きます。スターターテーマは読み取り専用のままなので、元のテーマはいつでも残っています。最初から作る場合は、**Create Theme**(新しいテーマ)をクリックしてください。テンプレートには`/*`と`*/`で囲まれた、オフになっている行があります。その行を囲む記号を削除するとオンになります。
3. 名前の欄に名前を入力してください。
4. 色を変えてみてください。`--primary: #3fae7a;`のような行を探し、色を置き換えてください。`#3fae7a`は16進数のカラーコードです。Web上のカラーピッカーで取得できます。`teal`などの名前も使えます。
5. **Preview**(プレビュー)はオンのままにしてください。入力に合わせてアプリが変わるため、変更をすぐに確認できます。
6. エディターの下を見てください。**CSSの問題は見つかりませんでした。**と表示されていれば、CSSに問題はありません。問題があれば、`;`や`}`の不足などが行番号とともに表示されます。
7. **Save**(保存)をクリックしてください。新しいテーマがオンになり、Marinaraが**このテーマを維持しますか?**と確認します。15秒以内に**Keep theme**(テーマを維持)をクリックしないと、以前の外観に戻ります。

最初によく変更するトークン:

| トークン | 色を変える対象 |
| --- | --- |
| `--background` | すべての背後にあるページ |
| `--foreground` | メインの文字 |
| `--primary` | ボタン、リンク、ハイライト |
| `--card` | カードとパネル |
| `--sidebar` | チャットとライブラリーのサイドバー |
| `--border` | 各部分を囲む線 |
| `--mari-font-ui` | アプリのフォント。例: `"Georgia", serif` |

小さなテーマの例:

```css
:root {
  --mari-tokens-version: 1;
  --primary: #3fae7a;
  --mari-selected-tint: var(--primary);
  --mari-font-ui: "Inter", system-ui, sans-serif;
}

[data-theme="dark"] {
  --background: #0f1712;
  --card: color-mix(in srgb, #0f1712 80%, transparent);
  --sidebar: #0b120e;
}
```

`:root { … }`には、すべてのカラースキームに適用する設定を書きます。`[data-theme="dark"] { … }`はダーク専用、`[data-theme="light"] { … }`はライト専用です。作業中にトークンの全一覧を確認するには、エディターの下の**CSS Variable Reference**(CSS変数のリファレンス)を開くか、後述の[色のトークン](#colour-tokens)を参照してください。

### 画像とフォントを追加する

エディターの下の**Pictures and sharing details (author, version, thumbnail, fonts)**(画像と共有情報(作者、バージョン、サムネイル、フォント))を開き、**Add pictures**(画像を追加)をクリックしてください。画像名をクリックすると、CSSのカーソル位置に挿入されます。画像を配置できる場所については、[画像](#pictures)と[背景](#backdrops)を参照してください。

画像とフォントはテーマの中に含める必要があります。テーマはほかのWebサイトから何も読み込めないため、CSSに画像やGoogle Fontへのリンクを書いても機能しません。

### Professor Mariにアートの作成を頼む

**Connections**(接続)で画像モデル(Codex、NovelAI、ComfyUI、OpenAIの画像モデルなど)を設定していれば、Professor Mariにテーマ用の画像を作って組み込んでもらえます。「Harborテーマに夜空の背景を作って」「Homeのカードに真ちゅうの枠を付けて」など、普通の言葉で頼んでください。

1. Mariが編集できるのは自分用のテーマだけです。スターターテーマの場合は、まず**Clone + Edit**(複製して編集)をクリックし、そのコピーを編集するよう頼んでください。
2. Mariは画像のプロンプトを自分で書き、そのまま画像モデルに送ります。画像のスタイルプロファイルやプロンプトの接頭辞(通常はキャラクターの絵向けに設定するもの)は使わないため、背景を頼んだのに肖像画になることはありません。
3. Mariは各画像を自分で確認してから説明します(小さな画像は拡大し、透明な部分はグレーの上に表示します)。何かを変更する前に、画像を確認できます。いくつかの候補(1回につき最大4つ)を作ってもらったり、「上半分だけ切り抜いて」「白い背景を透明にして」「小さくして」などの修正を頼んだりできます。修正するたびに新しい版が作られ、前の版も残ります。
4. 承諾すると、Mariは画像をテーマに保存し(**Add pictures**(画像を追加)と同じWebP形式)、テーマのCSSに組み込みます。自分で追加した画像と同じように、**Pictures and sharing details**(画像と共有情報)に表示されます。

レール、柵、送信ボタンなどの描画された装飾はSVG画像です。Mariは画像モデルを使わずに直接色を変えることができ、鮮明さも保たれます。

1枚の画像にかかる時間は画像モデルによって異なりますが、多くの場合は30秒から1分半ほどです。画像の接続に独自のComfyUIワークフローを使っている場合、そのワークフローに組み込まれたテキストは引き続き送信されます。

### テーマを共有する

1. **Pictures and sharing details**(画像と共有情報)で、**Author**(作者)、**Version**(バージョン、`1.0`など)、**Description**(説明)、**Thumbnail**(サムネイル)を入力し、**Made for**(対象)でダーク、ライト、または両方を選んでください。色やフォントの設定もテーマと一緒に提案するには、**Settings**(設定)の**Use my current Appearance**(現在の外観設定を使う)をクリックしてください。保存してください。
2. テーマの行の**Export**(エクスポート、アップロードのアイコン)をクリックしてください。MarinaraはCSS、画像、フォントを含む1つの`.json`ファイルを保存します。
3. ほかの人が作ったアートやフォントを使っている場合は、テキストエディターでファイルを開き、クレジットとライセンスを追加してください。[テーマファイル](#theme-files)を参照してください。
4. そのファイルを送ってください。受け取った人は**Import File**(ファイルをインポート)で読み込み、インストール前に作者名、クレジット、テーマで変更される内容の一覧を確認できます。

### 問題が起きたとき

Marinaraは、テーマが何をしてもトップバー、サイドバー、<kbd>Ctrl</kbd>+<kbd>K</kbd>、メッセージ入力欄を使える状態に保ちます。テーマがそのいずれかを隠したり、動かしたり、覆ったりすると、保存時に問題が示されます。**Save anyway**(このまま保存)を選ぶこともできますが、どれかが使えなくなった時点で、Marinaraはそのタブのテーマをオフにします。いつでも通常の外観に戻すには、<kbd>Esc</kbd>を3回押すか、アドレスの末尾に`?safe`を追加するか、<kbd>Ctrl</kbd>+<kbd>K</kbd>を押して「カスタムテーマ」と入力してください。

スターターテーマは学習用のよい例です。複製してCSSを読み、以下のトークンやパーツのフックがどう使われているか確認してください。

## テーマが優先される仕組み

アプリ自身のCSSは、`index.html`の冒頭で宣言されるカスケードレイヤーに配置されています。

```
mari-protected, mari-theme-important, theme, base, components, utilities, mari-app, mari-pickers
```

- テーマは**レイヤーに属さない**ため、テーマの通常のセレクターは、`!important`のないすべてのアプリ側ルールより優先されます。アプリ側ルールの詳細度は関係ありません。
- `mari-pickers`には外観の選択設定(背景、アクセント、フォント、チャットの色)が入ります。アプリのデフォルトより上、テーマより下に位置するため、選択設定よりテーマの色が優先されます。テーマが選択設定を上書きしている場合は、外観の画面でそのことが示されます。
- テーマ内の`!important`も使えます。そのルールは`mari-theme-important`にコピーされ、アプリ自身の`!important`ルールより優先されます。
- `mari-protected`は、トップバー、チャットのサイドバー、ライブラリーのサイドバー、Ctrl+Kを所定の場所に保ちます。テーマはその見た目(色、フォント、枠線、角丸、影)を変えられますが、隠す、移動する、縮める、覆うことはできません。試みると、そのタブではテーマがオフになり、理由が表示されます。
- トランジションを開始まで待たせられる時間は最大1秒です(`transition-delay`、または`transition`の2つ目の時間)。それより長く変更を遅らせるテーマは拒否されるため、画面の確認から長時間経過して何かが現れることはありません。アニメーションには任意の遅延を使えます。

元に戻す手段は常に使えます。URLに`?safe`を付ける、**Escapeを3回押す**、またはCtrl+K >「カスタムテーマ」でテーマがオフになります。新しいテーマでは「このテーマを維持しますか?」と確認され、15秒後に元に戻ります。

## 色のトークン

### 基本(すべてのビジュアルスタイルで定義)

`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`,
`--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`,
`--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`,
`--border`, `--input`, `--ring`, `--radius`, `--sidebar`, `--sidebar-foreground`, `--sidebar-border`,
`--sidebar-accent`, `--sidebar-accent-foreground`.

値には完全なCSSカラーを使います(`#1b1530`、`rgb(…)`、`oklch(…)`)。`270 25% 8%`のようなHSLの3つの数値だけの指定(shadcnの慣例)は、ここでは**使えません**。

`[data-theme="light"]`と`[data-theme="dark"]`でライトとダークの適用範囲を分けてください。

### 新しいレイアウト

| トークン | 用途 |
| --- | --- |
| `--ov-line` | 細い区切り線とパネルの枠線 |
| `--ov-text`, `--ov-muted`, `--ov-dim` | 文字、補助的な文字、薄い文字 |
| `--ov-accent` | アクセントを付ける箇所(デフォルトは`--primary`) |
| `--ov-hover`, `--ov-active-bg` | ホバー時と押下時の背景 |
| `--ov-mode-conversation`, `--ov-mode-roleplay`, `--ov-mode-game` | チャットのサイドバーやエディターのチャットモードの色 |
| `--ov-serif` | タイトルのフォント(`--mari-font-heading`に従います) |
| `--mari-selected-tint` | 選択された行、ピル、切り替えスイッチ。デフォルトは中立色(`--foreground`)です。選択箇所をアクセント色にするには`var(--primary)`を設定してください |
| `--mari-selected-bg`, `--mari-selected-ring` | 色から派生する値(10%と18%) |

### テーマのトークン(v1)

どのトークンもデフォルトはアプリ自身の外観です。ライトモードには、読みやすさを保つための専用の値があります。

| トークン | 用途 |
| --- | --- |
| `--mari-font-ui` | アプリ全体のフォント |
| `--mari-font-heading` | ページやセクションのタイトル |
| `--mari-font-chat` | RoleplayとConversationのチャットのメッセージ本文 |
| `--mari-mode-conversation`, `--mari-mode-roleplay`, `--mari-mode-game` | Homeのチップ、最近のチャット、新規チャットのランチャー、Homeウィジェットの見出し上の小ラベル |
| `--mari-home-pink`, `--mari-home-violet` | Homeウィジェットのその他のアクセント |
| `--mari-status-online`, `--mari-status-idle`, `--mari-status-dnd`, `--mari-status-offline` | 在席状態の点とラベル |
| `--mari-gauge-ok`, `--mari-gauge-warn`, `--mari-gauge-danger` | GameのゲージとHPバー。通常の状態ではウィジェット自身の色が優先されますが、危険な状態では常にトークンを使います |
| `--mari-game-combat`, `--mari-game-combat-text` | GameのCombatボタン |
| `--mari-stage-empty-bg` | シーン画像を読み込む前のGameのステージ(グラデーションを含む任意の`background`) |
| `--mari-scrim` | Ctrl+Kの背後の暗い背景 |
| `--mari-user-avatar-placeholder` | 画像がないときの自分のアバター(グラデーション) |
| `--mari-art-saturation-1`, `--mari-art-lightness-1`, `--mari-art-saturation-2`, `--mari-art-lightness-2` | 画像がないカードのグラデーション。各カードの色相は維持されます。これらをパーセントで設定すると、グラデーションを落ち着かせられます |
| `--mari-app-backdrop` | アプリ全体の背後に1回描画する画像またはグラデーション(後述) |
| `--mari-accent-fx-animation` | アクセントパルスまたはRGBモードがオンのときのアニメーション。それ以外は`none` |

### v1.1で追加されたテーマのトークン

テーマが設定するまで値を持たないため、それまでは利用者自身の設定が適用されます。

| トークン | 用途 |
| --- | --- |
| `--mari-text-outline` | メッセージの文字の縁取り。例えば`0`でオフ、または`1px #3b2a1a`。未設定なら利用者の文字の縁取り設定を使います |
| `--mari-dialogue-color` | キャラクターやペルソナに専用の色がない場合のセリフの色(専用の色があればそちらが優先されます) |
| `--mari-chat-font-size` | メッセージの文字サイズ。アクセシビリティの最小値は引き続き適用されます |
| `--mari-composer-placeholder` | 引用符で囲んだ文字列で指定するメッセージ入力欄のプレースホルダー: `"> waiting for user input..."`。`:root`か、`[data-composer="game"]`などの入力欄1つに設定してください。キーやパスワードを求めるテキストは無視されます |
| `--mari-page-veil` | 背景画像の上でも長い文章を読みやすくするため、設定、ライブラリー、エディター、ドキュメントに重ねる色。デフォルトは`transparent` |
| `--mari-page-floor` | 背景画像の上で、各フルページの下に敷かれるほぼ不透明なシート。デフォルトは`color-mix(in srgb, var(--background) 94%, transparent)`。`transparent`でなくなります |
| `--mari-top-bar-bg` | トップバー用の完全な`background`値。画像、グラデーション、複数のレイヤーを使えます。`--mari-top-bar-rendering: pixelated`でピクセルアートの鮮明さを保てます。タブとアイコンは常に最前面に表示されます |
| `--mari-top-bar-plate`, `--mari-top-bar-plate-radius` | トップバーのアートの上では、タブ、開いているチャットのタブ、アイコンボタン、ロゴそれぞれに下地を敷き、見やすくします。下地の色と角丸(デフォルト`0.5rem`)を設定します。角丸を`0`にすると、四角いピクセル風のボタンになります |
| `--mari-tab-row-strip-bg`, `--mari-tab-row-strip-height`, `--mari-tab-row-strip-room` | トップバーのタブの下に描く帯（ニュースティッカーや柵など）は、グループの行が表示される間、その行へ移ります（`:root[data-ov-tabrow]`、行は`[data-tab-row]`）。`[data-tab-row]`に`background`、高さ、タブ下に取る空間を設定します（初期値は高さ、`0px`なら背後）。`[data-mari-part="tab-row-strip"]`はアニメーション可能です。`:root[data-ov-tabrow]`時のバーの帯は作者側で外してください。 |
| `--mari-msg-head-rule` | Roleplayのメッセージの名前の下の線(`none`や`2px dashed currentColor`などの`border-bottom`値) |
| `--mari-home-widget-border`, `--mari-home-widget-border-width`, `--mari-home-widget-radius`, `--mari-home-widget-bg` | Professor Mariを含むすべてのHomeウィジェットの枠と表面 |
| `--mari-home-widget-font`, `--mari-home-widget-title-font`, `--mari-home-widget-title-size`, `--mari-home-widget-title-color`, `--mari-home-widget-eyebrow-size`, `--mari-home-widget-text-size`, `--mari-home-widget-muted` | Homeウィジェットの文字のスタイル。文字に必要な領域が増えると、切り取らずにウィジェットの高さが増します |
| `--mari-home-widget-eyebrow-color`, `--mari-home-widget-action-size`, `--mari-professor-sprite-scale` | ウィジェットのタイトル上の小ラベル、Professor MariのAskボタンの文字、Mariの画像の大きさ(1 = 標準) |
| `--mari-home-wash` | Homeが背景画像に重ねる色(標準はカードの色の65%)。`transparent`ならアートを薄めずに表示します |
| `--mari-home-art` | `none`でHomeのカードの標準画像を隠します。遅延読み込みのため、隠した画像はダウンロードされません。これは個々のカード(What's new、Around the table)の中の小さな画像で、Homeの背景ではありません。Homeの背後のアートはアプリの背景です |
| `--mari-ambient` (および`-opacity`、`-blend`、`-animation`) | 環境オーバーレイ。「環境オーバーレイ」を参照してください |
| `--mari-icon-send`, `--mari-icon-stop`, `--mari-icon-attach`, `--mari-icon-emoji` | メッセージ入力欄のアイコンの代わりに使う画像(`background-image`値) |
| `--mari-cursor`, `--mari-cursor-pointer` | 画像のポインター(完全な`cursor`値)。テーマがオンの間は、カスタムマウスポインターより優先されます |

### v1.4で追加されたテーマのトークン

v1.1のトークンと同じく、最初のグループはテーマが設定するまで何もしません。

| トークン | 用途 |
| --- | --- |
| `--mari-message-time` | すべてのチャットモードのメッセージ時刻(`[data-mari-part="time"]`)の色 |
| `--mari-chat-wash` | Roleplayのチャット背景に重ねる色を、完全な`background`値で指定します。標準は暗い色で、ライトではラベンダーがかった白です。`none`で取り除きます |
| `--mari-lore-constant`, `--mari-lore-selective`, `--mari-lore-normal` | ロアブックのエントリーの状態を示す点 |
| `--mari-toast-font-size` | トーストの文字サイズ(トーストはすでに`--mari-font-ui`を使っています) |
| `--mari-home-shortcut-size`, `--mari-home-shortcut-desc-size` | Homeの「エンジンを学ぶ」と「コミュニティ」のショートカット行。`--mari-home-widget-text-size`だけを設定した場合はそれに従い、説明はその0.85倍になります |
| `--mari-min-ui-text` | アプリの最小の文字(9-12 pxのラベル、件数、チップ)の下限。Tailwindの`--text-xs`、`--text-sm`、`--text-base`も設定できます |
| `--mari-user-avatar-image` | ペルソナに画像がない場合に自分のアバターに使う画像。トークンがない場合は、ペルソナに画像があればプレースホルダーにその画像が表示されるようになりました |
| `--mari-focus-frame`, `--mari-window-title`, `--mari-ambient-placement`, `--mari-ambient-mask` | スロット。後述を参照してください |

以下は、アプリ内で固定されていた値を置き換えます。未設定の場合は標準の外観になります。

| トークン | 用途 |
| --- | --- |
| `--mari-chrome-accent` | アクティブなタブの下線、エディターの外枠、選択欄、接続画面 |
| `--mari-chrome-muted` | パネル、サイドバー、Homeのグレーの補助文字(標準はUI枠の文字の58%) |
| `--mari-resource-accent`, `--mari-resource-<type>` | ライブラリーの種類別の色: `characters`、`personas`、`lorebooks`、`presets`、`connections`、`agents`、`settings`、`backgrounds`、`browser` |
| `--mari-ctrlk-conversation`, `--mari-ctrlk-roleplay`, `--mari-ctrlk-game` | Ctrl+Kのモード別の行の色 |
| `--mari-game-combat-bg`, `--mari-game-combat-bg-hover`, `--mari-game-combat-border` | GameのCombatボタン(2つの背景は完全な`background`なのでグラデーションを使えます。単色のレイヤーも付けてください) |
| `--mari-accent-text` | 小さな文字やアイコン(アクティブなタブ、セクションのラベル、リンク)用のアクセント。標準は、読めるようにライトでは少し暗く、ダークでは少し明るくしたアクセント色 |
| `--mari-top-bar-plate-active` | トップバーにアートがあるときの、アクティブな操作項目の下地(標準は下地に20%のアクセント色を混ぜた色) |
| `--mari-chat-header-bg` | Conversationのヘッダーの背後のフェード(標準は88%のページ色から透明へ変化。アプリの背景画像がある場合は`none`) |
| `--mari-home-hero-padding`, `--mari-home-widget-glow` | Homeの挨拶の内側の余白と、Homeウィジェットのヘッダーの背後の光彩 |

アプリは`<html>`で`--mari-top-bar-height`も公開します(テーマがバーを高くすると変わる、トップバーの実際の高さ)。テーマはこの値を使い、独自のレイヤーにトップバーの下までの余白を設けられます。

### v1.5で追加されたテーマのトークン

長い返信や、以前は内部のクラスを使う必要があった部分向けです。標準値が記載されているものを除き、テーマが設定するまで何もしません。

| トークン | 用途 |
| --- | --- |
| `--mari-chat-column` | Roleplayでメッセージと入力欄が共有する列(標準58rem)。利用者自身のチャット設定 → チャット領域の幅が引き続き優先されます |
| `--mari-message-measure` | メッセージ本文の最長の行。例: `68ch`(RoleplayとConversation) |
| `--mari-chat-line-height` | すべてのチャットモードのメッセージ本文の行の高さ(標準1.5)。アクセシビリティ → 行間が引き続き優先されます |
| `--mari-dialogue-weight` | 引用符付きのセリフ(`[data-mari-part="dialogue"]`)の太さ。例えば`400`にすると、長いセリフが太字の塊になりません |
| `--mari-dialogue-color` | テーマの`--mari-chat-*`の色でチャットの配色がオンになった場合にも表示されるようになりました。テーマが斜体やリンクに指定した色も同様です |
| `--mari-paragraph-gap` | 空行1行の代わりに使う段落間の余白。例: `0.85em` |
| `--mari-pinned-speaker`, `--mari-pinned-speaker-bg` | `on`: 長いRoleplayの返信をスクロールしている間、名前の行がチャットの上端に留まります(デスクトップとタブレット)。背景のデフォルトは吹き出しの背景です |
| `--mari-pinned-speaker-top`, `--mari-pinned-speaker-bleed` | 固定した行の位置(標準は表示中のチャットの上端)と、本文からはみ出す距離(標準1rem) |
| `--mari-phone-avatar` | `hidden`: スマートフォンのRoleplayでアバターの列を省き、返信に幅全体を使います |
| `--mari-mini-avatar-size`, `--mari-mini-avatar-ring` | スマートフォンで名前の横に表示する小さな画像(**Profile pictures on phones: Mini**(スマートフォンでのプロフィール画像: ミニ)、デフォルト)のサイズと、`box-shadow`で指定するリング。`[data-mari-part="mini-avatar"]`に`data-role`(`user`、`assistant`)が付きます |
| `--mari-phone-convo-avatar` | `full`: 利用者が**Mini**(ミニ)を選んでいても、スマートフォンのConversationチャットでアバターの列をフルサイズで維持します |
| `--mari-vn-fade` | 段落の続きが下にあるときのVNテキストボックス下端のフェード(標準1.75rem、`0`でオフ) |
| `--mari-message-actions`, `--mari-swipe-counter` | メッセージの下のツールと「2 / 5」のスワイプカウンターの色 |
| `--mari-card-art-placeholder` | 画像のないライブラリーのカードで、ランダムな色相のグラデーションの代わりに使う完全な`background` |
| `--mari-chat-row-art-opacity` | チャットのサイドバーで、開いているチャットの行の背後に表示する画像(標準0.14、`0`で非表示) |
| `--mari-chrome-accent`, `--mari-chrome-accent-gradient` | `<html>`からアクセントを読み取る部分(Convo / Roleplay / Gameのタブ、UI枠の枠線)にも適用されるようになりました |
| `--mari-focus-frame-outset` | フォーカス枠が対象の表面からはみ出す距離(長さ、最大2rem。「スロット」を参照) |
| `--mari-scrim` | ダイアログの背後の暗いレイヤー |
| `--mari-confirm-scrim` | 短い確認ダイアログの背後の明るい半透明のレイヤー(明るいテーマが落ち着いたままになるよう、薄く保ってください) |

テーマに環境オーバーレイがある間、アプリは`<html>`で`--mari-center-x`も公開します。これはチャットペインの水平方向の中心で、サイドバーの開閉にかかわらず、マスクで本文の列を見やすく保てます。`--mari-gutter-mask`がこの値を使います。

## 画像

テーマの画像はテーマファイルの`images`に格納し、CSSから名前で参照します。

```css
:root {
  --mari-app-backdrop: url("theme:night.webp");
}
[data-mari-part="home-widget"] {
  border-image: url("theme:frame.webp") 24 fill / 24px stretch;
}
```

- 画像は256 KiBのCSS上限ではなく、6 MiBのパッケージ容量に数えられるため、大きなアートも収まります。
- エディターで**Pictures and sharing details**(画像と共有情報)を開き、**Add pictures**(画像を追加)を押してください。PNGとJPEGは読み込み時にWebPとして保存されます(小さな画像は可逆圧縮なので、ピクセルアートや9スライスの枠も鮮明なままです。長辺は最大2560 pxです)。画像名をクリックすると、カーソル位置に`url("theme:name")`が挿入されます。
- テーマのインポートでも同じ処理をします。`data:` URLとしてインラインで書かれた画像はCSSから`images`に移り、静止画のPNGとJPEGはWebPになり、プレビューには各画像とそのサイズが表示されます(「代わりに元のファイルを残す(サイズ大)」のチェック欄もあります)。
- `theme:`の名前はテーマの`backgrounds`からも名前で画像を見つけます。チャットの背景ギャラリー用に同梱したアートも、利用者がギャラリーに追加するかどうかにかかわらずCSSで使えます。
- テーマを適用すると、各画像は同一オリジンの短い`blob:` URLになります。ダウンロードは発生せず、何か所で使っても画像のデコードは1回だけです。
- GIF、APNG、アニメーションWebP、`<animate>`を含むSVGは動く画像として扱われます。インポートのプレビューでそのことが示され、動きを減らす設定がオンの場合は最初のフレームを表示します。

## 背景

`:root`に`--mari-app-backdrop`を設定すると、アプリの背後にアートを描画できます。

```css
:root {
  --mari-app-backdrop: url("theme:city.webp");
  --mari-app-backdrop-position: bottom center;
  --mari-app-backdrop-rendering: pixelated;
}
```

アートはアプリ全体の下にある専用の固定レイヤー(`[data-mari-part="app-backdrop"]`)に1回描画されるため、Homeの装飾やライトのカラースキームに隠されません。チャットの背後にも表示されます。Roleplay、Conversation、Gameの表面が透明になり、標準のチャット背景は表示を譲ります。利用者がチャット用に選んだ背景は、その上に引き続き表示されます。パネルは`--card`と`--sidebar`を維持するため、その背後にもアートを見せたい場合は半透明にし、ページ全体に色を重ねるには`--mari-page-veil`を使ってください。ページ専用のパネルを設けるには、`[data-mari-part="page"]`にスタイルを指定してください(「フック」を参照)。これはすべてのライブラリーのページ、エディター、設定、ドキュメントを包むため、ロアブックにもキャラクターと同じパネルが付きます。 背景画像の上では、各フルページはさらに`--background`のほぼ不透明なシート(`--mari-page-floor`、デフォルトは94%)の上に表示され、長いリストやエディターも読みやすくなります。`--mari-page-floor`を別の色にするか、`transparent`にしてアートをより多く見せることもできます。`[data-mari-part="page"]`を`!important`付きでスタイルするテーマでは、このシートの代わりにそのテーマのパネルが使われます。

| トークン | デフォルト |
| --- | --- |
| `--mari-app-backdrop` | 画像またはグラデーション1つ |
| `--mari-app-backdrop-size` | `cover`(タイルには`auto`や`64px`を試してください) |
| `--mari-app-backdrop-position` | `center` |
| `--mari-app-backdrop-repeat` | `no-repeat` |
| `--mari-app-backdrop-attachment` | `fixed` |
| `--mari-app-backdrop-rendering` | `auto`(ピクセルアートには`pixelated`) |
| `--mari-app-backdrop-layers` | `url(city.webp) bottom / 100% auto no-repeat, radial-gradient(#fff3 1px, transparent 1px) 0 0 / 12px 12px, #fbe3ef`など、複数レイヤーの完全な`background`値。画像1枚用のトークンより優先されます |

独自の画像は、テーマの中で最も柔軟に使える部分です。背景、トップバーの帯、Homeウィジェットやメッセージの枠(`border-image`、または任意のパーツのフックに設定する`background`)、タイル模様、同梱のピクセルフォントはすべてテーマファイルに入り、インポートのプレビューに一覧表示されます。利用者の外観 > アクセシビリティ > テーマアートの強さの設定は、背景と環境オーバーレイを薄くします。ハイコントラストでは25%以下に抑えられ、テーマでどちらの設定も取り消すことはできません。

## 環境オーバーレイ

`--mari-ambient`には、チャットやページの上、ただしトップバーと両方のサイドバーの**下**に置くレイヤー用の、完全な`background`値を指定します。雨、落ち葉、走査線、周辺減光などに使えます。

```css
:root {
  --mari-ambient: url("theme:leaves.webp") 0 0 / 512px repeat;
  --mari-ambient-opacity: 0.6;
  --mari-ambient-animation: leaves-fall 30s linear infinite;
}
@keyframes leaves-fall {
  to {
    background-position: 0 1024px;
  }
}
```

`--mari-ambient-blend`は`mix-blend-mode`を設定します。`[data-mari-part="ambient"]::before`と`::after`を使い、さらに2つのレイヤーを自由に追加できます。このレイヤーはクリックを受け取らず、動きを減らす設定では動きが止まります(画像は静止フレームになります)。また、大部分が透けている必要があります。環境レイヤーがチャットを隠すテーマはオフになります。全画面の`body::after`はガードによってアプリを覆っていると判断されるため、代わりにこちらを使ってください。

レイヤーが見えない間は動きが止まります。アプリがバックグラウンドにあるとき(別のタブやアプリにフォーカスがあるとき)や、スマートフォンとタブレットでライブラリーのページ、エディター、設定などの全画面ページがチャットを覆っているときです。テーマのほかの場所にある無限アニメーションもバックグラウンドでは一時停止します。停止したところから再開するので、重要な処理のタイミングをそれに合わせないでください。

チャット自身の背景は`<img data-mari-part="backdrop">`です。標準の背景(背景を選んでいない場合)には`data-default-background="true"`も付くため、テーマはそれだけを置き換えられます。

```css
img[data-mari-part="backdrop"][data-default-background] {
  opacity: 0 !important;
}
```

## 天候

物語に天候があるとき(設定 > 外観 > エフェクト > 動的な天候エフェクト、World Stateエージェントがオン)、アプリはチャットの上に雨、雪、霧、花びら、星、太陽、月を描きます。テーマは`--mari-weather-*`トークンでこれらすべての見た目を変え、天候に合わせて独自のアートも切り替えられます。

初めての場合は、[テーマの天候](theme-weather.md)で画像付きの手順を確認してください。

```css
:root {
  --mari-weather-style: pixel; /* every drop and flake lands on a pixel grid */
  --mari-weather-pixel-size: 3px;
  --mari-weather-rain-color: #ffaacd;
  --mari-weather-petal-image: url("theme:petal-a.png") url("theme:petal-b.png");
  --mari-weather-petal-size: 3;
  --mari-weather-tint-strength: 0.4;
}
:root[data-theme="dark"] {
  --mari-weather-moon: none; /* the night backdrop already has a moon */
}
```

描画そのものは引き続きアプリが行います。テーマの読み込み時、カラースキームの変更時、テーマの編集時にこれらのトークンを読み取り、各値を確認して、認識できないものを無視します。そのため、昼夜別(またはチャット別)の天候も、ほかのトークンと同じように使えます。

| トークン | 値 |
| --- | --- |
| `--mari-weather-style` | `smooth`(デフォルト)または`pixel`: レイヤーを低解像度で描いて鮮明に拡大し、パーティクルを四角いセルにします |
| `--mari-weather-pixel-size` | 2～6(セルあたりのpx)、デフォルト3 |
| `--mari-weather-<kind>-color` | 単純な色(`#hex`、色名、`rgb()`、`hsl()`)。グラデーションや画像は使えません |
| `--mari-weather-<kind>-image` | テーマ自身の画像を最大4枚、`url("theme:a.png") url("theme:b.png")`のように指定します。パーティクルごとに1枚を選びます。smoothスタイルでは葉、花びら、灰が回転しながら落ちます |
| `--mari-weather-<kind>-size` | 0.5～3倍。pixelスタイルでは画像自身のサイズにこの値を掛けて描くため、ピクセルアートの画素を保てます(アートの1画素 = サイズ x 1 px) |
| `--mari-weather-<kind>-shape` | `round`または`square`(smoothスタイル。「データの雪」や火花には四角を使えます) |
| `--mari-weather-amount` | 0.25～1。テーマは天候の量を減らせますが、増やすことはできません |
| `--mari-weather-speed` | 0.5～1.5倍 |
| `--mari-weather-strength` | パーティクルの表示の強さの0.5～1.5倍(暗い街に薄い雨など) |
| `--mari-weather-tint-strength` | 標準の空の色の0～1倍(雨の青、夜の暗い色など) |
| `--mari-weather-rain-length` | 雨の筋の長さの0.5～3倍 |
| `--mari-weather-sun`, `-moon` | 背景に独自の太陽や月を描いている場合は`none` |
| `--mari-weather-lightning-color` | 閃光の色。強さとタイミングは、てんかんに配慮したアプリの穏やかな値を維持します |
| `--mari-weather-lightning-bolt` | `on`、`none`、または0.5-3(幅)。閃光のたびに左右どちらかの側を枝分かれした稲妻が走り、閃光とともに消えます |

種類: `rain`、`snow`、`hail`、`fog`、`dust`、`leaf`(風のある天候)、`petal`(花)、`ember`、`ash`、`sand`、`firefly`、`star`、`aurora`、および`sun`と`moon`(色、サイズ、画像1枚)。

### 天候に合わせて変わるアート

チャットの天候が表示されている間、`<html>`には固定の一覧から選ばれた2つの語が付きます(物語そのもののテキストは使いません)。

| 属性 | 値 |
| --- | --- |
| `data-mari-weather` | `clear`、`cloudy`、`rain`、`storm`、`snow`、`hail`、`fog`、`sand`、`ash`、`embers`、`wind`、`blossom`、`aurora` |
| `data-mari-sky` | `dawn`、`day`、`dusk`、`night` |
| `data-mari-shelter` | `indoors`または`outdoors`(アプリが判断できない場合は付きません) |

屋内ではパーティクル、霧の塊、太陽、月、星は描画されず、色の重なりと稲妻の閃光だけになるため、テーマの天候トークンが見た目に反映されるのは屋外だけです。これらの属性は環境アニメーションとエフェクトを減らすのオン/オフに関係なく設定されます(背景の切り替えは動きを伴いません)。チャットに天候がない場合や、利用者が天候をオフにした場合は削除されます。雨のときに晴れた背景をグレーにしたり、独自の環境レイヤーを退けて天候を二重に表示しないようにしたりできます。

```css
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:street-overcast.webp");
}
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

### 利用者が決める設定

- テーマは天候をオンにもオフにもできません。利用者の切り替え設定で決まります。
- 環境アニメーションとエフェクトを減らす(または端末の動きを減らす設定)では、天候をまったく描画しません。
- 描画エフェクトを減らすでは、色の重なり、光彩、夕焼けの色を省き、パーティクルを60%だけ描画します。
- テーマアートの強さは、背景と同じようにテーマの天候を薄くし、ハイコントラストでは25%以下に保ちます。
- すべての端末で、パネル、エディター、Mariがチャットを覆っている間は天候の描画が止まります。

Petal OS(ピクセル風の天候と独自の花びら)、NEON//GRID(シアンの筋状の雨)、Lantern Path(描かれた葉と、悪天候でグレーになる背景)が実例です。**Clone + Edit**(複製して編集)でコピーし、CSSを読んでください。

## アクセントのエフェクト

アクセントパルスとRGBモードは、新しいレイアウトのいくつかのアクセント箇所(「+ New」、主要なボタン、アシスタントのアバタータイル)をCSSフィルターでアニメーションさせます。フレームごとの書き換えはありません。テーマでは次のことができます。

- `:root { --marinara-theme-accent-pulse: enabled; }`で利用者のアクセントパルスをオンにできます。
- `animation: var(--mari-accent-fx-animation);`で独自の要素を追加できます。

どちらも`prefers-reduced-motion`と、アプリの「環境アニメーションとエフェクトを減らす」設定で停止します。

## フック

### `<html>`の属性

| 属性 | 値 |
| --- | --- |
| `data-theme` | `dark`、`light` |
| `data-visual-theme` | `default`(Marinara)、`sillytavern`(Dottore)、`stage` |
| `data-overhaul` | `on`(新しいレイアウト、デスクトップ)、`mobile`(新しいレイアウト、スマートフォンとタブレット)。旧レイアウトには付きません |
| `data-custom-theme` | 適用中のテーマのID |
| `data-seasonal-theme` | 季節の外観がオンの場合、その外観 |
| `data-mari-accent-fx` | アクセントのエフェクトの実行中は`pulse`または`rgb` |
| `data-chat-id` | 開いているチャットのID |
| `data-chat-open-mode` | 開いているチャットのモード: `roleplay`、`conversation`、`game` |
| `data-chat-tags` | 開いているチャットのタグ。小文字で、スペースは`-`に置き換わります。`:root[data-chat-tags~="horror"]`で物語にスタイルを指定できます |
| `data-mari-chat-art-behind` | チャットの背景がサイドパネルの背後に表示されている間に付きます(`--mari-chat-art`がその画像) |
| `data-marinara-reduced-effects` | 環境アニメーションを減らしているときに付きます |
| `data-mari-a11y-line-height` | 利用者が行間を広げたときに付きます(`--mari-a11y-line-height`) |
| `data-mari-a11y-letter-spacing` | 利用者が文字間隔を広げたときに付きます(`--mari-a11y-letter-spacing`) |
| `data-mari-a11y-focus` | 強いフォーカスリングがオンのときに付きます |
| `data-mari-contrast` | ハイコントラストがオンのときは`more`(利用者の選択、または端末からの要求) |
| `data-mari-cvd-safe` | 色覚に配慮した色がオンのときに付きます |
| `data-mari-weather` | 物語の天候の表示中、その天候: `rain`、`snow`、`fog`など([天候](#weather)を参照) |
| `data-mari-sky` | 物語の天候の表示中は`dawn`、`day`、`dusk`、`night`のいずれか |
| `data-mari-shelter` | 物語の天候の表示中、アプリが場所から判断できる場合は`indoors`または`outdoors` |

### 領域

`[data-component="…"]`は大きな領域を示します: `AppShell`、`TopBar`、`ChatSidebar`、`ChatSidebarSlot`、`RightPanelDesktop`、`RightPanelDesktopSlot`、`CenterContent`、`GlobalOmnibar`、`OverhaulLibraryNav`、`OverhaulSettingsPage`、`OverhaulLibraryPage`、`OverhaulCardGallery`、`OverhaulEditorHead`、`OverhaulEditorRail`。

### パーツ

| セレクター | 対象 |
| --- | --- |
| `[data-mari-part="message"]` | すべてのチャットモードのメッセージ1行。チャットの幅全体を占め、アバター、名前の行、吹き出しが入ります。この行ではなく吹き出し(下記の`bubble`)を装飾してください。行を装飾すると、すべての吹き出しがもう1つの箱に囲まれます。`data-message-id`と`data-message-role`(`user`、`assistant`、`system`など)、後述のメッセージデータも付きます |
| `[data-mari-part="bubble"]` | RoleplayとConversationのメッセージの吹き出し自体(`.mari-rp-bubble` / `.texting-bubble`)。背景、枠線、角丸、影はここに指定します |
| `[data-mari-part="message"][data-latest]` | キャラクターの最新の返信 |
| `[data-mari-part="message"][data-streaming]` | まだ書き込み中の返信 |
| `[data-mari-part="avatar"]`, `[data-mari-part="header"]`, `[data-mari-part="actions"]` | メッセージ内のアバター、名前の行、メッセージのツール |
| `[data-mari-part="reasoning"]`, `[data-mari-part="reasoning-text"]` | 推論の切り替え(またはボックス)とその本文。デスクトップとスマートフォンで同じフックです |
| `[data-mari-part="composer"]` | メッセージ入力欄。`data-composer`は`roleplay`、`conversation`、`game`のいずれかです |
| `[data-mari-part="home-art"]` | Homeのカードの標準画像 |
| `[data-mari-part="message"][data-vn]` | ビジュアルノベルのセリフボックス。同じデータ(キャラクター、ロール、番号)を持つメッセージで、内部には`avatar`と`header`のパーツもあります |
| `[data-mari-part="vn-sprite"]` | VNのセリフボックスの背後からシーンの下端まで伸びる空のレイヤー。現在の話者について、`data-vn-speaker`(話者名のスラッグ、またはロール)、`data-vn-speaker-role`、`data-character`、`data-character-id`が付くため、テーマはここに話者の画像を立たせられます。`[data-roleplay-vn-media]`にも同じ属性があります |
| `[data-mari-part="message"][data-game-narration]` | Gameのナレーションボックス。`data-message-role`は`narrator`で、キャラクターの発話中は`assistant`になり、`data-character`と`data-character-name`が付きます。`data-segment-type`と`data-expression`が現在のセリフを示します |
| `[data-mari-part="app-backdrop"]`, `[data-mari-part="ambient"]` | 背景と環境レイヤー。ページ内の位置は固定です。トークンでスタイルを指定してください |
| `[data-mari-part="home-widget"]` | Professor Mariを含むHomeウィジェットのカード。枠には`data-home-widget-id`(`recent`、`professor`、`whats-new`、`character-library`など)が付きます。内部には`home-widget-eyebrow`、`home-widget-title`、`home-widget-text`があります |
| `[data-mari-part="top-bar"]` | すべての端末のトップバー。分割表示のもう一方には、同じフック(`[data-component="TopBar"]`、`.ov-tab`、`.ov-tab__label`、`.ov-icon-btn`)と`[data-split-bar]`が付いた専用の細いバーがあり、トップバーのアートやフォントがそちらにも適用されます |
| `[data-mari-part="page-title"]` | メインページの大きなタイトル。ライブラリーの各セクション(キャラクター、ロアブック、接続、エージェントなど)、設定、拡張機能、ドキュメントが対象です。この1つのフックでページのタイトルを指定すると、すべてのページで揃えられます |
| `[data-mari-part="backdrop"]` | チャットの背景画像(「背景」を参照) |
| `[data-mari-part="stage-empty"]` | シーン画像がないGameのステージ |
| `[data-mari-part="time"]` | すべてのチャットモードのメッセージの時刻 |
| `[data-mari-part="chat-header"]` | Conversationのヘッダー(`data-chat-mode="conversation"`) |
| `[data-mari-part="game-hud"]`, `[data-mari-part="game-tools"]` | Gameのマップとパーティーのフローティング表示、およびナレーションのツール行 |
| `[data-mari-part="avatar-placeholder"]` | 空のアバターの円。`data-role`は`user`または`assistant` |
| `[data-mari-part="header"][data-placement]` | Roleplayのメッセージでは、`outside`(吹き出しの上に名前)または`inside` |
| `[data-mari-part="home-widget-glow"]` | Homeウィジェットのヘッダーの背後の光彩 |
| `[data-mari-part="dialogue"]` | メッセージ内の引用符付きのセリフ |
| `[data-mari-part="paragraph-gap"]` | 段落間の空行(`--mari-paragraph-gap`を設定するとブロックになります) |
| `[data-mari-part="vn-text"]`, `vn-counter`, `vn-nav` | VNのテキストボックス(続きがスクロールで表示される間は`data-more-below`)、「3 / 9」のカウンター、前へ / 次へボタン(`data-direction`) |
| `[data-mari-part="card-art"]` | ライブラリーのカードの画像。画像がない場合は`data-placeholder` |
| `[data-mari-part="page"]` | すべての全画面ページの表面。ライブラリーの各ページ(キャラクター、ロアブック、プリセット、正規表現スクリプト、接続、エージェント、カスタムツール)、すべてのエディター、設定、ドキュメントが対象です。1つのページ固有のクラスではなく、ここにパネルやシートを描画すると、すべてのページを同じ読みやすい表面にできます。チャットとHomeは含まれません |
| `[data-mari-part="chat-row-art"]` | サイドバーで、開いているチャットの行の背後に表示する画像 |
| `[data-mari-part="avatar-placeholder"]` | 空のアバターが表示されるすべての場所に追加されました。Conversationの行、チャットの行(頭文字)、ペルソナの切り替え、メッセージ入力欄、Gameが対象です |
| `.ov-lrow__dot[data-status]` | ロアブックのエントリーの点: `constant`、`selective`、`normal`のいずれか |
| `[data-chat-row]` | チャットのサイドバーの行。開いているチャットには`data-selected="true"`が付きます |
| `[data-chat-mode]` | モード別のチャットの表面 |
| `.mari-messages-scroll` | スクロールするメッセージ一覧 |
| `.mari-rp-bubble`, `.mari-rp-bubble--user`, `.mari-message-assistant` | RoleplayとConversationの吹き出し |
| `.mari-window`, `.mari-drawer` | ポップアウトウィンドウとドロワー |

### スロット

これらは適用中のテーマが要求したときにだけ現れるため、標準のページに余分なパーツはありません。

- **フォーカス枠。** `--mari-focus-frame`は、`url("theme:frame.png") 24 fill / 24px / 6px stretch`などの完全な`border-image`値を受け取り、利用者が注目している対象(最新の返信、Ctrl+K、開いているダイアログ、Homeの最近のチャット)に描画します。(メッセージテンプレート内の)ほかの要素にも`data-mari-focus-surface`を追加すると枠を付けられます。v1.5以降、枠が対象の表面からはみ出す量は`--mari-focus-frame-outset`(最大2rem)だけで指定し、値に`fill`が含まれる場合はまったくはみ出さないため、チャットを覆えません。`--mari-focus-frame`内に書いたはみ出し量は無視されます。枠は`border-image`です。CSSの後方で同じ要素に`border`の一括指定を使うとリセットされるので、そこでは代わりに`border-color`、`border-width`、`border-style`を設定してください。
- **ウィンドウのタイトル。** `--mari-window-title`に値(`on`など任意の値)を設定すると、各メッセージ、Homeウィジェット、メッセージ入力欄の上部にタイトル行が追加されます。`[data-mari-part="window-title"]`に`data-window`(`message`、`home-widget`、`composer`、v1.5以降は`narration`、`omnibar`、`window`、`dialog`も)が付きます。中には`window-title-text`(話者、ウィジェットのタイトル、または「メッセージ」)と、`_ [] X`の装飾用の空の`window-buttons`が入ります。
- **チャット行のプレビュー。** `--mari-chat-row-preview`に値(`on`など任意の値)を設定すると、チャット一覧の各名前の下に最新の1行を追加します。`[data-mari-part="chat-row-preview"]`に`data-role`(`user`、`assistant`、`narrator`など)が付き、先頭は`[data-mari-part="chat-row-preview-who"]`です(自分の行では「You:」、グループチャットでは話者名)。行の現在の状態表示(「入力中…」「未送信の下書き」)が優先されるため、2つ同時に表示されることはありません。トークンがなければ、その行は取得も描画もされません。
- **カードの背後の環境レイヤー。** `--mari-ambient-placement: behind-cards`は、環境レイヤーをチャットの上ではなく、メッセージ、Homeウィジェット、パネルの下(背景画像の上)に移します。`--mari-ambient-mask`(完全な`mask`値)で表示範囲を形作り、`--mari-ambient-mask: var(--mari-gutter-mask)`でウィンドウ中央を空けると、文字の上ではなく左右の余白に雨を降らせられます。`--mari-gutter-clear`は、空ける領域の半幅(26rem)を設定します。

### メッセージのデータ

すべてのメッセージには、作者、番号、生成にかかった時間が、セレクターや`attr()`用の属性と、`content:`や`counter()`用のCSS変数として付いています。

| 属性 | 変数 | 値 |
| --- | --- | --- |
| `data-character-id` |  | キャラクターのID(自分のメッセージには付きません) |
| `data-character-name` | `--mari-msg-char` | 表示名(`--mari-msg-char`は引用符で囲まれた文字列) |
| `data-character` |  | 小文字にし、スペースを`-`にした名前。セレクター用: `[data-character="captain-faye"]` |
| `data-message-index` | `--mari-msg-index` | 「メッセージ番号を表示」で表示されるメッセージ番号 |
| `data-gen-ms` | `--mari-msg-gen` | 生成時間(ms)。`--mari-msg-gen`は`"3.2s"`などの文字列です |

```css
[data-mari-part="message"] [data-mari-part="header"]::after {
  counter-reset: msg var(--mari-msg-index);
  content: "#" counter(msg) " · " var(--mari-msg-gen, "");
}
```

### メッセージテンプレート(HTML)

話者名とメッセージ番号を表示する状態ボックスなど、CSSだけでは足りない場合は、テーマファイルにロールごとの小さなHTMLテンプレートを含められます。メッセージごとに値が埋められ、末尾のボックス`[data-mari-part="message-extra"]`に表示されます。CSSでそのスタイルと配置を指定します。

```json
"templates": {
  "assistant": "<div class=\"status\"><b>{{char}}</b> · entry #{{index}} · {{gen}}</div>",
  "user": "<div class=\"status\">> {{char}} @ {{time}}</div>"
}
```

キー: `message`(すべてのロール)、`assistant`、`user`、`narrator`(ロール専用のテンプレートが`message`より優先されます)。フィールド: `{{char}}`、`{{role}}`、`{{index}}`、`{{gen}}`、`{{time}}`、`{{date}}`。不明なフィールドは空になります。各テンプレートは最大4,000文字です。Marinaraは、テキストとレイアウト用のタグ(`div`、`span`、`p`、`b`、`i`、`ul`、`table`、`details`、`progress`など)、その`class`、`title`、`role`、`data-*`属性を残し、スクリプト、スタイル、インラインの`style`、リンク、画像、フォーム、イベント属性を取り除きます。テキストでキーやパスワードを求めるテンプレートは破棄されます。

HTMLは利用者が明示的に許可する必要があります。テンプレート付きのテーマは、**Settings → Appearance → CSS Themes → Allow themes with HTML**(設定 → 外観 → CSSテーマ → HTMLを含むテーマを許可(リスクを承知します))がオンのときだけインストールできます(デフォルトはオフ)。インポートのプレビューに警告が表示され、設定がオフの場合、インストール済みのテーマはHTMLなしで表示されます。

## チャットごとの外観

チャット設定 > テーマで、1つのチャット専用のテーマを設定できます(「デフォルトの外観」では、そのチャットのカスタムテーマがオフになります)。キャラクターが1人だけのチャットでは、選んだテーマをそのキャラクターのほかの1対1のチャットのデフォルトにできます。グループチャットやGameのパーティーでは、メンバー1人のデフォルトを使うことはありません。テーマのセクションには、現在の外観の設定元がチャット、キャラクター、アプリのどれなのかが示されます。設定、ライブラリー、エディター、ドキュメントは常にアプリのテーマを使い、`data-chat-id`と`data-chat-tags`はチャット自体の表示中だけ`<html>`に付きます。

タグを使うと、1つのテーマの中で特定の物語のスタイルを持ち運べる形で指定できます: `:root[data-chat-tags~="noir"] { --primary: #c9a227; }`。タグはチャット設定 > チャット名(「タグを追加」)、チャット行のタグボタン(タッチ画面では長押しメニューの「タグ」も)から追加できます。属性内ではタグが小文字になり、スペースは`-`に置き換わるため、「Noir Mystery」は`noir-mystery`に一致します。

`--mari-chat-*`変数(`--mari-chat-bg`、`--mari-chat-text`、`--mari-chat-radius`、`--mari-chat-font-family`など)を設定すると、それに対応するチャットの表面のスタイルが自動でオンになります。テーマのチャットの色を表示するために、利用者が「Apply preset …」の設定をオンにする必要はありません。

## 昼と夜

設定 > 外観 > カラースキームは、システムや時刻に合わせられます(デフォルトでは07:00からライト、19:00からダークで、どちらも変更できます)。いずれも`<html>`の`data-theme`を切り替えるだけなので、両方にスタイルを指定すると、テーマに昼と夜の外観を持たせられます。

```css
:root[data-theme="light"] {
  --mari-app-backdrop: url("theme:day.webp");
}
:root[data-theme="dark"] {
  --mari-app-backdrop: url("theme:night.webp");
}
```

カラースキームは各端末自身の時計で決まり、同期されません。そのため、異なる場所にあるスマートフォンとPCでも、それぞれ適切な外観が表示されます。テーマファイルから切り替え設定自体を提案することもできます: `"settings": { "colorScheme": "time", "dayStart": "07:00", "nightStart": "19:00" }`(または`"system"`)。インポートのプレビューで、ほかの設定と同じように提案されます。

## テーマファイル

エクスポートすると、1つのテーマが1つのJSONファイルに書き出されます。

```json
{
  "kind": "marinara.theme",
  "formatVersion": 2,
  "name": "Forest Glass",
  "author": "You",
  "version": "1.2",
  "description": "Deep greens with frosted panels.",
  "colorScheme": "dark",
  "thumbnail": "data:image/webp;base64,…",
  "settings": { "colorScheme": "dark", "visualStyle": "stage", "accent": "#3fae7a", "fontFamily": "Georgia" },
  "fonts": [{ "family": "My Display", "src": "data:font/woff2;base64,…" }],
  "images": [{ "name": "frame.webp", "src": "data:image/webp;base64,…" }],
  "backgrounds": [{ "name": "forest.webp", "src": "data:image/webp;base64,…" }],
  "css": ":root { --primary: #3fae7a; }"
}
```

クレジット(v1.5)は同じファイルに入れ、テーマ一覧の(i)ボタンとインポートのプレビューに表示されます。

```json
{
  "license": "CC BY 4.0",
  "labels": ["High legibility", "No motion"],
  "credits": [{ "what": "Backdrops", "by": "Jane Doe", "license": "CC BY 4.0", "url": "https://example.com" }],
  "fonts": [{ "family": "My Display", "src": "…", "license": "OFL-1.1", "credit": "Fraunces by Undercase Type" }]
}
```

`labels`は、テーマ名の下に表示する短いタグで、最大4つ(各40文字)までです。フォントやクレジットのライセンスが`OFL-1.1`の場合は、アプリに同梱されたSIL Open Font Licenseの本文へのリンクが付きます。幅1920 px(または長辺2560 px)を超える画像は、テーマのインポート時に縮小されます。

必須なのは`kind`、`name`、`css`だけです。`templates`については「メッセージテンプレート」で説明しています。`settings`のキー: `colorScheme`(`dark`、`light`、`time`、`system`)、`dayStart`、`nightStart`、`visualStyle`、`accent`、`accentLight`、`background`、`backgroundLight`、`fontFamily`、`accentPulse`、`fontSize`(表示サイズ、px単位: 12、14、16、17、19、22、26、30、34)、`reduceMotion`(trueまたはfalse)。インポートでは、まず提案された設定にチェックが入ったプレビューを表示します。ただし、ビジュアルスタイル、アクセントパルス、表示サイズ、動きを減らす設定は、必要な場合に利用者がチェックを入れます。背景を自分のギャラリーに追加するかも選べます。4 KiB未満の画像はインラインのままで、1つの「小さなアイコン」チップにまとめて表示されます。フォントはテーマとともに(`@font-face`ルールとして)読み込まれ、テーマとともに取り除かれます。インストール済みのテーマと同名のテーマをインポートすると、アップデートを提案します。アップデートで同じ背景がギャラリーに二重に追加されることはありません。CSSの上限はCSSテキスト256 KiBで、画像、サムネイル、フォント、背景の合計上限は6 MiBです。収まらない画像は、そのサイズとともに個別に除外され、テーマの残りはインストールされます。通常の`.css`ファイル、`{ "name", "css" }`、旧形式の`marinara.theme-folder`エクスポートも引き続きインポートできます。

## テーマを軽快に保つ

スマートフォンやタブレット、特にSafariを使うiPadでは、重いCSSの影響がタップのたびに現れます。ほとんどのテーマは問題ありませんが、テストでテーマを重くしたのは次のパターンです。

- **親に`:has()`を使い、その子にスタイルを適用する**パターン。例えば`.panel:has(> .row) > *`や`body:has(.open) .chat *`です。ブラウザーは1文字入力されるたび、ストリーミングで1語届くたびにページ全体を再確認します。スタイルを指定する要素自体に`:has()`を付ける(`.row:has(> img)`)か、代わりに`data-mari-part`のフックを使ってください。
- **多数の要素に同時に`backdrop-filter`を使う**パターン。すべてのメッセージやチャット行などです。すりガラス風のパネルが1つか2つなら問題ありませんが、100行それぞれにぼかしを掛けるのは重くなります。代わりに半透明の色を使ってください。
- **レイアウトをアニメーションさせる**パターン(`width`、`height`、`top`、`margin`)や、大きな`box-shadow`のアニメーション。`opacity`と`transform`、または環境レイヤーの`background-position`をアニメーションさせてください。

**Settings → Advanced → Troubleshooting → Show tap timings**(設定 → 詳細設定 → トラブルシューティング → タップ時間を表示)で、その端末の各タップにかかる時間を、テーマありとなしで確認できます。両者を比較して、重いルールを見つけてください。

## アクセシビリティ

設定 > 外観 > アクセシビリティは、利用者の行間、文字間隔、フォーカスリング、ハイコントラスト、色覚に配慮した色、メッセージの文字サイズの最小値12 pxを適用します。値はすべての要素の`mari-protected`レイヤーにリテラルとして書き込まれるため(lib/accessibility-css.ts)、テーマは変数を再定義しても取り消せません。各設定がオフの間は、テーマで次を設定できます。

| トークン | 用途 |
| --- | --- |
| `--mari-focus-ring-color` | アプリの通常のフォーカスリング(デフォルトは`--primary`) |
| `--mari-cvd-good`, `--mari-cvd-warn`, `--mari-cvd-bad` | 独自の青とオレンジの組み合わせを使いたい場合の状態とゲージの色 |

アートについては、さらに次の3つの設定がテーマより優先されます。

- **Theme art strength**(テーマアートの強さ、0-100%)は、背景と環境オーバーレイを薄くします。
- **High contrast**(ハイコントラスト)は、表面もそのカラースキームの不透明な色にします(`--background`、`--card`、`--popover`、`--sidebar`、`--secondary`、`--muted`、`--mari-rp-bubble-bg`、ページのベール、Homeの色の重なり、Homeウィジェット、トップバーの下地)。テーマのアートも25%以下に抑え、文字がパステル調の画像に直接重ならないようにします。テーマが独自のセレクターにリテラルで指定した色は変わらないため、トークンを使うことをおすすめします。
- **Reduce motion**(動きを減らす)は、動く画像を最初のフレームで表示し、環境オーバーレイを止めます。強制カラー(Windows High Contrast)では、アートと`border-image`の枠を隠します。

固定の緑や赤ではなく、上記の状態とゲージのトークンを使うと、色覚に配慮した色の切り替えがテーマにも反映されます。スキップリンク(`.mari-skip-link`)は、テーマが何をしても利用できます。テーマがこれらを変更しようとすると、インポートのプレビューで利用者に通知されます。

## 安全性

- トップバー(全画面時の自動非表示状態を含む)、チャットのサイドバーとその行、ライブラリーのサイドバー、Ctrl+K、メッセージ入力欄は見た目を変えられますが、隠す、動かす、覆う、薄くする、フィルターで見えなくする、クリックできなくすることはできません。ガードは、テーマの読み込み後、2.5秒後と10秒後、チャットを開いたとき、パネルを開いたとき、カラースキームを変えたとき、サイズを変えたとき、テーマ自身のアニメーションの開始時と終了時に、テーマありとなしでこれらを測定します。いずれかを壊すテーマは、そのタブでオフにします。
- 画像も対象です(ガードv3)。タブ、アイコン、チャット行、メッセージ入力欄に重ねて描かれたものは、`pointer-events: none`の有無やサイズに関係なく、操作項目の中央で検出されます。それを隠すレイヤー(色、グラデーション、その位置の画素がほぼ不透明な画像)は、覆っているとみなされます。操作項目にはみ出す`border-image`や、操作項目に掛けた画像の`mask`も同様です。トップバー内では、すべての`::before`と`::after`がラベルやアイコンの下に置かれ、マスク、`list-style-image`、`border-image-outset`は適用されません。背景と環境オーバーレイは、構造上バーの下にあるため対象外です。
- ガードv4(第4段階)。コントラストは、文字の背後のレイヤーを描画順に読み取ります(`border-image`の塗り、上から順に各背景レイヤー、最後に色)。文字を実際に覆っている割合(サイズ、位置、繰り返し)で重みを付け、画像は文字の下だけをサンプリングします。細い線や隅の小さな装飾は対象外になり、明るいページに重ねた暗いベールは暗いものとして読み取られます。トップバーとメッセージ入力欄はより厳しく確認されます。元の文字のコントラストが3:1あった場合、最も低い箇所でも3:1を保つ必要があります。トップバー、チャット行、メッセージ入力欄で、操作項目自身の`::before`や`::after`に置いた画像がその項目を覆う場合も、覆っているとみなされます。疑似要素に置いた`position: fixed`の画像にはエディターで警告が出ます。代わりに`position: absolute`、`--mari-ambient`、`--mari-app-backdrop`を使ってください。疑似要素にトップバーのアートが見つかると、`--mari-top-bar-bg`と同様にタブとアイコンに下地が付きます。
- アート上のコントラスト: 文字の背後に画像がある場合、ガードは確認を省略せず、画像の色を読み取ります。
- チャット本文(v1.5): ガードは画面内のチャットの末尾数行をサンプリングし、テーマがそのうち半分の行を覆う場合はオフにします(疑似要素の覆い、カードの背後の不透明な環境レイヤー、本文にはみ出すフォーカス枠など)。テーマ自身のレイアウトで画面外に移った行や、テーマが返信の上に固定した名前の行は数えません。
- テーマが`content:`で追加するテキストは、インポートのプレビューに表示されます。
- テーマのテキストのルール(セキュリティ監査、2026年11月)。テーマが描画できるすべての文字列を、取得元(ファイル、エディター、Mari、バックアップ、チャットごとの選択)にかかわらず、テーマの適用前に確認します。対象は、`content:`と`quotes`の文字列、カスタムプロパティ(`content: var(--x)`も対象)、`@counter-style`の記号、メッセージ入力欄のプレースホルダー、メッセージテンプレート(本文と`title`)、SVG画像内のテキストです。キー、パスワード、サインイン、アカウント情報を求めるもの、アプリを装うもの(「ハッキングされた」「RCE」「セキュリティ警告」「Marinara認証済み」「サポートに電話」など)、電話番号やWebアドレスを含むもの、1つの宣言で英数字が80文字を超えるものは拒否されます。テーマはインストールできず、インストール済みでも適用されません。見た目の似た文字、アクセント記号、ゼロ幅文字、空白、1337表記は、先に正規化されます。セレクター、`font-family`、グリッド領域名の文字列は対象外です。テーマ名、作者、説明、クレジットでも、秘密情報を求めたり公式を装ったりできません(そこにはWebアドレスを記載できます)。
- URL: テキストのサニタイザー(url()の許可リスト、`@import`禁止、data:フォントのみ)に加え、適用前にブラウザーがスタイルシートを解析します。テーマ自身の画像、埋め込みのdata:画像とフォント、`#fragments`、`about:invalid`以外のアドレスがあると、テーマを拒否します。`src()`もurl()と同じルールに従い、末尾で閉じられていない`image-set(`は破棄されます。
- テーマファイルが提案する色(`settings.accent`、`background`、およびライト用の対応項目)は、単純な色かグラデーションに限られます。`url()`、`image-set()`、値の外へ抜け出す記述は使えません。
- SVG画像は使用前に許可リストから再構築されます。`<script>`、`<foreignObject>`、`<a>`、イベント属性、外部リンク、`<?xml-stylesheet?>`、DOCTYPEエンティティは使えず、CSSもテーマと同じ方法で無害化されます。デコード後に1辺8192 pxまたは4,000万画素を超えるラスター画像は拒否されます。
- 天候トークンは許可リストに基づいて読み取られます。既知のトークン名、範囲内に収めた数値、固定の一覧にある語、単純な色が対象です(`url()`、グラデーション、色以外の関数は使えません)。天候の画像はテーマ自身の画像に限られます(SVGの再構築とサイズ上限の確認後、アプリが作成した同一オリジンのアドレス)。ほかのアドレスは無視されます。テーマに書かれたものが実行されることはなく、稲妻の閃光はアプリの強さとタイミングを保ちます。
- メッセージテンプレートでは、ダイアログ、メニュー、通知を作るロールや、アプリ自身の`data-`属性、`mari-`/`ov-`クラス名は使えません。
- テーマのお試し(「このテーマを維持しますか?」)は、そのタブだけで行われます。ほかの端末に適用されるのは、維持を選んだ後です。応答がなければ元に戻り、バーにマウスを重ねるかフォーカスを当てるとカウントダウンが止まります。Escapeを3回押すと、そのタブのカスタムテーマがオフになります。Ctrl+K、メニュー、アプリのダイアログを閉じるために押したEscapeは数えません。

## 変更履歴

- **スマートフォンのミニ画像と控えめなアニメーション**(2026年11月12日～14日、仕様はバージョン1のまま): スマートフォンで名前の横に表示する小さな画像用の`--mari-mini-avatar-size`、`--mari-mini-avatar-ring`、`--mari-phone-convo-avatar`。`--mari-chat-row-preview`でチャット一覧に各チャットの最新の1行を追加できます。トランジションの開始待ちは最大1秒になりました。環境レイヤーと無限アニメーションは、見えない間は停止します。[テーマを軽快に保つ](#keeping-a-theme-fast)を参照してください。

- **読みやすいアクセント文字と分割バーのフック**(2026年11月11日、仕様はバージョン1のまま): 小さな文字に使うアクセントを、ライトでは少し暗く、ダークでは少し明るくしてラベルを読みやすくします。ボタンは元のアクセントのままです。`--mari-accent-text`でその文字色を指定できます。`[data-mari-part="top-bar"]`はすべての端末のトップバーを指します。分割表示のもう一方には、同じ`[data-component="TopBar"]`フック(加えて`[data-split-bar]`)を持つ独自のバーがあるため、テーマのトップバーのアート、フォント、タブの色が適用されます。`--mari-game-combat-bg`と`-bg-hover`は完全な`background`になり、グラデーションを使えます。

- **ページの表面のフック**(2026年11月10日、仕様はバージョン1のまま): `[data-mari-part="page"]`は、すべてのライブラリーのページ、エディター、設定、ドキュメントが載る1つの表面です。テーマでこれらすべてに同じパネルを付けられます。

- **テーマギャラリーと稲妻**(2026年11月9日、仕様はバージョン1のまま): スターターテーマをテーマギャラリーから必要に応じてダウンロードするようになりました。`--mari-weather-lightning-bolt`(`on`、`none`、または0.5～3の幅)は、嵐の閃光のたびに画面の片側に枝分かれした稲妻を描きます。

- **テーマの天候**(2026年11月、仕様はバージョン1のまま): `--mari-weather-*`トークン(ピクセル風、色、画像、サイズ、速度、量、強さ、色の重なり、太陽と月の非表示)、`<html>`の`data-mari-weather`と`data-mari-sky`、チャットを覆うパネルの下での天候の一時停止を追加しました。Petal OS、NEON//GRID、Lantern Pathで使っています。

- **第6段階とセキュリティ監査**(2026年11月、新しいトークンなし、仕様はバージョン1のまま): スターターテーマは読み取り専用になり、**Clone + Edit**(複製して編集)で編集可能なコピーを作ります(11月9日以降はインストールに同梱せず、テーマギャラリーから必要に応じてダウンロードします)。クレジット、ライセンス、ラベルをインポートのプレビューと(i)ボタンから表示します。テーマのお試しは**Keep theme**(テーマを維持)を選ぶまで、そのタブだけに適用されます。[安全性](#safety)に記載したテーマのテキストのルール、URL確認、SVG再構築、提案する色の確認を追加しました。

- **v1.5**(テーマ対応の第5段階、長い返信): `--mari-chat-column`、`--mari-message-measure`、`--mari-chat-line-height`、`--mari-dialogue-weight`、`--mari-paragraph-gap`、話者名の固定、`--mari-phone-avatar`、VNテキストボックスのパーツとフェード、`--mari-message-actions`、`--mari-swipe-counter`、`--mari-card-art-placeholder`、`--mari-chat-row-art-opacity`、`--mari-focus-frame-outset`、`--mari-scrim`、`--mari-center-x`を追加しました。セリフ、段落間の余白、カード画像、チャット行の画像のパーツと、あらゆる場所のアバターのプレースホルダーを追加しました。ナレーション、Ctrl+K、ウィンドウ、ダイアログにウィンドウタイトルを追加しました。UI枠のアクセントがルートを適用範囲とするUI枠にも反映されます。ガードがチャット本文を確認します。テーマのクレジット、ライセンス、ラベルと、同梱のOFL本文を追加しました。大きな画像はインポート時に縮小されます。

- **v1.4**(テーマ対応の第4段階): ガードv4(多層の背景、描画領域、トップバーとメッセージ入力欄の厳密な確認、疑似要素による覆い)、テーマファイルの`fontSize`と`reduceMotion`、インポートのプレビューで提案された設定へのチェックを追加しました。メッセージの時刻、Roleplayの色の重なり、UI枠のアクセントと薄い文字、ライブラリーとCtrl+Kの色、Combat、トースト、ロアブックの点、Homeのショートカット、文字サイズの下限、自分のアバター用のトークン、`--mari-top-bar-height`、`--mari-top-bar-plate-active`を追加しました。時刻、チャットヘッダー、GameのHUD、Gameのツール、アバターのプレースホルダー、Homeウィジェットの光彩のパーツと、フォーカス枠、ウィンドウタイトル、カードの背後の環境レイヤー、左右の余白のマスクのスロットを追加しました。

- **v1.3**(テーマ対応の第3段階、画像): テーマファイルの`images`と`url("theme:name")`を追加しました。CSSの上限はCSSテキストだけを数えます。インポート時のWebP変換、背景専用のレイヤー、背景上での`--mari-page-veil`の維持、`var()`を使った`!important`の一括指定の維持、環境オーバーレイ、画像のアイコンとカーソル、`--mari-home-wash`、`--mari-home-art`、追加のHomeウィジェットのトークンを導入しました。VNのセリフ、VNスプライトのスロット、Gameのナレーションのフックを追加しました。テーマファイルから時刻に従う設定を提案できます。ガードv3を導入しました。

- **v1.2**: メッセージテンプレートのスロット(テーマファイルの`templates`、`[data-mari-part="message-extra"]`)を追加しました。利用者が「HTMLを含むテーマを許可(リスクを承知します)」で明示的に許可します。

- **v1.1**: すべてのチャットモードに、キャラクター、番号、生成時間を持つメッセージのフックを追加しました。アバター、ヘッダー、操作、推論のパーツ、`--mari-composer-placeholder`、チャットの背後にも表示される背景v2(サイズ、位置、繰り返し、ピクセル表示、レイヤー)、`--mari-page-veil`、`--mari-top-bar-bg`、`--mari-text-outline`、`--mari-dialogue-color`、`--mari-chat-font-size`、`--mari-msg-head-rule`を追加しました。Homeウィジェットのトークンを追加し、Professor Mariも`home-widget`になりました。`--mari-stage-empty-bg`は`background`になり、グラデーションを使えます。
- **v1.0.1**: ガードv2、アクセシビリティの値の保護、追加されるテキストの確認を導入しました。インストールは全体が成功するか、何もインストールしないかのどちらかになりました。同梱の背景もインストールされます。元に戻す操作で、テーマが適用した設定も復元されます。テーマのフォントがフォント一覧に表示され、`url(#id)`の参照が維持され、同梱のフォント名がフォント自体から読み取られます。
- **v1**(最初に公開した仕様): 上記のテーマのトークン、パーツのフック、背景、アクセントのエフェクト。
