# 모양 설정

이 가이드에서는 Marinara의 색상, 글자 크기, 간격, 배경, 채팅 버튼과 창을 바꾸는 **Appearance**(모양) 탭을 설명합니다. 옆에 있는 **Conversation**(대화), **Roleplay**(롤플레이), **Game**(게임) 탭에서는 각 채팅 모드의 스타일을 정합니다.

다른 내용을 찾고 있다면 아래 가이드를 참고하세요.

- 미리 만들어진 스타일이나 나만의 테마: [사용자 지정 CSS 테마](custom-css-themes.md)
- 다른 폰트: [사용자 지정 폰트와 Google Fonts](fonts.md)
- 채팅 배경 이미지: [배경 라이브러리](chat-backgrounds.md)
- 채팅에서 캐릭터 고유의 모습: [카드 CSS 테마 가이드](card-css-theming.md)

## 모양 설정 열기

1. **Library → Settings**(라이브러리 → 설정)를 여세요.
2. **Appearance** 탭을 클릭하세요.
3. 탭 아래 줄에서 섹션 이름을 클릭해 바로 이동하거나 스크롤하세요.

| 탭 | 섹션 |
| --- | --- |
| **Appearance** | **Theme**(테마), **Fonts & Text Size**(글꼴 및 텍스트 크기), **Accessibility**(접근성), **Text Colors**(텍스트 색상), **Layout**(레이아웃), **Effects**(효과), **Backgrounds**(배경), **Chat Buttons & Windows**(채팅 버튼 및 창), **CSS Themes**(CSS 테마) |
| **Conversation** | **Conversation Layout**(대화 레이아웃), **Conversation Background**(대화 배경) |
| **Roleplay** | **Tracker Panel**(트래커 패널), **Roleplay Messages**(롤플레이 메시지), **Avatars**(아바타), **Visual Novel**(비주얼 노벨) |
| **Game** | **Game Text**(게임 텍스트), **Game Art**(게임 아트), **Game Assets**(게임 에셋) |

처음부터 다시 시작하려면 **Theme** 맨 위의 **Reset Appearance**(외형 초기화)를 클릭하세요. 겉모습이 Marinara 기본값으로 돌아가고, 현재 채팅의 배경이 지워지며, 사용자 지정 테마도 꺼집니다.

클래식 레이아웃에서는 이 섹션들이 **Appearance** 탭의 **App**(앱), **Conversation**, **Roleplay**, **Game** 버튼 네 개 안에 있습니다.

## 테마

| 설정 | 하는 일 |
| --- | --- |
| **Visual Style**(비주얼 스타일) | **Default (Marinara)**는 글로우 효과가 있는 레트로 Y2K 스타일입니다. **SillyTavern**은 깔끔하고 미니멀한 스타일입니다. 겉모습만 바꾸며, SillyTavern에서 데이터를 가져오는 기능과는 아무 관계가 없습니다. **Stage**는 새 레이아웃의 자두색, 황동색, 진홍색을 사용합니다. |
| **New layout (UI overhaul preview)**(새 레이아웃(UI 개편 미리보기)) | 기본값은 켜짐입니다. 클래식 레이아웃으로 돌아가려면 끄세요. 이 가이드들은 새 레이아웃을 먼저 설명합니다. |
| **Look on this device**(이 기기의 모양) | 기본값인 **Same as my other devices**(다른 기기와 동일)는 비주얼 스타일, 색상, 폰트, 사용자 지정 테마를 모든 기기에서 공유합니다. **Only this device**(이 기기만)를 고르면 휴대폰은 밝게, 컴퓨터는 어둡게 쓰는 것처럼 이 기기만 다른 모습으로 설정할 수 있습니다. |
| **Color Scheme**(색상 구성) | **Dark**(어둡게, 기본값), **Light**(라이트), **Follow system**(시스템 설정 따르기), **Follow time of day**(시간대 따르기) 중에서 고릅니다. 마지막 옵션은 이 기기의 시계를 기준으로 지정한 시간에 전환합니다. |
| **Custom Mouse Pointer**(사용자 지정 마우스 포인터) | 기본값은 켜짐입니다. Marinara의 강조 색상 커서를 사용합니다. 시스템 커서를 쓰거나 사용자 지정 테마에 커서를 맡기려면 끄세요. |
| **Accent Color**(강조 색상) | 버튼, 활성 아이콘, 포커스 링, 하이라이트, 외곽선의 색상입니다. 기본값은 분홍, 주황, 청록이 섞인 **Marinara Gradient**(Marinara 그라디언트)입니다. |
| **Accent Pulse**(강조 효과) | 강조 색상이 부드럽게 밝아졌다 어두워지거나 그라데이션의 색 사이를 순환하게 합니다. 기본값은 데스크톱에서 켜짐, 휴대폰에서 꺼짐입니다. |
| **RGB Mode**(RGB 모드) | 강조 색상이 무지개 색을 따라 순환하게 합니다. 저장해 둔 **Accent Color**는 바뀌지 않습니다. 기본값은 꺼짐입니다. |

