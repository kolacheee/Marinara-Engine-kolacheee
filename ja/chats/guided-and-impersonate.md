# ガイド付き生成とImpersonate

チャットの流れを操作する方法は2つあります。ガイド付き生成は、目に見えるメッセージを投稿せずに、次の返信の方向を指示します。Impersonateは、自分の返信をモデルに書かせます。Quick repliesメニューを使うと、この2つを**Send**(送信)の隣に置けます。

## /guidedで返信を導く

指示はキャラクターの外側からのものです。返信の内容を方向づけますが、チャットのメッセージとしては表示されません。

1. メッセージ入力欄に、`/guided`と指示を入力します。
2. <kbd>Enter</kbd>を押すか、**Send**をクリックします。

モデルは、指示した方向に沿って次の返信を書きます。たとえば次のとおりです。

```text
/guided make him admit he is lying
```

`/guided`の代わりに、`/narrator`、`/narrate`、`/nar`と入力することもできます。グループチャットでは、`respond as`、`reply as`、`respond for`を使って、指示を1人のキャラクターに向けられます。

```text
/guided respond as Alice make her admit she is lying
```

## ガイド付きの再生成

メッセージ入力欄の文章を、再生成のための一度だけの指示として使います。

1. **Settings → Chatting → Editing & Swipes**(設定 → チャットの動作 → 編集とスワイプ)を開き、**Guide swipes/regens with chat input**(チャットの入力でスワイプと再生成を導く)をオンにします。デフォルトではオフです。
2. チャットで、メッセージ入力欄に指示を入力します。送信はしません。
3. AIのメッセージで**Regenerate**(再生成)をクリックします。入力欄に文章があるときは、ボタンのラベルが**Regenerate (guided)**になります。

再生成の後も指示は入力欄に残るので、手直ししてもう一度再生成できます。指示を消したい場合は、**Settings → Chatting → Message Box**(設定 → チャットの動作 → メッセージ入力欄)で**Keep guidance after regenerating**(再生成後も指示を残す)をオフにします。

うまくいかなかった場合: ボタンのラベルが**Regenerate (guided)**になっている必要があります。**Regenerate**としか表示されない場合は、設定がオフか、入力欄が空です。

<a id="read-stored-guidance"></a>

## Stored guidanceを読む

Marinaraは、返信を方向づけた指示を保存します。

1. AIのメッセージにある、巻物の形をした**Stored guidance**(保存された指示)のアイコンをクリックします。
2. **Stored guidance**というタイトルのウィンドウに、指示が表示されます。

ウィンドウには、指示の出どころを示すラベルが付きます。**/guided**、**Guided regenerate**、**Game start**(Game Modeの設定)のいずれかです。`/guided`とガイド付き再生成の指示では、**Copy /guided**で、そのまま使える`/guided`コマンドをコピーできます。別のチャットに貼り付けて使えます。

## Impersonateで自分の返信を書かせる

Impersonateは、次の自分のメッセージを、ペルソナの口調でモデルに書かせます。ペルソナとは自分が演じるキャラクターのことで、`{{user}}`と表されます。[ペルソナ](../characters/personas.md)を参照してください。

始める前に: ImpersonateはRoleplayのチャットでのみ動作します。Conversationでは「Impersonate is not available in Conversation mode.」と表示されます。Gameでも使えません。

1. メッセージ入力欄に`/impersonate`と入力します。必要なら、続けて指示を書きます。
2. <kbd>Enter</kbd>を押すか、**Send**をクリックします。

モデルが、ペルソナとして自分のメッセージを投稿します。たとえば次のように書くと、天気をたずねるメッセージが書かれます。

```text
/impersonate ask about the weather
```

短い別名は`/imp`です。Impersonateが書いたメッセージにも**Regenerate**が使えるので、別の版を作れます。

投稿されたメッセージは自分のターンとして扱われるため、**エージェントをスキップ**がオンでない限り、自分で入力した場合と同じようにエージェントやトラッカーが動きます。**CYOAを方向づけに使う**がオンの状態でCYOAの選択肢を選ぶと、その直後にキャラクターの返答も要求します。それらが動く前に読んで編集したい場合は、Impersonateで下書きを作成します。

### まず下書きを作成する

下書きはチャットではなくメッセージ欄に入ります。保存はされず、送信するまで何も実行されません。キャラクターの返答、エージェント、トラッカー、世界の状態の変更もありません。

1. Roleplayチャットで**チャット設定**を開き、**なりすまし**セクションを探します。
2. **結果の出力先**を**メッセージの下書き**にします。既定は**投稿する**です。
3. `/impersonate`と、必要なら指示を入力し、<kbd>Enter</kbd>を押します。

下書きがメッセージ欄に順次表示されます。作成中は上に**次のメッセージを作成中…**と表示されます。そこにある**停止**か欄内の停止ボタンをクリックすると、そこまでの文章を残して止められます。完成後に編集して**送信**をクリックします。送信するまでは、上の行で次を選べます。

| ボタン | 動作 |
| --- | --- |
| **書き直す** | 同じ指示で下書きを書き直し、欄の文章を置き換えます。 |
| **元に戻す** | 下書きを破棄し、欄を元の内容に戻します。 |

別のチャットやタブに移っても作成は続きます。戻ると、そのチャットのメッセージ欄に下書きがあります。チャットごとに別の下書きを持ちます。

設定を変えずに1回だけ動作を選ぶには、次を使います。

