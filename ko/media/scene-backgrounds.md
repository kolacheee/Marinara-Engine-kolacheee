# Illustrator가 만드는 배경

**Illustrator** 에이전트는 요청할 때나 이야기가 새 장소에 도착할 때 배경을 그릴 수 있습니다. 날씨가 바뀌면 비, 눈, 안개 버전을, 시간대가 바뀌면 새벽, 낮, 일몰, 밤 버전도 만듭니다. 이 가이드에서는 이 모든 기능과 새로 그리는 대신 기존 그림을 재사용하는 방식을 설명합니다.

직접 업로드하고 고르는 그림은 [배경 라이브러리](../appearance/chat-backgrounds.md)를 참고하세요. 채팅에서 표시할 그림을 고르는 방식(Background 에이전트, 고정된 장소, 갤러리 그림)은 [이야기를 따라 바뀌는 배경](../roleplay/backgrounds.md)을 참고하세요.

## 시작하기 전에

- **Library → Agents**(라이브러리 → 에이전트)에서 **Illustrator**를 설치하세요. [Illustrator 에이전트](illustrator-agent.md)를 참고하세요.
- 이미지 모델을 지정하세요. Connections 페이지의 **Defaults**(기본값) 상자에서 **Images**(이미지) 작업을 설정하거나, Illustrator의 **Open Setup**(설정 열기) 화면에서 모델을 고르세요. [이미지 생성 제공자와 설정](image-providers.md)을 참고하세요.

생성한 배경은 Roleplay(롤플레이)와 Game Mode(게임 모드) 채팅에서 쓸 수 있으며 Conversation(대화)에서는 쓸 수 없습니다. Conversation에서는 "Scene background generation is available in Roleplay and Game modes."라는 메시지가 표시됩니다.

## 지금 배경 그리기

1. 채팅의 슬라이더 버튼으로 **Chat Settings**(채팅 설정)를 열고 **Gallery**(갤러리)를 펼치세요.
2. **Background**(배경)를 클릭하세요. 작업 중에는 **Generating...**이 표시됩니다.
3. 작업이 끝나면 새 그림이 배경 라이브러리에 추가되고 채팅 뒤에 표시됩니다. "Background generated." 메시지로 완료를 알려 줍니다.

이 작업을 위해 Illustrator를 채팅에 추가할 필요는 없습니다. 한 번만 실행되며 자동 실행을 시작하지 않습니다.

Marinara는 장면을 바탕으로 프롬프트를 만듭니다. 게임에서는 장르, 설정, 장소, 날씨, 시간대가 포함됩니다. 그림에는 **Backgrounds**(배경) 캔버스 크기가 적용되며, **Settings → Media → Image Generation**(설정 → 미디어 → 이미지 생성)에서 바꾸지 않으면 1280 x 720픽셀입니다.

작동하지 않는 경우: "Choose an image generation connection for the Illustrator agent, or mark one as the default image connection."은 이미지 모델을 찾지 못했다는 뜻입니다. **시작하기 전에**에서 설명한 대로 모델을 설정하세요. **Background** 버튼이 없으면 Illustrator가 설치되지 않은 것입니다.

## 새로운 장소마다 새 배경 만들기

이 기능을 켜면 이야기가 배경 없는 장소에 도착할 때 Illustrator가 배경을 그려 라이브러리에 저장하고 표시합니다.

1. 채팅에 **Illustrator**를 추가하세요. **Chat Settings → Agents**(채팅 설정 → 에이전트)에서 **Enable Agents**(에이전트 활성화)를 켠 다음 **Misc Agents**(기타 에이전트)에서 **Illustrator**를 추가하세요.
2. **Illustrator** 카드에서 **Generate Scene Backgrounds**(장면 배경 생성)를 켜세요.

