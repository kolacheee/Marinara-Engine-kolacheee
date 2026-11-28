# 外観の設定

**Appearance**(外観)タブでは、Marinaraの見た目を変えられます。対象は、色、文字サイズ、間隔、背景、チャットのボタンとウィンドウです。その隣にある**Conversation**、**Roleplay**、**Game**のタブでは、各チャットモードの見た目を設定します。

ほかのものをお探しですか?

- 用意された見た目や自作のテーマ: [カスタムCSSテーマ](custom-css-themes.md)
- 別のフォント: [カスタムフォントとGoogle Fonts](fonts.md)
- チャットの背景画像: [背景ライブラリー](chat-backgrounds.md)。
- チャットでのキャラクター独自の見た目: [カードCSSテーマ設定ガイド](card-css-theming.md)

## 外観の設定を開く

1. **Library → Settings**(ライブラリー → 設定)を開きます。
2. **Appearance**タブをクリックします。
3. タブの下に並ぶセクション名をクリックして移動するか、スクロールします。

| タブ | セクション |
| --- | --- |
| **Appearance** | **Theme**(テーマ)、**Fonts & Text Size**(フォントと文字サイズ)、**Accessibility**(アクセシビリティ)、**Text Colors**(文字色)、**Layout**(レイアウト)、**Effects**(エフェクト)、**Backgrounds**(背景)、**Chat Buttons & Windows**(チャットのボタンとウィンドウ)、**CSS Themes**(CSSテーマ) |
| **Conversation** | **Conversation Layout**(会話のレイアウト)、**Conversation Background**(会話の背景) |
| **Roleplay** | **Tracker Panel**(トラッカーパネル)、**Roleplay Messages**(ロールプレイメッセージ)、**Avatars**(アバター)、**Visual Novel**(ビジュアルノベル) |
| **Game** | **Game Text**(ゲームのテキスト)、**Game Art**(ゲームアート)、**Game Assets**(ゲームアセット) |

最初からやり直すには、**Reset Appearance**(外観をリセット)をクリックします。このボタンは**Theme**の先頭にあります。見た目がMarinaraのデフォルトに戻り、現在のチャットの背景が消え、カスタムテーマもすべてオフになります。

クラシックレイアウトでは、これらのセクションは**Appearance**タブにあり、**App**、**Conversation**、**Roleplay**、**Game**の4つのボタンで切り替えます。

## Theme

| 設定 | 内容 |
| --- | --- |
| **Visual Style**(ビジュアルスタイル) | **Default (Marinara)**(デフォルト)は、発光効果のあるレトロなY2K風の見た目です。**SillyTavern**は、すっきりとしたミニマルな見た目です。変わるのは見た目だけで、SillyTavernからのインポートとは関係ありません。**Stage**は、新しいレイアウトのプラム色、真ちゅう色、深紅色を使います。 |
| **New layout (UI overhaul preview)**(新しいレイアウト(UI刷新のプレビュー)) | デフォルトでオンです。オフにするとクラシックレイアウトに戻ります。このガイドでは、新しいレイアウトから先に説明します。 |
| **Look on this device**(この端末の外観) | **Same as my other devices**(ほかの端末と同じ、デフォルト)は、Visual Style、色、フォント、カスタムテーマをすべての端末で共有します。**Only this device**(この端末のみ)は、この端末だけ別の見た目にします。たとえば、スマートフォンはライト、コンピューターはダークにできます。 |
| **Color Scheme**(カラースキーム) | **Dark**(デフォルト)、**Light**、**Follow system**(システムに従う)、または**Follow time of day**(時刻に従う)から選びます。時刻に従う場合は、この端末の時計と指定した時刻に合わせて切り替わります。 |
| **Custom Mouse Pointer**(カスタムマウスポインター) | デフォルトでオンです。Marinaraのアクセントカラーのカーソルを使います。システム標準のカーソルを使うときや、カスタムテーマに設定を任せるときはオフにします。 |
| **Accent Color**(アクセントカラー) | ボタン、選択中のアイコン、フォーカスリング、ハイライト、枠線に色を付けます。デフォルトは、ピンク、オレンジ、シアンを混ぜた**Marinara Gradient**(Marinaraグラデーション)です。 |
| **Accent Pulse**(アクセントパルス) | アクセントカラーをゆっくり明るくしたり暗くしたり、グラデーションの色を順に巡らせたりします。デフォルトではデスクトップでオン、スマートフォンでオフです。 |
| **RGB Mode**(RGBモード) | アクセントの色を虹色に巡回させます。保存した**Accent Color**は変わりません。デフォルトはオフです。 |

