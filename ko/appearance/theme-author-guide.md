# 테마 작성자 가이드

이 가이드에서는 직접 테마를 만들거나 공유하는 방법을 설명합니다. 앞부분에서는 코딩 경험 없이도 첫 테마를 만들 수 있도록 단계별로 안내합니다. 나머지는 테마로 바꿀 수 있는 모든 색상, 그림, 부분과 모든 테마에 적용되는 안전 규칙을 정리한 참조 자료입니다. 테마 선택, 체험, 가져오기, 제거 방법은 [사용자 지정 CSS 테마](custom-css-themes.md)를 참고하세요.

**토큰 규약 버전 1**(`:root`의 `--mari-tokens-version: 1`). 이 가이드의 이름은 릴리스가 바뀌어도 계속 사용할 수 있습니다. 이름을 바꿔야 할 때는 버전이 올라가며, 끝부분의 [변경 사항](#changes)에 변경 내역을 기록합니다. 그 외의 모든 항목(다른 `--ov-*`, `--mari-*`, `--marinara-*` 변수, Tailwind 클래스, 요소 구조)은 내부 구현이며 업데이트할 때마다 바뀔 수 있습니다.

## 첫 테마를 단계별로 만들기

테마는 웹 페이지의 색상과 폰트를 지정하는 언어인 CSS로 작성한 짧은 설정 목록입니다. CSS를 몰라도 시작할 수 있습니다. 각 줄은 `--name: value;` 형식입니다. **토큰**(`--`로 시작하는 이름이 있는 설정), 콜론, 값, 세미콜론으로 이루어집니다.

1. **Library → Settings → Appearance**(라이브러리 → 설정 → 모양)를 열고 섹션 목록에서 **CSS Themes**(CSS 테마)를 클릭하세요.
2. 시작용 테마를 바꾸려면 **Browse the theme gallery**(테마 갤러리 찾아보기)에서 마음에 드는 테마를 다운로드하고, **Starter themes**(시작용 테마)에서 찾아 **Clone + Edit**(복제 후 편집)(복사 아이콘)를 클릭하세요. Marinara가 "Petal OS (내 사본)" 같은 이름으로 내 사본을 만들고 편집기에서 엽니다. 시작용 테마는 읽기 전용으로 유지되므로 원본은 항상 남습니다. 처음부터 만들려면 **Create Theme**(새 테마)를 클릭하세요. 템플릿에서 `/*`와 `*/` 사이에 있는 줄은 꺼져 있습니다. 해당 줄을 둘러싼 이 표시를 지우면 켜집니다.
3. 이름 입력란에 이름을 입력하세요.
4. 색상을 바꾸세요. `--primary: #3fae7a;` 같은 줄을 찾아 색상을 바꾸세요. `#3fae7a`는 16진수 색상 코드입니다. 웹의 색상 선택기에서 코드를 얻을 수 있습니다. `teal` 같은 이름도 사용할 수 있습니다.
5. **Preview**(미리보기)를 켜 두세요. 입력하는 동안 앱이 바뀌므로 각 변경 사항을 바로 볼 수 있습니다.
6. 편집기 아래를 확인하세요. **No CSS problems found.**(CSS 문제가 없습니다.)는 CSS에 문제가 없다는 뜻입니다. 문제가 있으면 누락된 `;`나 `}`처럼 각 문제와 줄 번호가 표시됩니다.
7. **Save**(저장)를 클릭하세요. 새 테마가 켜지고 Marinara가 **Keep this theme?**(이 테마를 유지할까요?)라고 묻습니다. 15초 안에 **Keep theme**(테마 유지)를 클릭하지 않으면 이전 모양으로 돌아갑니다.

대부분 처음에 바꾸는 토큰은 다음과 같습니다.

|토큰|색상이 적용되는 곳|
| ---------------- | -------------------------------------------- |
| `--background`   | 모든 요소 뒤의 페이지 |
| `--foreground`   | 주요 텍스트 |
| `--primary`      | 버튼, 링크, 강조 표시 |
| `--card`         | 카드와 패널 |
| `--sidebar`      | 채팅 및 Library 사이드바 |
| `--border`       | 요소 둘레의 선 |
| `--mari-font-ui` | 앱 폰트, 예: `"Georgia", serif` |

간단한 테마 예시입니다.

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

`:root { … }`에는 모든 색상 구성에 적용되는 설정을 넣습니다. `[data-theme="dark"] { … }`에는 Dark(다크)에만, `[data-theme="light"] { … }`에는 Light(라이트)에만 적용되는 설정을 넣습니다. 작업 중 전체 토큰 목록을 보려면 편집기 아래의 **CSS Variable Reference**(CSS 변수 참조)를 열거나 아래의 [색상 토큰](#colour-tokens)을 참고하세요.

### 그림과 폰트 추가하기

편집기 아래의 **Pictures and sharing details (author, version, thumbnail, fonts)**(그림 및 공유 정보, 작성자, 버전, 썸네일, 폰트)를 열고 **Add pictures**(그림 추가)를 클릭하세요. 그림 이름을 클릭하면 CSS의 커서 위치에 들어갑니다. 그림을 넣을 수 있는 위치는 [그림](#pictures)과 [배경 그림](#backdrops)을 참고하세요.

그림과 폰트는 테마 안에 들어 있어야 합니다. 테마는 다른 웹사이트에서 아무것도 불러올 수 없으므로 CSS에 그림이나 Google Font 링크를 넣어도 작동하지 않습니다.

### Professor Mari에게 아트 제작 요청하기

**Connections**(연결)에 이미지 모델(Codex, NovelAI, ComfyUI, OpenAI 이미지 모델 등)을 설정해 두었다면 Professor Mari가 테마용 그림을 만들어 넣어 줄 수 있습니다. "내 Harbor 테마에 밤하늘 배경을 만들어 줘"나 "Home 카드에 황동 프레임을 넣어 줘"처럼 일상적인 말로 요청하세요.

1. Mari는 사용자가 직접 만든 테마만 수정합니다. 시작용 테마는 먼저 **Clone + Edit**를 클릭한 뒤 사본을 수정해 달라고 요청하세요.
2. Mari가 그림 프롬프트를 직접 작성하고 그대로 이미지 모델에 보냅니다. 보통 캐릭터 아트용으로 설정하는 이미지 스타일 프로필과 프롬프트 접두사는 제외하므로 배경 대신 인물화가 나오는 일을 막습니다.
3. Mari는 각 그림을 직접 확인한 뒤 설명합니다. 작은 그림은 확대하고 투명한 부분은 회색 위에 표시해 확인하며, 변경하기 전에 사용자도 그림을 볼 수 있습니다. 고를 수 있도록 여러 버전을 요청하거나(한 번에 최대 4개), "위쪽 절반으로 잘라 줘", "흰 배경을 투명하게 해 줘", "더 작게 해 줘"처럼 수정을 요청하세요. 수정할 때마다 새 버전이 만들어지고 이전 버전도 남습니다.
4. 동의하면 Mari가 그림을 테마에 저장하고(**Add pictures**와 같은 방식으로 WebP로 저장) 테마 CSS에 넣습니다. 직접 추가한 그림처럼 **Pictures and sharing details**(그림 및 공유 정보)에 표시됩니다.

레일, 울타리, 보내기 버튼 같은 장식 그림은 SVG 그림입니다. Mari가 이미지 모델 없이 직접 색상을 바꿀 수 있으며 선명함도 유지됩니다.

그림마다 이미지 모델이 처리하는 만큼 시간이 걸리며, 보통 30초에서 1분 30초 정도입니다. 이미지 연결에서 직접 만든 ComfyUI 워크플로를 쓰는 경우 워크플로에 들어 있는 텍스트는 그대로 전송됩니다.

### 테마 공유하기

1. **Pictures and sharing details**에서 **Author**(작성자), **Version**(버전)(예: `1.0`), **Description**(설명), **Thumbnail**(썸네일)을 입력하고 **Made for**(대상)에서 Dark, Light 또는 둘 다를 고르세요. 테마와 함께 색상과 폰트를 제안하려면 **Settings**(설정) 아래의 **Use my current Appearance**(현재 모양 설정 사용)를 클릭하세요. 저장하세요.
2. 테마 행의 **Export**(내보내기)(업로드 아이콘)를 클릭하세요. Marinara가 CSS, 그림, 폰트가 들어 있는 `.json` 파일 하나를 저장합니다.
3. 다른 사람이 만든 아트나 폰트를 사용했다면 텍스트 편집기에서 파일을 열고 크레딧과 라이선스를 추가하세요. [테마 파일](#theme-files)을 참고하세요.
4. 파일을 보내세요. 받는 사람은 **Import File**(테마 가져오기)로 가져오며, 설치 전에 작성자 이름, 크레딧, 테마가 바꾸는 항목 목록을 확인합니다.

### 문제가 생겼을 때

Marinara는 테마가 무엇을 하든 상단 바, 사이드바, <kbd>Ctrl</kbd>+<kbd>K</kbd>, 메시지 입력란을 사용할 수 있게 유지합니다. 테마가 이 중 하나를 숨기거나 옮기거나 가리면 Save에서 문제를 알려 줍니다. **Save anyway**(그래도 저장)를 선택할 수는 있지만, Marinara는 테마가 해당 요소에 문제를 일으키는 즉시 그 탭에서 테마를 끕니다. 언제든 기본 모양으로 돌아가려면 <kbd>Esc</kbd>를 세 번 누르거나, 주소 끝에 `?safe`를 붙이거나, <kbd>Ctrl</kbd>+<kbd>K</kbd>를 누르고 "Custom theme"(사용자 지정 테마)을 입력하세요.

시작용 테마는 배우기 좋은 예시입니다. 하나를 복제하고 CSS를 읽으면서 아래의 토큰과 부분 훅을 어떻게 쓰는지 살펴보세요.

## 테마가 우선 적용되는 방식

앱 자체 CSS는 `index.html` 맨 앞에 선언된 캐스케이드 레이어에 들어 있습니다.

```
mari-protected, mari-theme-important, theme, base, components, utilities, mari-app, mari-pickers
```

- 테마는 **레이어에 속하지 않으므로** 테마의 일반 선택자는 `!important`가
  없는 모든 앱 규칙보다 우선합니다. 앱 규칙의 명시도는 상관없습니다.
- `mari-pickers`에는 Appearance의 선택기(배경, 강조 색상, 폰트, 채팅
  색상)가 들어 있습니다. 앱 기본값보다 높고 테마보다 낮으므로 테마
  색상이 선택기보다 우선하며, 테마가 선택기를 재정의하면 Appearance에서 알려 줍니다.
- 테마의 `!important`도 작동합니다. 해당 규칙은
  `mari-theme-important`에 복사되어 앱 자체 `!important` 규칙보다 우선합니다.
- `mari-protected`는 상단 바, 채팅 사이드바, Library 사이드바, Ctrl+K를 제자리에 유지합니다. 테마는
  스타일(색상, 폰트, 테두리, 모서리 반경, 그림자)을 바꿀 수 있지만 숨기거나 옮기거나 줄이거나
  가릴 수는 없습니다. 시도하면 해당 탭에서 테마가 꺼지고 사용자에게 이유를 알려 줍니다.
- 전환은 시작 전 대기 시간이 최대 1초입니다(`transition-delay` 또는 `transition`의 두
  번째 시간). 화면을 검사한 지 한참 뒤에 무언가 나타나는 일을 막기
  위해 이보다 오래 지연하는 테마는 거부됩니다. 애니메이션은 지연 시간에 제한이 없습니다.

되돌아가는 방법은 항상 작동합니다. URL의 `?safe`, **Escape 세 번 누르기**, Ctrl+K >
"Custom theme"으로 테마를 끕니다. 새 테마는 "Keep this theme?"라고 묻고 15초 뒤에 되돌아갑니다.

## 색상 토큰

### 기본 토큰(모든 비주얼 스타일에서 정의)

`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`,
`--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`,
`--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`,
`--destructive-foreground`, `--border`, `--input`, `--ring`, `--radius`,
`--sidebar`, `--sidebar-foreground`, `--sidebar-border`, `--sidebar-accent`, `--sidebar-accent-foreground`.

값은 완전한 CSS 색상입니다(`#1b1530`, `rgb(…)`, `oklch(…)`). `270 25% 8%`처럼 HSL
숫자 세 개만 쓰는 형식(shadcn 관례)은 여기서 **유효하지 않습니다**.

`[data-theme="light"]`와 `[data-theme="dark"]`로 라이트와 다크의 범위를 따로 지정하세요.

### 새 레이아웃

|토큰|용도|
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `--ov-line`                                                      | 가는 선과 패널 테두리 |
| `--ov-text`, `--ov-muted`, `--ov-dim`                            | 텍스트, 보조 텍스트, 흐린 텍스트 |
| `--ov-accent`                                                    | 강조 지점(기본값은 `--primary`) |
| `--ov-hover`, `--ov-active-bg`                                   | 마우스를 올리거나 누를 때의 배경 |
| `--ov-mode-conversation`, `--ov-mode-roleplay`, `--ov-mode-game` | 채팅 사이드바와 편집기의 채팅 모드 색상 |
| `--ov-serif`                                                     | 제목 폰트(`--mari-font-heading`을 따름) |
| `--mari-selected-tint`                                           | 선택된 행, 알약 모양 표시, 토글. 기본값은 중립 색상(`--foreground`)입니다. 강조 색상으로 선택을 표시하려면 `var(--primary)`로 설정하세요 |
| `--mari-selected-bg`, `--mari-selected-ring`                     | 강조 색조에서 파생(10%와 18%) |

### 테마 토큰(v1)

각 토큰은 기본적으로 앱 자체 모양을 따릅니다. 라이트 모드에는 가독성을 유지하는 별도 값이 있습니다.

|토큰|용도|
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `--mari-font-ui`                                                                                         | 앱 전체 폰트 |
| `--mari-font-heading`                                                                                    | 페이지와 섹션 제목 |
| `--mari-font-chat`                                                                                       | **Roleplay**(롤플레이)와 **Conversation**(대화) 채팅의 메시지 텍스트 |
| `--mari-mode-conversation`, `--mari-mode-roleplay`, `--mari-mode-game`                                   | Home의 칩, 최근 채팅, 새 채팅 런처, Home 위젯의 제목 위 작은 라벨 |
| `--mari-home-pink`, `--mari-home-violet`                                                                 | 그 외 Home 위젯의 강조 색상 |
| `--mari-status-online`, `--mari-status-idle`, `--mari-status-dnd`, `--mari-status-offline`               | 접속 상태 점과 라벨 |
| `--mari-gauge-ok`, `--mari-gauge-warn`, `--mari-gauge-danger`                                            | 게임 게이지와 HP 바. 정상 상태에서는 위젯 자체 색상이 여전히 우선하며, 위험 상태에서는 항상 토큰을 사용합니다 |
| `--mari-game-combat`, `--mari-game-combat-text`                                                          | 게임의 Combat 버튼 |
| `--mari-stage-empty-bg`                                                                                  | 장면 이미지가 로드되기 전 게임 무대(그라데이션을 포함한 모든 `background`) |
| `--mari-scrim`                                                                                           | Ctrl+K 뒤의 어두운 배경 |
| `--mari-user-avatar-placeholder`                                                                         | 그림이 없을 때의 내 아바타(그라데이션) |
| `--mari-art-saturation-1`, `--mari-art-lightness-1`, `--mari-art-saturation-2`, `--mari-art-lightness-2` | 그림 없는 카드의 그라데이션. 각 카드의 색조는 유지됩니다. 이 값을 백분율로 설정해 그라데이션을 차분하게 만들 수 있습니다 |
| `--mari-app-backdrop`                                                                                    | 앱 전체 뒤에 한 번 그리는 이미지 또는 그라데이션(아래 참고) |
| `--mari-accent-fx-animation`                                                                             | Accent Pulse(강조 효과)나 RGB Mode(RGB 모드)가 켜져 있을 때의 애니메이션. 그 외에는 `none` |

### v1.1에서 추가된 테마 토큰

테마가 값을 설정하기 전까지는 값이 없으므로 그때까지는 사용자 설정이 적용됩니다.

|토큰|용도|
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-text-outline`                                                                                                                                                                                                        | 메시지 텍스트 윤곽선. 예를 들어 `0`은 끄기, `1px #3b2a1a`는 윤곽선 지정입니다. 설정하지 않으면 사용자의 Text Outline(텍스트 윤곽선 / 스트로크) 설정을 따릅니다 |
| `--mari-dialogue-color`                                                                                                                                                                                                      | 캐릭터나 페르소나 자체 대사 색상이 없을 때의 대사 색상(자체 색상이 있으면 여전히 우선) |
| `--mari-chat-font-size`                                                                                                                                                                                                      | 메시지 텍스트 크기. Accessibility(접근성)의 최솟값은 계속 적용됩니다 |
| `--mari-composer-placeholder`                                                                                                                                                                                                | 메시지 입력란 플레이스홀더를 따옴표로 묶은 문자열로 지정합니다: `"> waiting for user input..."`. `:root` 또는 `[data-composer="game"]` 같은 입력란 하나에 설정하세요. 키나 비밀번호를 요구하는 텍스트는 무시됩니다 |
| `--mari-page-veil`                                                                                                                                                                                                           | 배경 그림 위에서도 긴 글을 읽기 쉽도록 Settings, Library, 편집기, Docs 위에 덮는 색상. 기본값은 `transparent`입니다 |
| `--mari-page-floor` | 배경 위에서 모든 전체 페이지가 올라가는 거의 불투명한 판. 기본값은 `color-mix(in srgb, var(--background) 94%, transparent)`이며, `transparent`로 없앨 수 있습니다 |
| `--mari-top-bar-bg`                                                                                                                                                                                                          | 상단 바의 전체 `background` 값: 이미지, 그라데이션 또는 여러 레이어. `--mari-top-bar-rendering: pixelated`는 픽셀 아트를 선명하게 유지합니다. 탭과 아이콘은 항상 위에 표시됩니다 |
| `--mari-top-bar-plate`, `--mari-top-bar-plate-radius`                                                                                                                                                                        | 상단 바 아트 위에서 모든 탭, 열린 채팅 탭, 아이콘 버튼, 로고는 읽기 쉽도록 받침 배경 위에 놓입니다. 이 토큰은 받침의 색상과 모서리 반경(기본값 `0.5rem`)을 설정합니다. 네모난 픽셀 버튼은 반경을 `0`으로 설정하세요 |
| `--mari-tab-row-strip-bg`, `--mari-tab-row-strip-height`, `--mari-tab-row-strip-room` | 상단 바의 탭 아래 띠(뉴스 티커, 울타리)는 그룹 행이 보일 때 그 행으로 이동합니다(`:root[data-ov-tabrow]`; 행은 `[data-tab-row]`). `[data-tab-row]`에 `background`, 높이, 탭 아래 차지할 공간을 지정하세요(기본값은 높이, `0px`이면 뒤에 배치). `[data-mari-part="tab-row-strip"]`은 애니메이션을 줄 수 있습니다. `:root[data-ov-tabrow]`일 때 바의 띠는 직접 제거하세요. |
| `--mari-msg-head-rule`                                                                                                                                                                                                       | Roleplay 메시지에서 이름 아래의 선(`none` 또는 `2px dashed currentColor` 같은 `border-bottom` 값) |
| `--mari-home-widget-border`, `--mari-home-widget-border-width`, `--mari-home-widget-radius`, `--mari-home-widget-bg`                                                                                                         | Professor Mari를 포함한 모든 Home 위젯의 프레임과 바탕 |
| `--mari-home-widget-font`, `--mari-home-widget-title-font`, `--mari-home-widget-title-size`, `--mari-home-widget-title-color`, `--mari-home-widget-eyebrow-size`, `--mari-home-widget-text-size`, `--mari-home-widget-muted` | Home 위젯의 글자 스타일. 텍스트에 공간이 더 필요하면 위젯이 텍스트를 자르는 대신 높이를 늘립니다 |
| `--mari-home-widget-eyebrow-color`, `--mari-home-widget-action-size`, `--mari-professor-sprite-scale`                                                                                                                        | 위젯 제목 위의 작은 라벨, Professor Mari의 Ask(Mari 교수님에게 묻기) 버튼 텍스트, Mari 그림의 크기(1 = 기본값) |
| `--mari-home-wash`                                                                                                                                                                                                           | Home이 배경 그림 위에 덮는 색조(기본값: 카드 색상의 65%). `transparent`는 아트를 원래 강도로 표시합니다 |
| `--mari-home-art`                                                                                                                                                                                                            | `none`은 Home 카드의 기본 그림을 숨깁니다. 지연 로딩하므로 숨긴 그림은 다운로드하지 않습니다. 이는 개별 카드(What's new, Around the table) 안의 작은 그림이며 Home 배경이 아닙니다. Home 뒤의 아트는 앱 배경 그림입니다 |
| `--mari-ambient` (및 `-opacity`, `-blend`, `-animation`)                                                                                                                                                                    | 앰비언트 오버레이: 앰비언트 오버레이 절 참고 |
| `--mari-icon-send`, `--mari-icon-stop`, `--mari-icon-attach`, `--mari-icon-emoji`                                                                                                                                            | 메시지 입력란 아이콘 대신 쓸 그림(`background-image` 값) |
| `--mari-cursor`, `--mari-cursor-pointer`                                                                                                                                                                                     | 그림 포인터(전체 `cursor` 값). 테마가 켜져 있는 동안 Custom Mouse Pointer보다 우선합니다 |

### v1.4에서 추가된 테마 토큰

v1.1 토큰처럼 첫 번째 그룹은 테마가 값을 설정하기 전까지 아무 효과가 없습니다.

|토큰|용도|
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-message-time`                                                                          | 모든 채팅 모드의 메시지 시간 색상(`[data-mari-part="time"]`) |
| `--mari-chat-wash`                                                                             | Roleplay 채팅 배경 위에 덮는 색조로, 전체 `background` 값입니다. 기본값은 어두운 색조이며 Light에서는 라벤더빛 흰색입니다. `none`으로 제거합니다 |
| `--mari-lore-constant`, `--mari-lore-selective`, `--mari-lore-normal`                          | 로어북 항목 상태 점 |
| `--mari-toast-font-size`                                                                       | 토스트 텍스트 크기(토스트는 이미 `--mari-font-ui`를 사용) |
| `--mari-home-shortcut-size`, `--mari-home-shortcut-desc-size`                                  | Home의 Learn(엔진 배우기) 및 Community(커뮤니티) 바로가기 줄. `--mari-home-widget-text-size`만 설정하면 그 값을 따르며, 설명은 0.85배 크기입니다 |
| `--mari-min-ui-text`                                                                           | 앱에서 가장 작은 텍스트(9~12px 라벨, 개수, 칩)의 하한. Tailwind의 `--text-xs`, `--text-sm`, `--text-base`도 설정할 수 있습니다 |
| `--mari-user-avatar-image`                                                                     | 페르소나에 그림이 없을 때 쓸 내 아바타 그림. 토큰이 없으면 이제 페르소나 자체 그림이 있는 경우 자리 표시자에 그 그림이 표시됩니다 |
| `--mari-focus-frame`, `--mari-window-title`, `--mari-ambient-placement`, `--mari-ambient-mask` | 슬롯. 아래 참고 |

다음 토큰은 앱에 고정되어 있던 값을 대체하며, 설정하지 않으면 기본 모양을 사용합니다.

|토큰|용도|
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-chrome-accent`                                                              | 활성 탭 밑줄, 편집기 외곽, 선택 상자, 연결 화면 |
| `--mari-chrome-muted`                                                               | 패널, 사이드바, Home의 회색 보조 텍스트(기본값: 외곽 UI 텍스트의 58%) |
| `--mari-resource-accent`, `--mari-resource-<type>`                                  | Library의 유형별 색상: `characters`, `personas`, `lorebooks`, `presets`, `connections`, `agents`, `settings`, `backgrounds`, `browser` |
| `--mari-ctrlk-conversation`, `--mari-ctrlk-roleplay`, `--mari-ctrlk-game`           | Ctrl+K 행의 모드별 색상 |
| `--mari-game-combat-bg`, `--mari-game-combat-bg-hover`, `--mari-game-combat-border` | Game의 Combat 버튼(두 배경은 전체 `background` 값이므로 그라데이션을 쓸 수 있습니다. 단색 레이어도 넣으세요) |
| `--mari-accent-text`                                                                | 작은 텍스트나 아이콘(활성 탭, 섹션 라벨, 링크)의 강조 색상. 기본값: 읽을 수 있을 만큼만 Light에서 어둡게, Dark에서 밝게 조정한 강조 색상 |
| `--mari-top-bar-plate-active`                                                       | 상단 바에 아트가 있을 때 활성 컨트롤 뒤의 받침 배경(기본값: 받침에 강조 색상 20%를 혼합) |
| `--mari-chat-header-bg`                                                             | Conversation 헤더 뒤에서 서서히 사라지는 배경(기본값: 88% 페이지 색상에서 투명해짐. 앱 배경 그림 아래에서는 `none`) |
| `--mari-home-hero-padding`, `--mari-home-widget-glow`                               | Home 인사말의 안쪽 여백과 Home 위젯 헤더 뒤의 빛 효과 |

앱은 `<html>`에 `--mari-top-bar-height`도 제공합니다. 이는 상단 바의 실제 높이이며 테마가 바를 높이면
함께 바뀌므로, 테마에서 자체 레이어를 그 아래에 배치할 여백을 줄 수 있습니다.

### v1.5에서 추가된 테마 토큰

긴 답변과 이전에 내부 클래스가 필요했던 부분을 위한 토큰입니다. 기본값이
명시된 경우를 제외하면 테마가 값을 설정하기 전에는 아무 효과가 없습니다.

|토큰|용도|
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-chat-column`                                       | 메시지와 메시지 입력란이 함께 쓰는 Roleplay 열(기본값 58rem). 사용자의 Chat settings → Chat width(채팅 설정 → 채팅 영역 너비)가 여전히 우선합니다 |
| `--mari-message-measure`                                   | 메시지 텍스트의 최대 줄 길이, 예: `68ch`(Roleplay 및 Conversation) |
| `--mari-chat-line-height`                                  | 모든 채팅 모드의 메시지 줄 높이(기본값 1.5). Accessibility → Line spacing(접근성 → 줄 간격)이 여전히 우선합니다 |
| `--mari-dialogue-weight`                                   | 따옴표로 묶인 대사(`[data-mari-part="dialogue"]`)의 굵기. 예를 들어 `400`으로 설정하면 긴 대사가 굵은 글자 덩어리가 되는 일을 막습니다 |
| `--mari-dialogue-color`                                    | 이제 테마의 `--mari-chat-*` 색상이 채팅 색상 표시를 켤 때도 적용되며, 테마에서 지정한 기울임꼴과 링크 색상도 함께 표시됩니다 |
| `--mari-paragraph-gap`                                     | 빈 줄 하나 대신 쓸 문단 간격, 예: `0.85em` |
| `--mari-pinned-speaker`, `--mari-pinned-speaker-bg`        | `on`: 긴 Roleplay 답변을 스크롤하는 동안 이름 줄이 채팅 상단에 고정됩니다(데스크톱 및 태블릿). 배경은 기본적으로 말풍선 배경을 따릅니다 |
| `--mari-pinned-speaker-top`, `--mari-pinned-speaker-bleed` | 고정된 줄의 위치(기본값: 보이는 채팅의 위쪽 가장자리)와 텍스트 바깥으로 뻗는 거리(기본값 1rem) |
| `--mari-phone-avatar`                                      | `hidden`: 휴대폰의 Roleplay에서 아바타 열을 없애 답변이 전체 너비를 사용합니다 |
| `--mari-mini-avatar-size`, `--mari-mini-avatar-ring`       | 휴대폰에서 이름 옆의 작은 그림(**Profile pictures on phones: Mini**(휴대폰 프로필 사진: 미니), 기본값): 크기와 `box-shadow`로 지정하는 테두리입니다. `data-role`(`user`, `assistant`)이 있는 `[data-mari-part="mini-avatar"]`입니다 |
| `--mari-phone-convo-avatar`                                | `full`: 사용자가 **Mini**(미니)를 선택했어도 휴대폰의 Conversation 채팅에서 전체 아바타 열을 유지합니다 |
| `--mari-vn-fade`                                           | 문단의 나머지가 아래에 있을 때 VN 텍스트 상자 하단에 나타나는 페이드(기본값 1.75rem, `0`으로 끄기) |
| `--mari-message-actions`, `--mari-swipe-counter`           | 메시지 아래 도구와 "2 / 5" 스와이프 카운터의 색상 |
| `--mari-card-art-placeholder`                              | 그림 없는 Library 카드의 무작위 색조 그라데이션 대신 쓸 전체 `background` |
| `--mari-chat-row-art-opacity`                              | 채팅 사이드바에서 열린 채팅 행 뒤의 그림(기본값 0.14, `0`으로 숨기기) |
| `--mari-chrome-accent`, `--mari-chrome-accent-gradient`    | 이제 `<html>`에서 강조 색상을 읽는 영역(Convo / Roleplay / Game 탭, 외곽 UI 테두리)에도 적용됩니다 |
| `--mari-focus-frame-outset`                                | 포커스 프레임이 영역 바깥으로 뻗는 거리(길이, 최대 2rem, 슬롯 참고) |
| `--mari-scrim`                                             | 대화 상자 뒤의 어두운 레이어 |
| `--mari-confirm-scrim`                                     | 간단한 확인 대화 상자 뒤의 밝은 반투명 레이어(밝은 테마의 차분함을 유지하려면 연하게 설정) |

앱은 테마에 앰비언트 오버레이가 있는 동안 `<html>`에 `--mari-center-x`도 제공합니다. 이는
채팅 창의 가로 중심으로, 사이드바가 열려 있든 닫혀 있든 마스크가 글을
읽는 열을 가리지 않게 할 수 있습니다. `--mari-gutter-mask`가 이 값을 사용합니다.

## 그림

테마는 테마 파일의 `images`에 그림을 담고 CSS에서 이름으로 사용합니다.

```css
:root {
  --mari-app-backdrop: url("theme:night.webp");
}
[data-mari-part="home-widget"] {
  border-image: url("theme:frame.webp") 24 fill / 24px stretch;
}
```

- 그림은 256KiB CSS 제한이 아니라 6MiB 패키지 예산에 포함되므로 원래 크기의 아트를 넣을 수 있습니다.
- 편집기에서 **Pictures and sharing details**를 열고 **Add pictures**를 누르세요. PNG와
  JPEG는 추가할 때 WebP로 저장됩니다(작은 그림은 무손실이므로 픽셀 아트와 9슬라이스 프레임이 선명하게
  유지되며 긴 쪽은 최대 2560px입니다). 그림 이름을 클릭하면 커서 위치에 `url("theme:name")`이 들어갑니다.
- 테마를 가져올 때도 같습니다. `data:` URL로 인라인 작성된 그림은 CSS에서
  `images`로 옮겨지고 정지 PNG와 JPEG는 WebP로 바뀝니다. 미리보기에는 모든 그림과 크기가 표시됩니다("Keep
  the original files instead"(대신 원본 파일 유지 (용량 큼)) 체크 상자도 있습니다).
- `theme:` 이름은 테마의 `backgrounds`도 이름으로 찾으므로 채팅 배경 갤러리용으로
  포함한 아트를 사용자가 갤러리에 추가했는지와 상관없이 CSS에서도 쓸 수 있습니다.
- 테마가 적용되면 모든 그림은 짧은 동일 출처 `blob:` URL이
  됩니다. 다운로드하는 항목은 없으며 여러 곳에 쓰는 그림도 한 번만 디코딩합니다.
- GIF, APNG, 애니메이션 WebP, `<animate>`가 있는 SVG는 움직이는 그림으로 분류합니다.
  가져오기 미리보기에 이 사실을 표시하며 Reduce motion(동작 줄이기)을 켜면 첫 프레임으로 표시합니다.

## 배경 그림

앱 뒤에 아트를 그리려면 `:root`에 `--mari-app-backdrop`을 설정하세요.

```css
:root {
  --mari-app-backdrop: url("theme:city.webp");
  --mari-app-backdrop-position: bottom center;
  --mari-app-backdrop-rendering: pixelated;
}
```

앱 전체 아래의 고정된 전용 레이어(`[data-mari-part="app-backdrop"]`)에 한 번 그리므로
Home 장식이나 라이트 색상 구성이 가리지 않습니다. 채팅 뒤에도 표시됩니다.
Roleplay, Conversation, Game 영역이 투명해지고 기본 채팅 배경은 물러납니다.
사용자가 채팅용으로 고른 배경은 여전히 그 위에 표시됩니다. 패널은 `--card`와
`--sidebar`를 유지하므로 뒤의 아트를 보이게 하려면 이 값을 반투명하게
설정하고 전체 페이지에 색조를 더하려면 `--mari-page-veil`을 쓰세요. 페이지에 전용 패널을
주려면 `[data-mari-part="page"]`의 스타일을 지정하세요(훅 참고). 여기에는 모든 Library 페이지,
편집기, Settings, Docs가 들어 있으므로 Lorebooks에도 Characters와 같은 패널이 적용됩니다. 배경 위에서는 모든 전체 페이지가 `--background`로 된 거의 불투명한 판(`--mari-page-floor`, 기본 94%) 위에도 놓이므로 긴 목록과 편집기를 읽기 쉽습니다. `--mari-page-floor`를 다른 색으로 바꾸거나, 그림이 더 보이도록 `transparent`로 설정하세요. `[data-mari-part="page"]`를 `!important`로 꾸미는 테마는 이 판 대신 자체 패널을 씁니다.

|토큰|기본값|
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-app-backdrop`            | 이미지 또는 그라데이션 하나 |
| `--mari-app-backdrop-size`       | `cover`(타일은 `auto`나 `64px`도 사용해 보세요) |
| `--mari-app-backdrop-position`   | `center` |
| `--mari-app-backdrop-repeat`     | `no-repeat` |
| `--mari-app-backdrop-attachment` | `fixed` |
| `--mari-app-backdrop-rendering`  | `auto`(픽셀 아트는 `pixelated`) |
| `--mari-app-backdrop-layers`     | 여러 레이어가 있는 전체 `background` 값. 예: `url(city.webp) bottom / 100% auto no-repeat, radial-gradient(#fff3 1px, transparent 1px) 0 0 / 12px 12px, #fbe3ef`. 단일 이미지 토큰보다 우선합니다 |

사용자 지정 이미지는 테마에서 가장 자유롭게 활용할 수 있는 부분입니다. 배경 그림, 상단
바 띠, Home 위젯 프레임, 메시지 프레임(`border-image` 또는 부분 훅의 `background`), 타일 패턴, 포함된
픽셀 폰트는 모두 테마 파일 안에 들어가며 가져오기 미리보기에 나열됩니다. 사용자의 Appearance > Accessibility
> Theme art strength(모양 > 접근성 > 테마 아트 강도)는 배경 그림과 앰비언트 오버레이를
흐리게 하며 High contrast(고대비)는 강도를 25% 이하로 유지합니다. 테마는 어느 쪽도 취소할 수 없습니다.

## 앰비언트 오버레이

`--mari-ambient`는 채팅과 페이지 위이면서 상단 바와 두 사이드바 **아래**인 레이어의
전체 `background` 값을 받습니다. 비, 낙엽, 주사선, 비네트를 넣을 수 있습니다.

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

`--mari-ambient-blend`는 `mix-blend-mode`를 설정하며 `[data-mari-part="ambient"]::before`와 `::after`로 레이어 두 개를 더
쓸 수 있습니다. 이 레이어는 클릭을 받지 않고 Reduce motion을
켜면 움직임을 멈춥니다(그림도 정지 프레임이 됩니다). 대부분 투명한 상태를 유지해야
하며 앰비언트 레이어가 채팅을 가리는 테마는 꺼집니다. 보호 기능이 앱을
가리는 것으로 판단하는 전체 화면 `body::after` 대신 이 레이어를 쓰세요.

레이어는 아무도 볼 수 없는 동안 멈춥니다. 앱이 백그라운드에 있을 때(다른 탭이나
앱에 포커스가 있을 때), 휴대폰과 태블릿에서 Library 페이지, 편집기, Settings 같은 전체
페이지가 채팅을 가릴 때가 해당합니다. 테마의 다른 부분에 있는 무한 반복 애니메이션도
백그라운드에서 일시 중지됩니다. 멈춘 위치부터 이어지므로 중요한 동작의 시점을 여기에 맞추지 마세요.

채팅 자체 배경은 `<img data-mari-part="backdrop">` 입니다. 기본 배경(고른 배경이
없는 경우)에는 `data-default-background="true"`도 있으므로 테마가 이것만 바꿀 수 있습니다.

```css
img[data-mari-part="backdrop"][data-default-background] {
  opacity: 0 !important;
}
```

## 날씨

이야기에 날씨가 있으면(World State 에이전트가 켜진 상태에서 Settings > Appearance > Effects > Dynamic weather effects(설정 > 모양
> 효과 > 동적 날씨 효과(비, 눈, 안개 등))), 앱이 채팅 위에 비, 눈, 안개, 꽃잎, 별, 해
또는 달을 그립니다. 테마는 `--mari-weather-*` 토큰으로 이 모든 요소의 스타일을 바꾸고 자체 아트도 날씨에 맞게 바꿀 수 있습니다.

처음이라면 [테마의 날씨](theme-weather.md)에서 그림과 함께 단계별 안내를 확인하세요.

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

그리기는 여전히 앱이 모두 처리합니다. 테마를 로드할 때, 색상 구성이 바뀔
때, 테마를 편집할 때 이 토큰을 읽고 각 값을 검사하며 알 수
없는 값은 무시합니다. 따라서 낮과 밤 또는 채팅별 날씨도 다른 토큰처럼 작동합니다.

|토큰|값|
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-weather-style`           | `smooth`(기본값) 또는 `pixel`: 레이어를 낮은 해상도로 그려 선명하게 확대하고 입자는 정사각형 칸으로 표시합니다 |
| `--mari-weather-pixel-size`      | 2~6(칸당 px), 기본값 3 |
| `--mari-weather-<kind>-color`    | 단순 색상(`#hex`, 색상 이름, `rgb()`, `hsl()`). 그라데이션이나 그림은 사용할 수 없습니다 |
| `--mari-weather-<kind>-image`    | 테마 자체 그림을 최대 4개 지정합니다: `url("theme:a.png") url("theme:b.png")`. 각 입자가 하나를 고릅니다. smooth 스타일에서는 나뭇잎, 꽃잎, 재가 회전하며 떨어집니다 |
| `--mari-weather-<kind>-size`     | 0.5~3배. pixel 스타일에서는 그림 자체 크기에 이 값을 곱해 그리므로 픽셀 아트의 픽셀이 유지됩니다(아트 픽셀 = 크기 x 1px) |
| `--mari-weather-<kind>-shape`    | `round` 또는 `square`(smooth 스타일. "데이터 눈"이나 불꽃에는 정사각형 사용) |
| `--mari-weather-amount`          | 0.25~1: 테마는 날씨를 줄일 수만 있고 늘릴 수는 없습니다 |
| `--mari-weather-speed`           | 0.5~1.5배 |
| `--mari-weather-strength`        | 입자가 표시되는 강도의 0.5~1.5배(어두운 도시의 가는 비) |
| `--mari-weather-tint-strength`   | 기본 하늘 색조의 0~1배(비가 올 때 파란색, 밤에는 어두운 색) |
| `--mari-weather-rain-length`     | 빗줄기 길이의 0.5~3배 |
| `--mari-weather-sun`, `-moon`    | 배경 그림에 해나 달이 이미 있으면 `none` |
| `--mari-weather-lightning-color` | 섬광 색상. 강도와 타이밍은 앱의 부드럽고 뇌전증에 안전한 값을 유지합니다 |
| `--mari-weather-lightning-bolt`  | `on`, `none` 또는 0.5~3(너비): 섬광마다 왼쪽이나 오른쪽에 갈라진 번개를 그리고 함께 사라지게 합니다 |

종류: `rain`, `snow`, `hail`, `fog`, `dust`, `leaf` (바람 부는 날씨), `petal` (꽃이 피는
날씨), `ember`, `ash`, `sand`, `firefly`, `star`, `aurora`, 그리고 `sun`과 `moon` (색상, 크기, 그림 하나).

### 날씨에 따라 바뀌는 아트

채팅의 날씨가 표시되는 동안 `<html>`에는 고정 목록에서 고른 두 단어가 들어갑니다(이야기 자체 텍스트는 쓰지 않습니다).

|속성|값|
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `data-mari-weather` | `clear`, `cloudy`, `rain`, `storm`, `snow`, `hail`, `fog`, `sand`, `ash`, `embers`, `wind`, `blossom`, `aurora` |
| `data-mari-sky`     | `dawn`, `day`, `dusk`, `night`                                                                                  |
| `data-mari-shelter` | `indoors` 또는 `outdoors`(앱이 판단할 수 없으면 없음) |

실내에서는 입자, 안개 덩어리, 해, 달, 별을 그리지 않고 색조와 번개 섬광만 표시하므로 테마의
날씨 토큰은 실외에서만 보입니다. 속성은 Reduce Ambient Animations(앰비언트 애니메이션 및 효과 줄이기)가 켜져 있는지와 상관없이
설정되며(배경 교체는 움직이지 않습니다), 채팅에 날씨가 없거나 사용자가 날씨를 끄면 제거됩니다. 이를 사용해 비가
올 때 맑은 배경을 회색빛으로 바꾸거나 자체 앰비언트 레이어를 물려 날씨가 이중으로 표시되지 않게 하세요.

```css
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:street-overcast.webp");
}
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

### 사용자가 결정하는 항목

- 테마는 날씨를 켜거나 끌 수 없습니다. 사용자 토글이 결정합니다.
- Reduce Ambient Animations 또는 기기의 동작 줄이기 설정을 켜면 날씨를 전혀 그리지 않습니다.
- Reduced paint effects(렌더링 효과 간소화)는 색조, 빛 효과, 노을 색조를 제거하고 입자를 60%만 그립니다.
- Theme art strength는 배경 그림처럼 테마의 날씨도 흐리게 하며 High contrast는 강도를 25% 이하로 유지합니다.
- 모든 기기에서 패널, 편집기 또는 Mari가 채팅을 가리는 동안 날씨 그리기가 멈춥니다.

Petal OS(픽셀 날씨와 자체 꽃잎), NEON//GRID(청록색 빗줄기), Lantern Path(그려진 나뭇잎, 악천후에 회색빛으로
변하는 배경)는 실제 예시입니다. 하나를 **Clone + Edit**로 복제해 CSS를 읽어 보세요.

## 강조 효과

Accent Pulse와 RGB Mode는 CSS 필터로 새 레이아웃의 일부 강조 지점("+ New", 주요 버튼, 어시스턴트
아바타 타일)에 애니메이션을 적용합니다. 프레임마다 다시 쓰는 값은 없습니다. 테마에서는 다음 작업을 할 수 있습니다.

- `:root { --marinara-theme-accent-pulse: enabled; }`로 사용자에게 Accent Pulse를 켭니다.
- `animation: var(--mari-accent-fx-animation);`으로 자체 요소를 추가합니다.

둘 다 `prefers-reduced-motion`과 앱의 "Reduce ambient animations" 설정에 따라 멈춥니다.

## 훅

### `<html>`의 속성

|속성|값|
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `data-theme`                    | `dark`, `light`                                                                                          |
| `data-visual-theme`             | `default` (Marinara), `sillytavern` (Dottore), `stage`                                                   |
| `data-overhaul`                 | `on`(새 레이아웃, 데스크톱), `mobile`(새 레이아웃, 휴대폰 및 태블릿). 이전 레이아웃에는 없습니다 |
| `data-custom-theme`             | 활성 테마의 ID |
| `data-seasonal-theme`           | 계절별 모양이 켜져 있을 때 해당 모양 |
| `data-mari-accent-fx`           | 강조 효과가 실행 중이면 `pulse` 또는 `rgb` |
| `data-chat-id`                  | 열린 채팅의 ID |
| `data-chat-open-mode`           | 열린 채팅의 모드: `roleplay`, `conversation`, `game` |
| `data-chat-tags`                | 열린 채팅의 태그. 소문자이며 공백은 `-`로 바꿉니다. `:root[data-chat-tags~="horror"]`로 이야기 스타일을 지정합니다 |
| `data-mari-chat-art-behind`     | 채팅 배경이 사이드 패널 뒤에 표시되는 동안 존재합니다(`--mari-chat-art`가 그림) |
| `data-marinara-reduced-effects` | 앰비언트 애니메이션을 줄였을 때 존재합니다 |
| `data-mari-a11y-line-height`    | 사용자가 줄 간격을 넓혔을 때 존재합니다(`--mari-a11y-line-height`) |
| `data-mari-a11y-letter-spacing` | 사용자가 글자 간격을 넓혔을 때 존재합니다(`--mari-a11y-letter-spacing`) |
| `data-mari-a11y-focus`          | 강한 포커스 링이 켜져 있을 때 존재합니다 |
| `data-mari-contrast`            | 사용자가 선택하거나 기기가 요청해 고대비가 켜지면 `more` |
| `data-mari-cvd-safe`            | 색각 이상 친화 색상이 켜져 있을 때 존재합니다 |
| `data-mari-weather`             | 이야기의 날씨가 표시되는 동안 해당 날씨: `rain`, `snow`, `fog` 등([날씨](#weather) 참고) |
| `data-mari-sky`                 | 이야기의 날씨가 표시되는 동안 `dawn`, `day`, `dusk` 또는 `night` |
| `data-mari-shelter`             | 이야기의 날씨가 표시되고 앱이 위치로 판단할 수 있을 때 `indoors` 또는 `outdoors` |

### 영역

`[data-component="…"]`는 큰 영역의 이름을
지정합니다: `AppShell`, `TopBar`, `ChatSidebar`, `ChatSidebarSlot`,
`RightPanelDesktop`, `RightPanelDesktopSlot`, `CenterContent`, `GlobalOmnibar`, `OverhaulLibraryNav`,
`OverhaulSettingsPage`, `OverhaulLibraryPage`, `OverhaulCardGallery`, `OverhaulEditorHead`, `OverhaulEditorRail`.

### 부분

|선택자|설명|
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[data-mari-part="message"]`                                                           | 모든 채팅 모드의 메시지 행 하나. 채팅 전체 너비이며 내부에 아바타, 이름 줄, 말풍선이 있습니다. 모든 말풍선이 두 번째 상자 안에 들어가지 않도록 이 행 대신 말풍선(아래의 `bubble`)을 꾸미세요. `data-message-id`, `data-message-role`(`user`, `assistant`, `system` 등)과 아래의 메시지 데이터도 있습니다 |
| `[data-mari-part="bubble"]`                                                            | Roleplay와 Conversation의 메시지 말풍선 자체(`.mari-rp-bubble` / `.texting-bubble`). 배경, 테두리, 모서리 반경, 그림자를 여기에 설정합니다 |
| `[data-mari-part="message"][data-latest]`                                              | 캐릭터의 가장 최근 답변 |
| `[data-mari-part="message"][data-streaming]`                                           | 아직 작성 중인 답변 |
| `[data-mari-part="avatar"]`, `[data-mari-part="header"]`, `[data-mari-part="actions"]` | 메시지 내부의 아바타, 이름 줄, 메시지 도구 |
| `[data-mari-part="reasoning"]`, `[data-mari-part="reasoning-text"]`                    | 추론 토글(또는 상자)과 텍스트. 데스크톱과 휴대폰에서 같은 훅을 씁니다 |
| `[data-mari-part="composer"]`                                                          | 메시지 입력란. `data-composer`는 `roleplay`, `conversation` 또는 `game`입니다 |
| `[data-mari-part="home-art"]`                                                          | Home 카드의 기본 그림 |
| `[data-mari-part="message"][data-vn]`                                                  | 비주얼 노벨 대사 상자. 동일한 데이터(캐릭터, 역할, 인덱스)를 갖는 메시지이며 내부에 `avatar`와 `header` 부분이 있습니다 |
| `[data-mari-part="vn-sprite"]`                                                         | VN 대사 상자 뒤에서 장면 하단까지 이어지는 빈 레이어. 현재 화자의 `data-vn-speaker`(화자 이름의 슬러그 또는 역할), `data-vn-speaker-role`, `data-character`, `data-character-id`가 있으므로 테마에서 그 자리에 화자의 그림을 세울 수 있습니다. `[data-roleplay-vn-media]`에도 같은 속성이 있습니다 |
| `[data-mari-part="message"][data-game-narration]`                                      | Game 내레이션 상자. `data-message-role`은 `narrator`이며 캐릭터가 말하는 동안에는 `data-character`와 `data-character-name`이 있는 `assistant`입니다. `data-segment-type`과 `data-expression`은 현재 대사를 설명합니다 |
| `[data-mari-part="app-backdrop"]`, `[data-mari-part="ambient"]`                        | 배경 그림과 앰비언트 레이어. 페이지 내 위치는 고정되어 있으며 토큰으로 스타일을 지정합니다 |
| `[data-mari-part="home-widget"]`                                                       | Professor Mari를 포함한 Home 위젯 카드. 프레임에는 `data-home-widget-id`(`recent`, `professor`, `whats-new`, `character-library` 등)가 있습니다. 내부에는 `home-widget-eyebrow`, `home-widget-title`, `home-widget-text`가 있습니다 |
| `[data-mari-part="top-bar"]`                                                           | 모든 기기의 상단 바. 분할 보기의 두 번째 영역에는 같은 훅(`[data-component="TopBar"]`, `.ov-tab`, `.ov-tab__label`, `.ov-icon-btn`)을 가진 얇은 전용 바가 있고 `[data-split-bar]`로 표시되므로 상단 바 아트와 폰트가 여기에도 적용됩니다 |
| `[data-mari-part="page-title"]`                                                        | 주요 페이지의 큰 제목. 모든 Library 섹션(Characters, Lorebooks, Connections, Agents 등), Settings, Extensions, Docs가 해당합니다. 이 훅 하나로 페이지 제목 스타일을 지정하면 모든 페이지에서 일치합니다 |
| `[data-mari-part="backdrop"]`                                                          | 채팅 배경 이미지(배경 그림 참고) |
| `[data-mari-part="stage-empty"]`                                                       | 장면 이미지가 없는 게임 무대 |
| `[data-mari-part="time"]`                                                              | 모든 채팅 모드의 메시지 시간 |
| `[data-mari-part="chat-header"]`                                                       | Conversation 헤더(`data-chat-mode="conversation"`) |
| `[data-mari-part="game-hud"]`, `[data-mari-part="game-tools"]`                         | Game의 지도·파티 플로팅 영역과 내레이션 도구 행 |
| `[data-mari-part="avatar-placeholder"]`                                                | 빈 아바타 원. `data-role`은 `user` 또는 `assistant`입니다 |
| `[data-mari-part="header"][data-placement]`                                            | Roleplay 메시지에서 `outside`(말풍선 위의 이름) 또는 `inside` |
| `[data-mari-part="home-widget-glow"]`                                                  | Home 위젯 헤더 뒤의 빛 효과 |
| `[data-mari-part="dialogue"]`                                                          | 메시지에서 따옴표로 묶인 대사 |
| `[data-mari-part="paragraph-gap"]`                                                     | 두 문단 사이의 빈 줄(`--mari-paragraph-gap`을 설정하면 블록이 됨) |
| `[data-mari-part="vn-text"]`, `vn-counter`, `vn-nav`                                   | VN 텍스트 상자(아래로 더 스크롤할 수 있으면 `data-more-below`), "3 / 9" 카운터, Previous / Next 버튼(`data-direction`) |
| `[data-mari-part="card-art"]`                                                          | Library 카드의 그림. 그림이 없으면 `data-placeholder` |
| `[data-mari-part="page"]`                                                              | 모든 전체 페이지의 바탕: 각 Library 페이지(Characters, Lorebooks, Presets, Regex scripts, Connections, Agents, Custom tools), 모든 편집기, Settings, Docs. 모든 페이지에 읽기 쉬운 동일한 바탕을 적용하려면 특정 페이지의 클래스 대신 여기에 패널이나 시트를 그리세요. Chats와 Home은 여기에 포함되지 않습니다 |
| `[data-mari-part="chat-row-art"]`                                                      | 사이드바에서 열린 채팅 행 뒤의 그림 |
| `[data-mari-part="avatar-placeholder"]`                                                | 이제 빈 아바타가 표시되는 모든 곳에 있습니다. Conversation 메시지, 채팅 행(이니셜), 페르소나 전환기, 메시지 입력란, Game이 해당합니다 |
| `.ov-lrow__dot[data-status]`                                                           | 로어북 항목 점: `constant`, `selective` 또는 `normal` |
| `[data-chat-row]`                                                                      | 채팅 사이드바의 행. 열린 채팅에는 `data-selected="true"`가 있습니다 |
| `[data-chat-mode]`                                                                     | 모드별 채팅 영역 |
| `.mari-messages-scroll`                                                                | 스크롤하는 메시지 목록 |
| `.mari-rp-bubble`, `.mari-rp-bubble--user`, `.mari-message-assistant`                  | Roleplay와 Conversation 말풍선 |
| `.mari-window`, `.mari-drawer`                                                         | 팝아웃 창과 드로어 |

### 슬롯

이 부분은 활성 테마가 요청할 때만 나타나므로 기본 페이지에는 불필요한 부분이 추가되지 않습니다.

- **포커스 프레임.** `--mari-focus-frame`은 `url("theme:frame.png") 24 fill / 24px / 6px stretch` 같은 전체 `border-image`
  값을 받아 독자가 주목하는 곳에 그립니다. 최신 답변, Ctrl+K,
  열린 대화 상자, Home의 Recent chats(최근 채팅)가 해당합니다. 메시지
  템플릿의 다른 요소에도 프레임을 넣으려면 `data-mari-focus-surface`를 추가하세요. v1.5부터 프레임은
  `--mari-focus-frame-outset`으로만 영역 바깥으로 뻗을 수 있으며(최대 2rem), 값에 `fill`이
  있으면 전혀 뻗지 않아 채팅 위를 덮을 수 없습니다.
  `--mari-focus-frame` 안에 작성한 바깥쪽 확장 값은 무시됩니다. 프레임은 `border-image`
  이므로 CSS에서 같은 요소에 나중에 쓰는 `border` 단축 속성이
  이를 초기화합니다. 그 자리에서는 `border-color`, `border-width`, `border-style`을 대신 설정하세요.
- **창 제목.** `--mari-window-title`을 설정하면(`on` 등 어떤 값이든 가능)
  각 메시지, Home 위젯, 메시지 입력란 상단에 제목 행이
  추가됩니다. `data-window` (`message`, `home-widget`, `composer`, v1.5부터는 `narration`, `omnibar`, `window`, `dialog`도
  포함)가 있는 `[data-mari-part="window-title"]` 이며, `window-title-text` (화자, 위젯 제목 또는
  "Message")와 `_ [] X` 장식을 넣을 수 있는 빈 `window-buttons`가 들어 있습니다.
- **채팅 행 미리보기.** `--mari-chat-row-preview`를 설정하면(`on` 등 어떤 값이든 가능)
  Chats 목록에서 각 채팅 이름 아래에 최신 줄이 추가됩니다. `data-role`
  (`user`, `assistant`, `narrator` 등)이 있는 `[data-mari-part="chat-row-preview"]` 이며, `[data-mari-part="chat-row-preview-who"]` (내 메시지는
  "You:"(나:), 그룹 채팅은 화자 이름)로 시작합니다. 행의 실시간 상태 줄("typing…"(입력
  중…), "Unsent draft"(전송하지 않은 초안))이 있으면 자리를 내주므로 한 행에
  둘이 동시에 표시되지 않습니다. 토큰이 없으면 이 줄을 가져오거나 그리지 않습니다.
- **카드 뒤의 앰비언트.** `--mari-ambient-placement: behind-cards`는 앰비언트 레이어를 채팅 위가
  아니라 메시지, Home 위젯, 패널 아래로 옮깁니다(배경 그림보다는 위).
  `--mari-ambient-mask` (전체 `mask` 값)는 표시 영역의 형태를 정하며, `--mari-ambient-mask: var(--mari-gutter-mask)`는
  창 가운데를 비워 비가 텍스트 위가 아닌 양옆 여백에
  내리게 합니다. `--mari-gutter-clear`는 비워 둘 영역의 절반 너비(26rem)를 설정합니다.

### 메시지 데이터

모든 메시지에는 작성자, 번호, 소요 시간이 들어 있습니다. 선택자와
`attr()` 용 속성으로도, `content:`와 `counter()` 용 CSS 변수로도 제공됩니다.

|속성|변수|값|
| --------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `data-character-id`   |                    | 캐릭터 ID(내 메시지에는 없음) |
| `data-character-name` | `--mari-msg-char`  | 표시 이름(`--mari-msg-char`는 따옴표로 묶인 문자열) |
| `data-character`      |                    | 선택자용으로 이름을 소문자로 바꾸고 공백을 `-`로 바꾼 값: `[data-character="captain-faye"]` |
| `data-message-index`  | `--mari-msg-index` | "Message numbers"(메시지 번호 표시)에 표시되는 메시지 번호 |
| `data-gen-ms`         | `--mari-msg-gen`   | 생성 시간(ms). `--mari-msg-gen`은 `"3.2s"` 같은 문자열입니다 |

```css
[data-mari-part="message"] [data-mari-part="header"]::after {
  counter-reset: msg var(--mari-msg-index);
  content: "#" counter(msg) " · " var(--mari-msg-gen, "");
}
```

### 메시지 템플릿(HTML)

화자 이름과 메시지 번호를 담은 상태 상자처럼
CSS만으로 부족할 때는 테마 파일에 역할별 작은 HTML
템플릿을 넣을 수 있습니다. 메시지마다 값을 채워 메시지
끝의 `[data-mari-part="message-extra"]` 상자에 표시하며 CSS로 스타일과 위치를 정합니다.

```json
"templates": {
  "assistant": "<div class=\"status\"><b>{{char}}</b> · entry #{{index}} · {{gen}}</div>",
  "user": "<div class=\"status\">> {{char}} @ {{time}}</div>"
}
```

키: `message` (모든 역할), `assistant`, `user`, `narrator` (역할 자체 템플릿이
`message`보다 우선). 필드: `{{char}}`, `{{role}}`, `{{index}}`, `{{gen}}`, `{{time}}`, `{{date}}`. 알 수
없는 필드는 비워 둡니다. 각 템플릿은 최대 4,000자입니다. Marinara는 텍스트와 레이아웃
태그(`div`, `span`, `p`, `b`, `i`, `ul`, `table`, `details`, `progress` 등),
`class`, `title`, `role`, `data-*` 속성을 유지하고 스크립트, 스타일, 인라인 `style`, 링크,
이미지, 폼, 이벤트 속성은 제거합니다. 텍스트에서 키나 비밀번호를 요구하는 템플릿은 제외합니다.

HTML은 사용자가 허용해야 합니다. 템플릿이 있는 테마는 **Settings → Appearance → CSS Themes → Allow themes
with HTML**(설정 → 모양 → CSS 테마 → HTML이 포함된 테마 허용 (위험을 감수합니다))이 켜져 있을
때만 설치할 수 있습니다(기본값 꺼짐). 가져오기 미리보기에서 이를 경고하며, 스위치를 끄면 설치된 테마도 HTML 없이 표시됩니다.

## 채팅별 모양

Chat settings > Theme(채팅 설정 > 테마)에서 채팅 하나에 전용 테마를 줄
수 있습니다("Default look"(기본 모양)을 선택하면 해당 채팅의 사용자 지정 테마가 꺼집니다). 캐릭터가 정확히
한 명인 채팅에서는 선택한 테마를 그 캐릭터의 다른 일대일 채팅에 쓸 기본값으로 지정할
수 있습니다. 그룹 채팅과 게임 파티는 멤버 한 명의 기본값을 가져오지 않습니다. Theme
섹션에는 현재 모양의 출처가 채팅, 캐릭터, 앱 중 어디인지 표시됩니다. Settings, Library, 편집기,
Docs는 항상 앱 테마를 사용하며, `data-chat-id`와 `data-chat-tags`는 채팅 자체가 표시되는 동안에만 `<html>`에 있습니다.

태그를 사용하면 하나의 테마 안에서 특정 이야기의 스타일을 다른 환경에서도 적용할 수 있습니다:
`:root[data-chat-tags~="noir"] { --primary: #c9a227; }`. Chat settings > Chat Name(채팅 설정 > 채팅 제목)의 "+ Add tag"(태그
추가), 채팅 행의 태그 버튼 또는 터치 화면에서 길게 누르면 나오는 메뉴의 "Tags"(태그)로
태그를 추가하세요. 속성에서는 태그가 소문자로 바뀌고 공백은 `-`로 바뀌므로 "Noir Mystery"는 `noir-mystery`와 일치합니다.

`--mari-chat-*` 변수(예: `--mari-chat-bg`, `--mari-chat-text`, `--mari-chat-radius`, `--mari-chat-font-family`) 중 하나를 설정하면
해당 채팅 영역의 스타일이 자동으로 켜집니다. 테마의 채팅 색상을
표시하기 위해 사용자가 "Apply preset …" 스위치를 켤 필요는 없습니다.

## 낮과 밤

Settings > Appearance > Color Scheme(설정 > 모양 > 색상 구성)은 시스템이나
시간대를 따를 수 있습니다(기본값은 07:00부터 Light, 19:00부터 Dark이며 둘 다 조정 가능).
어느 쪽이든 `<html>`의 `data-theme`만 전환하므로, 테마에서 둘의 스타일을 지정하면 낮과 밤 모양이 생깁니다.

```css
:root[data-theme="light"] {
  --mari-app-backdrop: url("theme:day.webp");
}
:root[data-theme="dark"] {
  --mari-app-backdrop: url("theme:night.webp");
}
```

색상 구성은 각 기기 자체 시계로 결정되며 동기화되지
않습니다. 따라서 다른 장소의 휴대폰과 PC에도 각각 올바른 모양이
표시됩니다. 테마 파일에서 전환 설정 자체를 제안할 수도
있습니다: `"settings": { "colorScheme": "time", "dayStart": "07:00", "nightStart": "19:00" }` (또는 `"system"`). 가져오기 미리보기에서 다른 설정처럼 제안합니다.

## 테마 파일

내보내기는 테마 하나를 JSON 파일 하나로 저장합니다.

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

크레딧(v1.5)은 같은 파일에 넣으며 테마
목록의 (i) 버튼과 가져오기 미리보기에 표시됩니다.

```json
{
  "license": "CC BY 4.0",
  "labels": ["High legibility", "No motion"],
  "credits": [{ "what": "Backdrops", "by": "Jane Doe", "license": "CC BY 4.0", "url": "https://example.com" }],
  "fonts": [{ "family": "My Display", "src": "…", "license": "OFL-1.1", "credit": "Fraunces by Undercase Type" }]
}
```

`labels`에는 테마 이름 아래에 표시할 짧은 태그를 최대 4개(각 40자) 넣습니다. 라이선스가
`OFL-1.1` 인 폰트나 크레딧은 앱에 포함된 SIL Open Font License 본문으로 연결됩니다.
너비가 1920px보다 크거나 긴 쪽이 2560px보다 큰 그림은 테마를 가져올 때 축소됩니다.

필수 항목은 `kind`, `name`, `css` 뿐입니다. `templates`는 메시지 템플릿 절에서 설명합니다. `settings`
키: `colorScheme` (`dark`, `light`, `time` 또는 `system`), `dayStart`, `nightStart`, `visualStyle`, `accent`, `accentLight`,
`background`, `backgroundLight`, `fontFamily`, `accentPulse`, `fontSize` (Display Size(디스플레이 사이즈), px 단위: 12, 14,
16, 17, 19, 22, 26, 30 또는 34), `reduceMotion` (true 또는 false).
가져올 때 먼저 제안 설정이 체크된 미리보기가 표시됩니다. 단, Visual Style(비주얼 스타일),
Accent Pulse, Display Size, Reduce motion은 사용자가 원할 때 직접 체크합니다. 배경을
갤러리에 추가할지도 사용자가 고릅니다. 4KiB 미만 그림은 인라인으로 남고 "작은 아이콘" 칩
하나로 표시됩니다. 폰트는 테마와 함께 `@font-face` 규칙으로 로드되고 테마와 함께 제거됩니다. 설치된
테마와 이름이 같으면 업데이트를 제안하며, 업데이트할 때 같은 배경을 갤러리에 두 번
추가하지 않습니다. CSS 제한은 CSS 텍스트 256KiB이며 그림, 썸네일, 폰트, 배경의 합계
제한은 6MiB입니다. 용량에 맞지 않는 그림은 크기를 표시하며 해당 그림만 제외하고 나머지
테마는 설치합니다. 일반 `.css` 파일, `{ "name", "css" }`, 이전 `marinara.theme-folder` 내보내기도 계속 가져올 수 있습니다.

## 테마 성능 유지하기

휴대폰과 태블릿, 특히 Safari를 쓰는 iPad에서는 CSS가 느리면 탭할 때마다
느껴집니다. 대부분의 테마는 괜찮지만, 테스트에서 다음 패턴이 테마를 느리게 만들었습니다.

- **부모의 `:has()`로 자식에 스타일을 적용하는 패턴**. 예:
  `.panel:has(> .row) > *` 또는 `body:has(.open) .chat *`. 브라우저가 글자 하나를 입력하거나 단어
  하나가 스트리밍될 때마다 전체 페이지를 다시 검사하게 됩니다.
  스타일을 적용하는 요소에 `:has()`를 쓰거나(`.row:has(> img)`), `data-mari-part` 훅을 대신 쓰세요.
- **여러 요소에 동시에 적용하는 `backdrop-filter` **. 예를 들어 모든 메시지나 채팅 행에 적용하는 경우입니다. 흐릿한
  유리 효과 패널 한두 개는 괜찮지만 100개 행마다 흐림 효과를 넣으면 안 됩니다. 반투명 색상을 대신 쓰세요.
- **레이아웃 애니메이션**(`width`, `height`, `top`, `margin`) 또는 큰 `box-shadow`
  애니메이션. `opacity`와 `transform`, 또는 앰비언트 레이어의 `background-position`에 애니메이션을 적용하세요.

**Settings → Advanced → Troubleshooting → Show tap timings**에서 해당 기기의 탭 처리
시간을 테마 적용 전후로 볼 수 있습니다. 두 값을 비교해 느린 규칙을 찾으세요.

## 접근성

Settings > Appearance > Accessibility(설정 > 모양 > 접근성)는 사용자의 줄 간격과
글자 간격, 포커스 링, 고대비, 색각 이상 친화 색상, 메시지 텍스트의 최소
크기 12px를 적용합니다. 값은 모든 요소의 `mari-protected` 레이어에 리터럴로 기록되므로(lib/accessibility-css.ts), 테마가 변수를
재정의해도 취소할 수 없습니다. 옵션이 꺼져 있을 때는 테마에서 다음을 설정할 수 있습니다.

|토큰|용도|
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| `--mari-focus-ring-color`                              | 앱의 일반 포커스 링(기본값 `--primary`) |
| `--mari-cvd-good`, `--mari-cvd-warn`, `--mari-cvd-bad` | 파란색과 주황색 조합을 직접 정할 때의 상태 및 게이지 색상 |

아트에는 다음 세 가지 선택도 테마보다 우선합니다.

- **Theme art strength**(0~100%)는 배경 그림과 앰비언트 오버레이를 흐리게 합니다.
- **High contrast**는 바탕도 해당 색상 구성의 불투명한 색상으로
  만듭니다(`--background`, `--card`, `--popover`, `--sidebar`, `--secondary`, `--muted`, `--mari-rp-bubble-bg`, 페이지 베일, Home
  색조, Home 위젯, 상단 바 받침 배경). 테마 아트는 25%
  이하로 유지해 텍스트가 파스텔 그림 위에 놓이지 않게 합니다. 테마가
  자체 선택자에 리터럴로 쓴 색상은 바뀌지 않으므로 토큰을 우선 사용하세요.
- **Reduce motion**은 움직이는 그림을 첫 프레임으로 표시하고 앰비언트
  오버레이를 멈춥니다. 강제 색상(Windows High Contrast)은 아트와 `border-image` 프레임을 숨깁니다.

고정된 초록색과 빨간색 대신 위의 상태 및 게이지 토큰을 쓰면 색각
이상 친화 스위치가 테마에도 적용됩니다. 테마가 무엇을 하든 건너뛰기 링크(`.mari-skip-link`)는 사용할
수 있습니다. 가져오기 미리보기에서 테마가 이 항목을 바꾸려 하면 사용자에게 알려 줍니다.

## 안전

- 상단 바(전체 화면에서 자동으로 숨겨지는 상태 포함), 채팅 사이드바와 채팅 행,
  Library 사이드바, Ctrl+K, 메시지 입력란은 스타일을 바꿀 수 있지만 숨기거나 옮기거나 가리거나 흐리게
  하거나 필터로 보이지 않게 하거나 클릭할 수 없게 만들 수는 없습니다. 보호 기능은
  테마 로드 후, 2.5초 및 10초 시점, 채팅을 열 때, 패널을 열 때,
  색상 구성이 바뀔 때, 크기를 조절할 때, 테마 자체 애니메이션이 시작되거나 끝날 때
  테마 적용 전후를 측정합니다. 이 중 하나라도 문제가 생기면 해당 탭에서 테마를 끕니다.
- 그림도 검사합니다(보호 기능 v3). 탭, 아이콘, 채팅 행, 메시지
  입력란 위에 그려진 것은 크기나 `pointer-events: none` 여부와 상관없이 컨트롤 중심에서
  감지합니다. 이를 숨기는 레이어(색상, 그라데이션 또는 해당 위치의 픽셀이 대부분 불투명한
  그림)는 가리는 것으로 판단합니다. 컨트롤 위로 넘어오는 `border-image`의 바깥쪽 확장과
  컨트롤에 씌운 그림 `mask`도 마찬가지입니다. 상단 바 안의 모든 `::before`와 `::after`는
  라벨과 아이콘 아래에 쌓이며, 마스크, `list-style-image`, `border-image-outset`은 적용되지 않습니다. 배경
  그림과 앰비언트 오버레이는 구조상 바 아래에 있으므로 검사 대상에 포함되지 않습니다.
- 보호 기능 v4(4차). 대비를 계산할 때 텍스트 뒤 레이어를 그리는
  순서대로 읽습니다(`border-image` 채우기, 맨 위부터 각 배경 레이어, 마지막으로 색상). 실제로
  텍스트를 덮는 부분(크기, 위치, 반복)에 따라 가중치를 주고 그림은 텍스트 바로
  아래에서만 샘플링합니다. 가는 선이나 모서리의 작은 장식은 더 이상 계산에 포함되지
  않으며 밝은 페이지 위의 어두운 베일은 어둡게 인식합니다. 상단 바와 메시지
  입력란은 더 엄격하게 검사합니다. 이전에 3:1이었던 텍스트는 대비가 가장 낮은 지점에서도
  그 비율을 유지해야 합니다. 상단 바, 채팅 행, 메시지 입력란에서 컨트롤
  자체의 `::before`나 `::after` 그림이 컨트롤을 덮으면 가리는 것으로 판단합니다. 가상 요소의
  `position: fixed` 그림은 편집기에 경고가 표시됩니다. 대신 `position: absolute`, `--mari-ambient`, `--mari-app-backdrop`을 쓰세요. 가상
  요소에서 상단 바 아트가 발견되면 `--mari-top-bar-bg`처럼 탭과 아이콘에 받침 배경이 생깁니다.
- 아트 위의 대비: 텍스트 뒤에 그림이
  있으면 검사를 건너뛰지 않고 그림의 색상을 읽습니다.
- 채팅 텍스트(v1.5): 보호 기능이 화면에 보이는 채팅의 마지막 몇 줄을
  샘플링하고 테마가 그중 절반을 덮으면 끕니다. 가상 요소 덮개, 카드 뒤의 불투명한
  앰비언트, 텍스트 위까지 뻗는 포커스 프레임이 해당합니다. 테마 자체 레이아웃 때문에
  화면 밖으로 나간 줄이나 답변 위에 고정한 이름 줄은 계산에 포함되지 않습니다.
- 테마가 `content:`로 추가하는 텍스트는 가져오기 미리보기에 표시됩니다.
- 테마 텍스트 규칙(2026년 11월 보안 감사). 파일, 편집기, Mari, 백업,
  채팅별 선택 등 출처와 상관없이 테마가 그릴 수 있는 모든 문자열을
  적용 전에 검사합니다. `content:`와 `quotes` 문자열, 사용자 지정 속성(따라서 `content: var(--x)`도 포함),
  `@counter-style` 기호, 메시지 입력란 플레이스홀더, 메시지 템플릿(단어와 `title`), SVG 그림 안의
  텍스트가 해당합니다. 키, 비밀번호, 로그인, 계정 정보를 요구하거나, 앱인 척하거나("hacked", "RCE",
  "security alert", "verified by Marinara", "call support"), 전화번호나 웹 주소를 담거나,
  선언 하나에서 영문자와 숫자가 80자를 넘는 텍스트는 거부합니다. 해당 테마는 설치할
  수 없으며 이미 설치된 테마도 적용하지 않습니다. 비슷하게 생긴 문자, 악센트,
  폭이 없는 문자, 공백, 1337 표기를 먼저 정규화합니다. 선택자, `font-family`, 그리드
  영역 이름의 문자열은 검사하지 않습니다. 테마 이름, 작성자, 설명, 크레딧도 시크릿을
  요구하거나 공식이라고 주장할 수 없습니다(이 항목에는 웹 주소를 쓸 수 있습니다).
- URL: 텍스트 정리(url() 허용 목록, `@import` 금지, data:는 폰트만
  허용) 외에도 적용 전에 브라우저가 스타일시트를 파싱합니다. 테마 자체 그림,
  포함된 data: 그림과 폰트, `#fragments`, `about:invalid` 이외의 주소가 있으면 테마를
  거부합니다. `src()`에도 url() 규칙을 적용하며 끝에서 닫히지 않은 `image-set(`은 제외합니다.
- 테마 파일에서 제안하는 색상(`settings.accent`, `background` 및 각각의 라이트 값)은 단순
  색상이나 그라데이션이어야 합니다. `url()`, `image-set()` 또는 값의 범위를 벗어나는 내용은 허용하지 않습니다.
- SVG 그림은 사용 전에 허용 목록을 바탕으로 다시
  구성합니다. `<script>`, `<foreignObject>`, `<a>`, 이벤트 속성, 외부 링크, `<?xml-stylesheet?>`,
  DOCTYPE 엔터티는 허용하지 않으며 CSS도 테마처럼 정리합니다. 디코딩하면 한
  변이 8192px를 넘거나 4천만 픽셀을 넘는 래스터 그림은 거부합니다.
- 날씨 토큰은 허용 목록으로 읽습니다. 알려진 토큰 이름, 허용 범위로
  제한한 숫자, 고정 목록의 단어, 단순 색상만 허용합니다(`url()`, 그라데이션, 색상 함수
  이외의 함수는 금지). 날씨 그림은 테마 자체 그림이어야 합니다(SVG 재구성과 크기
  제한을 거친 뒤 앱이 만든 동일 출처 주소). 그 외 주소는
  무시합니다. 테마에 작성한 내용은 실행되지 않으며 번개 섬광은 앱의 강도와 타이밍을 유지합니다.
- 메시지 템플릿은 대화 상자, 메뉴, 알림을 만드는 역할이나 앱
  자체 `data-` 속성, `mari-` /`ov-` 클래스 이름을 사용할 수 없습니다.
- 테마 체험("Keep this theme?")은 해당 탭에서만 진행됩니다. Keep을 선택한 뒤에야
  다른 기기에 적용됩니다. 답하지 않으면 되돌아가며, 바에 마우스를 올리거나 포커스를 두면
  카운트다운이 멈춥니다. Escape를 세 번 누르면 해당 탭에서 사용자 지정 테마가
  꺼집니다. Ctrl+K, 메뉴 또는 앱의 대화 상자를 닫는 Escape는 횟수에 포함되지 않습니다.

## 변경 사항

- **휴대폰 미니 사진과 조용해진 애니메이션**(2026년 11월 12~14일, 규약은 여전히
  버전 1): 휴대폰에서 이름 옆의 작은 그림을 위한 `--mari-mini-avatar-size`, `--mari-mini-avatar-ring`,
  `--mari-phone-convo-avatar` ; Chats 목록에 각 채팅의 최신 줄을 추가하는 `--mari-chat-row-preview`
  ; 전환 대기 시간 최대 1초; 아무도 볼 수 없는
  동안 멈추는 앰비언트 레이어와 무한 반복 애니메이션; [테마 성능 유지하기](#keeping-a-theme-fast).

- **읽기 쉬운 강조 텍스트와 분할 바 훅**(2026년 11월 11일,
  규약은 여전히 버전 1): 작은 텍스트에 쓰는 강조 색상은 Light에서 조금
  어둡게, Dark에서 조금 밝게 조정해 라벨을 읽기 쉽게 하며 버튼은 원래
  강조 색상을 유지합니다. `--mari-accent-text`로 해당 텍스트 색상을 직접 설정합니다. `[data-mari-part="top-bar"]`는 모든
  기기의 상단 바이며, 분할 보기의 두 번째 영역에도 같은 `[data-component="TopBar"]` 훅(추가로
  `[data-split-bar]`)을 가진 전용 바가 있어 테마의 상단 바 아트, 폰트, 탭
  색상이 적용됩니다. `--mari-game-combat-bg`와 `-bg-hover`는 전체 `background` 값이므로 그라데이션을 쓸 수 있습니다.

- **페이지 바탕 훅**(2026년 11월 10일, 규약은 여전히
  버전 1): `[data-mari-part="page"]`는 모든 Library 페이지, 편집기, Settings, Docs의
  공통 바탕이므로 테마에서 모두 같은 패널을 줄 수 있습니다.

- **테마 갤러리와 번개 줄기**(2026년 11월 9일, 규약은 여전히 버전
  1): 시작용 테마를 테마 갤러리에서 필요할 때 다운로드합니다. `--mari-weather-lightning-bolt` (`on`,
  `none` 또는 0.5~3의 너비)는 폭풍 섬광마다 화면 한쪽에 갈라진 번개를 그립니다.

- **테마 날씨**(2026년 11월, 규약은 여전히 버전 1): `--mari-weather-*`
  토큰(픽셀 스타일, 색상, 그림, 크기, 속도, 양, 강도, 색조,
  해와 달 끄기), `<html>`의 `data-mari-weather`와 `data-mari-sky`, 패널에 가려지면 일시
  중지되는 날씨. Petal OS, NEON//GRID, Lantern Path가 이를 사용합니다.

- **6차 개선과 보안 감사**(2026년 11월, 새 토큰 없음, 규약은 여전히
  버전 1): 시작용 테마는 읽기 전용이며 **Clone + Edit**로 편집할 수
  있는 사본을 만듭니다(11월 9일부터 설치에 포함하는 대신 테마 갤러리에서 필요할 때
  다운로드). 크레딧, 라이선스, 라벨은 가져오기 미리보기와 (i) 버튼 안에 표시됩니다. 테마
  체험은 **Keep theme**를 선택할 때까지 해당 탭에서만 진행됩니다. [안전](#safety) 절에 설명한
  테마 텍스트 규칙, URL 검사, SVG 재구성, 제안 색상 검사도 포함됩니다.

- **v1.5**(테마 5차 개선, 긴 답변): `--mari-chat-column`, `--mari-message-measure`,
  `--mari-chat-line-height`, `--mari-dialogue-weight`, `--mari-paragraph-gap`, 화자 고정, `--mari-phone-avatar`, VN 텍스트
  상자 부분과 페이드, `--mari-message-actions`, `--mari-swipe-counter`, `--mari-card-art-placeholder`, `--mari-chat-row-art-opacity`, `--mari-focus-frame-outset`, `--mari-scrim`,
  `--mari-center-x` ; dialogue, paragraph-gap, card-art, chat-row-art 부분과 모든
  위치의 아바타 자리 표시자; 내레이션, Ctrl+K, 창, 대화
  상자의 창 제목; 루트 범위의 외곽 UI에도 적용되는 강조
  색상; 채팅 텍스트 보호 검사; OFL 본문이 포함된
  테마 크레딧, 라이선스, 라벨; 가져올 때 큰 그림 축소.

- **v1.4**(테마 4차 개선): 보호 기능 v4(다층 배경, 그려진 영역,
  엄격한 상단 바와 메시지 입력란 검사, 가상 요소 덮개); 테마 파일의
  `fontSize`와 `reduceMotion`, 가져오기 미리보기에서 제안 설정 체크; 메시지 시간, Roleplay
  색조, 외곽 UI 강조 및 흐린 텍스트, Library와 Ctrl+K 색상, Combat,
  토스트, 로어북 점, Home 바로가기, 텍스트 크기 하한, 사용자 아바타
  토큰; `--mari-top-bar-height`와 `--mari-top-bar-plate-active` ; time, chat-header, game-hud, game-tools, avatar-placeholder, home-widget-glow 부분;
  포커스 프레임, 창 제목, 카드 뒤 앰비언트, 양옆 여백 마스크 슬롯.

- **v1.3**(테마 3차 개선, 그림): 테마 파일의 `images`와 `url("theme:name")` ; CSS 텍스트만 계산하는
  CSS 제한; 가져올 때 WebP 변환; 전용 레이어의 배경 그림; 배경 그림 위에
  유지되는 `--mari-page-veil` ; `var()`가 있는 `!important` 단축 속성 유지; 앰비언트 오버레이; 그림 아이콘과 커서;
  `--mari-home-wash`, `--mari-home-art` 및 추가 Home 위젯 토큰; VN 대사, VN 스프라이트 슬롯, Game
  내레이션 훅; 테마 파일에서 Follow time of day(시간대 따르기) 제안 가능; 보호 기능 v3.

- **v1.2**: 메시지 템플릿 슬롯(테마 파일의 `templates`,
  `[data-mari-part="message-extra"]`), 사용자가 "Allow themes with HTML"로 허용하는 방식.

- **v1.1**: 모든 채팅 모드에서 캐릭터, 인덱스, 생성
  시간이 있는 메시지 훅; 아바타, 헤더, 작업, 추론 부분;
  `--mari-composer-placeholder` ; 채팅 뒤에도 표시되는 배경 그림 v2(크기, 위치,
  반복, 픽셀 렌더링, 레이어); `--mari-page-veil` ; `--mari-top-bar-bg` ;
  `--mari-text-outline`, `--mari-dialogue-color`, `--mari-chat-font-size`, `--mari-msg-head-rule` ; Professor Mari를 `home-widget`으로 포함하는
  Home 위젯 토큰. `--mari-stage-empty-bg`는 이제 `background` 값입니다(그라데이션 사용 가능).
- **v1.0.1**: 보호 기능 v2, 보호되는 Accessibility 값, 추가 텍스트 검사. 설치는
  전체가 성공하거나 전체가 취소되며, 포함된 배경도 설치합니다. Go back(돌아가기)은 테마가 적용한 설정도 복원합니다.
  테마 폰트가 Font 목록에 표시되며, `url(#id)` 참조를 유지하고 포함된 폰트 이름을 폰트에서 읽습니다.
- **v1**(처음 공개한 규약): 위의 테마 토큰, 부분 훅, 배경 그림, 강조 효과.
