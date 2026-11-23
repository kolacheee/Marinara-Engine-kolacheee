# Marinara Engine 시작하기

Marinara Engine은 AI 캐릭터와 채팅하고 롤플레이하는 앱입니다. 내 컴퓨터에서 직접 실행됩니다. 이 가이드에서는 홈 화면과 첫 채팅까지의 단계를 설명합니다.

## 첫 채팅 시작하기

시작하기 전에: AI 서비스에서 받은 API 키(비밀번호 같은 비밀 코드)나, 아래에서 설명하는 **Built-in model**(내장 모델)이 필요합니다.

1. Marinara Engine을 설치하고 브라우저에서 여세요. [Marinara Engine 설치](../INSTALLATION.md)에서 사용 중인 플랫폼을 고르세요.
2. 연결을 추가하세요. AI 서비스 하나에 쓰는 API 키 하나를 연결하거나 **Built-in model**을 사용할 수 있습니다. [AI 제공자에 연결하기](../connections/connecting-to-a-provider.md)를 참고하세요.
3. 연결에서 쓸 모델을 고르세요. 방법은 같은 가이드에서 설명합니다.
4. 캐릭터를 만들거나 가져오세요. 오른쪽 위의 **Library**(라이브러리)를 클릭해 **Library → Characters**(라이브러리 → 캐릭터)를 열고 **New character**(새 캐릭터)를 클릭하거나, **Import**(가져오기)를 클릭해 파일에서 카드를 불러오세요. [캐릭터 만들기와 편집](../characters/creating-and-editing-characters.md)을 참고하세요.
5. 홈에서 **Conversation**(대화), **Roleplay**(롤플레이), **Game**(게임)을 클릭하세요. 또는 채팅 목록을 여세요. 오른쪽 위의 **Library**를 클릭하고 사이드바 위쪽에서 **Chats**(채팅)를 고른 다음, **Convo**(대화), **Roleplay**, **Game** 탭 중 하나를 선택하고 **New**(새로 만들기)를 클릭하세요.
6. 새 탭에서 설정 페이지가 열립니다. 캐릭터와 **Content**(콘텐츠) 옵션을 고른 다음 **Start roleplay**(롤플레이 시작)를 클릭하세요(Conversation은 **Start chatting**(채팅 시작), Game은 **Create world**(세계 생성)).

결과: 새 채팅이 열리고 첫 메시지를 쓸 수 있습니다.

아직 연결이 없으면 Marinara가 연결 추가 창을 먼저 엽니다.

Marinara에는 온라인 AI가 들어 있지 않습니다. 대부분은 온라인 서비스에 연결합니다. API 키 없이 내 컴퓨터에서 실행되는 작은 모델인 **Built-in model**을 다운로드할 수도 있습니다. 가벼운 보조 작업에 적합하며, 주력 채팅용은 아닙니다. [내장 모델 설정](../connections/local-model.md)을 참고하세요.

Marinara를 처음 열면 짧은 안내 투어가 시작됩니다. [첫 실행 튜토리얼](tutorial.md)을 참고하세요. 단계 중간에 막히면 내장 어시스턴트인 Professor Mari에게 물어보세요. [Professor Mari, 앱 안의 어시스턴트](professor-mari.md)를 참고하세요.

## 화면 구성과 탐색

Marinara에는 어떤 테마를 쓰든 위치가 바뀌지 않는 두 영역이 있습니다.

- **상단 바.** 왼쪽에는 **Home**(홈)과 열어 둔 채팅, 캐릭터, 페이지마다 하나씩 생기는 탭이 있습니다. 오른쪽의 검색 버튼(또는 <kbd>Ctrl</kbd>+<kbd>K</kbd>, Mac에서는 <kbd>⌘</kbd>+<kbd>K</kbd>)으로 채팅, 캐릭터, 설정, 가이드를 찾거나 열고 Professor Mari에게 질문할 수 있습니다. 그 옆에는 채팅이 열려 있을 때 표시되는 **Chat settings**(채팅 설정), 이 가이드를 여는 **Docs**(문서), 사이드바를 보이거나 숨기는 **Library**가 있습니다.
- 오른쪽의 **사이드바** 위쪽에는 **Chats | Library**(채팅 | 라이브러리) 전환 버튼이 있습니다. **Chats**는 **Convo**, **Roleplay**, **Game** 탭에 채팅을 나열합니다([채팅 목록 관리하기](../chats/managing-chats.md) 참고). **Library**에는 **Characters**(캐릭터), **Personas**(페르소나), **Lorebooks**(로어북), **Presets**(프리셋), **Regex scripts**(정규식 스크립트), **Connections**(연결), **Agents**, **Custom tools**(사용자 지정 도구), 그리고 **Settings**(설정)와 **Extensions**(확장)가 있습니다. 하나를 고르면 가운데에 해당 페이지가 열립니다.