**Accent Color**には単色や、2色以上を滑らかにつなぐグラデーションを設定できます。デフォルトに戻すには、**Reset to default**(デフォルトに戻す)をクリックします。アプリの背景はDarkまたはLightモードに従い、カスタムテーマでは独自の背景も設定できます。**Accent Pulse**と**RGB Mode**は、どちらか一方だけをオンにできます。

## Fonts & Text Size

- **Font**(フォント)でアプリのフォントを選びます。[カスタムフォントとGoogle Fonts](fonts.md)を参照してください。
- **Display Size**(表示サイズ)は、このデバイスでのアプリ全体の基準となる文字サイズを決めます。変更はすぐに反映されます。

| 選択肢 | サイズ |
| --- | --- |
| **Tiny** | 12 px |
| **Small** | 14 px |
| **Medium** | 16 px |
| **Default** | 17 px |
| **Large** | 19 px |
| **Huge** | 22 px |
| **Extra large** | 26 px |
| **Extra extra large** | 30 px |
| **Maximum** | 34 px |

- **Chat Font Size**(チャットの文字サイズ)は、チャットメッセージの文字サイズを決めるスライダーです。範囲は12 pxから72 pxまでで、デフォルトは16 pxです。

## Accessibility

| 設定 | 内容 |
| --- | --- |
| **Line spacing**(行間) | メッセージや長い文章の行と行の間隔です。**Default**、**Relaxed (1.6)**(ゆったり)、**Loose (1.8)**(広め)、**Double (2.0)**(2倍)から選びます。メニューとボタンのサイズは変わりません。 |
| **Letter spacing**(文字間隔) | アプリ全体の文字と文字の間隔です。**Default**、**A little wider**(少し広い)、**Wider**(広い)、**Widest**(最も広い)から選びます。 |
| **High contrast**(ハイコントラスト) | 文字、枠線、フォーカスの色を強くします。**Follow system**(システムに従う)では、端末が高いコントラストを求めたときにオンになります。 |
| **Strong focus rings**(強いフォーカスリング) | キーボードで選択している項目を太い線で囲みます。<kbd>Tab</kbd>キーでは、**Skip to content**(コンテンツへスキップ)のリンクも使えます。 |
| **Reduce motion**(動きを減らす) | アニメーション、トランジション、**Accent Pulse**、テーマのエフェクトを停止します。端末が動きを減らすよう求めた場合は自動でオンになります。 |
| **Theme art strength**(テーマアートの強さ) | カスタムテーマの背景画像とオーバーレイ(雨、葉、走査線)の表示の強さです。テーマのアートで文字が読みにくい場合は弱くします。 |
| **Colour-blind-safe colours**(色覚に配慮した色) | 状態を示す点、ゲージ、Deleteボタンで、緑と赤の代わりに青とオレンジを使います。 |

## Text Colors

- **Chat Text Color**(チャットの文字色)は、メッセージの基本の文字色です。デフォルトはDarkでは`#d4d4d4`、Lightでは`#1a1025`です。
- **Default Dialogue Color**(デフォルトのセリフの色)は、キャラクターやペルソナが独自のDialogue Highlight Colorを持たないときに、引用符で囲まれたセリフを着色します。カード側の色が優先されます。**Apply preset colors**(プリセットの色を適用)が**Chat Buttons & Windows**でオンの間は、セリフにそのスタイルの文字色を使います。
- **Chat Chrome Text Color**(チャット周辺のUIの文字色)は、チャットの周りの操作部品の文字色を決めます。対象は、トラッカーのウィジェット、フォルダーのラベル、設定の説明文、チャットボタンから開いたウィンドウです。デフォルトは**Chat Text Color**と同じです。
- **Text Outline / Stroke**(文字の縁取り)は、文字に縁取りを付け、模様の多い背景の上でも読みやすくします。縁取りの色と、0から5 pxまでの**Width**(太さ)を指定します。デフォルトは0.5 pxで、0にするとオフになります。

## Layout

- **Desktop sidebar width**(デスクトップのサイドバーの幅)は、コンピューターで両側のサイドバーの幅を決めます。**Reset width**(幅をリセット)で元に戻ります。スマートフォンのレイアウトは変わりません。
- **Show Android status bar**(Android ステータスバーを表示)は、Androidアプリにスマートフォンのステータスバーを表示します。

## Effects

- **Dynamic weather effects (rain, snow, fog, etc.)**(動的な天気エフェクト(雨、雪、霧など))はデフォルトでオンです。物語の中の天候と時刻に合わせて天気を表示し、そのチャットで**World State**エージェントをオンにする必要があります。[エージェント: チャットを支えるAIヘルパー](../agents/agents-overview.md)を参照してください。
- **Reduce Ambient Animations & Effects**(環境アニメーションとエフェクトを減らす)は、装飾用のアニメーション、粒子、回転するプレビュー、文字が少しずつ現れる表示を止めます。

