# 테마의 날씨 꾸미기

이야기에 날씨가 있으면 Marinara는 채팅 위에 비, 눈, 안개, 떨어지는 나뭇잎과 꽃잎, 별, 해나 달을 그립니다. 테마로 이 모든 요소에 고유한 모습을 줄 수 있습니다. 비의 색을 바꾸거나, 눈을 픽셀 사각형으로 내리게 하거나, 나뭇잎을 직접 그린 그림으로 바꾸거나, 비가 올 때 배경을 회색으로 바꿀 수 있습니다.

이 가이드에서는 그 방법을 단계별로 안내합니다. 먼저 자신만의 테마가 있어야 합니다. 아직 없다면 [테마 제작 가이드](theme-author-guide.md)에서 몇 분 만에 만드는 방법을 확인하세요. 그 가이드의 [날씨](theme-author-guide.md#weather) 섹션은 이 페이지를 짧게 정리한 참고 자료입니다.

## 날씨가 작동하는 방식

날씨는 이야기에서 가져옵니다. **Roleplay**(롤플레이)나 Game 채팅에서 **World State**(월드 트래커) 에이전트는 "heavy rain"(폭우), "night"(밤)처럼 날씨와 시간대를 추적합니다. Marinara는 이 단어를 읽고 무엇을 그릴지 고릅니다. "rain"이면 빗줄기, "snow"이면 눈송이, "night"이면 별과 달을 그리는 식입니다.

그리는 작업은 언제나 앱이 직접 합니다. 테마 자체는 아무것도 그리지 않습니다. 테마에서 몇 가지 `--mari-weather-` 토큰(`--primary`처럼 이름이 있는 설정)을 지정하면 앱이 이를 읽고 원하는 모습으로 날씨를 그립니다. 이렇게 해서 테마를 안전하게 유지합니다. 테마 안의 어떤 것도 코드를 실행할 수 없으며, 모션 감소 같은 사용자 설정이 항상 우선합니다.

### 실내에서는 바깥에만 표시되는 날씨

이야기의 장소가 여관, 침실, World Maps의 방 같은 실내이면 앱은 화면 전체에 비를 내리지 않습니다. 날씨의 색조와 번개 섬광만 남겨 두어 방 안은 젖지 않습니다. 앱은 World State의 위치("Tideglass Inn, Brinewatch")나 World Maps의 장소 유형으로 실내 여부를 판단합니다. 판단할 수 없으면 평소대로 날씨를 그립니다. **Weather Versions of Backgrounds**를 켜면([날씨별 배경](../media/scene-backgrounds.md#weather-versions-of-backgrounds) 참고) 배경 그림 자체에 창문에 내리는 비가 표시되고, 움직이는 날씨 효과도 다시 나타나 창유리 위에만 그려집니다. 테마의 날씨 모양도 여기에 적용됩니다.

### 테마가 없을 때의 날씨

테마가 없는 비 오는 밤의 모습입니다. 짙은 파란색 색조 위로 가늘고 옅은 빗줄기가 내립니다. 아래 그림들은 같은 채팅에 시작용 테마 세 가지를 적용한 모습입니다.

## 작업하면서 날씨 확인하기

이야기에서 비가 올 때까지 기다릴 필요는 없습니다. 직접 날씨를 설정할 수 있습니다.

1. **Library → Settings → Appearance**(라이브러리 → 설정 → 모양)를 열고 **Effects**(효과) 아래의 **Dynamic weather effects**(동적 날씨 효과)가 켜져 있고 **Reduce Ambient Animations & Effects**(앰비언트 애니메이션 및 효과 줄이기)가 꺼져 있는지 확인하세요.
2. Roleplay 채팅을 연 다음 **Chat Settings → Agents**(채팅 설정 → 에이전트)를 열고 **World State**를 켜세요.
3. **World State** 트래커를 여세요. 컴퓨터에서는 Tracker Panel에 있습니다. 휴대폰에서는 **World State** 버튼을 누르세요.
4. **Weather**(날씨) 값을 클릭하고 `heavy rain` 같은 날씨 단어를 입력하세요. **Time**(시간)을 클릭하고 `night`를 입력하세요.
5. 날씨가 즉시 표시됩니다. 이제 상단 바에 이 채팅의 탭이 생깁니다.

테마를 작업하는 동안에는 Settings가 창 가운데를 채우고 뒤쪽 날씨는 일시 중지됩니다. 테마를 저장한 다음 상단 바에서 채팅 탭을 클릭해 결과를 확인하세요. 다른 날씨를 시험하려면 4단계의 단어를 바꾸세요. 아래 **단어별 날씨 효과** 표에 모든 단어가 나와 있습니다.

> **팁:** 시험하는 동안 AI가 바꾸지 못하도록 Weather 값을 잠그세요(트래커의 잠금 모드). [Roleplay HUD와 트래커](../roleplay/hud-and-trackers.md)를 참고하세요.

## 첫 날씨 모양을 단계별로 만들기

NEON//GRID 시작용 테마처럼 비에 색을 입히고 빗줄기를 길게 만들어 보겠습니다.

1. **Library → Settings → Appearance → CSS Themes**(라이브러리 → 설정 → 모양 → CSS 테마)를 열고 테마의 **Edit theme CSS**(테마 CSS 편집)를 클릭하세요(코드 아이콘).
2. CSS 위쪽에서 `:root {` 줄을 찾으세요. 없다면 새 줄에 `:root {`를 추가하고 그다음 줄에 `}`를 추가하세요.
3. 그 안의 `}` 앞에 다음 줄을 추가하세요:

```css
--mari-weather-rain-color: #3ff0ff;
--mari-weather-rain-length: 2.2;
--mari-weather-strength: 1.4;
```

4. **Save**(저장)를 클릭하세요. Marinara에서 **Keep this theme?**(이 테마를 유지할까요?)를 물으면 **Keep theme**(테마 유지)을 클릭하세요.
5. 상단 바에서 시험용 채팅의 탭을 클릭하세요. 이제 비는 청록색이고, 빗줄기는 약 두 배 길어지며 더 선명하게 보입니다.

각 줄의 역할은 다음과 같습니다:

- `--mari-weather-rain-color`는 빗방울의 색입니다. `#3ff0ff` 같은 16진수 코드, `skyblue` 같은 이름, `rgb(63 240 255)` 등 어떤 색이든 사용할 수 있습니다.
- `--mari-weather-rain-length`는 빗줄기를 길거나 짧게 만듭니다. `1`은 보통 길이이고 `2.2`는 두 배보다 조금 더 깁니다.
- `--mari-weather-strength`는 모든 입자를 더 선명하게(`1` 초과) 또는 더 옅게(`1` 미만) 표시합니다.

### 적용 결과

이 세 줄에 몇 가지 설정을 더한 NEON//GRID에서 같은 비 오는 밤을 본 모습입니다.

### 낮과 밤의 색 고르기

어두운 배경에서 잘 보이는 색도 밝은 배경에서는 안 보일 수 있습니다. 다른 색을 설정할 때와 마찬가지로 낮의 색은 `[data-theme="light"]` 블록에, 밤의 색은 `[data-theme="dark"]` 블록에 넣으세요:

```css
:root[data-theme="light"] {
  --mari-weather-rain-color: #1aa7c4;
  --mari-weather-snow-color: #22b8d6;
}
:root[data-theme="dark"] {
  --mari-weather-rain-color: #3ff0ff;
  --mari-weather-snow-color: #7af7ff;
}
```

## 단어별 날씨 효과

날씨 종류마다 짧은 이름이 있습니다. `snow`를 `--mari-weather-snow-color`에 넣는 것처럼 토큰에 이 이름을 사용합니다.

|이야기의 단어|앱이 그리는 효과|토큰에 쓰는 이름|
| ----------------------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
|rain, downpour(비, 폭우)|빗줄기|`rain`|
|storm, thunder, lightning(폭풍, 천둥, 번개)|번개 섬광을 동반한 폭우|`rain`(섬광: `lightning-color`, 번개 줄기: `lightning-bolt`)|
|snow, sleet, blizzard, frost, cold(눈, 진눈깨비, 눈보라, 서리, 추위)|눈송이|`snow`|
|hail(우박)|우박 알갱이|`hail`|
|fog, mist, haze(안개, 옅은 안개, 연무)|지면 안개 위로 화면 아래쪽에 부드럽게 모인 안개|`fog`|
|sand, dust storm(모래, 먼지 폭풍)|날리는 모래|`sand`|
|ash, smoke, volcanic(재, 연기, 화산)|떨어지는 재|`ash`|
|fire, embers, inferno(불, 불씨, 큰불)|떠오르는 불씨|`ember`|
|wind, breeze, gusts(바람, 산들바람, 돌풍)|떨어지는 나뭇잎|`leaf`|
|cherry blossom, petals(벚꽃, 꽃잎)|떨어지는 꽃잎|`petal`|
|aurora, northern lights(오로라, 북극광)|띠 모양의 오로라|`aurora`|
|clear, sunny, cloudy, 그 밖의 단어(맑음, 화창함, 구름 많음)|떠다니는 작은 입자 몇 개|`dust`|
|night(시간: 밤)|별과 반딧불이|`star`, `firefly`|
|dusk, evening(시간: 황혼, 저녁)|반딧불이|`firefly`|
|morning, day, dusk(아침, 낮, 황혼, 맑은 하늘)|해|`sun`|
|night(밤, 맑은 하늘)|달|`moon`|

안개가 끼거나 눈이 오는 밤에는 별이 나타나지 않고, 비가 오면 반딧불이가 나타나지 않습니다. 해와 달은 하늘이 맑을 때만 표시됩니다.

## 색, 크기, 모양 바꾸기

표의 모든 종류에 같은 세 가지 설정을 사용할 수 있습니다. 토큰 가운데에 종류 이름을 넣으세요.

|토큰|역할|값|
| --------------------------- | ---------------------------- | ---------------------------------------------------------- |
|`--mari-weather-snow-color`|색|단색: `#fff0f7`, `white`, `rgb(...)`, `hsl(...)`|
|`--mari-weather-snow-size`|각 입자의 크기|`0.5`(절반)~`3`(세 배)|
|`--mari-weather-snow-shape`|둥근 점 또는 작은 사각형|`round` 또는 `square`|

`snow`를 표의 다른 이름으로 바꾸세요. 예를 들어 `--mari-weather-ember-color`나 `--mari-weather-leaf-shape`를 사용할 수 있습니다.

예를 들어 컴퓨터 스타일 테마에서는 눈송이 대신 작은 청록색 사각형으로 "데이터 눈"을 만들 수 있습니다.

```css
:root {
  --mari-weather-snow-color: #7af7ff;
  --mari-weather-snow-shape: square;
  --mari-weather-snow-size: 1.2;
}
```

비, 안개, 오로라는 고유한 형태를 유지하므로 모양 설정이 적용되지 않습니다. 안개의 경우 `--mari-weather-fog-color`가 떠다니는 안개와 지면 안개 모두에 색을 입히고, `--mari-weather-tint-strength`가 안개를 더 옅거나 짙게 만듭니다.

## 직접 만든 그림 사용하기

점이나 줄기 대신 직접 만든 그림이 각 날씨 효과로 떨어지게 할 수 있습니다. 단풍잎, 벚꽃잎, 종이 별, 작은 픽셀 눈송이 등을 사용할 수 있습니다.

1. PNG처럼 배경이 투명한 작은 그림을 그리거나 찾으세요. 그림은 작게 유지하세요. 나뭇잎은 너비가 약 24~64픽셀이면 충분합니다. 더 큰 그림은 긴 변이 160픽셀이 되도록 축소됩니다.
2. 테마 편집기에서 **Pictures and sharing details**(그림 및 공유 정보, 작성자, 버전, 썸네일, 폰트)를 열고 **Add pictures**(그림 추가)를 클릭하세요. 한 종류에 그림을 최대 네 개까지 추가하세요.
3. CSS에서 해당 종류의 `-image` 토큰에 그림을 공백으로 구분해 나열하세요:

```css
:root {
  --mari-weather-leaf-image: url("theme:leaf-1.png") url("theme:leaf-2.png") url("theme:leaf-3.png");
  --mari-weather-leaf-size: 0.8;
}
```

4. 저장한 다음 시험용 채팅을 열고 날씨를 `windy`로 설정하세요. 이제 나뭇잎이 떠다니며 내려오고, 각 나뭇잎에는 추가한 그림 중 하나가 사용됩니다.

그림 사용 팁:

- **Pictures and sharing details** 아래에서 그림 이름을 클릭하면 커서 위치의 CSS에 `url("theme:...")`가 삽입되므로 이름을 직접 입력할 필요가 없습니다.
- 그림은 `leaf-1.png`처럼 확장자까지 포함해 추가할 때의 파일 이름을 유지합니다. 목록에 표시된 이름을 그대로 사용하세요.
- 그림은 원래 색으로 그려지므로 해당 종류의 `-color` 토큰은 효과가 없습니다.
- `-size`로 모든 그림을 더 크거나 작게 만드세요. 부드러운 스타일에서는 크기도 조금씩 달라져 전부 똑같아 보이지 않습니다.
- 부드러운 스타일에서는 나뭇잎, 꽃잎, 재가 떨어지면서 천천히 회전합니다. 다른 종류는 똑바로 선 모양을 유지합니다.
- 그림은 테마 안에 있어야 합니다. 다른 웹사이트의 그림 링크는 무시됩니다.

Lantern Path 시작용 테마는 이 방식으로 채색한 나뭇잎 네 개를 사용합니다.

## 픽셀 스타일

픽셀 스타일은 날씨 레이어 전체를 큰 정사각형 픽셀 격자에 맞춰 픽셀 아트 테마와 어울리게 합니다. 빗방울, 눈송이, 별이 선명한 작은 블록으로 바뀝니다.

```css
:root {
  --mari-weather-style: pixel;
  --mari-weather-pixel-size: 3px;
  --mari-weather-petal-image: url("theme:wx-petal-1.png") url("theme:wx-petal-2.png");
  --mari-weather-petal-size: 3;
}
```

- `--mari-weather-style: pixel`은 픽셀 스타일을 켭니다. `smooth`를 사용하거나 생략하면 보통 모습입니다.
- `--mari-weather-pixel-size`는 각 블록의 크기로, `2px`~`6px`입니다. `3px`부터 시작하면 좋습니다.
- 픽셀 스타일에서는 그림의 원래 크기에 `-size`를 곱한 크기로 그립니다. 픽셀 아트의 한 칸을 이미지의 1픽셀로 그린 다음 `-size`를 픽셀 크기와 같은 숫자로 설정하면 그림의 픽셀이 날씨 픽셀과 맞아떨어집니다. Petal OS는 11픽셀 꽃잎을 크기 `3`으로 그립니다.
- 픽셀 스타일에서는 그림이 떨어질 때 회전하지 않고 불투명하게 그려집니다(나타나고 사라질 때 세 단계로 뚜렷하게 바뀝니다). 덕분에 픽셀 아트가 선명하게 유지됩니다.

### 예시: Petal OS

꽃잎이 날리는 밤에 Petal OS 시작용 테마를 적용한 모습입니다. 꽃잎은 테마에서 직접 그린 11픽셀 그림이고, 별도 같은 3픽셀 격자에 놓입니다.

## 해와 달

해와 달도 다른 종류처럼 색, 크기, 그림 한 개를 지정할 수 있습니다:

```css
:root {
  --mari-weather-sun-color: #ffe9a8;
  --mari-weather-moon-color: #ffe2f0;
  --mari-weather-moon-size: 1.5;
}
```

배경에 이미 달이 그려져 있다면 달이 두 개가 되지 않도록 앱의 달을 끄세요:

```css
:root[data-theme="dark"] {
  --mari-weather-moon: none;
}
```

`--mari-weather-sun: none`은 같은 방식으로 해를 끕니다.

## 효과를 잔잔하게 하거나 강조하기

다음 설정은 날씨 레이어 전체를 한 번에 바꿉니다:

|토큰|역할|값|
| -------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
|`--mari-weather-amount`|떨어지는 입자의 수|`0.25`(4분의 1)~`1`(보통). 테마는 날씨 입자를 줄일 수 있지만 늘릴 수는 없습니다.|
|`--mari-weather-speed`|떨어지는 속도|`0.5`(절반 속도)~`1.5`|
|`--mari-weather-strength`|입자가 선명하게 보이는 정도|`0.5`(옅게)~`1.5`(선명하게)|
|`--mari-weather-tint-strength`|채팅 위에 입히는 색조(비가 오면 파란색, 밤에는 어두운 색)|`0`(없음)~`1`(보통)|
|`--mari-weather-lightning-color`|번개 섬광의 색|단색. 섬광은 은은하고 느리게 유지되어 번쩍이는 빛에 민감한 사람도 안전하게 볼 수 있습니다.|
|`--mari-weather-lightning-bolt`|섬광이 번쩍일 때마다 번개 색으로 가지가 갈라진 번개 줄기를 그림|`on` 또는 `0.5`~`3`의 굵기. `none`(기본값)이면 섬광만 남습니다.|

차분하게 글을 읽는 테마라면 `--mari-weather-amount: 0.5;`와 `--mari-weather-tint-strength: 0.3;`을 시험하세요.

### 번개 줄기

기본적으로 폭풍은 화면에 섬광만 표시합니다. 섬광이 번쩍일 때마다 가지가 갈라진 실제 번개 줄기를 그리려면 `--mari-weather-lightning-bolt`를 추가하세요:

```css
:root {
  --mari-weather-lightning-color: #e8f2ff;
  --mari-weather-lightning-bolt: 1.2;
}
```

번개는 화면 왼쪽이나 오른쪽 가장자리를 따라 내려치며, 채팅 글이 있는 가운데를 가로지르지 않습니다. 여러 갈래로 갈라지고 지정한 번개 색으로 빛납니다. 앱 자체의 섬광이 켜진 동안에만 나타나고 함께 사라지므로 테마에서 섬광을 추가하거나 더 빠르게 만들 수는 없습니다. 픽셀 스타일에서는 번개도 픽셀 격자의 블록으로 그려집니다. Apogee Lounge, Crepuscular, Dewglass, Gutterlight, MARI to the Moon, Sanguine Keep, Under Sail, Velvet Casket 등 대부분의 시작용 테마는 번개 줄기를 사용합니다. Granite Watch와 Quiet Iris는 실내를 배경으로 하므로 번개 줄기를 끕니다.

## 날씨에 따라 배경 바꾸기

테마의 그림도 날씨에 따라 바뀔 수 있습니다. 채팅에 날씨가 표시되는 동안 Marinara는 CSS에서 확인할 수 있는 두 단어를 페이지에 추가합니다:

- `data-mari-weather`는 `clear`, `cloudy`, `rain`, `storm`, `snow`, `hail`, `fog`, `sand`, `ash`, `embers`, `wind`, `blossom`, `aurora` 중 하나입니다.
- `data-mari-sky`는 `dawn`, `day`, `dusk`, `night` 중 하나입니다.

이 값은 항상 위 단어 중 하나이며 이야기의 원문이 들어가지는 않습니다. 채팅에 날씨가 없거나 사용자가 날씨를 끄면 사라집니다.

### 예시: 비 오는 Lantern Path

Lantern Path는 비가 오면 햇살이 비치는 숲을 회색의 흐린 숲으로 바꿉니다. 왼쪽은 맑은 아침이고, 오른쪽은 같은 채팅에 비가 오는 모습입니다.

### 배경 교체하기

같은 효과를 내려면 비나 폭풍일 때만 적용되는 블록을 추가하고 두 번째 배경 그림을 지정하세요:

```css
:root {
  --mari-app-backdrop: url("theme:forest-sunny.webp");
}
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:forest-overcast.webp");
}
```

읽는 방법: `:root[data-mari-weather="rain"]`은 "비가 오는 동안에만"이라는 뜻입니다. 쉼표는 "또는"이라는 뜻입니다.

- 테마에서 `--mari-app-backdrop-layers`를 설정하고 `--mari-app-backdrop`은 사용하지 않는다면 날씨 블록에서도 `--mari-app-backdrop-layers`를 바꾸세요. 이 설정이 단일 그림보다 우선하기 때문입니다.
- 낮과 밤도 맞추려면 색상 모드를 추가하세요. `:root[data-theme="dark"][data-mari-weather="rain"]`은 "다크 모드의 비 오는 밤"입니다.
- `data-mari-sky`도 같은 방식으로 작동합니다. 예를 들어 `:root[data-mari-sky="dusk"]`를 사용하면 노을 버전의 그림을 지정할 수 있습니다.

### 날씨 효과 겹치지 않게 하기

테마에 나뭇잎이나 비가 내리는 자체 앰비언트 오버레이(`--mari-ambient`)가 있으면 이야기의 날씨와 겹칠 수 있습니다. 실제 날씨 효과가 내릴 때는 이를 끄세요:

```css
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

이 코드는 "날씨가 있고 맑음이나 구름 많음이 아니면 앰비언트 오버레이를 숨긴다"는 뜻입니다.

직접 만든 낙엽이나 비 오버레이도 실외에만 표시할 수 있습니다. 날씨가 표시되는 동안 `data-mari-shelter`는 `indoors` 또는 `outdoors`입니다(앱이 판단할 수 없으면 이 속성이 없습니다):

```css
:root[data-mari-shelter="indoors"] {
  --mari-ambient: none;
}
```

## 사용자가 계속 결정하는 설정

테마는 날씨의 모습을 바꾸지만, 날씨를 볼지 여부는 바꾸지 않습니다:

- 테마는 날씨를 켜거나 끌 수 없습니다. Settings의 **Dynamic weather effects**가 결정합니다.
- **Reduce Ambient Animations & Effects**나 기기의 모션 감소 설정이 켜져 있으면 날씨를 전혀 그리지 않습니다. 그림 교체에는 움직임이 없으므로 배경은 계속 `data-mari-weather`를 따릅니다.
- **Reduced paint effects**(렌더링 효과 간소화)는 색조와 빛나는 효과를 없애고 입자를 더 적게 그립니다.
- **Theme art strength**(테마 아트 강도)는 배경처럼 날씨도 옅게 만들고, **High contrast**(고대비)는 날씨를 옅게 유지합니다.
- 패널, 편집기나 Mari가 채팅을 가리는 동안에는 배터리를 아끼기 위해 날씨가 일시 중지됩니다.

## 작동하지 않을 때

- **아무것도 바뀌지 않습니다.** 토큰이 `{ }` 블록 안에 있고 `;`로 끝나는지 확인하세요. 철자를 확인하세요. `--mari-weather-rain-color`이며, `color`는 미국식 철자입니다.
- **값이 무시됩니다.** 토큰의 범위를 벗어난 숫자는 가장 가까운 경계 값으로 조정되고, 앱이 이해할 수 없는 값은 버립니다. 색은 단색이어야 합니다. 그라데이션과 `url()`은 무시됩니다.
- **그림이 표시되지 않습니다.** 그림은 테마의 그림 목록에 있어야 하며, `url("theme:...")`의 이름은 확장자(`.webp` 또는 `.png`)까지 정확히 일치해야 합니다.
- **날씨가 전혀 표시되지 않습니다.** 채팅에서 **World State**가 켜져 있고, Weather 값에 표의 단어가 들어 있으며, **Dynamic weather effects**가 켜져 있고 **Reduce Ambient Animations & Effects**가 꺼져 있는지 확인하세요.
- **Roleplay에서는 날씨가 표시되지만 Conversation(대화)에서는 표시되지 않습니다.** 정상 동작입니다. 날씨는 Roleplay와 Game 채팅에만 표시됩니다.

## 시작용 테마에서 배우기

테마 갤러리의 모든 시작용 테마에는 날씨 효과가 있습니다. 하나를 다운로드하고 **Clone + Edit**(복제 후 편집)을 클릭한 다음 CSS에서 `Weather`로 표시된 부분으로 스크롤해 구현 방법을 확인하세요.

- **NEON//GRID**: 긴 청록색 빗줄기, 사각형 "데이터 눈", 나뭇잎과 꽃잎 대신 자홍색 불꽃을 사용합니다. 실제 날씨가 내리면 그려진 비 오버레이는 사라집니다.
- **Petal OS**: 3픽셀 격자의 픽셀 스타일, 직접 만든 픽셀 꽃잎, 밤에는 옅은 분홍색 비, 낮에는 짙은 베리색 비를 사용하며 날씨가 나쁘면 도시가 잿빛으로 변합니다.
- **Lantern Path**: 직접 그린 나뭇잎, 따뜻한 색의 반딧불이, 날씨에 따라 흐리거나 눈 덮인 모습으로 바뀌는 배경을 사용합니다. 배경에 빛을 직접 그려 넣었으므로 앱의 해는 사용하지 않습니다.
- **Dewglass**: 작은 입자 대신 직접 만든 비눗방울, 코드로 그린 결정 모양 눈송이, 아쿠아색 비, 청록색 번개 줄기, 흐리거나 얼거나 안개 낀 모습으로 바뀌는 석호 배경을 사용합니다.
- **Velvet Casket**: 낮과 밤의 폭풍이 다릅니다. 낮에는 분홍색 번개와 연보라색 비, 밤에는 묘지 위로 보랏빛 흰색 번개와 은빛 비가 내리며, 직접 만든 박쥐와 장미 꽃잎이 바람에 날립니다.
- **Gutterlight**: 차가운 만화풍 비, 바람에 날리는 찢어진 신문지, 나트륨등처럼 노란 스모그, 번개가 칠 때 가고일에서 물이 쏟아지는 폭풍 배경을 사용합니다.
- **Under Sail**: 바다의 돌풍 속에서 흰빛이 도는 파란 번개가 배의 삭구를 따라 내려치고, 바다 안개와 난간 및 밧줄 사다리에 쌓인 눈, 바람에 날리는 갈매기 깃털이 나타납니다.
- **Apogee Lounge**: 라운지 창문 너머로 우주의 날씨를 보여 줍니다. 폭풍은 성운 속 보라색 플라스마 번개를 동반한 이온 폭풍, 비는 미세 운석의 궤적, 눈은 얼음 지대, 안개는 성운의 연무로 바뀝니다. 마스크가 모든 효과를 유리 안에 가둡니다.
- **Granite Watch**: 실내 테마이므로 날씨를 테마에서 허용하는 한 최대한 옅게 유지합니다. 비는 배관에서 떨어지는 물방울, 눈은 석고 가루처럼 보이며, 번개 줄기는 꺼져 있고 앱의 섬광은 램프가 깜박이는 듯한 색을 띱니다. 실내 배경에 맞춰 날씨를 차분하게 만드는 방법을 확인할 수 있습니다.
- **Quiet Iris**: 또 하나의 실내 테마지만 관측창이 있습니다. 날씨는 유리 너머로만 보이고, 배경은 관측창에 비, 서리 또는 안개가 낀 버전으로 바뀌며, 번개 줄기는 꺼져 있고 폭풍이 치면 베이가 조금 어두워집니다.
- **MARI to the Moon**: 트레이딩 룸 창문 너머로 보는 시장의 날씨입니다. 비는 초록색 틱으로 내리고, 폭풍은 빨간 번개와 빨간 화면이 뜨는 폭락이며, 눈은 떨어지는 동전과 다이아몬드, 바람은 지폐를 날리고, 꽃은 작은 로켓을 쏘아 올리며, 안개는 스카이라인을 덮은 FUD입니다.
- **Sanguine Keep**: 성의 창문 너머로 보는 날씨입니다. 배경마다 있는 스텐실이 비, 눈, 꽃잎, 나뭇잎, 번개를 대전당(휴대폰에서는 계단탑)의 창유리 안에만 두고, 돌벽 위로는 절대 내보내지 않습니다.
- **Crepuscular**: 연감으로 읽는 같은 바다입니다. 눈은 슈거 파우더, 먼지는 빵 부스러기, 반딧불이는 지켜보는 눈, 바람은 종잇조각을 날리고, 번개는 가늘게 새긴 가지이며, 밤샘 경계는 우산 아래에서 계속됩니다. 실내에서는 납 테두리 유리창 너머로 바다가 보입니다.

## 관련 가이드

- [테마 제작 가이드](theme-author-guide.md)
- [사용자 지정 CSS 테마](custom-css-themes.md)
- [Roleplay HUD와 트래커](../roleplay/hud-and-trackers.md)
- [모양 설정](appearance-settings.md)