**Accent Color**는 단색이나 그라데이션을 받습니다. 그라데이션은 두 가지 이상의 색이 부드럽게 섞이는 표현입니다. 기본값으로 되돌리려면 **Reset to default**(기본값으로 초기화)를 클릭하세요. 앱 배경은 Dark 또는 Light 모드를 따르며, 사용자 지정 테마에서 자체 배경을 정할 수도 있습니다. **Accent Pulse**와 **RGB Mode**는 한 번에 하나만 켤 수 있습니다.

## 글꼴 및 텍스트 크기

- **Font**(폰트)는 앱 폰트를 정합니다. [사용자 지정 폰트와 Google Fonts](fonts.md)를 참고하세요.
- **Display Size**(디스플레이 사이즈)는 이 기기에서 앱 전체의 기준 글자 크기를 정합니다. 변경 사항은 즉시 적용됩니다.

| 선택지 | 크기 |
| --- | --- |
| **Tiny**(매우 작음) | 12 px |
| **Small**(작음) | 14 px |
| **Medium**(중간) | 16 px |
| **Default** | 17 px |
| **Large**(큼) | 19 px |
| **Huge**(매우 큼) | 22 px |
| **Extra large**(매우 크게) | 26 px |
| **Extra extra large**(매우 매우 크게) | 30 px |
| **Maximum**(최대) | 34 px |

- **Chat Font Size**(채팅 폰트 사이즈)는 채팅 메시지 글자 크기를 정하는 슬라이더입니다. 범위는 12 px에서 72 px까지이고, 기본값은 16 px입니다.

## 접근성

| 설정 | 하는 일 |
| --- | --- |
| **Line spacing**(줄 간격) | 메시지와 긴 글의 줄 사이 간격입니다. **Default**(기본값), **Relaxed (1.6)**(여유롭게 (1.6)), **Loose (1.8)**(넉넉하게 (1.8)), **Double (2.0)**(두 배 (2.0)) 중에서 고릅니다. 메뉴와 버튼은 크기를 유지합니다. |
| **Letter spacing**(글자 간격) | 앱 전체의 글자 사이 간격입니다. **Default**, **A little wider**(조금 넓게), **Wider**(넓게), **Widest**(가장 넓게) 중에서 고릅니다. |
| **High contrast**(고대비) | 텍스트, 테두리, 포커스 색상을 더 선명하게 표시합니다. **Follow system**을 고르면 기기에서 더 높은 대비를 요청할 때 켜집니다. |
| **Strong focus rings**(강한 포커스 링) | 키보드로 선택한 항목에 굵은 윤곽선을 표시합니다. <kbd>Tab</kbd>을 누르면 **Skip to content**(콘텐츠로 건너뛰기) 링크도 표시됩니다. |
| **Reduce motion**(동작 줄이기) | 애니메이션, 전환, **Accent Pulse**, 테마 효과를 멈춥니다. 기기에서 동작 줄이기를 요청하면 자동으로 켜집니다. |
| **Theme art strength**(테마 아트 강도) | 사용자 지정 테마의 배경 그림과 오버레이(비, 낙엽, 주사선)가 얼마나 진하게 보일지 정합니다. 테마의 그림 때문에 글을 읽기 어렵다면 낮추세요. |
| **Colour-blind-safe colours**(색각 이상 친화 색상) | 상태 점, 게이지, 삭제 버튼에 초록색과 빨간색 대신 파란색과 주황색을 사용합니다. |

## 텍스트 색상