- **ダイス結果をテキストで表示**（初期設定はオフ）は、ダイスのアニメーションの代わりに、ダイスと各出目、合計を短い行で表示します。ロール自体は行われ、モデルとゲームにも結果が渡ります。技能判定のダイスを含め、すべてのチャットモードに適用されます。
- **Reduced paint effects**(描画エフェクトを減らす)は、負荷の大きい半透明のパネルや影を平らにし、性能の低い端末でも表示をなめらかに保ちます。

## Backgrounds

このセクションには、**Chat Background**(チャットの背景)ピッカーと**Background Blur**(背景のぼかし)があります。ピッカーには、現在のチャットの背景(または**Default background**(デフォルトの背景))と最近選んだ背景が表示されます。別の背景を選ぶには、画像か**Browse library**(ライブラリーを閲覧)をクリックします。ほかに次の設定もあります。

- **Conversation background image opacity**(Conversationの背景画像の不透明度): Conversationモードでチャットの背景をどのくらい強く表示するかを決めます。
- **Chat background behind side panels**(サイドパネルの背後にもチャットの背景を表示): 開いているチャットの背景をぼかし、サイドバーとトップバーの背後まで広げます。
- **Chat List Backgrounds**(チャット一覧の背景): チャット一覧の各行の後ろに、そのチャットの背景を控えめなバナーとして表示します。**Active & Hovered**、**Every Row**、**Off**から選びます。

[背景ライブラリー](chat-backgrounds.md)を参照してください。

## Chat Buttons & Windows

**Chat widget style**(チャットウィジェットのスタイル)は、移動できるチャットのボタン、ウィンドウ、セクションの見た目を決めます。**Default**(デフォルト)、**Dottore**(氷のような青、淡い金属、切り落とした角)、**Prof. Mari**(金の縁取りが施された絵本風の枠)から選びます。1つ選ぶと、その下の設定がリセットされます。

| 操作 | 内容 |
| --- | --- |
| **Font**(フォント) | **Preset font**(プリセットのフォント)、**App font**(アプリのフォント)、**Sans serif**(サンセリフ)、**Storybook serif**(絵本風のセリフ)、**Technical monospace**(技術系の等幅)から選びます。 |
| **Shape**(形) | **Preset shape**(プリセットの形)、**Rounded**(角丸)、**Square**(四角)、**Cut corners**(角を切り落とす)、**Arched**(アーチ)から選びます。 |
| **Button size (px)**(ボタンのサイズ(px)) | 移動できるチャットボタンとそのアイコンのサイズを変えます。32から96の値を入力するか、欄を空にしてデフォルトにします。 |
| **Border & Buttons Color**(枠線とボタンの色)、**Background Color**(背景色)、**Text Color**(文字色) | 3つの主な色です。1つをリセットすると、プリセットとDarkまたはLightに従います。 |
| **Apply preset font**(プリセットのフォントを適用)、**Apply preset shape**(プリセットの形を適用)、**Apply preset colors**(プリセットの色を適用) | そのスタイルをメッセージ、入力欄、チャットの操作部品にも適用します。デフォルトはオフです。 |

Professor Mariにチャットで頼むと、カスタムのチャットスタイルを作ってもらえます。

## CSS Themes

用意されたテーマや、自作またはインポートしたテーマがあります。[カスタムCSSテーマ](custom-css-themes.md)を参照してください。

## Conversationタブ

- **Chat Layout**(チャットのレイアウト)は、**Conversation Layout**にあり、Conversationのメッセージの見た目を変えます。その場でプレビューが表示されます。**Linear**(デフォルト)はチャット風に行を並べます。**Bubbles**はメッセンジャー風の吹き出しで表示します。
- **Avatar Shape**(アバターの形)は**Circular**(円形)か**Square**(四角形)です。アバターの大きさは変わりません。
- **Profile pictures on phones**(スマートフォンでのプロフィール画像)では、すべてのチャットモードで、スマートフォンのメッセージ横に表示する画像を設定します。**Mini**(ミニ、デフォルト)では、キャラクター名の前と自分の名前の後ろに小さな画像を置くので、メッセージの幅を保てます。**Full**(通常)では画像の列を残し、**Off**(オフ)では画像を表示しません。タブレットとコンピューターでは、常に通常サイズの画像を表示します。
- **Conversation Theme**(Conversationのテーマ)は、**Conversation Background**にあり、すべてのConversationチャットの後ろに2色のグラデーションを設定します。**Dark**と**Light**のタブは、それぞれ別のグラデーションを保持します。これはすべてのConversationチャットのデフォルトで、チャットごとの設定ではありません。

スワイプメニューのスイッチは、**Settings → Chatting → Editing & Swipes**(設定 → チャット → 編集とスワイプ)にあります。

