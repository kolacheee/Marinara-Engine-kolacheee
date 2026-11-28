# 지침 기반 생성과 Impersonate

채팅의 흐름을 조종하는 두 가지 방법입니다. 지침 기반 생성은 화면에 메시지를 올리지 않고 다음 답변의 방향을 정해 줍니다. Impersonate(유저 사칭)는 내 답장을 모델이 대신 쓰게 합니다. Quick replies(퀵 리플라이) 메뉴는 두 기능을 **Send**(전송) 옆에 모아 둡니다.

## /guided로 답변 방향 잡기

지침은 캐릭터 밖에서 하는 말입니다. 답변의 방향을 잡아 줄 뿐, 채팅 메시지로는 표시되지 않습니다.

1. 메시지 입력란에 `/guided`와 원하는 방향을 입력하세요.
2. <kbd>Enter</kbd>를 누르거나 **Send**를 클릭하세요.

모델이 그 방향에 맞춰 다음 답변을 씁니다. 예를 들면 다음과 같습니다.

```text
/guided make him admit he is lying
```

`/guided` 대신 `/narrator`, `/narrate`, `/nar` 중 하나를 입력해도 됩니다. 그룹 채팅에서는 `respond as`, `reply as`, `respond for`로 한 캐릭터를 지목해 방향을 줄 수 있습니다.

```text
/guided respond as Alice make her admit she is lying
```

## 재생성에 지침 적용하기

메시지 입력란에 적어 둔 글을 한 번의 재생성에만 쓰는 지침으로 활용합니다.

1. **Settings → Chatting → Editing & Swipes**(설정 → 채팅 중 → 편집 및 스와이프)를 열고 **Guide swipes/regens with chat input**(채팅 입력으로 스와이프/재생성 안내)을 켜세요. 기본값은 꺼짐입니다.
2. 채팅에서 메시지 입력란에 방향을 입력하되, 보내지는 마세요.
3. AI 메시지에서 **Regenerate**(재생성)를 클릭하세요. 입력란에 글이 있으면 버튼 라벨이 **Regenerate (guided)**로 표시됩니다.

적어 둔 방향은 재생성한 뒤에도 입력란에 남아 있으므로, 고쳐서 다시 재생성할 수 있습니다. 대신 입력란을 비우려면 **Settings → Chatting → Message Box**(설정 → 채팅 중 → 메시지 입력창)에서 **Keep guidance after regenerating**(재생성 후 지침 유지)을 끄세요.

작동하지 않는 경우: 버튼 라벨이 **Regenerate (guided)**여야 합니다. **Regenerate**라고만 표시되면 설정이 꺼져 있거나 입력란이 비어 있는 것입니다.

<a id="read-stored-guidance"></a>

## 저장된 지침 확인하기

Marinara는 답변의 방향을 잡은 지침을 저장해 둡니다.

1. AI 메시지에서 **Stored guidance**(저장된 지침) 아이콘(두루마리)을 클릭하세요.
2. **Stored guidance** 창에 그 방향이 표시됩니다.

창에는 방향이 어디에서 왔는지가 표시됩니다. **/guided**, **Guided regenerate**(유도 재생성), Game Mode(게임 모드) 설정 단계를 뜻하는 **Game start**(게임 시작) 중 하나입니다. `/guided`와 유도 재생성으로 준 방향에서는 **Copy /guided**(/guided 복사)가 바로 쓸 수 있는 `/guided` 명령어를 복사합니다. 이 명령어는 다른 채팅에 붙여 넣을 수 있습니다.

## Impersonate로 내 답장 쓰기

Impersonate는 내 다음 메시지를 모델이 페르소나의 말투로 대신 쓰게 합니다. 페르소나는 내가 연기하는 캐릭터이며, `{{user}}`로 표기됩니다. [사용자 페르소나](../characters/personas.md)를 참고하세요.

시작하기 전에: Impersonate는 Roleplay(롤플레이) 채팅에서만 작동합니다. Conversation(대화)에서는 "Impersonate is not available in Conversation mode."라는 메시지가 표시됩니다. Game에서도 쓸 수 없습니다.

1. 메시지 입력란에 `/impersonate`를 입력하세요. 원하면 뒤에 방향을 덧붙이세요.
2. <kbd>Enter</kbd>를 누르거나 **Send**를 클릭하세요.

모델이 페르소나로서 유저 메시지를 올립니다. 예를 들어 다음 명령은 날씨를 묻는 메시지를 씁니다.

```text
/impersonate ask about the weather
```

