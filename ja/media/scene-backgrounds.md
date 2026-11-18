# Illustratorが描く背景

**Illustrator**エージェントは、物語の背景を描けます。頼んだときに1枚描くほか、物語が新しい場所へ移るたびに描いたり、天気が変わったときに雨、雪、霧などの背景を描いたりできます。このガイドでは、この3つの使い方と、新しく描く代わりに手持ちの画像を再利用する仕組みを説明します。

自分でアップロードして選ぶ画像については、[背景ライブラリー](../appearance/chat-backgrounds.md)を参照してください。チャットに表示する画像の選び方(Backgroundエージェント、場所へのピン留め、ギャラリーの画像)については、[物語に合わせて変わる背景](../roleplay/backgrounds.md)を参照してください。

## 始める前に

- **Library → Agents**(ライブラリー → エージェント)から**Illustrator**をインストールします。[Illustratorエージェント](illustrator-agent.md)を参照してください。
- 画像モデルを設定します。Connectionsページの**Defaults**(用途)ボックスで**Images**(画像)の役割を設定するか、Illustratorの**Open Setup**(設定を開く)画面で選びます。[画像生成プロバイダーと設定](image-providers.md)を参照してください。

生成した背景はRoleplayとGameのチャットで使えます。Conversationでは使えません。Conversationでは「Scene background generation is available in Roleplay and Game modes.」と表示されます。

## 今すぐ背景を描く

1. チャットのスライダーボタンで**Chat Settings**(チャット設定)を開き、**Gallery**(ギャラリー)を展開します。
2. **Background**(背景)をクリックします。処理中は**Generating...**と表示されます。
3. 完成すると、新しい画像が背景ライブラリーに追加され、チャットの背後に表示されます。「Background generated.」と表示されれば完了です。

この操作のためにIllustratorをチャットに追加する必要はありません。1回だけ実行され、自動実行は始まりません。

Marinaraはシーンをもとにプロンプトを組み立てます。ゲームでは、ジャンル、舞台設定、場所、天気、時間帯が含まれます。画像には**Backgrounds**(背景)のキャンバスサイズを使います。**Settings → Media → Image Generation**(設定 → メディア → 画像生成)で変更しなければ、1280×720ピクセルです。

うまくいかなかった場合: 「Choose an image generation connection for the Illustrator agent, or mark one as the default image connection.」は、画像モデルが見つからなかったことを意味します。**始める前に**の説明に従って設定してください。**Background**ボタンがない場合は、Illustratorがインストールされていません。

## 新しい場所ごとに新しい背景を描く

この設定をオンにすると、背景のない場所へ物語が移ったときに、Illustratorが背景を描き、ライブラリーに保存して表示します。

1. **Illustrator**をチャットに追加します。**Chat Settings → Agents**(チャット設定 → エージェント)で**Enable Agents**(エージェントを有効にする)をオンにし、**Misc Agents**(その他のエージェント)から**Illustrator**を追加します。
2. **Illustrator**カードで**Generate Scene Backgrounds**(シーンの背景を生成)をオンにします。

