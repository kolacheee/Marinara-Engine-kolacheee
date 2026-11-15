# Text to Speech (TTS)の設定

Text to Speech (TTS)は、チャットのメッセージとゲームの語りを音声で読み上げます。このガイドでは、TTSをオンにする方法、音声サービスと声の選び方、自動再生の設定、メッセージごとの操作を説明します。

## クイックスタート

1. 上部バーの**Connections**(接続)をクリックし、**Add**(追加)をクリックします。
2. 種類を選ぶチップで**Voice**(音声)をクリックし、サービスを選んで、**API key**(APIキー)にキーを貼り付けます。**Connect**(接続)をクリックします。
3. **Found in … — use it for:**で**Voice**にチェックを入れ、**Done**(完了)をクリックします。Voiceモデルを選ぶと、音声合成がオンになります。
4. **Defaults**(用途)ボックスの**Voice**行にある歯車をクリックし、**Preview**(試聴)をクリックしてサンプルを聞きます。チャットでは、メッセージの下の**Speak**(読み上げ)をクリックします。

## 音声合成をオンにする

**Voice**(音声合成(Text to Speech))の役割にモデルを選ぶと、音声合成がオンになります。それだけでは、何も読み上げは始まりません。各メッセージの**Speak**(読み上げ)ボタンと**Auto-play**(自動再生)の項目が表示されるようになります。何をいつ読み上げるかは、引き続き自分で選びます。

1. **Library → Connections**(ライブラリー → 接続)を開きます。**Defaults**(用途)ボックスで**Voice**をクリックします。**Model for Voice**(音声合成(Text to Speech)用のモデル)ウィンドウが開きます。
2. アカウントの音声モデル、または**Local PocketTTS**など、この端末上の音声エンジンを選びます。選んだものが**Voice**行に表示されます。
3. 音声のアカウントがまだない場合は、ウィンドウ下部の**Add account**(アカウントを追加)、またはConnectionsページの**New connection**(新しい接続)をクリックし、**Voice**タブを開いてください。
4. 音声合成をオフにするには、もう一度**Voice**をクリックし、**Turn voice off**(音声をオフにする)を選びます。オフのあいだは、何も読み上げられません。

音声サービスとは、音声を生成するサービスのことです。Marinaraは次のサービスに対応しています。

- **OpenAI-compatible**: OpenAI、またはOpenAIのTTS形式に合わせた任意のサーバー。これがデフォルトです。
- **ElevenLabs**: ElevenLabsの音声サービス。
- **PocketTTS**: 自分のコンピューターで動かす無料の音声サーバー。
- **xAI Voice**: xAIの音声サービス。

Marinaraは音声サービスごとに、キー、アドレス、モデル、声、パラメーターを別々のプロファイルとして保存します。サービスを切り替えると、そのサービスで前回使った設定が戻ります。まだ設定していないサービスは、デフォルトの状態から始まります。

リクエストは、Marinara自身のサーバーを経由して送られます。APIキーは、サーバー上で暗号化して保存されます。キーを保存すると、欄には伏せ字の点が並び、実際のキーがブラウザーに返ることはありません。

### アカウントのVoiceモデルを使う