## Roleplayタブ

**Tracker Panel**では、Roleplayチャットの横にあるステータス、服装、場所のパネルの見た目を設定します。[Roleplay HUDとトラッカー](../roleplay/hud-and-trackers.md)を参照してください。

**Roleplay Messages**

| 設定 | 内容 | デフォルト |
| --- | --- | --- |
| **Chat position** | 広い画面でメッセージと入力欄を置く位置です。**Left**、**Center**、**Right**から選びます。スマートフォンでは画面幅いっぱいのままです。 | **Center** |
| **Custom chat width**(チャットの幅を指定) | メッセージ列の幅を指定します。 | オフ |
| **Roleplay Messages Background Opacity** | 値を下げると、メッセージの吹き出しから背景が透けて見えます。カードやプリセットの半透明の色より優先されます。 | 90% |
| **Stretch Messages**(メッセージを幅いっぱいに表示) | すべてのメッセージが行の幅いっぱいに広がり、短いメッセージも長いメッセージと幅が揃います。 | オフ |
| **Hide line under names**(名前の下の線を隠す) | 名前の下の細い線を消します。 | オフ |

**Avatars**

| 設定 | 内容 | デフォルト |
| --- | --- | --- |
| アバターのスタイル | **None**、**Small Circles**、**Small Rectangles**、**Glued Side Panel**、または**Faded Side Panel**(フェードするサイドパネル)から選びます。Faded Side Panelは、メッセージに向かって徐々に薄くなる幅の広いポートレートです。 | **Small Circles** |
| **Scrollable Avatars** | 長いメッセージをスクロールしている間もアバターを表示し続けます。 | オフ |
| **Narrator's Cycling Avatars**(ナレーターのアバターを順に切り替え)、**Narrator's Avatar Borders**(ナレーターのアバターの枠線) | Narratorのアバターの見た目を設定します。 | |
| **Message avatar scale** | 75%から250%までです。 | 100% |
| **Default sprite scale** | 50%から175%までです。チャットごとのスプライトのサイズのほうが優先されます。 | 100% |

**Visual Novel**

**Visual Novel display**(ビジュアルノベル表示)は、セリフ用のポートレートとスプライトを添えて、完成した段落を1つずつ表示します。新しいRoleplayと、独自の設定がないRoleplayの表示を決めます。**Auto-play VN paragraphs**(VNの段落を自動再生)、その**Paragraph delay**(段落の間隔)、**Dialogue portrait scale**(会話のポートレートの倍率)、**Full-body sprite scale**(全身スプライトの倍率)で再生方法を設定します。

**Show Thinking In Messages**(メッセージ内に思考を表示)と**Don't Collapse Thinking**(思考を折りたたまない)は、**Settings → Chatting → Thinking**(設定 → チャット → 思考)にあります。

## Gameタブ

**Game Text**

- **Instantly reveal game text**(ゲームのテキストを即座に表示)は、タイプライター効果を省略します。
- **Mouse-wheel + click navigation**(マウスホイールとクリックで操作)は、マウスで物語を前後に移動します。
- **Game narration speed**(Gameのナレーション速度)と**Game auto-play segment delay**(Gameの区切りの自動再生間隔)は、文字を表示する速さと、次へ進むまでの速さを設定します。
- **Game Dialogue Display**: **Classic Dialogue Box**(デフォルト)は1つの区切りを表示し、過去の行は**Logs**に入ります。**History Above Dialogue Box**は、過去の区切りをセリフ欄の上に表示します。
- **Game text effects**(Gameのテキスト効果、デフォルトはオン)は、劇的な言葉、すべて大文字の強調、補足、文字エフェクト用のタグをアニメーションで表示します。オフにすると、普通の文字で表示されます。

**Game Art**には、2つのスライダーがあります。**Dialogue portrait scale**(75%から175%、デフォルトは100%)と**Full-body sprite scale**(75%から275%、デフォルトは135%)です。

**Game Assets**については、[ゲームアセット](../game/game-assets.md)を参照してください。

## このデバイスにだけ残る設定

Appearanceの設定はほとんどが他のデバイスにも同期されます。**Display Size**と**Chat Font Size**は同期されません。この2つは使っているブラウザーに保存されます。1台の端末だけ全体の見た目を変えるには、**Look on this device**を**Theme**で使います。何が同期されるかは[設定の概要](../settings/settings-overview.md)を参照してください。

## 関連ガイド

- [カスタムCSSテーマ](custom-css-themes.md)
- [カスタムフォントとGoogle Fonts](fonts.md)
- [背景ライブラリー](chat-backgrounds.md)
- [カードCSSテーマ設定ガイド](card-css-theming.md)
- [設定の概要](../settings/settings-overview.md)