컴퓨터에서는 두 페이지를 나란히 표시할 수도 있습니다. [분할 보기](tabs-and-drafts.md#split-view-two-pages-at-once)를 참고하세요.

휴대폰이나 태블릿에서는 **Home**이 왼쪽 위에, **Library**(겹친 모양 버튼)가 오른쪽 위에 있습니다. Library를 누르면 페이지 위로 사이드바가 펼쳐지며, 같은 **Chats | Library** 전환 버튼이 있습니다. Library 화면 아래쪽에는 **Settings**, **Docs**, **All Tabs**(모든 탭)가 있습니다. 검색하려면 상단 바의 제목을 탭하고, 열려 있는 탭을 보려면 숫자 버튼을 탭하세요. [탭, 분할 보기와 저장하지 않은 변경 사항](tabs-and-drafts.md)과 [터치 제스처](../chats/messages.md#touch-gestures)를 참고하세요.

## 홈 화면 한눈에 보기

홈은 열려 있는 채팅이 없을 때 보입니다. 위쪽에는 인사말, 버전 번호, 그리고 각 모드로 새 채팅을 시작하는 **Conversation**, **Roleplay**, **Game**이 있습니다. 아직 모델을 설정하지 않았다면 **Connect a model to start chatting**(채팅을 시작하려면 모델을 연결하세요)을 누르면 Connections 페이지가 열립니다. **Professor**(교수님)는 Professor Mari를 별도 탭에서 열며, 설치한 앱(예: Story Writer)도 여기에 버튼을 추가합니다. **Widgets**(위젯)로 아래의 카드를 배치할 수 있습니다.

클래식 레이아웃(**Settings → Appearance → Theme → New layout**(설정 → 모양 → 테마 → 새 레이아웃)에서 새 레이아웃을 끄면 적용됨)에서는 홈이 웹 브라우저처럼 보입니다. 탭, 검색 바, **Discord**, **Support**(지원), **Credits**(크레딧), **Documentation**(문서), **Tutorial**(튜토리얼), **FAQ**, **Achievements**(업적), **Widgets** 북마크가 있습니다.

<a id="choose-a-chat-mode"></a>

## 채팅 모드 고르기

채팅을 시작할 때 모드를 고릅니다.

- **Conversation**: 메신저 앱처럼 생긴 단순한 AI 채팅입니다. [Conversation Mode: 시작하기](../conversation/getting-started.md)를 참고하세요.
- **Roleplay**: 캐릭터 한 명 이상이 나오는 이야기입니다. 앱이 장소와 시간 같은 장면 정보를 추적합니다. [Roleplay Mode: 시작하기](../roleplay/getting-started.md)를 참고하세요.
- **Game**: 1인용 게임입니다. AI가 이야기를 들려주는 게임 마스터 역할을 합니다. 동료 무리(파티), 주사위 굴림, 지도, 퀘스트가 함께합니다. [Game Mode: 시작하기](../game/getting-started.md)를 참고하세요.

<a id="home-widgets"></a>

## 홈 위젯

위젯은 보이거나 숨기고 옮길 수 있는 작은 카드입니다.

1. 홈에서 **Widgets**를 클릭하세요. **Home Widgets**(홈 위젯) 창이 열립니다. 창에는 **Built-in**(기본 제공), **Agents**(에이전트), **Personal**(개인) 아래로 위젯이 나열됩니다.
2. 위젯 옆의 눈 모양 버튼을 클릭하면 위젯을 보이거나 숨길 수 있습니다. 다시 보이게 한 위젯은 홈의 첫 번째 빈자리로 갑니다.
3. 위젯을 옮기려면 오른쪽 위 모서리의 손잡이를 끄세요. 컴퓨터에서는 위젯 위에 마우스를 올리면 손잡이가 나타납니다.

위젯 배치는 이 브라우저에 저장됩니다. 개인 위젯에는 편집 버튼과 삭제 버튼도 있습니다. 클래식 레이아웃에서는 창 맨 아래의 **Browser chrome**(브라우저 UI)에 스위치가 하나 있습니다. **Show URL bar**(URL 표시줄 표시)는 컴퓨터에서 홈의 검색 바를 보이거나 숨깁니다.

Professor Mari에게 부탁하면 개인 위젯을 만들어 줍니다. 설치한 에이전트도 위젯을 추가할 수 있습니다.

## 참고: 기본 제공 위젯

| 위젯 | 하는 일 | 처음부터 표시 |
| --- | --- | --- |
| **Professor Mari** | **Ask Professor Mari**(Professor Mari에게 묻기)는 Professor Mari와의 채팅을 엽니다. | 예 |
| **Recent chats**(최근 채팅) | 최근 채팅입니다. 하나를 클릭하면 다시 열립니다. 비어 있으면 **Your chats will show here**(채팅이 여기에 표시됩니다)라고 표시됩니다. | 예 |
| **Things to try**(시도해 볼 것) | 기능 하나씩을 다루는 다음 세 가지 작은 시도를 제안합니다. 모두 해 보거나 팁을 끄면 대신 **Documentation**, **Replay tutorial**(튜토리얼 다시 보기), **Read FAQ**(FAQ 보기)를 표시합니다. [시도해 볼 것](#things-to-try)을 참고하세요. | 예 |
| **What's New**(새 소식) | **See what's new**(새로운 기능 보기)와 **Read release notes**(릴리스 노트 보기)입니다. | 예 |
| **Community**(커뮤니티) | **Discord**, **Support**, **Credits**로 가는 링크입니다. | 예 |
| **Character Library**(캐릭터 라이브러리) | 날마다 새로 고른 내 캐릭터입니다. | 아니요 |
| **Discovery desk**(탐색 데스크) | 아직 설치하지 않은 에이전트입니다. **Browse agents**(에이전트 둘러보기)는 카탈로그를 엽니다. | 아니요 |
| **Character of the Day**(오늘의 캐릭터) | 라이브러리의 캐릭터 하나를 **Start a chat**(채팅 시작), **View character**(캐릭터 보기)와 함께 보여 줍니다. | 아니요 |
| **Clock & calendar**(시계 및 달력) | 오늘 날짜와 시간입니다. | 아니요 |
| **Achievements** | 최근 업적과 가장 가까운 다음 업적입니다. Achievements 설정이 켜져 있어야 합니다. | 아니요 |

## 시도해 볼 것

**Things to try** 위젯은 다음에 시도할 기능 세 가지를 제안합니다. 각 과제는 이전 과제에 이어집니다. 갤러리 사진을 스티커로 만들고, 그 스티커를 채팅에서 보내는 식입니다.

- 과제를 클릭하면 앱의 해당 위치가 열립니다. 해당 위치가 없으면 가이드가 열립니다.
- 체크 표시를 클릭하면 완료로 표시하고, 가위표를 클릭하면 건너뜁니다. 건너뛴 과제는 다시 표시되지 않습니다.
- 해당 모드의 채팅이나 스티커 라벨처럼 Marinara가 완료를 확인할 수 있는 과제는 대부분 자동으로 체크됩니다. 나머지는 직접 체크하세요.
- **See all**은 모든 과제를 코스별로 나열하고 **Show me**(위치 보기)를 함께 표시합니다. 코스의 과제는 먼저 해야 할 과제를 마치면 나타납니다. **Only in this layout**(이 레이아웃에서만) 아래의 코스는 새 레이아웃의 기능을 다룹니다.
- 코스를 마치면 해당 **Explorer** 업적이 열립니다.

위젯은 **Settings > General > Confirmations & Help**(설정 > 일반 > 확인 및 도움말)의 **Feature tips** 설정을 따릅니다. 팁을 끄면 가이드 링크가 표시됩니다. 진행 상황은 이 브라우저에 저장됩니다.

### AI 기초와 심화 탐구

**See all**(모두 보기)에는 탭이 두 개 더 있습니다.

- **AI basics**(AI 기초): AI가 처음인 사람을 위한 짧은 투어입니다. 모델이 무엇인지, Marinara가 어떤 종류를 쓰는지, 토큰과 컨텍스트가 무엇인지 설명하고, 원한다면 모델 설정도 돕습니다. 설정 단계는 건너뛸 수 있습니다. 마지막에는 Professor Mari를 만납니다. 환영 튜토리얼이 끝난 뒤 작은 창에서 한 번 제안합니다. [AI 기초](ai-basics.md)를 참고하세요.
- **Deep dives**(심화 탐구): 선택 기준이 명확하지 않은 설정과, 카드의 **Creator's Notes**(제작자 노트)에 넣는 CSS처럼 잘 알려지지 않은 기능을 다룹니다. 자주 쓰는 그룹이 먼저 표시됩니다.

각 항목을 열면 가이드의 관련 부분으로 이동해 강조 표시하고, 그 아래 카드에서 쉬운 말로 설명합니다. **Got it**(확인)을 클릭하면 완료로 표시됩니다. AI basics에서는 다음 단계도 열립니다. **Core**(기본) 코스를 마치면 위젯의 마지막 줄에 심화 탐구 하나가 추천됩니다. AI basics나 Deep dives의 그룹 하나를 마치면 **Explorer**(탐험가) 업적이 열리고, 모든 심화 탐구를 마치면 업적이 하나 더 열립니다. 투어를 제안하는 창도 **Feature tips**(기능 팁) 설정을 따릅니다.

## 도움받는 곳

- 홈 화면에서 Professor Mari에게 물어보세요.
- 빠른 답을 보려면 **Things to try** 위젯에서 **See all**을 연 다음 **Read FAQ**를 클릭하세요.
- 앱 안의 가이드를 보려면 상단 바에서 **Docs**를 클릭하세요.
- **Community** 위젯에서 **Discord**를 클릭하면 커뮤니티로 연결되고, **Support**를 클릭하면 프로젝트를 후원할 수 있습니다.

무언가 고장 났다면 [Marinara Engine 문제 해결](../TROUBLESHOOTING.md)을 참고하세요.

## 관련 가이드

- [Marinara Engine 설치](../INSTALLATION.md)
- [AI 제공자에 연결하기](../connections/connecting-to-a-provider.md)
- [캐릭터 만들기와 편집](../characters/creating-and-editing-characters.md)
- [첫 실행 튜토리얼](tutorial.md)
- [탭, 분할 보기와 저장하지 않은 변경 사항](tabs-and-drafts.md)
- [Professor Mari, 앱 안의 어시스턴트](professor-mari.md)