**Audio**(音声)のアカウントをすでに追加している場合([対応しているAIプロバイダー](../connections/providers-reference.md#audio)を参照)は、その詳細をもう一度入力する必要はありません。そのアカウントの音声モデルは、**Voice**(音声合成(Text to Speech))の選択画面に表示されます。

1. **Defaults**(用途)ボックスの**Voice**行をクリックし、モデルを選びます。
2. その行の歯車をクリックします。声と、そのほかの設定を選びます。

Marinaraはそのアカウントのアドレス、キー、モデル、**Request timeout (seconds)**(リクエストのタイムアウト、秒単位)を使うので、声の設定にはそれらの欄が表示されません。キーはアカウントの中にとどまり、声の設定にコピーされることも、ブラウザーに送られることもありません。新しいキーなど、アカウントに加えた変更はすぐに反映されます。

声、速度、そのほかの読み上げの設定は、アカウントごとに保存されます。同じ種類のアカウントどうしでも、設定を共有することはありません。通常の4つの音声サービスの設定は元のまま残ります。

選んだアカウントが削除された場合や使えない場合、その行には**The voice account is missing**と表示され、別の音声モデルを選ぶまで何も読み上げられません。Marinaraが勝手に切り替えることはありません。

## アドレス、キー、モデルを設定する

**Add account**(アカウントを追加)ウィンドウで入力するのは、キーかアドレスだけです。後から変更するには、**Connections**(接続)でアカウントの**⋯**をクリックし、**Edit account**(アカウントを編集)を選んでください。音声のアカウントを選んだ場合は、ここを飛ばしてください。これらはアカウントから使われます。

1. **Address**(アドレス)を確認します。サービスごとにデフォルトが入ります(下の表を参照)。変更するのは、プロキシや自分で運用するサーバーを使う場合だけです。
2. **API key**(APIキー)にキーを貼り付けます。既存のキーをそのまま使うときは、伏せ字の点を残しておきます。キーを削除するときは、欄を空にします。
3. モデルを選ぶか、サービスが対応している別のモデルIDを入力します。

| 音声サービス | デフォルトのアドレス | デフォルトのモデル | デフォルトの声 |
| --- | --- | --- | --- |
| OpenAI-compatible | `https://api.openai.com/v1` | `tts-1` | `alloy` |
| ElevenLabs | `https://api.elevenlabs.io` | `eleven_multilingual_v2` | なし、自分で選ぶ必要があります |
| PocketTTS | `http://localhost:8000` | `pocket-tts` | `alba` |
| xAI Voice | `https://api.x.ai/v1` | `grok-tts` | `eve` |

**ElevenLabs**の場合、モデルの一覧には、自分のアカウントで使える読み上げモデルが読み込まれます。通常の読み上げモデルを選んでください。IDに`ttv`を含むモデルは音声デザイン用で、テキストを読み上げられません。選ぶと、読み上げモデルを使うように促すエラーが出て、再生に失敗します。

### PocketTTS

PocketTTSはMarinaraに内蔵されていません。[公式PocketTTSサーバー](https://github.com/kyutai-labs/pocket-tts)を別途インストールし、`uvx pocket-tts serve`で起動してください。Marinaraがダウンロードや管理をすることはありません。公式サーバーは`http://localhost:8000`を使います。ホストやポートを変えていなければ、**Address**(アドレス)はこの値のままにします。Marinaraは公式のmultipart `/tts` APIを検出します。[OpenAI互換PocketTTSラッパー](https://github.com/teddybear082/pocket-tts-openai_streaming_server)用の独自URLも引き続き使えます。

### リクエストのタイムアウト

Marinaraは、読み上げる1行ごとに最大60秒待ちます。自分のコンピューター、特にノートパソコンで動かす音声サーバーでは、長い行にもっと時間がかかることがあります。**Voice settings**(声の設定)(**Defaults**(用途)ボックスの**Voice**行にある歯車)の**More**(その他)にある**Request timeout (seconds)**(リクエストのタイムアウト、秒単位)の値を大きくしてください。範囲は10秒から3,600秒です。

音声のアカウントには、モデルの**Edit model**(モデルの編集)ウィンドウの**Default voice**(デフォルトの声)の下と、**Voice settings**に、独自の**Request timeout (seconds)**があります。**Voice**の役割に選んだものも含め、音声のアカウントを通して読み上げるチャットは、その上限を使います。**Voice settings**の上限は、**Preview**(試聴)を含め、その設定による読み上げに適用されます。1行に時間がかかりすぎた場合、エラーには、Marinaraが何秒待ったかと、どの設定の値を大きくすればよいかが表示されます。

## 声を選ぶ

キャラクターやペルソナに個別の声を割り当てるまでは、すべての話し手が**Shared voice**(共有の声)を使います。**Voice settings**(声の設定)の**Who speaks**(誰が話すか)セクションには、この両方の設定があります。

### 全員で1つの声を使う

**Shared voice**(共有の声)で声を選びます。サービスの実際の声の一覧を読み込むには、**Refresh voices from provider**(プロバイダーから声を再読み込み)ボタン(円形の矢印アイコン)をクリックします。接続する前は、欄が空にならないよう、短い内蔵の一覧が表示されます。サービス側でエラーが起きたときは、その代替の一覧を再読み込みの成功のように見せず、エラーを表示します。

公式PocketTTSサーバーには声の一覧を返すエンドポイントがないため、Marinaraは内蔵の声を表示し、一覧の横に、別の内蔵の名前や対応する音声URLを入力できる欄を残します。互換ラッパーサーバーは、独自の一覧を返し、カスタムIDやパスを受け付けることができます。

**ElevenLabs**では、声を必ず選ぶ必要があります。Marinaraはアカウントのライブラリー全体(個人の声、ワークスペースの声、保存済みの声、デフォルトの声)を読み込みます。選択画面には、検索欄と、読み込んだ声の数があります。最初は「Select an ElevenLabs voice」が選ばれた状態で、実際の声を選ぶまで再生はできません。

### キャラクターやペルソナごとに選ぶ

1. **Character and persona voices**(キャラクターとペルソナの声)で、**Add voice**(声を追加)をクリックします。
2. 左の一覧でキャラクターかペルソナを、右の一覧で声を選びます。
3. それぞれについて繰り返します。

キャラクターの声は、**Character Editor**(キャラクターエディター)の**Voice**タブでも設定できます。変更されるのは同じ行です。キャラクターが1つの声を共有しているあいだは、タブに**All characters share one voice right now.**と表示されます。**Use a voice per character**(キャラクターごとの声を使う)をクリックして切り替え、声を選んでください。**Open Text to Speech settings**(音声合成の設定を開く)をクリックすると、**Voice settings**(声の設定)が開きます。**Character and persona voices**(キャラクターとペルソナの声)の**Refresh**(更新)は、声の一覧を読み込み直します。先にキャラクターを作成しておいてください。1つもない場合は、声を割り当てる前にキャラクターかペルソナを追加するよう案内が出ます。

個別の声がないキャラクターは、名前が一致するカード(AU版のコピー元など)の声を使います。それもなければ、共有の声を使います。[キャラクターの作成と編集](../characters/creating-and-editing-characters.md)を参照してください。

### 語り手の声

語りとは、シーンの描写やゲームマスターのせりふのように、特定のキャラクターが話すわけではない文章です。

1. **Narrator voice**(語り手の声)で、**Use separate narrator voice**をオンにします。
2. 声を選びます。

この声は、RoleplayとConversationのメッセージで行の話し手がNarrator、GM、Game Master、Systemのいずれかのとき、およびGame Modeで話し手の名前がない語りに使われます。ElevenLabsでは、ここで語り手の声を選んでください。空のままにすると、全体の声が設定されているときだけ、語りがその声に切り替わります。

### NPCのランダムな声(Game Modeのみ)

この機能は、Game Modeが追跡している脇役のキャラクターに、余っている声を割り当てます。RoleplayとConversationでは効果がありません。

1. **Random NPC voices**(NPCのランダムな声)で、**Use default voices for random NPCs**をオンにします。
2. **Male NPC defaults**と**Female NPC defaults**で、声にチェックを入れます。

個別の声を持たない追跡中のNPCには、対応する候補から一定の規則で声が選ばれ、そのセッションのあいだ同じ声を保ちます。声を割り当て済みのNPCは、その声を使います。性別がはっきりしないNPCは、両方の候補から選ばれます。男性向け、女性向けと判別できる声が見つからない場合は、どちらの候補も声の全一覧を使います。

## 音声形式と速さ

**Audio format**(音声形式)は**MP3**(デフォルト)か**WAV**です。MP3を生成できないローカルのサーバーではWAVを使ってください。ElevenLabsは常にMP3を使うため、この項目は表示されません。xAI Voiceでは表示されますが、効果はありません。xAIは常にMP3を返すからです。

**Speed**(話す速さ)のスライダーの範囲は、音声サービスによって異なります。

| 音声サービス | 範囲 |
| --- | --- |
| OpenAI-compatible | 0.25倍から4.0倍 |
| PocketTTS | 互換ラッパーでは0.25から4.0。公式サーバーは速さを自身で制御します。 |
| ElevenLabs | 0.7倍から1.2倍 |
| xAI Voice | 0.7倍から1.5倍 |

保存済みの速さが範囲外の場合は、いちばん近い許容値に収められます。ElevenLabsには、さらに2つの項目があります。**Language**(言語を指定するか、**Auto detect**のままにします)と、**Stability**(表情豊かな話し方から安定した話し方まで)です。

## 自動再生

**Auto-play**(自動再生)の各トグルは、ある種類の新しいメッセージを、生成が終わった時点で読み上げます。どれも**Voice**(音声合成(Text to Speech))の役割にモデルが設定されている必要があります。すべて最初はオフです。

- **Roleplay messages**: Roleplayの新しい返信
- **Conversation messages**: Conversationの新しい返信
- **Game narration**: Game Modeの新しい語りと戦闘の行
- **Progressive playback**: 複数行の返信で、全体を待たずに最初の行からすぐ再生を始めます。
- **Only read dialogues**: 引用符やタグの付いたせりふだけを読み上げ、地の語りは飛ばします。

自動再生が動くのは、いちばん新しい返信が完成したときの1回だけです。チャットを開き直したりスクロールしたりしても、古いメッセージを読み直すことはありません。

Roleplayでは、メインの返信が保存されるとすぐに音声の準備が始まります。Prose Guardianなど、オンにしたエージェントが返信を書き直す場合、Marinaraは最終的なテキストを待ちます。

### テキストのフィルターと感情の指示

これらのフィルターは手動の再生と自動再生の両方に適用され、Gameの語りとRoleplayの話者抽出にも反映されます。コードブロックはデフォルトで省略されます。ほかの2つは最初はオフです。

- **Skip text inside HTML and custom tags**(HTMLタグとカスタムタグ内のテキストを省略): 非表示の`<simulation>...</simulation>`ブロックなど、囲まれたテキストを取り除きます。声の選択に使う話者タグは残ります。
- **Skip fenced code blocks**(フェンスで囲まれたコードブロックを省略)
- **Skip text inside square brackets**(角括弧内のテキストを省略)

**Roleplay speaker extractor**(Roleplayの話者抽出)をオンにすると、**Enable emotion indicators**(感情表現の指示を使う)が表示されます。この設定は、せりふの言葉を変えずに声の指示を加えます。感情表現の指示がオンのときは、**Skip text inside square brackets**がオンでも、角括弧内のテキストが音声サービスに送られます。メモも含まれる場合があります。括弧内のメモを読み上げ対象から外すには、感情表現の指示をオフにし、省略の設定はオンのままにしてください。`[Low, steady voice, restrained urgency]`のような指示は、長い行を分割しても途中で切れません。アプリが認識する話者やシーンのラベルは、引き続き取り除かれます。各指示をどう使うかは、音声モデルが決めます。**Voice**(音声合成(Text to Speech))の役割にモデルを設定し、**Game narration**と感情表現の指示をオンにすると、Gameのシーン、パーティー、戦闘でのせりふにも指示が含まれることがあります。

## メッセージを1つ読み上げる

**Voice**(音声合成(Text to Speech))の役割にモデルを設定すると、キャラクターや語り手のメッセージの下のツールバーに**Speak**(読み上げ)ボタン(マイクのアイコン)が表示されます。

- **Speak**をクリックすると読み上げます。音声を取得しているあいだ、ボタンは読み込み中の表示になります。
- 再生中にもう一度クリックすると停止します。ツールチップは**Stop speaking**になります。
- 読み上げられる文章がないメッセージ(画像だけの場合など)は**No dialogue to speak**と表示され、ボタンは無効のままです。

読み上げ中は、**Pause speaking**、**Resume speaking**、**Restart speaking**のボタンが表示されます。スピーカーのアイコンのボタンを押すと、0から100パーセントの**Line volume**(この読み上げの音量)スライダーが開きます(デフォルトは50)。この音量は、Game Modeのミキサーとも、Conversationの通話の音量とも別です。

うまくいかなかった場合は、[トラブルシューティング](#troubleshooting)を参照してください。

## 保存済みの音声

Marinaraは生成した音声をブラウザーに保存し、同じ行を2回生成しないようにします。**Voice settings**(声の設定)の**Cached clips**(保存済みの音声)セクションには、現在の件数と合計サイズが表示されます。**Export cached TTS clips**(保存済みの音声を書き出す)ボタン(ダウンロードのアイコン)をクリックすると、保存済みの音声をすべて個別の音声ファイルとして保存できます。キャッシュは古いクリップから自動的に整理されます。アプリ内に消去ボタンはありません。空にするには、ブラウザーのデータを削除してください。

## 各チャットモードでのTTS

- **Roleplay**では、**Roleplay messages**のトグルと**Speak**の操作を使います。[Roleplayモード: はじめに](../roleplay/getting-started.md)を参照してください。
- **Conversation**では、**Conversation messages**のトグルと同じ操作を使います。音声通話については、[Conversationの音声通話とビデオ通話](../conversation/calls.md)で説明します。
- **Game Mode**では、**Game narration**のトグルを使います。ミキサーには、**Master**、**Music**、**Sound Effects**、**Ambient**と並んで**TTS**のチャンネルがあります。このチャンネルはゲーム内の読み上げ音声の音量を決め、最初は100パーセントです。[Gameの操作](../game/getting-started.md#the-games-controls)を参照してください。

### Phonetic name(通話での読み方)

声がキャラクターやペルソナの名前を正しく読めないときは、**Phonetic name**(読み仮名)を追加し、どう読むかを入力してください。**Character Editor**(キャラクターエディター)では、**Voice**タブにあります。**Persona Editor**(ペルソナエディター)では、基本情報の欄と並んでいます。これが使われるのは、Conversationの音声通話とビデオ通話のときだけです。**Speak**、自動再生、Game Modeの語りでは使われません。

## トラブルシューティング

- **何も読み上げない**: **Defaults**(用途)ボックスの**Voice**(音声合成(Text to Speech))行が**Off**(オフ)になっていないか確かめます。次に、該当する**Auto-play**のトグルを確認するか、メッセージの**Speak**を使います。
- **Voice行にThe voice account is missingと表示される**: 音声モデルのアカウントが削除されたか、使えなくなっています。別の音声モデルを選んでください。[アカウントのVoiceモデルを使う](#use-a-voice-model-from-an-account)を参照してください。
- **一覧に声が出ない**: **Voice**行にモデルと有効なキーが設定されていることを確認してから、**Refresh voices from provider**をクリックします。公式PocketTTSサーバーは、Marinaraの内蔵の一覧を使います。互換PocketTTSラッパーの場合は、`<Base URL>/v1/voices`が応答することを確認してください。
- **ElevenLabsが読み上げない**: プレースホルダーの「Select an ElevenLabs voice」ではなく、実際の声を選んでください。音声モデルが読み上げモデルであり、IDに`ttv`を含む音声デザイン用モデルでないことも確認します。
- **行が「No audio after 60 s」で止まる**: 音声サーバーにもっと時間が必要です。メッセージに示された場所で**Request timeout (seconds)**の値を大きくしてください。[リクエストのタイムアウト](#request-timeout)を参照してください。
- **ローカルアドレスにある自前のサーバーがブロックされる**: `.env`で`TTS_LOCAL_URLS_ENABLED`をオンにします。これで、OpenAI-compatibleやElevenLabs形式のサーバーについて、Marinaraがローカルアドレスやプライベートアドレスへ接続できるようになります。PocketTTSにこの設定は不要です。[サーバー設定リファレンス](../CONFIGURATION.md)を参照してください。
- **すぐに試す**: **Voice settings**(声の設定)の**Preview**(試聴)をクリックすると、現在の設定で短いサンプルを聞けます。

## リファレンス: 音楽、効果音、Gacha Forge

これらのセクションは、上級者向けの設定です。

### 互換オーディオサーバーでGameの音楽と効果音を生成する

1. **Connections**(接続)で、**Music & Sound Effects**(音楽と効果音)のアカウントを**Edit model**(モデルの編集)で開き、**Custom compatible server**(カスタム互換サーバー)を選びます。**Add connection**(接続を追加)の一覧には、この種類のアカウント用の項目はありません。このアカウントは、アップグレードかインポートによって作られます([アカウントリファレンス](../connections/providers-reference.md#music--sound-effects)を参照)。
2. 音楽や効果音のサーバーのアドレス、キー、モデルを入力します。
3. **Generation API format**を設定し、サーバーが提供するエンドポイントパスを入力します。パスが空の機能は使えません。
4. **Music generation**(音楽生成)、**Sound-effect generation**(効果音生成)、またはその両方をオンにします。
5. Gameのセットアップかゲームのオーディオ設定で、このアカウントを選びます。読み上げ用のアカウントは、**Voice**の役割の声の設定で別に選んでおきます。

エンドポイントのパスは、アカウントのBase URLに追加されます。`http://localhost:8002/v1`の場合は`chat/completions`を指定すると、`/v1/chat/completions`にアクセスします。ローカルのHTTPエンドポイントには、ほかのローカル互換オーディオリクエストと同じく、`.env`で`TTS_LOCAL_URLS_ENABLED=true`の設定が必要です。

対応するAPI形式は次の2種類です。

- **Prompt JSON → MP3 audio**は`{ "model": "your-model", "prompt": "the requested sound", "duration": 5, "response_format": "mp3" }`を送信し、MP3のバイト列を受け取ります。Gameの音楽はコンテキストトラックの長さ(デフォルトは120秒)を使います。効果音は5秒を要求します。
- **Chat Completions → inline audio (ACE-Step compatible)**は、`model`、ユーザーの`messages`を1件、`stream: false`、および`duration`、`instrumental: true`、`format: "mp3"`を持つ`audio_config`を送信します。`choices[0].message.audio`内のインラインのMP3を受け付けます。形式は、base64データURLを含むACE-StepのオーディオURL配列、またはbase64の`data`を持つオブジェクトです。[ACE-Step互換APIの仕様](https://github.com/ace-step/ACE-Step-1.5/blob/main/docs/en/Openrouter_API_DOC.md)を参照してください。リモートの結果URLや非同期ジョブAPIには対応していません。

サーバーが実装している機能だけをオンにしてください。OpenAI互換の音声エンドポイントがあるだけでは、音楽や効果音に対応しているとは限りません。Infermaticなどのサービスは、これらの形式のいずれかを提供するか、アダプターを用意する必要があります。Infermaticの実際の音楽エンドポイントは、ここでは検証していません。ElevenLabsやSunoAPIのネイティブ生成には、**Music & Sound Effects**でそのソースを使ってください。[アカウントリファレンス](../connections/providers-reference.md#music--sound-effects)を参照してください。

生成したコンテキスト音楽は、エリアや遭遇段階ごとに1回作曲され、再利用されます。同じ効果音には、オーディオキャッシュを使います。生成エラーが起きても、キャッシュは再試行に使える状態で残ります。

### Gacha Forgeの会話と音声

Gacha Forge 1.11.0以降は、**Voice**の役割で選んだアカウントと、そのキャラクターごとの声の割り当てを使います。 - **Read character dialogue**(キャラクターの会話を読み上げる)をオンにすると、声が割り当てられたインポート済みキャラクターの会話を読み上げます。この設定は、新しいワールドの**Lore**(背景設定)のセットアップステップ、または既存のワールドの場合はGacha Forge自体のワールド設定にあります。ナレーション、思考、EngineのキャラクターIDを持たない生成ユニット、声のないキャラクターは読み上げません。名前があるだけで、ほかのキャラクターの声を借りることはありません。

- **Voice**の役割が**Off**(オフ)でなければ、選択した音声のアカウントを使えます。
- 同梱のGameの音楽と効果音には、生成用のアカウントは不要です。新しいトラックを作曲するには、Gacha Forgeで**Generate music and sound effects**(音楽と効果音を生成する)をオンにし、**Audio connection**(オーディオ接続)でMusic & Sound Effectsのアカウントを選んでください。この欄は、生成がオンのときに表示されます。Home、戦闘、ボス、ストーリーシーン、キャラクターストーリーのトラックは、初めて必要になったときに生成され、その後は再利用されます。これらのリクエストには、自分のサービスのアカウントが使われます。
- 右上のミュートボタンは、音楽、会話、効果音をまとめて消音します。Gacha Forgeの見た目の設定には、この3つの個別の音量調整(0を含む)と、自動再生の待ち時間(デフォルトは**3秒**で、テキストの表示と会話の読み上げが終わったあとに始まります)があります。選択肢は引き続きプレイヤーを待ちます。シーンを離れると、会話の読み上げは取り消されます。ワールドを離れると、そのワールドの音声は止まります。

これらの操作を使うには、Engineとあわせて、インストール済みのGacha Forgeパッケージもアップデートしてください。

## 関連ガイド

- [Conversationの音声通話とビデオ通話](../conversation/calls.md)
- 2Dと3Dのアバター向けの[音声合成によるリップシンク](../agents/avatars.md#lip-sync-with-text-to-speech)
- [Roleplayモード: はじめに](../roleplay/getting-started.md)
- [Game Mode: はじめに](../game/getting-started.md)
- [対応しているAIプロバイダー](../connections/providers-reference.md)
- [キャラクターの作成と編集](../characters/creating-and-editing-characters.md)
- [サーバー設定リファレンス](../CONFIGURATION.md)
