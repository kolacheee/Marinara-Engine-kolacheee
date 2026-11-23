# SillyTavern에서 넘어오기

SillyTavern에서 쓰던 기능은 대부분 Marinara Engine(이하 Marinara)에도 있으며, 이름이 다른 경우도 있습니다. 표에서 익숙한 용어를 찾은 뒤 **Show me**(위치 보기)를 누르면 앱의 해당 위치가 열리고, 이름을 누르면 가이드를 읽을 수 있습니다.

검색(**Ctrl+K**, 휴대폰에서는 제목 탭)에 SillyTavern 용어를 입력해도 됩니다. "chat completion preset", "world info", "regex", "author's note" 모두 Marinara의 해당 기능으로 연결됩니다.

캐릭터, 채팅, 프리셋과 World Info를 옮기려면 [SillyTavern에서 가져오기](importing-from-sillytavern.md)를 참고하세요. 채팅은 메시지 날짜, 작가 노트와 페르소나를 유지하고, 프리셋은 샘플러 설정을 유지합니다.

## 같은 기능의 Marinara 이름

| SillyTavern의 이름 | Marinara의 이름 | 위치 | |
| ------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------- |
| Chat Completion 프리셋, AI Response Configuration(샘플러) | [프리셋](../prompts/presets.md) | Library(라이브러리) → **Presets**(프리셋). 온도, Top P/K, Min P와 페널티는 프리셋의 **Parameters**(매개변수)에 있습니다. | [위치 보기](#show-presets) |
| Prompt Manager | [프리셋 섹션](../prompts/presets.md) | Library → **Presets**, 프리셋 열기 → **Sections**(섹션) | [위치 보기](#show-presets) |
| 저장된 채팅 설정, 채팅 기본값 | [설정 프로필](../chats/settings-profiles.md) | Library → **Settings profiles**(설정 프로필), 또는 New Roleplay(새 롤플레이) → **Use a Profile**(프로필 사용) | [위치 보기](#show-settingsProfiles) |
| World Info, World Book | [로어북](../lorebooks/overview.md) | Library(라이브러리) → **Lorebooks**(로어북) | [위치 보기](#show-lorebooks) |
| Author's Note | [작가 노트](../roleplay/getting-started.md) | Chat Settings(Roleplay) | [위치 보기](#show-authorsNotes) |
| Regex | [정규식 스크립트](../extending/regex-scripts.md) | Library → **Regex scripts**(정규식 스크립트) | [위치 보기](#show-regexScripts) |
| 그룹 채팅 | [그룹 채팅](../chats/group-chats.md) | 채팅에 캐릭터를 두 명 이상 추가 | [위치 보기](#show-groupChats) |
| 캐릭터 카드, 대체 인사말 | [캐릭터 카드](../characters/import-export.md) | Library → **Characters**(캐릭터) → **Import**(가져오기). Roleplay 채팅을 시작할 때 대체 인사말을 고릅니다. | |
| Quick Replies, STscript | [빠른 답장과 슬래시 명령](../chats/guided-and-impersonate.md) | **Send**(보내기) 옆, 또는 `/` 입력 | [위치 보기](#show-quickReplies) |
| 확장(Summarize, Image Generation 등) | [에이전트](../agents/agents-overview.md) | Library → **Agents**(에이전트), 그다음 채팅별로 켜기 | [위치 보기](#show-agents) |
| Summarize, Vector Storage, Data Bank | [기억 회상과 요약](../agents/memory.md) | Chat Settings → **Memory Recall**(기억 회상) | [위치 보기](#show-memory) |
| API Connections, Connection Profiles | [연결](../connections/connecting-to-a-provider.md) | Library → **Connections**(연결) | [위치 보기](#show-connections) |
| Prompt Itemization | [Peek Prompt](../chats/peek-prompt.md) | 가장 최근 AI 답변 → **Peek prompt**(프롬프트 미리보기) | [위치 보기](#show-peekPrompt) |
| 체크포인트, 분기 | [분기](../chats/branches.md) | 메시지 → **Branch from here**(여기서 분기) | [위치 보기](#show-branches) |
| 스와이프, 다시 굴리기 | [스와이프](../chats/messages.md) | 답변 아래 화살표, 또는 터치스크린에서 스와이프 | [위치 보기](#show-swipes) |
| Persona Management | [페르소나](../characters/personas.md) | Library → **Personas**(페르소나) | [위치 보기](#show-personas) |
| UI 테마, 사용자 지정 CSS | [테마와 CSS 테마](../appearance/custom-css-themes.md) | Settings(설정) → **Appearance**(모양) | [위치 보기](#show-themes) |

**Show me**는 가능하면 페이지를 열거나 해당 단계를 시작합니다. Peek Prompt나 기억처럼 채팅 안에 있는 기능은 먼저 채팅을 여세요. 그렇지 않으면 가이드가 열립니다.

## 다르게 작동하는 기능

- **지시 및 컨텍스트 템플릿 없음.** Marinara는 채팅 메시지를 보내고 모델 서버가 모델 자체 템플릿을 적용하므로 SillyTavern의 **Advanced Formatting**에서 고를 항목이 없습니다. 프리셋의 섹션이 스토리 문자열을 대신합니다.
- **샘플러.** 프리셋의 설정은 해당 프리셋을 쓰는 채팅의 시작값입니다. 연결이나 채팅에 설정한 값이 우선합니다. 최대 답변 길이와 컨텍스트 크기는 연결에서 정합니다. Top A와 반복 페널티는 여기에서 설정할 수 없습니다.
- **작가 노트.** 매 답변마다 지정한 깊이에 들어갑니다. **Post-processing messages**(메시지 후처리)가 기본값인 **Apply**(적용)로 설정되어 있으면 가까운 사용자 메시지 안에 포함되어 전송됩니다. SillyTavern의 빈도, 위치와 역할 설정에 해당하는 항목은 없습니다. **Peek prompt**(프롬프트 미리보기)에 삽입된 위치가 표시됩니다.
- **그룹 채팅.** Roleplay에서는 기본적으로 내레이터 한 명이 모든 캐릭터를 연기하여 토큰을 덜 사용합니다. SillyTavern처럼 캐릭터마다 차례로 답하게 하려면 Chat Settings → **Group Chat**(그룹 채팅)을 열고 모드를 바꾸세요. SillyTavern에서 가져온 그룹은 이미 **Individual**(개별) 모드를 사용합니다.
- **키.** 채팅에서 Enter는 새 줄을 추가하고 **Ctrl+Enter**는 전송합니다. Enter로 보내려면 Settings → **Chatting**(채팅)에서 **Send on Enter**(엔터 키로 전송)를 켜세요. 화살표 키로 스와이프 사이를 이동하려면 같은 탭의 **Intuitive swipe navigation**(직관적인 스와이프 탐색)을 켜야 합니다.
- **Quick Replies.** 여기서는 **Send** 옆의 한 번 클릭하는 동작(대신 말하기, 가이드 답장)을 뜻합니다. SillyTavern의 Quick Reply 세트는 가져오지 않습니다.

- **세 가지 채팅 모드.** Marinara는 채팅을 **Conversation**(대화)(DM 같은 메시지 대화), **Roleplay**(롤플레이)(내레이션이 있는 긴 장면), **Game**(게임)(게임 마스터가 규칙에 따라 세계를 진행)으로 나눕니다. 새 채팅을 만들 때마다 원하는 모드를 물으며, 설정에는 해당 모드에서 쓰는 항목만 표시됩니다.
- **채팅 시작하기.** 새 채팅을 만들면 짧은 설정 과정이 열립니다. 자주 쓰는 구성을 설정 프로필로 저장하면 다음에는 **Use a Profile**을 누른 뒤 **Apply & Start**(적용 및 시작)를 누르는 한 단계로 시작할 수 있습니다. 프로필에 별표를 달면 해당 모드의 새 채팅에 기본값으로 쓰입니다.
- **모든 것을 찾는 검색.** **Ctrl+K**로 채팅, 캐릭터, 설정과 가이드를 찾고, 명령을 실행하고, Professor Mari의 도움으로 질문에 답할 수 있습니다.
- **Professor Mari.** Marinara의 내장 어시스턴트는 앱에 관한 질문에 답하고 캐릭터, 로어북과 에이전트를 만들어 줄 수 있습니다. 홈에서 여세요.

## 관련 가이드

- [SillyTavern에서 가져오기](importing-from-sillytavern.md)
- [설정 프로필](../chats/settings-profiles.md)
- [채팅 설정](../chats/chat-settings.md)
