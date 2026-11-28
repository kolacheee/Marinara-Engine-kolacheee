# カスタムCSSテーマ

テーマを使うと、色、フォント、画像、パネルの形など、Marinaraの見た目全体を変えられます。Marinaraには、ダウンロードできる既製のスターターテーマを集めたギャラリーがあります。人から共有されたテーマをインポートしたり、自分でテーマを作ったりすることもできます。

テーマを使わずに手早く変えたいときは、[外観の設定](appearance-settings.md)または[用意されているチャットウィンドウのスタイル](#ready-made-chat-window-styles)を参照してください。自分でテーマを作る場合は、[テーマ作成ガイド](theme-author-guide.md)で手順を1つずつ説明しています。

## カスタムテーマとは

テーマは、Webページで色、フォント、余白を指定するコードであるCSSのかたまりに、テーマに付属する画像やフォントを加えたものです。テーマはMarinaraのサーバーに保存されるため、インストールしたテーマは、そのサーバーに接続するすべてのデバイスに表示されます。同時にオンにできるテーマは1つだけですが、テーマはいくつでも置いておけます。

## テーマの場所

**Library → Settings → Appearance**(ライブラリー → 設定 → 外観)を開き、セクションの並びにある**CSS Themes**(CSSテーマ)をクリックします。クラシックレイアウトでは**Settings → Addons → Theme Library**(設定 → アドオン → テーマライブラリー)です。

このセクションには、次の項目があります。

- 上部にある**Create Theme**(新しいテーマ)と**Import File**(ファイルをインポート)。
- **Allow themes with HTML (I accept the risk)**(HTMLを含むテーマを許可(リスクを承知します))。デフォルトではオフです。[HTMLを含むテーマ](#themes-with-html)を参照してください。
- **Installed Themes**(インストール済みのテーマ)。**Default Theme**(デフォルトのテーマ)、自分のテーマ、ダウンロードしたスターターテーマの順に並びます。
- **Browse the theme gallery**(テーマギャラリーを見る)。ダウンロードできるスターターテーマが並びます。

## スターターテーマ

スターターテーマはインストールには含まれないため、選ぶまでは容量を使いません。テーマギャラリーにあり、選んだテーマだけをMarinaraがダウンロードします。

1. **Browse the theme gallery**(テーマギャラリーを見る)を**Installed Themes**の下でクリックします。この操作にはインターネット接続が必要です。
2. 各テーマには、プレビュー、短い説明、サイズ、タグが表示されます。
3. 気に入ったテーマの横にある**Download**(ダウンロード)をクリックします。**Starter themes**(スターターテーマ)として**Installed Themes**に表示され、すぐに切り替えられます。

| テーマ | 見た目 |
| --- | --- |
| **Apogee Lounge** | 1970年代の宇宙客船の展望ラウンジ。窓の向こうには巨大ガス惑星が浮かび、成形パネルにメッセージが表示されます。 |
| **Crepuscular** | 夜の海の暦。崖の上で、フードをかぶった人影が見張るような月の下で夜通し番をしています（実はパンケーキを食べています）。メッセージは罫線の入った帳簿の一列に並びます。 |
| **Dewglass** | 2000年代風の光沢のあるガラス。晴れたラグーンや夜のオーロラを背景に、メッセージがジェルのしずくのように浮かびます。 |
| **Granite Watch** | 山中にある冷戦時代の司令所。返信はテレプリンター用紙のように印字され、ウィジェットはクリップボードに掛かっています。 |
| **Gutterlight** | 犯罪コミック風に描かれた雨のゴシック都市。インクで描いたコマとキャプションボックスを使います。 |
| **Lantern Meadow** | 落ち着いていてとても読みやすく、動きはありません。 |
| **Lantern Path** | 穏やかな動きのある、読書向けの縦長レイアウト。 |
| **Maple's Bramble Cottage** | 居心地のよいコテージ。長い返信を読むための縦長レイアウトがあります。 |
| **MARI to the Moon** | トレーディング端末。返信はすべて注文票になり、上部バーには株価ティッカーが流れ、チャット一覧はウォッチリストになります。 |
| **NEON//GRID** | 長い返信向けに作られたネオン調のサイバーパンク。 |
| **Petal OS** | ピクセルフォントを使った、遊び心のあるレトロなデスクトップ。 |
| **Quiet Iris** | 静かな船のAI。マットなグラファイトの計器、赤琥珀色のレンズがひとつ、そしてすべてのチャットが一本の光る背骨に沿ってドッキングします。 |
| **Rosalind's Folio** | ビジュアルノベル風の趣向を加えた物語の本のようなレイアウト。 |
| **Sanguine Keep** | 月明かりのゴシック城。夜は深紅のベルベットと金箔、昼は淡い大理石。肖像はランセット窓に収まり、メッセージは聖遺物箱のパネルに表示されます。 |
| **Swiss Poster** | 動きのない、静かですっきりしたポスターデザイン。 |
| **Under Sail** | 航海中の帆船の甲板。すべてのメッセージが帆桁から下がるキャンバスの帆になります。 |
| **Velvet Casket** | 昼はパステルゴス、夜はトラディショナルゴスになり、メッセージは棺の形で表示されます。 |

すべてのスターターテーマにダーク版とライト版があります。各名前の下にある**No motion**(動きなし)や**High legibility**(高い可読性)などの小さなタグで、テーマの特徴が分かります。

ダウンロードしたテーマの新しいバージョンがギャラリーにある場合、ギャラリーの一覧に**Update**(アップデート)と表示されます。クリックすると新しいバージョンを入手できます。

ダウンロードしたスターターテーマは読み取り専用なので、作成時の状態が常に保たれます。それぞれに4つのボタンがあります。

- **(i) Credits and licences**(クレジットとライセンス): アートやフォントの作者と、再利用できる条件を確認できます。
- **Clone + Edit**(複製して編集)(コピーのアイコン): 「Petal OS (my copy)」のような自分用のコピーを作り、エディターで開きます。
- **Export**(テーマをエクスポート)(アップロードのアイコン): テーマをファイルとして保存します。
- **Remove**(テーマを削除)(ごみ箱のアイコン): このインストールからテーマを削除します。ギャラリーからいつでも再ダウンロードできます。

アプリを使わずにテーマファイルを入手することもできます。GitHubにあるテーマギャラリーの`themes`フォルダー([kolacheee-themesブランチ](https://github.com/kolacheee/Marinara-Engine-kolacheee/tree/kolacheee-themes/themes))にあります。そこで`.json`ファイルをダウンロードし、**Import File**(ファイルをインポート)を使ってください。

## テーマの切り替え

1. **Installed Themes**(インストール済みのテーマ)でテーマ名をクリックします。このブラウザータブでテーマがオンになります。
2. バーに**Keep this theme?**(このテーマを維持しますか?)と表示され、15秒のカウントダウンが始まります。バーにポインターを合わせると、カウントダウンが一時停止します。
3. そのまま使うには**Keep theme**(テーマを維持)をクリックします。ほかのデバイスにも表示されるようになります。前の見た目に戻るには、**Go back**(戻る)をクリックするか、カウントダウンが終わるまで待ちます。

カスタムテーマをオフにするには、**Default Theme**(デフォルトのテーマ)をクリックします。**Reset Appearance**(外観をリセット)でもテーマがオフになります。この項目は**Settings → Appearance → Theme**(設定 → 外観 → テーマ)の先頭にあります。

1台のデバイスだけで別のテーマを使うには、先に**Look on this device**(このデバイスの見た目)を**Only this device**(このデバイスのみ)に設定します。この項目は**Settings → Appearance → Theme**にあります。

### 通常の見た目に戻す

テーマによってMarinaraが使いにくくなった場合、次のどの方法でも、そのタブでテーマをオフにできます。

- <kbd>Esc</kbd>を3回押します。
- ブラウザーのアドレスの末尾に`?safe`を追加します。
- <kbd>Ctrl</kbd>+<kbd>K</kbd>を押して、「Custom theme」と入力します。

Marinaraは、トップバー、サイドバー、<kbd>Ctrl</kbd>+<kbd>K</kbd>、メッセージボックスも保護します。テーマで外観を変えることはできますが、いずれかを隠したり、移動したり、覆ったりすると、そのタブではテーマがオフになり、理由が表示されます。

## テーマのインポート

1. **Import File**(ファイルをインポート)をクリックします。
2. `.json`または`.css`のテーマファイルを選びます。
3. プレビューに、テーマの名前、作者、バージョン、画像、サイズ、クレジット、ライセンスが表示されます。動く画像、テーマが追加する文字、動作しない部分など、インストール前に知っておくべきことも表示されます。
4. 一緒に取り込むものを選びます。プレビューには、カラースキーム、アクセントカラー、フォントなど、テーマが推奨する設定が表示され、そのほとんどにチェックが入っています。テーマの背景をチャット背景のギャラリーに追加することもできます。
5. すぐに切り替えるには**Install and try it**(インストールして試す)、一覧に追加するだけなら**Install**(インストール)をクリックします。

同じ名前のテーマがすでにある場合、プレビューにはアップデートするか**Keep both**(両方を残す)かの選択肢が表示されます。試しているテーマから戻ると、Marinaraはそのテーマによって変更された設定も元に戻します。

パスワードやキーを求めたり、Marinaraを装ったりする文字を書き込むテーマはインストールできません。テーマに求められても、キーやパスワードを入力しないでください。

### HTMLを含むテーマ

一部のテーマは、メッセージテンプレートと呼ばれる小さなHTMLボックスをすべてのメッセージに追加します。Marinaraはそこからスクリプト、リンク、画像、フォームを削除しますが、他人が書いたHTMLで誤解を招く表示になる可能性は残ります。このようなテーマは、**Allow themes with HTML (I accept the risk)**(HTMLを含むテーマを許可(リスクを承知します))がオンの間だけインストールできます。スイッチがオフの場合、インストール済みのテーマもHTMLなしで表示されます。

## テーマの作成

**Create Theme**(新しいテーマ)をクリックするか、スターターテーマの**Clone + Edit**(複製して編集)をクリックして、すでに見栄えのよいテーマから始めます。エディターには、名前の欄、大きなCSSの欄、**Preview**(プレビュー)、**Save**(保存)があります。新しいテーマは保存するとオンになり、**Keep this theme?**(このテーマを維持しますか?)と尋ねられます。

[テーマ作成ガイド](theme-author-guide.md#your-first-theme-step-by-step)では、最初のテーマを作る手順を1つずつ説明しています。

### Professor Mariとテーマを作る

自分でCSSを書く必要はありません。「スマートフォンでも使える、居心地のよい秋のテーマを作って」「Harborテーマのどこがおかしい?」のように、普段の言葉でProfessor Mariに頼んでください。テーマの設計とレビュー用のハンドブックを持っていて、それに従って進めます。

1. **まずアイデアを確認します。** 雰囲気、LightかDarkか(または両方か)、使うデバイス、画像や天候が必要かを尋ねてから、「海の背景に、すりガラスのカプセル型パネル」のように、1つの見た目を一文にまとめます。
2. **オフの状態で作ります。** 試す場所も案内します。**CSS Themes**(CSSテーマ)で選び、15秒以内に**Keep theme**(テーマを維持)を押してください。Professor Mari自身にオンにするよう頼んだ場合も、タブに同じ**Keep this theme?**の確認が表示され、誰も応答しなければ元に戻ります。
3. **見た目の確認を頼みます。** Mariには画面が見えないので、LightとDarkで確認する具体的な箇所を挙げ、気になるところのスクリーンショットを求めます。Marinaraがテーマをオフにした場合は、表示されたメッセージを伝えてください。理由が書かれているので、Mariがその問題を直します。
4. **画像も作れます。** Connectionsに画像モデルが設定されていれば、背景、フレーム、アイコンを作り、1つずつ先に見せて、了承を得てからテーマに保存します。テーマに描かれた縁飾り(SVG画像)の色も変えられます。[Professor Mariに画像の作成を頼む](theme-author-guide.md#ask-professor-mari-to-make-the-art)を参照してください。

テーマをレビューするときは、角の形の不統一、影、読みにくいラベルなど、合っていない点を画面ごとに挙げます。どれを直すか伝えるまでは、何も変更しません。

Mariが作業できるのは、自分のテーマだけです。スターターテーマは読み取り専用なので、まず**Clone + Edit**(複製して編集)をクリックし、そのコピーを編集するよう頼んでください。フォント、クレジット、サムネイルは、**Pictures and sharing details**(画像と共有情報)で自分で追加します。

## 自分のテーマの編集、エクスポート、削除

自分のテーマの行には3つのボタンがあります。

- **Edit theme CSS**(テーマのCSSを編集)(コードのアイコン)をクリックすると、エディターが開きます。編集しても、どのテーマがオンかは変わりません。
- **Export**(テーマをエクスポート)(アップロードのアイコン)をクリックすると、共有したり別の場所でインポートしたりできる`.json`ファイルがダウンロードされます。
- **Remove**(テーマを削除)(ごみ箱のアイコン)をクリックすると、確認後にテーマが削除されます。この操作は元に戻せないため、後で使う可能性がある場合は先にエクスポートしてください。

## 1つのチャットだけに使うテーマ

チャットごとに専用のテーマを設定できます。

1. チャットを開き、**Chat Settings**(チャット設定)を開きます。
2. **Theme**(テーマ)でテーマを選びます。**Follow the app**(アプリに従う)ではアプリのテーマを使い、**Default look (no custom theme)**(デフォルトの外観(カスタムテーマなし))ではそのチャットのテーマをオフにします。
3. キャラクターが1人のチャットでは、**Use it for every chat with this character**(このキャラクターとのすべてのチャットで使う)にチェックを入れると、そのキャラクターのテーマになります。

設定とライブラリーでは、常にアプリのテーマを使います。

## テーマを変更できる人

Marinaraを動かしているコンピューターでは、シークレットは不要です。スマートフォンなどの別のデバイスでは、テーマの作成、インポート、複製、編集、削除に管理用のシークレットが必要です。**Settings → Advanced → Security**(設定 → 詳細設定 → セキュリティ)で入力してください。インストール済みのテーマを選ぶだけなら、シークレットは不要です。[管理用のシークレット](../REMOTE_ACCESS.md#the-admin-secret-and-privileged-actions)を参照してください。

## 用意されているチャットウィンドウのスタイル

始める前に: この方法にCSSは要りません。

1. **Settings → Appearance → Chat Buttons & Windows**(設定 → 外観 → チャットのボタンとウィンドウ)を開きます。
2. **Chat widget style**(チャットウィジェットのスタイル)でスタイルを選びます。

| スタイル | 見た目 |
| --- | --- |
| **Default**(デフォルト) | 元の見た目。 |
| **Dottore** | 氷のような青の計器を思わせる枠、淡い金属色の縁、切り落とした角。 |
| **Prof. Mari** | 金色で縁取った物語の本を思わせる枠、宝石のような青、ウィンドウのタイトルに添えた原石。ボタンにはウィンドウと同じ背景を使います。 |

各スタイルには専用のフォントがあり、ライトモードとダークモードに対応し、ボタン、ウィンドウ、展開できるセクションの外観をまとめて変えます。スタイルを選ぶと、**Font**(フォント)、**Shape**(形)、3つの色がすべてリセットされます。ウィンドウの位置はそのままです。

次の項目は個別に変更できます。

- **Font**と**Shape**は、別のものを選ぶまでスタイルに従います(**Preset font**(プリセットのフォント)、**Preset shape**(プリセットの形))。
- **Border & Buttons Color**(枠線とボタンの色)は、輪郭とボタンのアイコンを変えます。アイコンにはグラデーションの最初の色を使います。
- **Background Color**(背景色)は、ボタン、ウィンドウ、展開できるセクション、編集欄を塗りつぶします。
- **Text Color**(文字色)は、ウィジェットの文字を変えます。見出しとラベルにはグラデーションが表示され、編集欄には最初の色を使います。

どの色にも、単色用のカラーピッカーとグラデーションの選択肢があります。各設定の横にある**Reset color**(色をリセット)を使うと、再びスタイルのライトモードまたはダークモードの色に従います。装飾の紋章は元の色を保ちます。

### スタイルをチャットにも適用する

カラーピッカーの下にある3つのスイッチで、スタイルの適用範囲を広げられます。各スイッチは最初はオフで、それぞれ独立して動作します。スイッチをオフにすると、その部分は通常のチャットの外観に戻ります。別のスタイルを選んでも、スイッチの選択は保たれます。

| スイッチ | 適用されるもの |
| --- | --- |
| **Apply preset font**(プリセットのフォントを適用) | ウィジェットのフォント。メッセージ、入力欄、チャットの操作部品に使います。 |
| **Apply preset shape**(プリセットの形を適用) | 枠の形。Roleplayメッセージ(クラシックとビジュアルノベル)、Gameの会話ボックス、入力欄、操作部品に使います。Conversationメッセージは元の形を保ちます。 |
| **Apply preset colors**(プリセットの色を適用) | これらの領域の枠線、背景、文字の色。Conversationメッセージも対象です。独自の色やグラデーションも適用されます。引用符で囲まれたセリフは、キャラクターやペルソナごとのDialogue Highlight Colorを保ちます。エージェントの装飾付きカードのようにHTMLでできたメッセージは、それ自体が指定した文字の色を保ちます。 |

**Load More**(さらに読み込む)や**Show older**(古いものを表示)などの履歴のボタンも、ほかのチャットの操作部品と同じくスイッチに従います。Game Modeでは、スイッチは補足の発言、HUDウィジェット、マップパネル、キャラクターシート、ログ、インベントリー、戦闘画面のパネル、ダイアログにも適用されます。Professor Mariに、これらの領域のカスタムテーマを作成してもらうこともできます。

カスタムテーマでは、これらのスタイルをさらに上書きできます。[チャットウィンドウとドロワーの外観](#styling-chat-windows-and-drawers)にある変数は、スタイルの色より優先されます。ウィンドウの書体には`--mari-window-font-family`、セクションの角には`--mari-drawer-radius`を使い、タイトルの装飾を隠すには`--mari-window-ornament: none`を指定してください。スタイルの装飾をすべて取り除くには、先に**Default**を選んでください。

## テーマ作者向け

ここから先は、テーマのCSSを手書きする人向けのリファレンスです。すべての安定したトークン、パーツフック、安全ルールを一覧にした[テーマ作成ガイド](theme-author-guide.md)から始めてください。

## テーマとCard CSS

Marinaraには、カスタムCSSを追加する方法が2つあり、両方を同時に有効にできます。

- カスタムテーマはアプリ全体を塗り替えます。Marinaraの中核となる変数を上書きでき、`!important`も`position: fixed`も使えます。
- Card CSSはキャラクターやペルソナのカードに埋め込まれ、チャットごとにオンにします。Card CSSはより厳しく整理されます。中核となる変数は上書きできず、`!important`は取り除かれ、`position: fixed`は`position: absolute`に置き換わります。対象はアプリ全体ではなくチャットのメッセージです。[カードCSSテーマ設定ガイド](card-css-theming.md)を参照してください。

## サイズと名前の上限

テーマ名は200文字までです。CSSは256 KiBまでで、UTF-8のバイト数で数えます。これより大きなテーマは、保存時やインポート時に拒否されます。また、カスタムテーマのCSSは実行前に整理されるため、他のWebサイトからファイルを読み込むスタイルは動作しません。画像やフォントは、代わりに`data:` URIとして埋め込んでください。

## CSS変数リファレンス

テーマエディターには、折りたためる**CSS Variable Reference**(CSS変数リファレンス)があります。クリックすると、上書きできる代表的な変数を確認できます。テーマは`:root`ブロックでこれらの変数を設定してアプリの見た目を変えます。リファレンスに載っている変数は次のとおりです。

| 変数 | 変わる場所 |
| --- | --- |
| `--background` | ページの背景 |
| `--foreground` | 本文の文字 |
| `--primary` | アクセントとボタン |
| `--primary-foreground` | primary上の文字 |
| `--secondary` | カードと入力欄 |
| `--card` | カードの背景 |
| `--border` | 枠線 |
| `--muted-foreground` | 薄い文字 |
| `--sidebar` | サイドバーの背景 |
| `--sidebar-border` | サイドバーの枠線 |
| `--marinara-shell-edge-border` | 画面左右の外枠 |
| `--destructive` | エラーと削除 |
| `--popover` | ドロップダウンの背景 |
| `--accent` | ホバー時の強調 |

テーマでは、この一覧に限らず、Marinaraが使うどのCSS変数も設定できます。専用の変数を持つ効果もあります。たとえば`--marinara-theme-accent-pulse: enabled`は、アクセントが脈打つアニメーションを要求します。

## チャットウィンドウとドロワーの外観

コンピューターでは、**Chat Settings**(チャット設定)は移動できるウィンドウとして開きます。その中の折りたたみ可能なセクションは**drawers**(ドロワー)と呼ばれます。ドロワーは独立したウィンドウに切り離し、さらに**bubble**(バブル)と呼ばれる小さな移動可能なボタンに最小化できます。

Game controls、Session、Volume、Game Assets、接続したチャット、パッケージの操作など、ほかのチャットツールもこれらのウィンドウとボタンを使います。スマートフォンでは、ほとんどのウィンドウが画面幅いっぱいのパネルとして開きます。Echo Chamberは、移動やサイズ変更ができる小さなウィンドウのままです。Chat Settingsから切り離したツールは、移動できる3点アイコンの**Chat tools**(チャットツール)メニューにまとめられます。トラッカーのボタンは別に表示されます。

以下のクラス、データ属性、変数を使うと、これらの部品の外観をまとめて変えられます。テーマのルールは、`!important`を使わずにデフォルトを上書きします。

### クラス

| 部品 | クラス |
| --- | --- |
| ウィンドウ | `.mari-window` |
| タイトルバー | `.mari-window__header` |
| タイトルとそのアイコン | `.mari-window__title-row` |
| タイトル | `.mari-window__title` |
| タイトルバーのボタン(Reset View、お気に入りレイアウトの星、Tracker Panel、ピン留め、ロック、閉じる、戻す) | `.mari-window__controls`(各ボタンは`.mari-window__control`) |
| ウィンドウの内容 | `.mari-window__body` |
| サイズ変更用の辺と角 | `.mari-window__resize-handle` |
| ポインターまたはフォーカスがウィンドウ内にある間に表示される角のマーク | `.mari-window__resize-grip` |
| ドロワー | `.mari-drawer` |
| ドロワーのヘッダーとタイトル | `.mari-drawer__header`、`.mari-drawer__title` |
| ドロワーのアイコン、件数バッジ、**?** | `.mari-drawer__icon`、`.mari-drawer__count`、`.mari-drawer__help` |
| 折りたたんだドロワーのプレビュー(トラッカーの小さなウィジェット) | `.mari-drawer__summary` |
| 矢印の横のドロワーボタンと、切り離しボタン | `.mari-drawer__actions`、`.mari-drawer__popout` |
| ドロワーの矢印と内容 | `.mari-drawer__arrow`、`.mari-drawer__body` |
| ドロワーを外へドラッグする間、ポインターに追従するプレビュー | `.mari-drawer-ghost` |
| 最小化したウィンドウのボタン(バブル) | `.mari-window-bubble` |
| アイコンの代わりにバブルが表示するリアルタイムの概要(World Stateのバナー) | `.mari-window-bubble__banner` |
| ドラッグ中のバブルがほかのバブルとそろうときに表示される線 | `.mari-window-snap-guide` |
| エージェントの実行中に表示される点(Chat Settingsボタン、Trackersウィンドウ) | `.mari-agents-running-dot` |

### データ属性

- `data-window`はウィンドウとそのバブルの名前です。`chat-settings`、`trackers`、操作ウィンドウの`control:game`、`control:session`、`control:volume`、`control:assets`、`control:connected-chat`、`control:package:<package>`、`control:beholder:<package>`を使い、切り離したドロワーには`drawer:<window>:<drawer>`を使います。例は`drawer:chat-settings:chat-name`です。
- `data-drawer`はドロワーの名前です。例は`chat-name`です。`roleplay-agents`や`conversation-agents`のように、チャットモードで始まる名前もあります。トラッカーには`tracker-world`、`tracker-persona`、`tracker-characters`、`tracker-quests`、`tracker-inventory`、`tracker-custom`、`agent-activity`を使います。
- `data-presentation`は、コンピューターのウィンドウでは`"window"`、スマートフォンのパネルでは`"sheet"`です。
- `data-pinned`と`data-locked`は、ウィンドウがピン留めまたはロックされている間、`"true"`です。
- `data-window-control`は、タイトルバーの各ボタンの名前です。`"pin"`、`"lock"`、`"close"`、`"put-back"`があります。押された状態のピン留めボタンとロックボタンには、`aria-pressed="true"`も付きます。
- `data-chat-settings-control`は、Chat Settingsの追加のタイトルバーボタンを識別します。`"reset-view"`、`"favorite-layout"`、`"tracker-panel"`があります。現在のレイアウトが保存済みのお気に入りと一致すると、お気に入りの星には`aria-pressed="true"`が付き、アイコンが塗りつぶされます。
- 各サイズ変更ハンドルの`data-edge`は、`"n"`、`"s"`、`"e"`、`"w"`、`"ne"`、`"nw"`、`"se"`、`"sw"`のいずれかです。
- 開いたドロワーの`.mari-drawer__header`内にある切り替えボタンには、`aria-expanded="true"`が付きます。
- `data-drawer-control="pop-out"`は、ドロワーの切り離しボタンを示します。
- `data-outside="true"`は、ドロップすると切り離される距離まで、ウィンドウの外へ移動したドラッグプレビューを示します。
- `data-axis`は、縦に伸びる位置合わせガイドでは`"x"`、横に伸びるガイドでは`"y"`です。
- ドロワーを独立したウィンドウに表示しているとき、ウィンドウとその中のドロワーの両方で`data-detached`が`"true"`になります。切り離したドロワーのウィンドウの名前は`data-window="drawer:<window>:<drawer>"`で、例は`data-window="drawer:chat-settings:chat-name"`です。`data-drawer-host`は元のウィンドウの名前です。
- タイトルをドラッグしているドロワーの`data-dragging`は`"true"`になります。切り離したドロワーを元に戻せる状態でウィンドウの上に重ねている間、そのウィンドウの`data-drop-target`は`"true"`になります。
- バブルには、対応するウィンドウの`data-window`と`data-minimized="true"`が付きます。例は`.mari-window-bubble[data-window="control:volume"]`です。操作ウィンドウの名前は`control:game`、`control:session`、`control:volume`、`control:assets`、`control:connected-chat`、`control:package:<package>`、`control:beholder:<package>`です。ドラッグ中のバブルでは`data-dragging`が`"true"`になります。最小化したWorld Stateトラッカーのように、アイコンの代わりにリアルタイムの概要を表示するバブルには`data-banner="true"`が付き、概要に合わせて横幅が広がります。
- ロックされたバブルには、Chat Settingsボタンを含め、`data-locked="true"`が付きます。ウィンドウを開くことはできますが、そのウィンドウのロックを解除するまで移動はできません。`.mari-window-bubble[data-locked="true"]`で、これらのボタンに別の外観を付けられます。
- スマートフォンでは、ウィンドウと、その少し大きなバブルの両方に`data-presentation="sheet"`が付きます。Tracker Panelのバブルは`.mari-window-bubble[data-tracker-panel-toggle="bubble"]`です。
- Chat Settingsボタンもバブルです。`.mari-window-bubble[data-chat-settings-button]`で指定でき、Chat Settingsが開いている間は`data-open="true"`が付きます。
- 切り離したセクションは、`data-drawer-host`(元のウィンドウ)が付いたバブルに縮みます。そのウィンドウの**Put back**(戻す)ボタンは`[data-window-control="put-back"]`です。

### 変数

各変数には、共通のチャットUIの色へのフォールバックがあります。そのため、テーマでは変えたいものだけ指定すれば十分です。

| 変数 | 制御するもの |
| --- | --- |
| `--mari-window-bg` | ウィンドウの背景 |
| `--mari-window-text` | ウィンドウの文字 |
| `--mari-window-border`, `--mari-window-border-width` | ウィンドウの枠線 |
| `--mari-window-radius` | ウィンドウの角の丸み |
| `--mari-window-shadow` | ウィンドウの影 |
| `--mari-window-backdrop-filter` | ウィンドウの背後のぼかし |
| `--mari-window-header-bg`, `--mari-window-header-text`, `--mari-window-header-border` | タイトルバーの色 |
| `--mari-window-header-padding` | タイトルバーの余白 |
| `--mari-window-control-color`, `--mari-window-control-color-hover`, `--mari-window-control-bg-hover` | お気に入りの星を含むタイトルバーのボタン |
| `--mari-window-control-color-active`, `--mari-window-control-bg-active` | ピン留め、ロック、塗りつぶされたお気に入りの星を含む、押された状態のタイトルバーボタン |
| `--mari-window-control-radius`, `--mari-window-control-gap` | ボタンの丸みと間隔 |
| `--mari-window-focus-ring` | キーボードフォーカスの輪郭と、ドロワーを戻す先のウィンドウの輪郭 |
| `--mari-window-resize-handle-size` | サイズ変更用の辺の幅 |
| `--mari-window-bubble-size`, `--mari-window-bubble-radius`, `--mari-window-bubble-shadow` | バブルのサイズ、丸み、影 |
| `--mari-window-bubble-bg`, `--mari-window-bubble-bg-hover`, `--mari-window-bubble-border` | バブルの背景と枠線 |
| `--mari-window-bubble-text`, `--mari-window-bubble-text-hover` | バブルのアイコンの色 |
| `--mari-window-snap-guide` | 位置合わせガイドの色 |
| `--mari-drawer-bg`, `--mari-drawer-border` | ドロワーの背景と区切り線 |
| `--mari-drawer-header-bg`, `--mari-drawer-header-bg-hover` | ドロワーのヘッダーの色 |
| `--mari-drawer-header-padding`, `--mari-drawer-body-padding-inline`, `--mari-drawer-body-padding-bottom` | ドロワーの余白 |
| `--mari-drawer-title-color`, `--mari-drawer-icon-color`, `--mari-drawer-arrow-color` | ドロワーのヘッダーの文字とアイコン |
| `--mari-drawer-count-bg`, `--mari-drawer-count-text` | ドロワーの件数バッジ |

すべてのウィンドウを変えるには`:root`に、1つだけ変えるにはセレクターに変数を設定してください。

```css
:root {
  --mari-window-radius: 0.5rem;
  --mari-window-bubble-bg: #3b0764;
}

[data-window="chat-settings"] .mari-drawer[data-drawer="chat-name"] {
  --mari-drawer-border: transparent;
}
```

## メッセージ、入力欄、チャットの操作部品の外観

3つの**Apply preset**スイッチを使うと、カスタムテーマでもチャットのほかの部分にウィジェットのデザインを適用できます。以下の変数で各部分を上書きできます。CSSを自分で書きたくない場合は、Professor Mariに統一感のあるチャットテーマを依頼してください。

| 部品 | クラス |
| --- | --- |
| RoleplayとGameのメッセージボックス、Gameの補足の発言、HUDウィジェット、マップパネル、キャラクターシート、チャット入力欄 | `.mari-chat-style-surface` |
| Gameのログ、インベントリー、戦闘画面のパネル、選択肢、ダイアログ。パネルには、`logs`、`inventory`、`combat-actions`のように名前を示す`data-game-section`も付きます | `.mari-game-section.mari-chat-style-surface` |
| Journalなど、ウィンドウ内に表示されるGameの内容。ウィンドウの色に従います | `.mari-game-section` |
| Conversationメッセージ(フォントと色のみ) | `.mari-chat-style-conversation` |
| 枠のないConversationメッセージの文字 | `.mari-chat-style-text` |
| CallsとConversationのグループ操作を含むチャットの操作部品 | `.mari-chat-style-control` |
| 履歴のボタン: **Load More**、**Show older**、**Show newer**、**Latest**と、Gameのログの**Older**、**All**、**Show more older logs**。これらには`.mari-chat-style-control`も付いています | `.mari-chat-history-pager` |
| エージェントの装飾付きカードのようにHTMLでできたメッセージ。**Apply preset colors**がオンのときも、その中で指定した文字の色が保たれます | `.mari-html-content` |

| 変数 | 制御するもの |
| --- | --- |
| `--mari-chat-font-family` | 対応するチャット領域のフォント |
| `--mari-chat-bg` | ボックスの背景。単色またはグラデーションを指定できます |
| `--mari-chat-text` | 読みやすい単色の文字色 |
| `--mari-chat-border` | ボックスの輪郭。単色またはグラデーションを指定できます |
| `--mari-chat-border-color` | 単色の枠線のフォールバック |
| `--mari-chat-radius` | Conversationメッセージを除くボックスの角の丸み |
| `--mari-chat-control-bg`, `--mari-chat-control-bg-hover` | チャットボタンの背景 |
| `--mari-chat-control-color`, `--mari-chat-control-radius` | チャットボタンのアイコンの色と角の丸み |
| `--mari-chat-input-bg` | 編集欄の内側の背景 |

たとえば、**Apply preset font**と**Apply preset colors**をオンにすると、次のように指定できます。

```css
:root {
  --mari-chat-font-family: Georgia, serif;
  --mari-chat-bg: #251e29;
  --mari-chat-text: #f4e8dc;
  --mari-chat-border: linear-gradient(100deg, #d6aa66, #dda0b2);
}
```

未設定の変数は、ウィジェットの設定とプリセットに従います。組み込みのスタイルを通してこれらの変数を適用するには、対応するスイッチがオンである必要があります。**Apply preset shape**がオンでも、Conversationメッセージは元の形を保ちます。カスタムテーマでクラスを直接指定することもできます。装飾のために切り抜く場合も、フォーカスの輪郭、メニュー、メッセージの内容は切り抜かないようにしてください。

スマートフォンでは、3点メニューを開くと丸いボタンが展開されます。開閉ボタンは`[data-chat-tools-menu-button]`、開いたボタン列は`[data-chat-tools-menu]`で、各リスト項目の`data-chat-tools-menu-item`には、そのウィンドウのIDが設定されます。ツールのボタンは`.mari-window-bubble.mari-chat-tools-button`を使い、`data-chat-tools-menu-tool`にも同じIDが設定されます。ボタン列にはウィンドウの枠がありません。ボタンは丸い形を保ち、チャットのほかの部分に適用する3つのスイッチとは独立して、ウィジェットの色とボタンのサイズに従います。

<a id="styling-character-sheets"></a>
## キャラクターシートのスタイル

ルールセットのシートはRoleplayとGameで同じ表示です。以下のクラスとデータ属性でテーマを適用できます。

| 部分 | クラス | データ属性 |
| --- | --- | --- |
| シート全体 | `.mari-ruleset-sheet` | `data-ruleset`（ルールセットID、例：`local/my-rules`）、`data-rank-display`（`value`、`label`、`dots`、`roman`、`number`）、編集中は`data-editing="true"` |
| タイトルと**シートを編集**ボタン | `.mari-ruleset-sheet__header` | |
| タブ | `.mari-ruleset-sheet__tabs` | 各タブに`data-tab-id`と`aria-selected` |
| グループ見出し | `.mari-ruleset-sheet__heading` | |
| シート上部のフィールド | `.mari-ruleset-sheet__field`（`.mari-ruleset-sheet__fields`内） | `data-field`、計算値は`data-derived` |
| 能力値 | `.mari-ruleset-sheet__ability`（`.mari-ruleset-sheet__abilities`内）、スコアと判定値は`__ability-score`と`__ability-value` | `data-ability`、グループに`data-section` |
| 体力などのプール | `.mari-ruleset-sheet__pool`（`.mari-ruleset-sheet__pools`内） | `data-pool`、グループに`data-pool-group` |
| トラック | `.mari-ruleset-sheet__track`（`.mari-ruleset-sheet__tracks`内） | `data-track`、負傷トラックには`data-wound="true"`も付く |
| 状態 | `.mari-ruleset-sheet__conditions` | |
| 習得した技能やセーヴ | `.mari-ruleset-sheet__rank`（`.mari-ruleset-sheet__trained`内、グループ別に`.mari-ruleset-sheet__rank-group`）、ランク、または`data-rank-display="value"`時の判定値は`__rank-value`、スマートフォンの横の判定値は`__rank-check`、練習は`__practice` | `data-skill`か`data-save`、`data-tier`（段階ID）、`data-rank`（`0`は未習得、`1`は次の段階、以降同様） |
| 編集中の技能やセーヴ | `.mari-ruleset-sheet-editor__rank` | `data-skill`か`data-save`、`data-tier`、`data-rank` |
| 装備などのリスト | `.mari-ruleset-sheet__list`、各行は`.mari-ruleset-sheet__list-row` | `data-list`、チェック済みの行に`data-marked="true"` |

次の例は、あるルールセットのランク2を星2つで表示します。変更したい各ランクに同様のルールを2つずつ追加します。点、名前、ローマ数字、数値でランクを表示する場合だけ使ってください。判定値表示では`__rank-value`に判定値が入るため、それを隠してしまいます。

```css
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value {
  font-size: 0;
}
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value::after {
  content: "★★";
  font-size: 0.6875rem;
}
```

## 関連ガイド

- [テーマ作成ガイド](theme-author-guide.md)
- [テーマの天気](theme-weather.md)
- [カードCSSテーマ設定ガイド](card-css-theming.md)
- [外観の設定](appearance-settings.md)
- [サーバー設定リファレンス](../CONFIGURATION.md)
- [リモートアクセス](../REMOTE_ACCESS.md)