Illustrator는 **Image Run Interval**(이미지 실행 간격)에 따라 장면을 확인합니다(바꾸지 않으면 메시지 5개마다). 답변마다 확인하게 하려면 [Decision 모델 확인](#check-every-reply-with-a-decision-model)을 쓰세요. Game Mode에서는 **Game Illustrator** 스위치가 배경에도 적용됩니다.

### 이미 가진 그림 재사용하기

Illustrator는 새 장소를 그리기 전에 이미 가진 그림을 다음 순서로 찾습니다.

1. 채팅이나 캐릭터 갤러리에서 그 장소에 고정한 배경입니다. [장소에 배경 고정하기](../roleplay/backgrounds.md#pin-a-background-to-a-place)를 참고하세요.
2. 이름이나 두 단어 이상의 태그가 World State의 장소에 포함된 라이브러리 그림입니다. 예를 들어 `generated-guest-bedroom.png`나 `guest bedroom` 태그가 붙은 그림은 "Smith House, guest bedroom"에 쓰입니다.
3. World State에 장소가 없으면 Illustrator의 프롬프트 모델이 쓴 장소 이름을 같은 방식으로 비교합니다.

대소문자, 악센트, "'s"는 구분하지 않으며, 단순한 `bedroom.png`보다 가장 구체적인 이름을 우선합니다. 맞는 그림이 있으면 그 그림을 표시하고(이야기의 날씨에 맞는 버전이 있으면 그 버전으로) 새로 그리지 않습니다. 맞는 그림이 없는 장소에만 새 그림을 만듭니다.

이름이 맞는 그림이 없고 Illustrator 카드에서 **Reuse a library background that looks like the place**(장소와 비슷한 라이브러리 배경 재사용)를 켰다면, [그림을 읽는 Decision 모델](../connections/decision-models.md#features-that-look-at-pictures)이 장소와 같은 단어가 들어간 라이브러리 그림을 최대 4장까지 살펴보고 맞는 그림을 보여 줍니다. 맞는 그림이 하나도 없을 때만 새로 그립니다. 기본적으로 꺼져 있으며, 이런 모델이 없으면 회색으로 비활성화됩니다.

한 장소에 같은 그림이 계속 쓰이게 하려면 장소를 따라 파일 이름을 짓거나("Kitchen"이라면 `kitchen.png`), `smith house kitchen`처럼 두 단어 이상으로 된 태그를 붙이세요([배경에 태그 달기](../appearance/chat-backgrounds.md#tag-a-background) 참고). `kitchen`이나 `night`처럼 한 단어로 된 태그는 보통 그림의 모습을 설명하므로 여기서는 무시됩니다.

## 날씨별 배경

이 기능을 켜면 배경이 이야기의 날씨를 따릅니다. 여관에 비가 내리기 시작하면 Illustrator가 여관 배경을 창문에 비가 내리는 모습으로 다시 그립니다. 실내에서는 움직이는 비가 유리창 뒤에만 내리며 방 안에는 내리지 않습니다.

1. **Chat Settings → Agents → Illustrator**를 여세요.
2. **Weather Versions of Backgrounds**를 켜세요.

그림을 입력받아 시작할 수 있는 이미지 모델이 필요합니다. OpenAI, Gemini, NovelAI, 이미지 입력이 있는 ComfyUI를 비롯해 대부분의 모델이 지원합니다. 지원하지 않는 모델이면 그림은 그대로 유지됩니다.

동작 방식은 다음과 같습니다.

- 각 그림과 날씨 조합은 **한 번**만 그립니다. 날씨가 다시 바뀌거나 이야기가 비 오는 여관으로 돌아오면 저장된 버전을 비용 없이 다시 표시합니다.
- 해당 버전은 원본 옆에 `name--wx-rain.png`로 저장됩니다. 다른 종류는 `storm`, `snow`, `blizzard`, `hail`, `fog`, `sand`, `ash`, `embers`, `blossom`, `aurora`이며, 처음부터 궂은 날씨로 만든 그림에서 비나 눈이 없는 사본을 만들 때는 `clear`를 씁니다. 특이한 날씨는 이야기에서 쓴 표현으로 버전을 만듭니다. 유성우는 `name--wx-meteor-shower.png`입니다.
- 쾌청하거나 맑거나 흐리거나 바람이 부는 날씨와 그 밖의 가벼운 날씨에는 기본 그림을 유지합니다.
- 날씨는 **World State** 에이전트나 아래의 Decision 모델 확인에서 읽습니다.
- 직접 골랐든, Background 에이전트가 골랐든, Illustrator가 그렸든 라이브러리의 모든 배경에 적용됩니다. 고정된 장소와 캐릭터를 따라 바뀌는 갤러리 배경에도 적용됩니다. **Background** 에이전트는 기본 그림 중에서 고르며, 맞는 날씨 버전이 있으면 그 버전이 표시됩니다.

### 창문: 움직이는 날씨가 표시되는 곳

실내 그림의 날씨 버전을 처음 만들 때 Illustrator는 이미지 모델에 그림 속 창문의 위치도 묻습니다. 답은 작은 흑백 마스크로 저장하며, 그 방의 모든 날씨 버전이 공유합니다. 움직이는 날씨(빗줄기, 눈송이, 꽃잎)는 유리창에만 그려집니다.

- 창문 없는 방에는 움직이는 날씨 없이 날씨에 따른 색감과 번개 섬광만 나타납니다.
- 오로라, 유성우처럼 떨어지는 것이 없는 날씨는 정지된 상태로 유지됩니다. 그림에는 보이지만 그 위로 움직이는 효과는 없습니다.
- 마스크는 데이터 폴더의 `backgrounds/weather-masks`에 보관됩니다.

### 날씨 그림이나 창문 다시 만들기

채팅에 날씨 버전이 표시되는 동안 **Chat Settings → Agents → Illustrator**의 **Weather Versions of Backgrounds** 아래에는 **This rain picture**처럼 날씨 이름이 붙은 행이 나타납니다.

- **Remake picture**는 기본 그림에서 이 날씨 버전을 다시 그립니다.
- **Remake windows**는 이미지 모델에 창문 마스크를 다시 요청합니다. 비가 쿠션 위에 내리거나 창문에 내리지 않을 때 쓰세요.
- **No moving weather**는 이 방의 마스크를 끕니다. 이 방의 날씨 버전에는 날씨에 따른 색감과 번개만 나타납니다. **Remake windows**로 다시 켤 수 있습니다.

작동하지 않는 경우: 채팅의 World State에 **Weather**(날씨)가 표시되는지(또는 아래의 날씨 확인을 켰는지), **Illustrator**가 이미지 모델과 함께 채팅에 추가되어 있는지 확인하세요.

## 배경의 시간대별 버전

켜면 배경이 이야기 속 시계를 따릅니다. 여관에 밤이 찾아오면 Illustrator가 밤의 여관을 다시 그립니다. 밖은 어두운 하늘이고 안에는 등불과 촛불이 켜집니다. 장소, 배치, 카메라는 그대로이며 조명만 바뀝니다.

1. **채팅 설정 → 에이전트 → Illustrator**를 여세요.
2. **배경의 시간대별 버전**를 켜세요.

날씨 버전처럼 기존 그림에서 시작할 수 있는 이미지 모델이 필요합니다.

작동 방식:

- 시간대는 **새벽**, **낮**, **일몰**, **밤**의 네 가지입니다. World State의 시간이 결정합니다. 시각(`7:40 PM`, `21:15`)이 우선이며, 없으면 "해 질 무렵", "자정", "이른 아침" 같은 표현을 사용합니다. 오전 5시 전과 오후 8시부터는 밤, 오전 5~7시는 새벽, 오전 7시~오후 5시는 낮, 오후 5~8시는 일몰입니다.
- 그림은 그릴 당시의 시간대를 보여 주는 것으로 간주합니다. Illustrator는 직접 그린 그림의 시간대를 기억합니다. 다른 그림은 파일 이름이나 태그의 시간 단어(`tavern-night.png`, `#sunset`)를 사용하고, 나머지는 낮으로 간주합니다. 따라서 낮 그림에는 밤 버전을, 밤 그림에는 낮 버전을 만들며 밤 버전을 또 만들지는 않습니다.
- 그림과 시간대 조합마다 **한 번만** 그리며 이후에는 무료로 다시 표시합니다. 원본 옆에 `name--tod-night.png`로 저장합니다(`--tod-dawn`, `--tod-day`, `--tod-sunset`도 사용).
- 날씨 버전도 켜져 있으면 한 그림에 둘 다 반영합니다. 비 오는 밤은 `name--wx-rain--tod-night.png`이며 기본 그림에서 한 번 그립니다. 날씨만 바뀌면 시간대는 유지되고 반대도 마찬가지입니다.
- Illustrator 실행 주기뿐 아니라 매 답변 후 시간을 확인하므로 World State 시계가 밤이 되는 즉시 밤 그림을 표시합니다. 이는 시간대에만 해당합니다. 새 장소는 여전히 Illustrator 실행이나 아래의 새 장소 확인을 기다립니다.
- 시간대 버전에는 이미 하늘이 있으므로 그 위에 그리는 하늘 색조, 해, 달, 별은 덜 두드러집니다.
- World State에 시간이 없으면 판단 모델 확인으로 알 수 있습니다(아래 참고).

시간대 버전이 표시되는 동안 날씨 그림과 같은 줄이 나타납니다. 예를 들어 **이 밤 사진**와 **사진 다시 만들기**가 표시됩니다.

배경 라이브러리에서는 기본 그림 아래에 버전이 모입니다. 카드에는 개수가 표시되며 열면 **날씨 및 시간대별 버전**에 목록이 나옵니다.

## Decision 모델로 답변마다 확인하기

Illustrator는 보통 실행 간격에 따라 장면을 확인하므로 새 장소의 배경이 나올 때까지 답변 몇 개를 기다릴 수 있습니다. 예 또는 아니요로 답하는 작은 모델인 [Decision 모델](../connections/decision-models.md)로 답변마다 확인할 수 있습니다.

시작하기 전에: Connections 페이지의 **기본값**에서 판단 모델을 선택하고 **장면 배경 생성**, **배경의 날씨별 버전**, **배경의 시간대별 버전** 중 원하는 조합을 켜세요.

1. **Chat Settings → Agents → Illustrator**를 여세요.
2. **결정 모델 확인**에서 **장면이 새 장소로 이동함**, **날씨가 바뀜**, **시간대가 바뀜** 같은 확인을 하나 고르거나, **새 장소, 날씨 및 시간대 변경**처럼 켜진 확인을 모두 선택하세요. 켜진 설정에 해당하는 확인만 표시됩니다. 기본값은 **비활성화됨**입니다.

답변마다 다음을 수행합니다.

- 새 장소 확인은 최신 메시지에서 장면이 새로운 장소로 이동하는지 묻습니다. 그렇다고 답하면 그 장소에 배경을 마련하며, 가능하면 이미 가진 그림을 재사용합니다. 프롬프트 모델은 그렇다는 답이 나온 뒤에만 새 배경을 작성합니다.
- 날씨 확인은 최신 메시지에서 날씨가 바뀌는지 묻습니다. 그렇다고 답하면 현재 배경의 날씨 버전을 표시하거나 그립니다. World State에 날씨가 없으면 Decision 모델이 날씨 종류도 고릅니다.
- 시간대 확인은 최신 메시지에서 시간대가 바뀌는지 묻습니다. 그렇다면 현재 배경의 시간대 버전을 보여 주거나 그립니다. World State에 시간이 없으면 판단 모델이 새벽, 낮, 일몰, 밤도 선택합니다.
- 이 확인은 동작할 기회만 추가합니다. Illustrator 자체 실행과 World State의 장소 변경도 계속 반영됩니다.
- 답이 없으면(모델 없음, 시간 초과, 오류) 확인을 건너뜁니다.

작동하지 않는 경우: Decision 모델을 고르지 않으면 목록이 회색으로 비활성화되고 모델을 고를 곳을 알려 줍니다.

## 전송 전에 프롬프트 검토하기

1. **Settings → Media → Generation Defaults**(설정 → 미디어 → 생성 기본값)를 여세요.
2. **Expose media prompts before sending**(전송 전에 미디어 프롬프트 표시)을 켜세요.

그러면 생성할 배경을 포함해 이미지 요청마다 **Review Image Prompt** 창이 열립니다. 프롬프트와 부정 프롬프트를 수정한 다음 **Generate**(생성)를 클릭해 전송하거나 **Cancel**(취소)을 클릭해 중단하세요. 입력한 글은 적은 그대로 전송됩니다.

## 관련 가이드

- [이야기를 따라 바뀌는 배경](../roleplay/backgrounds.md): 채팅에 표시할 그림, 고정된 장소와 갤러리 배경입니다.
- [배경 라이브러리](../appearance/chat-backgrounds.md): 그림 업로드, 태그 지정, 정리와 흐림 효과입니다.
- [Illustrator 에이전트](illustrator-agent.md): 장면 삽화, 클립과 실행 간격입니다.
- [채팅 갤러리](../chats/chat-gallery.md): Gallery 섹션과 버튼입니다.
- [Decision 모델](../connections/decision-models.md)