| コマンド | 動作 |
| --- | --- |
| `/impersonate_draft` | 下書きを作成します。`/impd`、`/imp_draft`も使えます。 |
| `/impersonate_post` | メッセージを投稿します。`/impp`、`/imp_post`も使えます。 |

**クイック返信**がオンなら、**送信**の隣のメニューにも両方があります。**なりすまし**は設定に従い、もう一方の操作は逆の動作をします。欄が空でも下書きを開始でき、その場合はモデルが発言内容を選びます。

**CYOAを方向づけに使う**がオンで**結果の出力先**が**メッセージの下書き**の場合、CYOAの選択肢をクリックすると、その選択肢を指示として下書きを作成します。選択肢は送信するまで画面に残ります。

### Impersonateの設定

これらの設定は、すべてのウィンドウとデバイスで、すべてのチャットの`/impersonate`に適用されます。Roleplayチャットで**チャット設定**を開き、**なりすまし**セクションを探します。パネルの開き方は[チャット設定](chat-settings.md)を参照してください。

| 項目 | 動作 |
| --- | --- |
| **結果の出力先** | **投稿する**はメッセージをすぐにチャットに追加します。**メッセージの下書き**はメッセージ欄に書き込み、自分で編集して送信できます。[まず下書きを作成する](#write-a-draft-first)を参照してください。既定：**投稿する**。 |
| **Prompt Template**(プロンプトテンプレート) | impersonateのたびに送る任意の指示です。空のままにすると、チャット自身のプロンプト、または組み込みのデフォルトが使われます。`{{user}}`、`{{persona_description}}`、`{{impersonate_direction}}`を使えます。これらは、Marinaraが実際の文章に置き換えるプレースホルダーです。**Built-in default**を選ぶとデフォルトを読めます。**Copy built-in default to edit**でコピーを作って編集を始め、**Save as**で名前を付けてテンプレートを保存し、**Delete template**でテンプレートを削除します。 |
| **Preset** | impersonateの返信にだけ使うプロンプトプリセットです。デフォルトは**Use chat default**です。[プリセット](../prompts/presets.md)を参照してください。 |
| **Connection** | impersonateの返信に使うモデルです。より安価なモデルや速いモデルなどを選べます。デフォルトは**Use chat default**です。**Random**も選べます。[AIプロバイダーへの接続](../connections/connecting-to-a-provider.md)を参照してください。 |
| **エージェントをスキップ** | Impersonate中にエージェント（トラッカー、ロアブックのルーターなど）を省略します。処理を速め、世界の状態の変更を防ぎます。既定はオフです。下書きでは常に省略します。[エージェント](../agents/agents-overview.md)を参照してください。 |
| **Send Public Faces**(公開情報を送信) | Roleplayチャットでは、**Public Face**(公開情報)があるキャラクターは、名前とPublic Faceだけの形でimpersonateのプロンプトに入ります。そのため、こちらの返信では知り得る情報だけを使います。これは、そのカードが送るほかのすべての内容を置き換えます。対象はDescription、Personality、Backstory、Appearance、Scenario、System Prompt、会話例、RPG属性、Post-History Instructions、Depth Promptです。Public Faceが空のキャラクターは、カード全体を保持します。impersonateのプリセットやプロンプトテンプレートに置いた`{{description}}`などのマクロは、引き続き指定された内容を送ります。**Regenerate**(再生成)は、メッセージを書いたときの設定を保持します。デフォルトはオフです。[Cardタブ](../characters/creating-and-editing-characters.md#card-tab)を参照してください。 |
| **Use CYOA as direction** | CYOA(choose your own adventure、選択肢で進む形式)の選択肢をクリックしたときに、それを投稿する代わりに、impersonateの指示として使います。デフォルトではオフです。**Settings → Chatting → Message Box**(設定 → チャットの動作 → メッセージ入力欄)で**Add CYOA choices to the message box instead of sending them**(CYOAの選択肢を送信せずメッセージ入力欄に追加する)がオンの場合、クリックしても文章がメッセージ欄に追加されるだけで、この設定は効果がありません。 |

### 1つのチャットにプロンプトを設定する

1. `/impersonate_prompt`と入力し、続けてプロンプトを引用符で囲んで書きます。
2. <kbd>Enter</kbd>を押します。

```text
/impersonate_prompt "You will now play as my OC:"
```

デフォルトに戻すには、`/impersonate_prompt reset`と入力します。別名は`/imp_prompt`です。

## Sendの隣にQuick repliesを追加する

Quick repliesは、ワンクリックで使える、**Send**の代わりの操作を追加します。スラッシュコマンドを入力する必要はありません。

1. **Settings → Chatting → Message Box**(設定 → チャットの動作 → メッセージ入力欄)を開きます。
2. **Quick replies**をオンにします。デフォルトではオフです。
3. 展開して、表示する操作を選びます。オンにすると、3つの操作はデフォルトですべてオンです。

| 操作 | 動作 |
| --- | --- |
| **Post only** | 入力したメッセージを、返信なしでチャットに追加します。コマンド`/send <message>`でも同じことができます。 |
| **Guide reply** | 入力した文章を、`/guided`の指示として送ります。 |
| **なりすまし** | 入力した文章を指示としてペルソナ側の返答を生成します。**結果の出力先**に従い、Roleplayでは隣のもう1つの操作が逆の動作をします（**なりきりの下書きを作成**または**なりきりで作成して投稿**）。Conversationチャットでは非表示です。 |

オンの操作が1つだけのときは、そのボタンが**Send**の隣に表示されます。2つ以上のときは、点が3つ並んだボタン(**Quick replies**)にまとまり、押すとメニューが開きます。