짧은 별칭은 `/imp`입니다. Impersonate가 쓴 메시지에도 **Regenerate**가 작동하므로 다른 버전을 받을 수 있습니다.

게시한 메시지는 내 턴으로 처리되므로 **에이전트 생략**가 켜져 있지 않으면 직접 입력한 메시지처럼 에이전트와 트래커가 실행됩니다. **CYOA를 지침으로 사용**이 켜진 상태에서 CYOA 선택지를 고르면 바로 이어서 캐릭터의 답변도 요청합니다. 그 전에 메시지를 읽고 수정하려면 Impersonate로 초안을 작성하세요.

### 먼저 초안 작성하기

초안은 채팅 대신 메시지 입력창에 들어갑니다. 저장되지 않으며, 보내기 전까지 아무것도 실행되지 않습니다. 캐릭터 답변, 에이전트, 트래커, 세계 상태 변경도 없습니다.

1. Roleplay 채팅에서 **채팅 설정**를 열고 **Impersonate** 섹션을 찾으세요.
2. **결과를 보낼 곳**를 **메시지 초안**로 설정하세요. 기본값은 **바로 게시**입니다.
3. `/impersonate`와 원하는 지시를 입력한 뒤 <kbd>Enter</kbd>를 누르세요.

초안이 메시지 입력창에 실시간으로 표시됩니다. 작성 중에는 위에 **다음 메시지 작성 중…**가 표시됩니다. 그곳의 **중지**이나 입력창의 중지 버튼을 누르면 지금까지 쓴 내용을 유지한 채 멈춥니다. 완료되면 텍스트를 수정하고 **전송**를 누르세요. 보내기 전까지 위쪽 줄에서 다음을 선택할 수 있습니다.

| 버튼 | 기능 |
| --- | --- |
| **다시 작성** | 같은 지시로 초안을 다시 작성하여 입력창의 초안을 교체합니다. |
| **되돌리기** | 초안을 버리고 입력창의 이전 내용을 복원합니다. |

다른 채팅이나 탭으로 이동해도 작성은 계속됩니다. 돌아오면 해당 채팅의 입력창에 초안이 있습니다. 채팅마다 별도의 초안이 있습니다.

설정을 바꾸지 않고 한 번만 선택하려면 다음 명령을 사용하세요.

| 명령 | 기능 |
| --- | --- |
| `/impersonate_draft` | 초안을 작성합니다. `/impd`, `/imp_draft`도 가능합니다. |
| `/impersonate_post` | 메시지를 게시합니다. `/impp`, `/imp_post`도 가능합니다. |

**퀵 리플라이**가 켜져 있으면 **전송** 옆 메뉴에도 둘 다 있습니다. **Impersonate**는 설정을 따르고 두 번째 동작은 반대로 작동합니다. 입력창이 비어 있어도 초안을 시작할 수 있으며, 이때는 모델이 발언 내용을 고릅니다.

**CYOA를 지침으로 사용**이 켜져 있고 **결과를 보낼 곳**가 **메시지 초안**이면 CYOA 선택지를 누를 때 그 선택지를 지시로 삼아 초안을 작성합니다. 선택지는 보내기 전까지 화면에 남습니다.

### Impersonate 설정

이 설정은 모든 창과 기기에서 모든 채팅의 `/impersonate`에 적용됩니다. Roleplay 채팅에서 **채팅 설정**를 열고 **Impersonate** 섹션을 찾으세요. 패널을 여는 방법은 [채팅 설정](chat-settings.md)을 참고하세요.