- **Chat Text Color**(채팅 글자색)는 메시지 본문의 기본 글자 색입니다. 기본값은 Dark에서 `#d4d4d4`, Light에서 `#1a1025`입니다.
- **Default Dialogue Color**(기본 대사 색상)는 캐릭터나 페르소나에 자체 Dialogue Highlight Color가 없을 때 따옴표 안의 대사에 쓰입니다. 카드에 지정된 색상이 우선합니다. **Chat Buttons & Windows**에서 **Apply preset colors**(프리셋 색상 적용)가 켜져 있는 동안에는 대사에 그 스타일의 글자 색상이 쓰입니다.
- **Chat Chrome Text Color**(채팅 UI 텍스트 색상)는 트래커 위젯, 폴더 라벨, 설정 설명문, 채팅 버튼으로 여는 창처럼 채팅 주변 컨트롤의 글자 색을 정합니다. 기본값은 **Chat Text Color**와 같습니다.
- **Text Outline / Stroke**(텍스트 윤곽선 / 스트로크)는 글자에 윤곽선을 넣어 복잡한 배경 위에서도 읽기 쉽게 합니다. 색상을 정하고 **Width**(굵기)를 0에서 5 px 사이로 지정하세요. 기본값은 0.5 px이고, 0으로 두면 윤곽선이 꺼집니다.

## 레이아웃

- **Desktop sidebar width**(데스크톱 사이드바 너비)는 컴퓨터에서 양쪽 사이드바의 너비를 정합니다. **Reset width**(너비 초기화)를 누르면 원래대로 돌아갑니다. 휴대폰은 기존 배치를 유지합니다.
- **Show Android status bar**(Android 상태 표시줄 표시)는 Android 앱에서 휴대폰의 상태 표시줄을 보여 줍니다.

## 효과

- **Dynamic weather effects (rain, snow, fog, etc.)**(동적 날씨 효과(비, 눈, 안개 등))는 기본값이 켜짐입니다. 이야기 속 날씨와 시간대에 맞춰 날씨를 보여 주며, 해당 채팅에서 **World State**(월드 트래커) 에이전트가 켜져 있어야 합니다. [에이전트: 채팅을 도와주는 AI](../agents/agents-overview.md)를 참고하세요.
- **Reduce Ambient Animations & Effects**(앰비언트 애니메이션 및 효과 줄이기)는 장식용 애니메이션, 파티클, 회전하는 미리보기, 텍스트가 서서히 나타나는 효과를 멈춥니다.

- **주사위 굴림을 텍스트로 표시**(기본값 꺼짐)는 주사위 애니메이션 대신 주사위와 각 결과, 합계를 짧은 텍스트로 보여 줍니다. 주사위는 계속 굴러가며 모델과 게임도 결과를 받습니다. 기술 판정의 주사위를 포함해 모든 채팅 모드에 적용됩니다.
- **Reduced paint effects**(렌더링 효과 간소화)는 부담이 큰 반투명 패널과 그림자를 단순하게 바꿔 느린 기기에서도 매끄럽게 작동하도록 합니다.

## 배경

이 섹션에는 **Chat Background**(채팅 배경화면) 선택기와 **Background Blur**(배경 흐림)가 있습니다. 선택기에는 현재 채팅의 배경(또는 **Default background**(기본 배경))과 최근에 고른 배경이 표시됩니다. 다른 배경을 고르려면 그림이나 **Browse library**(라이브러리 찾아보기)를 클릭하세요. 다음 설정도 있습니다.

- **Conversation background image opacity**(대화 배경 이미지 불투명도): Conversation 모드에서 채팅 배경이 얼마나 진하게 보일지 정합니다.
- **Chat background behind side panels**(사이드 패널 뒤에 채팅 배경 표시): 열린 채팅의 배경을 부드럽게 처리해 사이드바와 상단 표시줄 뒤까지 펼칩니다.
- **Chat List Backgrounds**(채팅 목록 배경): 채팅 목록에서 각 채팅의 배경을 행 뒤에 은은한 배너로 보여 줍니다. **Active & Hovered**, **Every Row**, **Off** 중에서 고르세요.

[배경 라이브러리](chat-backgrounds.md)를 참고하세요.

## 채팅 버튼 및 창

**Chat widget style**(채팅 위젯 스타일)은 이동 가능한 채팅 버튼, 창, 섹션의 모습을 정합니다. **Default**, **Dottore**(차가운 파란색, 옅은 금속, 잘린 모서리), **Prof. Mari**(금색 테두리의 동화책 프레임) 중에서 고르세요. 하나를 고르면 아래 컨트롤이 초기화됩니다.

