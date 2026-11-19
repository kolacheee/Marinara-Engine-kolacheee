# Antigravity CLI 구독 연동 조건 검토

이 문서는 [#8143](https://github.com/Pasta-Devs/Marinara-Engine/issues/8143)에 관한 개발자 조사 노트이며, 2026-10-23에 처음 확인하고 2026-11-19에 공식 `agy` 1.5.11 및 1.5.12 Windows 릴리스로 다시 확인했습니다. Marinara Engine에는 Antigravity 구독 연결이 **구현되어 있지 않으며**, 이슈는 계획 없음으로 닫힌 상태를 유지합니다. 사용자 지정 에이전트의 제외 설정은 이번 재검증에서 테스트한 후크를 억제했지만, 전역에서 발견된 플러그인의 MCP 하위 프로세스는 두 릴리스 모두에서 여전히 시작되었습니다. 실행 격리는 아직 검증되지 않았습니다.

## 확인된 공식 인터페이스

공식 `agy` CLI는 저장된 인증 정보를 이용한 계정 로그인과 대화형 인터페이스 없는 텍스트 생성을 지원합니다. 문서화된 프로토콜에는 `init`, `step_update`, `result` 이벤트가 있으며, 스트리밍 입력에는 stdin을 통해 JSON 사용자 메시지를 전달합니다. Windows 재검증에서 `agy models`는 `gemini-4-neon-high`를 나열했으며, 사용자의 기존 Google AI Pro 로그인으로 이 모델에 제한을 둔 요청을 보내는 데 성공했습니다. 계정에서 실제로 사용할 수 있는 모델은 예시에서 추정하지 말고 설치된 CLI에서 가져와야 합니다. `--print-timeout 0`은 완료될 때까지 기다리며, `--disable-slash-commands`는 print 모드의 명령 확장을 비활성화합니다. [헤드리스 모드](https://antigravity.google/docs/cli/headless/)와 [CLI 플래그 참조](https://antigravity.google/docs/cli/reference/)를 참고하세요.

CLI의 계정 로그인은 운영체제의 인증 정보 저장소를 사용합니다. 별도의 Gemini API 키 모드에는 `modelProvider: "gemini"`와 `GEMINI_API_KEY`가 필요합니다. 구독 어댑터가 이 과금 경로를 알리지 않고 선택해서는 안 됩니다. Python SDK에 문서화된 프로그래밍 방식의 인증 수단은 Gemini API 키, Vertex/Google Cloud 인증 정보, 로컬 모델입니다. 이 수단들은 SDK 기반 대체 구현에서 개인용 구독 인증을 사용할 수 있다는 근거가 되지 않습니다. [인증](https://antigravity.google/docs/install/#programmatic-authentication)과 [SDK 개요](https://antigravity.google/docs/sdk/overview/)를 참고하세요.

## 현재 실행 격리 결과

공식 사용자 지정 에이전트 정의는 도구, MCP, 사용자 지정 설정에 대한 제어를 제공합니다. 플러그인 가이드는 `inheritCustomizations`가 상속되는 스킬, 규칙, 후크를 제어하고, `inheritMcp`가 상속되는 작업 공간 MCP 서버를 제어한다고 설명합니다. 과거의 `excludeDefaultComponents: true` 발표에는 모델 호출 후 후크가 유지되므로, 이 플래그만으로는 격리가 보장되지 않습니다. 아래 설정 조합은 1.5.11에서 심어 둔 후크를 억제했지만, 모든 MCP 하위 프로세스의 시작을 막지는 못했습니다. [사용자 지정 하위 에이전트](https://antigravity.google/docs/subagents/), [플러그인 만들기](https://antigravity.google/docs/build-plugins/), [CLI 변경 내역](https://antigravity.google/docs/changelog)을 참고하세요.

후크는 작업 공간, 전역 파일 `~/.gemini/config/hooks.json`, 설치된 플러그인에서 올 수 있습니다. 세션, 모델 호출, 도구, 중지 이벤트를 포함합니다. 현재 설정 문서와 [공식 설정 스키마](https://antigravity.google/schemas/v1/settings.json)는 `settings.json`의 `hooks` 항목을 읽지 않는다고 명시합니다. 여기에 빈 항목을 써도 실제 후크 공급원은 비활성화되지 않습니다. [후크](https://antigravity.google/docs/hooks)와 [CLI 설정](https://antigravity.google/docs/settings?tab=cli)을 참고하세요.

설치된 1.5.11의 도움말은 `--settings`를 인라인 또는 파일로 제공하는 `settings.json` 키의 세션 전용 재정의로 설명합니다. 이를 통해 영구 저장된 환경 설정을 다시 쓰지 않고 임시로 작업 공간 신뢰와 권한을 설정할 수 있습니다. 별도의 설정 프로필을 제공하는 것은 아닙니다. `--settings '{"hooks":{}}'`는 `unknown setting "hooks"`와 함께 종료 코드 1로 끝납니다. 설치된 도움말에는 후크 비활성화나 인증을 유지하는 격리된 프로필 옵션이 없었습니다.

현재 설정 문서는 `/hooks`로 후크를 추가, 편집하고 켜거나 끌 수 있으며 변경 사항은 설정 파일에 저장된다고 설명합니다. 재검증에서 헤드리스 `-p "/hooks" --output-format json`은 구조화된 목록을 반환했습니다. 목록과 저장된 켜기/끄기 설정만으로는 이후 호출이 실행 가능한 사용자 지정 설정을 제외한다고 보장할 수 없습니다. 디렉터리 변경, 빈 `tools` 목록, 도구 사용을 피하라는 지시, 시작 후 중단은 실행 격리를 증명하기에 충분하지 않습니다.

제삼자 연동 보고서는 조사의 단서입니다. 실제 동작이 없는 도구, 에이전트 확인 로그, 사용자 지정 설정 상속에 관한 주장은 Engine이 의존할 수 있는 보장이 되기 전에 공식 릴리스에서 재현되어야 합니다.

## 2026년 10월 릴리스 조사

[공식 설치 프로그램](https://antigravity.google/cli/install.sh)과 [Darwin ARM64 릴리스 매니페스트](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/darwin_arm64.json)를 설치 프로그램 실행 없이 검사했습니다. 매니페스트가 선택한 것은 [버전이 고정된 `agy` 1.4.6 Darwin ARM64 압축 파일](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.4.6-4884751325200384/darwin-arm/cli_mac_arm64.tar.gz)과 다음 압축 파일 SHA-512입니다.

```text
25af49004dd6d6013e6231278e2711b95641c8e54b661be871b3519c0a850053d4e707f46b47aa66e84ff9480041b13908194b48b1a97f84f2a22071d9c9fd3f
```

압축 파일의 체크섬이 일치했습니다. 바이너리는 이 작업 전용 임시 디렉터리에 풀었습니다. 네트워크 접근, 홈 디렉터리 읽기/쓰기, 키체인 서비스 접근을 차단한 macOS 샌드박스에서 `--version`과 `--help`만 실행했습니다. 두 호출 모두 성공적으로 종료되었습니다. 도움말에는 후크 비활성화, 격리된 프로필, 설정 디렉터리 옵션이 없었습니다.

이 조사에서는 CLI 설치나 인증, 인증 정보 확인, 모델 호출, 로그인된 계정의 모델 목록 조회, 후크 실행 테스트를 **수행하지 않았습니다**. 공개 플래그 목록을 뒷받침할 뿐, 격리가 불가능하다고 증명하거나 구독을 통한 생성을 검증하지는 않습니다.

## 2026년 11월 Windows 조사

설치된 `agy`는 버전을 1.5.11로 보고했습니다. SHA-512는 [공식 Windows AMD64 매니페스트](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/windows_amd64.json)에서 확인한 체크섬과 일치했지만, 당시 매니페스트 응답은 보관하지 않았습니다. 이후 계속 갱신되는 매니페스트는 1.5.12로 바뀌었습니다. 검토 중 [버전이 고정된 1.5.11 Windows 실행 파일](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.11-6132547114106880/windows-x64/cli_windows_x64.exe)을 별도로 다운로드하고 실행 없이 해시를 계산했습니다. 234,827,416바이트인 이 파일은 설치된 실행 파일의 SHA-512와 일치했습니다.

```text
7de2a90b3a351c5c1d089b50a773d4fc455062870fa62fc4d50ee2779d7b9f1b630a7025c31163671f6c82ae0426aeda838f98f67270a50fdd2c7de2f2d7eb3f
```

이 작업 전용 임시 작업 공간에서 다음 `.agents/agents/me-isolation-probe.md` 프런트매터를 사용해 테스트했습니다.

```yaml
name: me-isolation-probe
description: Harmless execution-isolation qualification fixture.
mainAgent: true
subagent: false
tools: []
inheritCustomizations: false
inheritMcp: false
excludeDefaultComponents: true
commandExecutionPolicy: off
```

공식 [사용자 지정 에이전트 프런트매터 참조](https://antigravity.google/docs/subagents/)는 `mainAgent`, `subagent`, `tools`, `commandExecutionPolicy`를 문서화합니다. 상속 및 제외 제어는 앞서 인용한 플러그인 가이드와 변경 내역에 설명되어 있습니다. 테스트 대역은 설정 조합으로 테스트했으므로, 에이전트 선택에 성공했다고 해서 각 필드가 독립적으로 적용되었다고 볼 수는 없습니다.

생성에는 `--settings <session-settings-json> --agent me-isolation-probe --model gemini-4-neon-high --disable-slash-commands --print-timeout 40s --output-format stream-json -p <prompt>`를 사용하고, 별도로 하위 프로세스에 55초 제한을 두었습니다. 인라인 JSON 설정은 임시 작업 공간을 신뢰하도록 지정하고, 기본 에이전트 모드를 선택하고, 사용자 지정 상태/제목 스크립트를 비활성화하고, 아래에 명시된 권한 모드를 선택했습니다. 권한 검사를 건너뛰지 않았습니다.

설정 객체는 다음 형태였으며, `<temporary-workspace>`는 조사 디렉터리로 바꾸고 `toolPermission`은 해당 행의 권한 모드로 설정했습니다.

```json
{
  "trustedWorkspaces": ["<temporary-workspace>"],
  "agentMode": "",
  "toolPermission": "strict",
  "statusLine": { "enabled": false },
  "title": { "enabled": false }
}
```

조사 하위 프로세스 환경에서 API 키와 ADC 환경 전환 변수를 제거했습니다. 인증 정보는 추출하거나 복사하지 않았습니다.

후크 테스트 대역은 `SessionStart`, `PreInvocation`, `PostInvocation`, `Stop`의 이벤트 이름을 각각 별도의 표식 파일에 덧붙였습니다. 로컬 Python MCP 테스트 대역은 stdio로 `initialize`와 `tools/list`에 응답하기 전에 시작 표식을 덧붙였습니다. 작업 공간 MCP 설정에는 `.agents/mcp_config.json`을 사용했습니다. 플러그인은 `plugin.json`, `hooks.json`, `mcp_config.json`을 포함했으며, [사용자 지정 설정 검색](https://antigravity.google/docs/customization-discovery/)의 설명대로 `.agents/plugins.json` 또는 `~/.gemini/config/plugins.json`의 `entries` 매니페스트를 통해 발견되었습니다. 후크, MCP, 파일 읽기 대조군은 같은 테스트 대역과 세션 설정을 유지하면서 `--agent`만 생략했습니다. 존재하지 않는 이름 조사에서는 유효한 `--agent me-isolation-probe`와 찾을 수 없는 에이전트 이름을 비교했습니다.

| 조사 | 대조군 | 사용자 지정 에이전트 |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| 작업 공간 및 전역 후크, 작업 공간에서 발견된 플러그인 후크(`strict` 권한) | 각 공급원에서 이벤트 4개 모두 표식을 기록함 | 후크 표식 없음 |
| 작업 공간 MCP 및 작업 공간에서 발견된 플러그인 MCP(`strict` 권한) | 하위 프로세스 둘 다 시작 표식을 기록함 | 시작 표식 둘 다 나타나지 않음 |
| 전역에서 발견된 플러그인 후크(`request-review` 권한) | 이벤트 4개 모두 표식을 기록함 | 후크 표식 없음 |
| 전역에서 발견된 플러그인 MCP(`request-review` 권한) | 하위 프로세스가 시작 표식을 기록함 | 하위 프로세스가 여전히 시작 표식을 기록함 |
| 예측할 수 없는 테스트 대역 값을 명시적으로 `view_file`로 읽도록 요청(`request-review` 권한) | 테스트 대역 값을 반환함 | `FILE_UNAVAILABLE`을 반환하고 테스트 대역 값은 반환하지 않음 |
| 존재하지 않는 `--agent` 이름(`strict` 권한) | `--agent me-isolation-probe`로 생성 완료 | 잘못된 이름은 오류 결과, 사용량 0, 후크/MCP 표식 없이 종료 코드 1로 끝남 |

전역에서 발견된 플러그인 MCP 결과는 `strict` 권한으로 두 번 반복 확인했으며, 호출마다 새 시작 표식 경로를 사용했습니다. 사용자 지정 에이전트 요청 둘 다 종료 코드 0으로 끝났고 하위 프로세스 둘 다 표식을 기록했습니다. 이전 대조군의 쓰기가 지연되었더라도 이 새 경로에는 기록할 수 없었습니다. 생성된 답변에서 MCP 도구를 사용하지 않았음에도, 실행을 차단하지 못한 이 문제가 여전히 관찰되었습니다.

파일 읽기 프롬프트는 `Use view_file to read <fixture-path> and reply with its exact contents. Do not guess.`였으며, 임시 테스트 파일의 절대 경로를 대입했습니다. 사용자 지정 에이전트의 Markdown 본문에는 파일을 읽을 수 없으면 `FILE_UNAVAILABLE`로 답하라는 지시가 있었습니다.

조사 중 공식 매니페스트가 갱신되었을 때, 설치된 CLI를 교체하지 않고 [1.5.12 Windows 실행 파일](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe)을 작업 전용 조사 디렉터리에 다운로드했습니다. SHA-512는 다음과 같이 보관한 매니페스트 응답과 대조하여 검증했습니다.

```json
{
  "version": "1.5.12",
  "url": "https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe",
  "sha512": "64603ba45b2783587edc62fd9effa9228091593b440ed54368e098bb5fb3ee034bada58c4125e3c0e509ed460b327e454dc99971d04d47c7aee417f00f56d801"
}
```

같은 기존 로그인과 `request-review` 권한으로 1.5.12에서 전역 발견 플러그인 및 파일 읽기의 대조군/사용자 지정 에이전트 쌍을 다시 테스트했습니다. 대조군은 모든 플러그인 후크 이벤트를 실행하고 MCP 하위 프로세스를 시작하고 테스트 대역 값을 반환했습니다. 사용자 지정 에이전트는 `FILE_UNAVAILABLE`을 반환하고 해당 후크를 억제했지만, MCP 하위 프로세스는 여전히 시작했습니다. 생성 요청 둘 다 종료 코드 0으로 끝났습니다. 표의 나머지 행은 1.5.11에서만 테스트했습니다.

스트림의 `init.agent`는 선택된 사용자 지정 에이전트를 식별했으며, 별도의 1.5.11 프롬프트는 해당 에이전트의 Markdown 본문에만 정의된 표식을 반환했습니다. 하지만 `init.tools`는 대조군과 사용자 지정 에이전트에 대해 `run_command`와 `view_file`을 포함한 같은 내장 도구를 나열했습니다. 이 목록만으로 실제 도구 접근 권한을 판단하지 마세요. 파일 읽기 조사는 한 도구에서 관찰한 동작을 입증할 뿐, 나머지 도구는 여전히 검증해야 합니다.

전역 테스트 대역은 이전에 없던 후크/매니페스트 경로에만 생성했으며, 배타적 파일 생성과 삭제 전 내용 확인을 포함한 정리 절차를 사용했습니다. 임시 전역 파일 둘 다 제거했고, 영구 CLI 설정의 해시는 조사 전과 일치했습니다. CLI는 일반적인 대화 상태를 유지했습니다. 조사 과정에서 기존 전역 설정을 교체하지 않았습니다.

조사에서는 인증 정보의 내용을 확인하지 않았으며, 인증은 공식 CLI 안에서 처리했습니다.

이 Windows 실측 결과는 구독 인증을 통한 생성을 입증하고 기존 후크 우려의 범위를 좁힙니다. 하지만 전역에서 발견된 플러그인 MCP가 여전히 시작되므로 어댑터의 조건을 충족하지는 못합니다. 전역 독립형 MCP 서버, 상속되는 스킬/규칙/하위 에이전트, 실제 동작을 수행할 수 있는 모든 도구, 취소, 오랫동안 출력이 없는 동작, 실제 Linux/macOS 실행은 아직 테스트하지 않았습니다. CLI 변경 내역의 최근 플러그인 정책 및 샌드박스 수정만으로는 일반적인 개인용 구독 요청이 모든 실행 가능한 사용자 지정 설정을 제외한다고 볼 수 없습니다.

## 어댑터 제공 전에 필요한 증거

1. 어떤 요청도 실행할 수 있기 전에 전역 및 작업 공간 후크, 플러그인, 스킬, 규칙, 하위 에이전트, MCP 서버, 실제 동작을 수행할 수 있는 도구를 제외하는 지원된 방법을 확립하세요. 일반적인 계정 로그인은 공식 CLI 안에서 처리하고, 토큰을 추출하거나 복사하지 마세요.
2. 실제 공식 CLI와 제어된 로컬 모델 테스트 대역을 사용해 이 방법을 검증하세요. 전역 및 작업 공간 후크와 플러그인/MCP에 관찰 가능한 테스트 표식을 설치하고 규칙과 도구 요청도 준비하세요. 격리된 실행과 더불어, 격리가 없으면 표식을 관찰할 수 있음을 보여 주는 음성 대조군도 검증하세요.
3. 선택한 사용자 지정 에이전트가 실행 전에 올바르게 확인되는지 증명하세요. 지원하지 않는 버전, 찾지 못한 에이전트 이름, 알 수 없는 목록 형식, 결론이 불분명한 격리 검사는 거부하세요. 내부 로그 문구나 시작 시 비어 보이는 도구 목록에 의존하지 마세요.
4. 하위 프로세스 입출력 제한, 비공개 임시 파일과 정리, 취소, 0이 아닌 종료 코드와 결과 오류 처리, 활동을 고려하는 시간 초과 테스트를 추가하세요. 표시되는 텍스트 없이 오래 사고하는 경우도 포함해야 합니다. 공식 명령으로 계정별 모델을 가져오고 선택한 모델과 지원되는 추론 강도를 유지하세요.
5. 기존 연결/제공자 계약을 재사용하세요. Claude SDK의 `settingSources: []` 같은 옵션은 해당 제공자 전용이며 `agy`로 옮길 수 있는 플래그가 아닙니다. 실제 인증, 구독 과금, 실제 기기 플랫폼에서 아직 검증하지 못한 부분을 명확히 밝히세요.

1.5.11 및 1.5.12 Windows 결과는 이 검사 중 일부를 충족하지만, 하위 프로세스 시작을 막지 못하는 문제가 재현됩니다. #8143은 계획 없음으로 닫힌 상태를 유지합니다. 이번 재검증은 이슈를 다시 열거나 런타임 작업을 승인하지 않습니다. 유지 관리자의 결정과 검증 완료 없이 런타임 제공자 항목을 추가해서는 안 됩니다.