| 컨트롤 | 하는 일 |
| --- | --- |
| **결과를 보낼 곳** | **바로 게시**은 메시지를 즉시 채팅에 추가합니다. **메시지 초안**는 입력창에 작성하여 직접 수정하고 보낼 수 있게 합니다. [먼저 초안 작성하기](#write-a-draft-first)를 참고하세요. 기본값: **바로 게시**. |
| **Prompt Template**(프롬프트 템플릿) | Impersonate를 실행할 때마다 보내는 선택적 지침입니다. 비워 두면 채팅 자체의 프롬프트나 내장 기본값을 사용합니다. Marinara가 실제 텍스트로 바꿔 넣는 자리 표시자인 `{{user}}`, `{{persona_description}}`, `{{impersonate_direction}}`을 쓸 수 있습니다. 기본값을 읽으려면 **Built-in default**(내장된 기본값)를, 사본으로 시작하려면 **Copy built-in default to edit**(내장된 기본값을 복사하여 편집)를, 이름을 붙인 템플릿으로 보관하려면 **Save as**(다른 이름으로 저장)를, 템플릿을 지우려면 **Delete template**(템플릿 삭제)을 고르세요. |
| **Preset**(프리셋) | Impersonate 답변에만 쓰는 프롬프트 프리셋입니다. 기본값: **Use chat default**(채팅 기본값 사용). [Preset Editor와 프롬프트 관리](../prompts/presets.md)를 참고하세요. |
| **Connection**(연결) | Impersonate 답변에 쓸 모델로, 더 저렴하거나 빠른 모델을 지정할 수 있습니다. 기본값: **Use chat default**. **Random**(무작위)도 고를 수 있습니다. [AI 제공자에 연결하기](../connections/connecting-to-a-provider.md)를 참고하세요. |
| **에이전트 생략** | Impersonate 중 에이전트(트래커, 로어북 라우터 등)를 건너뜁니다. 속도를 높이고 세계 상태가 바뀌는 것을 막습니다. 기본적으로 꺼져 있습니다. 초안은 항상 건너뜁니다. [에이전트](../agents/agents-overview.md)를 참고하세요. |
| **Send Public Faces** | Roleplay 채팅에서 **Public Face**가 있는 캐릭터는 Impersonate 프롬프트에 이름과 Public Face만 들어가므로, 내가 알 수 있는 내용만 바탕으로 답변합니다. 이 내용이 카드에서 보내는 나머지 전부를 대신합니다. Description, Personality, Backstory, Appearance, Scenario, System Prompt, 예시 대화, RPG 속성, Post-History Instructions, Depth Prompt가 해당합니다. Public Face가 비어 있는 캐릭터는 전체 카드를 유지합니다. Impersonate 프리셋이나 프롬프트 템플릿에 넣은 `{{description}}` 같은 매크로는 여전히 해당 내용을 보냅니다. **Regenerate**(재생성)는 메시지 작성 당시의 설정을 유지합니다. 기본값은 꺼짐입니다. [Card 탭](../characters/creating-and-editing-characters.md#card-tab)을 참고하세요. |
| **Use CYOA as direction**(CYOA를 지침으로 사용) | CYOA(choose your own adventure) 선택지를 클릭하면 그 내용을 올리지 않고 Impersonate 방향으로 씁니다. 기본값은 꺼짐입니다. **Settings → Chatting → Message Box**에서 **Add CYOA choices to the message box instead of sending them**(CYOA 선택지를 전송하지 않고 메시지 입력란에 추가)이 켜져 있으면, 클릭해도 텍스트가 메시지 입력란에 추가되기만 하고 이 설정은 효과가 없습니다. |

### 한 채팅에만 프롬프트 지정하기

1. `/impersonate_prompt`와 큰따옴표로 감싼 프롬프트를 입력하세요.
2. <kbd>Enter</kbd>를 누르세요.

```text
/impersonate_prompt "You will now play as my OC:"
```

기본값으로 되돌리려면 `/impersonate_prompt reset`을 입력하세요. 별칭은 `/imp_prompt`입니다.

## Send 옆에 Quick replies 추가하기

Quick replies는 **Send** 대신 쓸 수 있는 원클릭 동작을 추가하므로, 슬래시 명령어를 입력할 필요가 없습니다.

1. **Settings → Chatting → Message Box**를 여세요.
2. **Quick replies**를 켜세요. 기본값은 꺼짐입니다.
3. 펼쳐서 표시할 동작을 고르세요. 켜 두면 세 동작이 모두 기본으로 켜져 있습니다.

| 동작 | 하는 일 |
| --- | --- |
| **Post only**(단순 작성) | 입력한 메시지를 답변 없이 채팅에 올립니다. `/send <message>` 명령도 같은 일을 합니다. |
| **Guide reply**(지시 작성) | 입력한 글을 `/guided` 방향으로 보냅니다. |
| **Impersonate** | 입력한 텍스트를 지시로 사용해 페르소나의 답변을 생성합니다. **결과를 보낼 곳**를 따르며, Roleplay에서는 옆의 두 번째 동작이 반대로 작동합니다(**페르소나 초안 작성** 또는 **페르소나로 작성 후 게시**). Conversation 채팅에서는 숨겨집니다. |

동작이 하나만 켜져 있으면 그 버튼이 **Send** 옆에 놓입니다. 둘 이상이면 메뉴를 여는 점 세 개 버튼(**Quick replies**) 하나로 묶입니다.