| 컨트롤 | 하는 일 |
| --- | --- |
| **Font** | **Preset font**(프리셋 폰트), **App font**(앱 폰트), **Sans serif**(산세리프), **Storybook serif**(동화책 세리프), **Technical monospace**(기술용 고정폭) 중에서 고릅니다. |
| **Shape**(모양) | **Preset shape**(프리셋 모양), **Rounded**(둥근 모서리), **Square**, **Cut corners**(잘린 모서리), **Arched**(아치형) 중에서 고릅니다. |
| **Button size (px)**(버튼 크기(px)) | 이동 가능한 채팅 버튼과 아이콘의 크기를 바꿉니다. 32에서 96 사이의 값을 입력하거나, 비워 두면 기본값을 씁니다. |
| **Border & Buttons Color**(테두리 및 버튼 색상), **Background Color**(배경 색상), **Text Color**(텍스트 색상) | 세 가지 주요 색상입니다. 하나를 초기화하면 프리셋과 Dark 또는 Light 모드를 따릅니다. |
| **Apply preset font**(프리셋 폰트 적용), **Apply preset shape**(프리셋 모양 적용), **Apply preset colors** | 그 스타일을 메시지, 입력란, 채팅 컨트롤에도 적용합니다. 기본값은 꺼짐입니다. |

Professor Mari에게 사용자 지정 채팅 스타일을 만들어 달라고 할 수 있습니다. 채팅에서 요청하세요.

## CSS 테마

미리 만들어진 테마와 직접 만들거나 가져온 테마를 다룹니다. [사용자 지정 CSS 테마](custom-css-themes.md)를 참고하세요.

## Conversation 탭

- **Conversation Layout**에 있는 **Chat Layout**(채팅 레이아웃)은 Conversation 메시지의 표시 방식을 바꾸며, 실시간 미리보기를 보여 줍니다. **Linear**(기본값)는 채팅 형식의 행으로, **Bubbles**는 메신저 형식의 말풍선으로 표시합니다.
- **Avatar Shape**(아바타 모양)는 **Circular**(원형) 또는 **Square**(사각형)입니다. 아바타 크기는 그대로입니다.
- **Profile pictures on phones**(휴대폰 프로필 사진)는 모든 채팅 모드에서 휴대폰의 메시지 옆에 표시할 사진을 정합니다. 기본값인 **Mini**(미니)는 캐릭터 이름 앞과 내 이름 뒤에 작은 사진을 배치해 메시지가 전체 너비를 유지하게 합니다. **Full**(전체)은 사진 열을 유지하고, **Off**(끔)는 사진을 숨깁니다. 태블릿과 컴퓨터에서는 항상 전체 사진을 표시합니다.
- **Conversation Background**에 있는 **Conversation Theme**(대화 테마)는 모든 Conversation 채팅 뒤에 깔리는 두 색상 그라데이션을 정합니다. **Dark** 탭과 **Light** 탭은 각자 그라데이션을 따로 가집니다. 채팅별 설정이 아니라 모든 Conversation 채팅에 적용되는 기본값입니다.

스와이프 메뉴 스위치는 **Settings → Chatting → Editing & Swipes**(설정 → 채팅 → 편집 및 스와이프)에 있습니다.

## Roleplay 탭

**Tracker Panel**은 Roleplay 채팅 옆의 스탯, 옷차림, 위치 패널의 모양을 정합니다. [Roleplay HUD와 트래커](../roleplay/hud-and-trackers.md)를 참고하세요.

**Roleplay Messages**

| 설정 | 하는 일 | 기본값 |
| --- | --- | --- |
| **Chat position**(채팅 위치) | 넓은 화면에서 메시지와 입력 상자가 놓일 위치입니다. **Left**(왼쪽), **Center**(가운데), **Right**(오른쪽) 중에서 고릅니다. 휴대폰에서는 화면 너비를 그대로 씁니다. | **Center** |
| **Custom chat width**(사용자 지정 채팅 너비) | 메시지 열의 너비를 직접 정합니다. | 꺼짐 |
| **Roleplay Messages Background Opacity**(롤플레이 메시지 배경 불투명도) | 값을 낮추면 말풍선 너머로 배경이 비쳐 보입니다. 카드와 프리셋의 반투명 색상보다 우선합니다. | 90% |
| **Stretch Messages**(메시지 너비 늘리기) | 모든 메시지가 행 전체를 채워 짧은 메시지도 긴 메시지와 나란히 정렬됩니다. | 꺼짐 |
| **Hide line under names**(이름 아래 선 숨기기) | 이름 아래의 가는 선을 없앱니다. | 꺼짐 |