Illustratorは**Image Run Interval**(画像の実行間隔)に従ってシーンを確認します(変更しなければ5メッセージごと)。返信のたびに確認するには、[Decisionモデルによる確認](#check-every-reply-with-a-decision-model)を使ってください。Game Modeでは、**Game Illustrator**スイッチが背景にも適用されます。

### 手持ちの画像を再利用する

Illustratorは新しい場所を描く前に、次の順で手持ちの画像を探します。

1. チャットやキャラクターのギャラリーで、その場所にピン留めされた背景。[場所に背景をピン留めする](../roleplay/backgrounds.md#pin-a-background-to-a-place)を参照してください。
2. 名前、または2語以上のタグがWorld Stateの場所に含まれるライブラリーの画像。たとえば、`generated-guest-bedroom.png`や、`guest bedroom`のタグが付いた画像は、「Smith House, guest bedroom」に使われます。
3. World Stateに場所がない場合は、Illustratorのプロンプトモデルが書いた場所の名前を同じ方法で照合します。

大文字と小文字、アクセント記号、「's」は区別せず、単なる`bedroom.png`よりも具体的な名前を優先します。合う画像があれば、その画像を表示し(物語の天気に合った版があればそれを使います)、新しく描くことはありません。一致する画像がない場所だけに、新しい画像が作られます。

名前に一致するものがなく、Illustratorカードで**Reuse a library background that looks like the place**(場所に合うライブラリーの背景を再利用)をオンにしている場合、[画像を読み取れる判定モデル](../connections/decision-models.md#features-that-look-at-pictures)が、場所の名前と共通の単語を持つライブラリーの画像を最大4枚確認し、合うものを表示します。どれも合わない場合にだけ、新しい画像を描きます。デフォルトではオフで、対応するモデルがなければグレー表示になります。

同じ場所で同じ画像を使い続けるには、場所に合わせたファイル名(「Kitchen」なら`kitchen.png`)にするか、`smith house kitchen`のような2語以上のタグを付けます([背景にタグを付ける](../appearance/chat-backgrounds.md#tag-a-background)を参照)。`kitchen`や`night`のような1語だけのタグは、通常は画像の見た目を表すため、ここでは無視されます。

## 天気に合わせた背景

この設定をオンにすると、背景が物語の天気に合わせて変わります。宿で雨が降り始めると、Illustratorは窓に雨が見える宿の背景を描き直します。屋内では、動く雨は窓ガラスの向こうにだけ降り、部屋の中には降りません。

1. **Chat Settings → Agents → Illustrator**(チャット設定 → エージェント → Illustrator)を開きます。
2. **Weather Versions of Backgrounds**(天気に合わせた背景)をオンにします。

元画像から生成できる画像モデルが必要です。OpenAI、Gemini、NovelAI、画像入力のあるComfyUIなど、多くのモデルが対応しています。対応していないモデルでは、画像はそのままです。

動作は次のとおりです。

- 画像と天気の組み合わせごとに、描くのは**1回だけ**です。天気が元に戻ったときや、雨の宿へ物語が戻ったときは、保存済みの画像が無料で再表示されます。
- 天気に合わせた画像は、元画像の隣に`name--wx-rain.png`として保存されます。ほかの種類は`storm`、`snow`、`blizzard`、`hail`、`fog`、`sand`、`ash`、`embers`、`blossom`、`aurora`です。悪天候の中で最初に作られた画像には、雨などのないコピーとして`clear`もあります。珍しい天気では、物語に出てきた言葉を使います。流星群なら`name--wx-meteor-shower.png`です。
- 快晴、晴れ、曇り、風などの穏やかな天気では、通常の画像を使います。
- 天気は**World State**エージェント、またはDecisionモデルによる確認(下記)から読み取ります。
- 対象はライブラリー内のすべての背景です。自分で選んだ背景、Backgroundエージェントが選んだ背景、Illustratorが描いた背景に加え、場所にピン留めした背景やキャラクターに合わせて変わるギャラリーの背景も含まれます。**Background**エージェントは通常の画像から選び、対応する天気の版があれば、それを表示します。

### 窓: 動く天気を表示する場所

屋内の画像に初めて天気の版を作るとき、Illustratorは画像モデルに、その画像の窓の位置も尋ねます。結果は小さな白黒のマスクとして保存され、その部屋のすべての天気の版で共有されます。動く天気(雨の線、雪片、花びら)は、窓ガラスの部分だけに描画されます。

- 窓のない部屋では動く天気を表示せず、天気に応じた色合いと稲妻の閃光だけを表示します。
- オーロラ、流星群など、何も降らない天気は静止したままです。画像には描かれますが、その上で動くものはありません。
- マスクはデータフォルダー内の`backgrounds/weather-masks`に保存されます。

### 天気の画像や窓を作り直す

チャットに天気の版が表示されているとき、**Chat Settings → Agents → Illustrator**(チャット設定 → エージェント → Illustrator)の**Weather Versions of Backgrounds**(天気に合わせた背景)の下には、**This rain picture**(この雨の画像)のように天気の名前が付いた行が表示されます。

- **Remake picture**(画像を作り直す)は、通常の画像から、この天気の版をもう一度描きます。
- **Remake windows**(窓を作り直す)は、画像モデルに窓のマスクをもう一度作らせます。クッションの上に雨が降ったり、窓に雨が表示されなかったりするときに使ってください。
- **No moving weather**(動く天気を表示しない)は、この部屋のマスクをオフにします。この部屋の天気の版には、天気に応じた色合いと稲妻だけが表示されます。**Remake windows**で元に戻せます。

うまくいかなかった場合: チャットのWorld Stateに**Weather**(天気)が表示されているか(または下記の天気の確認がオンか)、そして画像モデルを設定した**Illustrator**がチャットに追加されているかを確認してください。

## Decisionモデルで返信のたびに確認する

通常、Illustratorがシーンを確認するのは実行間隔ごとなので、新しい場所の背景ができるまでに数回の返信を待つことがあります。はい・いいえで答える小さなモデルである[Decisionモデル](../connections/decision-models.md)を使えば、返信のたびに確認できます。

始める前に: Connectionsページの**Defaults**(用途)ボックスでDecisionモデルを選び、**Generate Scene Backgrounds**(シーンの背景を生成)、**Weather Versions of Backgrounds**(天気に合わせた背景)、またはその両方をオンにしてください。

1. **Chat Settings → Agents → Illustrator**(チャット設定 → エージェント → Illustrator)を開きます。
2. **Decision Model Checks**(Decisionモデルによる確認)で、**The scene moved to a new place**(シーンが新しい場所に移った)、**The weather changed**(天気が変わった)、**New place and weather changes**(新しい場所と天気の変化)のいずれかを選びます。デフォルトは**Off**(オフ)です。

各返信の後に、次の処理が行われます。

- 新しい場所の確認では、最新のメッセージでシーンが新しい場所に移ったかを尋ねます。「はい」なら、その場所の背景を用意します。手持ちの画像が使えれば再利用します。プロンプトモデルが新しい背景の記述を書くのは、「はい」の後だけです。
- 天気の確認では、最新のメッセージで天気が変わったかを尋ねます。「はい」なら、現在の背景の天気の版を表示するか、描きます。World Stateに天気がない場合は、Decisionモデルが天気の種類も選びます。
- 確認は、処理を行う機会を追加するだけです。Illustrator自身の実行やWorld Stateの場所の変化も、引き続き処理のきっかけになります。
- 回答がない場合(モデルがない、タイムアウト、エラー)は、その確認をスキップします。

うまくいかなかった場合: Decisionモデルを選んでいないと、一覧はグレー表示になり、モデルを選ぶ場所が案内されます。

## 送信前にプロンプトを確認する

1. **Settings → Media → Generation Defaults**(設定 → メディア → 生成のデフォルト設定)を開きます。
2. **Expose media prompts before sending**(送信前にメディアのプロンプトを表示)をオンにします。

これで、生成する背景も含め、画像リクエストの前に毎回**Review Image Prompt**(画像プロンプトを確認)ウィンドウが開きます。プロンプトとネガティブプロンプトを編集し、送信するには**Generate**(生成)、中止するには**Cancel**(キャンセル)をクリックしてください。入力したテキストは、そのまま送られます。

## 関連ガイド

- [物語に合わせて変わる背景](../roleplay/backgrounds.md): チャットに表示する画像、場所へのピン留め、ギャラリーの背景。
- [背景ライブラリー](../appearance/chat-backgrounds.md): 画像のアップロード、タグ付け、整理、ぼかし。
- [Illustratorエージェント](illustrator-agent.md): シーンのイラスト、クリップ、実行間隔。
- [チャットのギャラリー](../chats/chat-gallery.md): Galleryセクションとそのボタン。
- [Decisionモデル](../connections/decision-models.md)