**Avatars**

| 설정 | 하는 일 | 기본값 |
| --- | --- | --- |
| 아바타 스타일 | **None**(없음), **Small Circles**(작은 원형), **Small Rectangles**(작은 직사각형), **Glued Side Panel**, **Faded Side Panel**(페이드 사이드 패널) 중에서 고릅니다. 마지막 옵션은 넓은 초상화가 메시지 안으로 서서히 흐려지도록 표시합니다. | **Small Circles** |
| **Scrollable Avatars**(스크롤 가능한 아바타) | 긴 메시지를 스크롤하는 동안에도 아바타가 계속 보이게 합니다. | 꺼짐 |
| **Narrator's Cycling Avatars**(내레이터 아바타 순환), **Narrator's Avatar Borders**(내레이터 아바타 테두리) | Narrator 아바타의 표시 방식입니다. | |
| **Message avatar scale**(메시지 아바타 크기) | 75%에서 250%까지입니다. | 100% |
| **Default sprite scale**(기본 스프라이트 배율) | 50%에서 175%까지입니다. 채팅별로 지정한 스프라이트 크기가 계속 우선합니다. | 100% |

**Visual Novel**

**Visual Novel display**(비주얼 노벨 표시)는 완성된 문단을 한 번에 하나씩, 대화 초상화와 설정해 둔 스프라이트와 함께 보여 줍니다. 새 Roleplay 채팅과 별도 설정이 없는 채팅의 표시 방식을 정합니다. **Auto-play VN paragraphs**(VN 문단 자동 재생), **Paragraph delay**(문단 지연 시간), **Dialogue portrait scale**(대화 초상화 배율), **Full-body sprite scale**(전신 스프라이트 크기)로 재생 방식을 정합니다.

**Show Thinking In Messages**(메시지에 추론 표시)와 **Don't Collapse Thinking**(생각 접지 않기)은 **Settings → Chatting → Thinking**(설정 → 채팅 → 추론)에 있습니다.

## Game 탭

**Game Text**

- **Instantly reveal game text**(게임 텍스트 즉시 표시)는 타이핑 효과를 건너뜁니다.
- **Mouse-wheel + click navigation**(마우스 휠 + 클릭 탐색)은 마우스로 이야기를 넘길 수 있게 합니다.
- **Game narration speed**(게임 내레이션 속도)와 **Game auto-play segment delay**(게임 자동 재생 구간 간격)는 글이 나타나고 다음으로 넘어가는 속도를 정합니다.
- **Game Dialogue Display**(게임 대사 화면): 기본값인 **Classic Dialogue Box**는 구간 하나를 보여 주며, 지난 대사는 **Logs**(로그)에 있습니다. **History Above Dialogue Box**는 이전 구간을 대화 상자 위쪽에 표시합니다.
- **Game text effects**(게임 텍스트 효과, 기본값 켜짐)는 극적인 단어, 모두 대문자로 쓴 강조, 괄호 속 방백, 텍스트 효과 태그에 애니메이션을 적용합니다. 평범한 텍스트로 보려면 끄세요.

**Game Art**에는 슬라이더가 두 개 있습니다. **Dialogue portrait scale**(75%에서 175%, 기본값 100%)과 **Full-body sprite scale**(75%에서 275%, 기본값 135%)입니다.

**Game Assets**는 [게임 에셋](../game/game-assets.md)에서 설명합니다.

## 이 기기에만 저장되는 설정

Appearance 설정 대부분은 다른 기기와 동기화됩니다. **Display Size**와 **Chat Font Size**는 동기화되지 않으며, 지금 쓰는 브라우저에 저장됩니다. 한 기기만 완전히 다른 모습으로 쓰려면 **Theme**의 **Look on this device**를 사용하세요. 무엇이 동기화되는지는 [설정 개요](../settings/settings-overview.md)를 참고하세요.

## 관련 가이드

- [사용자 지정 CSS 테마](custom-css-themes.md)
- [사용자 지정 폰트와 Google Fonts](fonts.md)
- [배경 라이브러리](chat-backgrounds.md)
- [카드 CSS 테마 가이드](card-css-theming.md)
- [설정 개요](../settings/settings-overview.md)
