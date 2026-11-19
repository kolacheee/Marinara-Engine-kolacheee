# Antigravity CLI 订阅集成资格评估

这是一份针对 [#8143](https://github.com/Pasta-Devs/Marinara-Engine/issues/8143) 的开发者研究笔记，首次核查于 2026-10-23，并于 2026-11-19 针对官方 `agy` 1.5.11 和 1.5.12 Windows 发行版复查。Marinara Engine **尚未实现** Antigravity 订阅连接，该 issue 仍以不计划实现的状态关闭。自定义智能体的排除设置阻止了本次复查中测试的钩子，但两个发行版仍会启动通过全局配置发现的插件的 MCP 子进程。执行隔离仍未通过资格评估。

## 已确认的官方接口

官方 `agy` CLI 支持使用缓存的账号凭据登录，也支持无交互界面的文本生成。文档中的协议包含 `init`、`step_update` 和 `result` 事件，流式输入通过 stdin 传入 JSON 格式的用户消息。在 Windows 复查中，`agy models` 列出了 `gemini-4-neon-high`，使用用户现有的 Google AI Pro 登录状态向该模型发起有时限的请求，均成功完成。账号实际可用的模型必须从已安装的 CLI 获取，不能根据这个示例推断。`--print-timeout 0` 会等待操作完成，`--disable-slash-commands` 会禁用 print 模式下的命令展开。参见[无界面模式](https://antigravity.google/docs/cli/headless/)和 [CLI 参数参考](https://antigravity.google/docs/cli/reference/)。

CLI 的账号登录使用操作系统的凭据存储。独立的 Gemini API 密钥模式要求设置 `modelProvider: "gemini"` 和 `GEMINI_API_KEY`；订阅适配器不能悄悄切换到这种计费方式。Python SDK 文档列出的程序化认证方式是 Gemini API 密钥、Vertex/Google Cloud 凭据和本地模型。这些方式无法证明，基于 SDK 的替代方案能够使用面向个人用户的订阅进行认证。参见[认证](https://antigravity.google/docs/install/#programmatic-authentication)和 [SDK 概览](https://antigravity.google/docs/sdk/overview/)。

## 当前执行隔离结果

官方自定义智能体定义提供工具、MCP 和自定义配置的控制选项。插件指南说明，`inheritCustomizations` 控制继承的技能、规则和钩子，`inheritMcp` 控制继承的工作区 MCP 服务器。早先关于 `excludeDefaultComponents: true` 的公告表示会保留模型调用后的钩子，因此单靠这个参数无法保证隔离。下面的组合配置在 1.5.11 中阻止了预先设置的测试钩子，但未能阻止所有 MCP 子进程启动。参见[自定义子智能体](https://antigravity.google/docs/subagents/)、[构建插件](https://antigravity.google/docs/build-plugins/)和 [CLI 更新日志](https://antigravity.google/docs/changelog)。

钩子可以来自工作区、全局文件 `~/.gemini/config/hooks.json` 和已安装的插件，涵盖会话、模型调用、工具和停止事件。当前设置文档和[官方设置架构](https://antigravity.google/schemas/v1/settings.json)明确说明，不会加载 `settings.json` 中的 `hooks` 条目。在那里写入空条目并不能禁用真正的钩子来源。参见[钩子](https://antigravity.google/docs/hooks)和 [CLI 设置](https://antigravity.google/docs/settings?tab=cli)。

已安装的 1.5.11 帮助说明，`--settings` 可通过内联内容或文件，仅在当前会话中覆盖 `settings.json` 的键。这允许临时设置工作区信任和权限，而不改写持久化的偏好设置。它并不提供独立的配置档案：`--settings '{"hooks":{}}'` 会以退出码 1 退出，并报错 `unknown setting "hooks"`。已安装版本的帮助中没有禁用钩子或保留认证的隔离配置档案选项。

当前设置文档说明，`/hooks` 可以添加、编辑和开关钩子，改动会保存到配置文件。在复查中，无界面命令 `-p "/hooks" --output-format json` 返回了结构化清单。清单和保存的开关状态并不能保证后续调用会排除可执行的自定义配置。切换目录、提供空的 `tools` 列表、指示模型避免使用工具，或在启动后中止，都不足以证明执行已经隔离。

第三方集成报告只能作为调查线索。有关无实际作用的工具、智能体解析日志或自定义配置继承的说法，必须在官方发行版上复现后，才能成为 Engine 依赖的保证。

## 2026 年 10 月发行版探查

已检查[官方安装程序](https://antigravity.google/cli/install.sh)及其 [Darwin ARM64 发行清单](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/darwin_arm64.json)，但没有运行安装程序。清单选定了[带版本号的 `agy` 1.4.6 Darwin ARM64 归档](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.4.6-4884751325200384/darwin-arm/cli_mac_arm64.tar.gz)，其 SHA-512 如下：

```text
25af49004dd6d6013e6231278e2711b95641c8e54b661be871b3519c0a850053d4e707f46b47aa66e84ff9480041b13908194b48b1a97f84f2a22071d9c9fd3f
```

归档校验和一致。二进制文件被解压到本任务专用的临时目录中。仅在 macOS 沙箱内运行了 `--version` 和 `--help`，沙箱禁止网络访问、主目录读写和钥匙串服务访问。两次调用均成功退出。帮助内容没有列出禁用钩子、隔离配置档案或指定配置目录的选项。

此次探查**没有**安装 CLI、对 CLI 进行认证、查看凭据、调用模型、列出已登录账号的模型，也没有测试钩子执行。它仅印证了公开的参数清单；既不能证明隔离不可能实现，也不能验证订阅生成是否可用。

## 2026 年 11 月 Windows 探查

已安装的 `agy` 报告版本为 1.5.11。其 SHA-512 与当时在[官方 Windows AMD64 清单](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/windows_amd64.json)中看到的校验和一致，但没有保留那次原始清单响应。滚动更新的清单后来升级到了 1.5.12。审核期间，独立下载了[带版本号的 1.5.11 Windows 可执行文件](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.11-6132547114106880/windows-x64/cli_windows_x64.exe)，计算哈希但未运行；这个 234,827,416 字节的文件与已安装可执行文件的 SHA-512 一致：

```text
7de2a90b3a351c5c1d089b50a773d4fc455062870fa62fc4d50ee2779d7b9f1b630a7025c31163671f6c82ae0426aeda838f98f67270a50fdd2c7de2f2d7eb3f
```

测试在本任务专用的临时工作区中运行，`.agents/agents/me-isolation-probe.md` 使用以下 frontmatter：

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

官方[自定义智能体 frontmatter 参考](https://antigravity.google/docs/subagents/)记录了 `mainAgent`、`subagent`、`tools` 和 `commandExecutionPolicy`。继承和排除控制选项见上文引用的插件指南和更新日志。测试将这些配置作为一个组合来检验；成功选择智能体并不能证明每个字段都独立生效。

生成使用 `--settings <session-settings-json> --agent me-isolation-probe --model gemini-4-neon-high --disable-slash-commands --print-timeout 40s --output-format stream-json -p <prompt>`，并为子进程另设了 55 秒时限。内联 JSON 设置将临时工作区设为可信，选择默认智能体模式，禁用自定义状态/标题脚本，并选择下文注明的权限模式。没有跳过任何权限检查。

设置对象的结构如下，其中 `<temporary-workspace>` 替换为探查目录，`toolPermission` 设为表格对应行的权限模式：

```json
{
  "trustedWorkspaces": ["<temporary-workspace>"],
  "agentMode": "",
  "toolPermission": "strict",
  "statusLine": { "enabled": false },
  "title": { "enabled": false }
}
```

探查子进程的环境中移除了 API 密钥和 ADC 环境开关；没有提取或复制任何凭据。

钩子测试配置为 `SessionStart`、`PreInvocation`、`PostInvocation` 和 `Stop` 分别准备了哨兵文件，向其中追加事件名称。本地 Python MCP 测试程序在通过 stdio 响应 `initialize` 和 `tools/list` 之前，先追加启动标记。工作区 MCP 配置使用 `.agents/mcp_config.json`。插件包含 `plugin.json`、`hooks.json` 和 `mcp_config.json`，通过 `.agents/plugins.json` 或 `~/.gemini/config/plugins.json` 中的 `entries` 清单发现，具体机制见[自定义配置发现](https://antigravity.google/docs/customization-discovery/)。钩子、MCP 和文件读取的对照测试省略了 `--agent`，其余测试配置和会话设置保持一致。不存在的名称探查则比较了有效的 `--agent me-isolation-probe` 与无法解析的智能体名称。

| 探查 | 对照 | 自定义智能体 |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| 工作区和全局钩子；通过工作区发现的插件钩子（`strict` 权限） | 每个来源的全部四种事件都写入了标记 | 没有钩子标记 |
| 工作区 MCP 和通过工作区发现的插件 MCP（`strict` 权限） | 两个子进程都写入了启动标记 | 两个启动标记都未出现 |
| 通过全局配置发现的插件钩子（`request-review` 权限） | 全部四种事件都写入了标记 | 没有钩子标记 |
| 通过全局配置发现的插件 MCP（`request-review` 权限） | 子进程写入了启动标记 | 子进程仍然写入了启动标记 |
| 明确要求用 `view_file` 读取无法预测的测试文件值（`request-review` 权限） | 返回了测试文件中的值 | 返回 `FILE_UNAVAILABLE`；未返回测试文件中的值 |
| 不存在的 `--agent` 名称（`strict` 权限） | `--agent me-isolation-probe` 完成了生成 | 无效名称以退出码 1 退出，结果为错误，用量为零，无钩子/MCP 标记 |

针对通过全局配置发现的插件 MCP，又使用 `strict` 权限重复测试了两次，每次调用都使用新的启动标记路径。两次自定义智能体请求的退出码均为 0，两个子进程都写入了标记。先前对照测试中的延迟写入不可能写到这些新路径。尽管生成的回复没有使用 MCP 工具，这仍是已观察到、尚未解决的执行隔离阻碍。

文件读取提示词为 `Use view_file to read <fixture-path> and reply with its exact contents. Do not guess.`，其中替换为临时测试文件的绝对路径。自定义智能体的 Markdown 正文指示它：如果无法读取文件，就回复 `FILE_UNAVAILABLE`。

调查期间官方清单更新后，将 [1.5.12 Windows 可执行文件](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe)下载到了本任务专用的探查目录，没有替换已安装的 CLI。其 SHA-512 已对照下面保留的清单响应验证：

```json
{
  "version": "1.5.12",
  "url": "https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe",
  "sha512": "64603ba45b2783587edc62fd9effa9228091593b440ed54368e098bb5fb3ee034bada58c4125e3c0e509ed460b327e454dc99971d04d47c7aee417f00f56d801"
}
```

使用相同的现有登录状态和 `request-review` 权限，在 1.5.12 上重复了通过全局配置发现的插件及文件读取的对照/自定义智能体测试。对照测试执行了全部插件钩子事件，启动了 MCP 子进程，并返回了测试文件中的值。自定义智能体返回了 `FILE_UNAVAILABLE`，也阻止了这些钩子，但仍启动了 MCP 子进程。两次生成请求的退出码均为 0。表格中的其他行仅在 1.5.11 上测试过。

流式输出中的 `init.agent` 标识了选中的自定义智能体，另一个 1.5.11 提示词测试还返回了仅在该智能体 Markdown 正文中定义的标记。不过，`init.tools` 为对照和自定义智能体列出了相同的内置工具，包括 `run_command` 和 `view_file`。不能据此清单判断工具实际是否可用。文件读取探查只确认了一个工具的实际行为，其他工具仍需资格评估。

全局测试配置只在原本不存在的钩子/清单路径上创建，采用排他方式创建文件，清理时先核对内容再删除。两个临时全局文件都已删除，CLI 持久化设置的哈希与探查前一致。CLI 保留了正常的聊天状态。这些探查没有替换已有的全局配置。

这些探查没有查看凭据内容；认证始终留在官方 CLI 内。

这些 Windows 实测结果确认了通过订阅认证进行生成是可行的，也缩小了最初对钩子的疑虑范围。但适配器仍未通过资格评估：通过全局配置发现的插件 MCP 仍会启动。全局独立 MCP 服务器、继承的技能/规则/子智能体、所有能采取实际操作的工具、取消、长时间无输出时的行为，以及 Linux/macOS 实际执行，均尚未测试。CLI 更新日志中较新的插件策略和沙箱修复，不能证明普通个人订阅请求会排除所有可执行的自定义配置。

## 交付适配器前所需的证据

1. 确立受支持的机制，在任何请求有机会执行之前，排除全局和工作区钩子、插件、技能、规则、子智能体、MCP 服务器以及能采取实际操作的工具。正常账号登录必须留在官方 CLI 内，不要提取或复制 Token。
2. 使用真正的官方 CLI 和受控的本地模型测试替身检验该机制。为全局和工作区钩子、插件/MCP 设置可观察的测试标记，并准备规则和工具请求。既要验证隔离运行，也要用反向对照证明：未隔离时，确实能够观察到这些标记。
3. 在执行前证明 CLI 确实识别到了所选的自定义智能体。拒绝不受支持的版本、无法解析的智能体名称、未知的清单格式，以及无法得出结论的隔离检查；不要依赖内部日志措辞或启动时看似为空的工具列表。
4. 为子进程输入/输出设置上限，使用私有临时文件并清理，支持取消，处理非零退出码和结果错误，并测试根据活动情况判断的超时，包括长时间思考却没有可见文本的情况。通过官方命令获取账号专属模型，并保留所选模型和受支持的推理力度。
5. 复用现有的连接/服务商契约。Claude SDK 的 `settingSources: []` 等选项属于特定服务商，不能直接当成 `agy` 的参数使用。明确说明真实认证、订阅计费和实体平台测试方面仍未验证的部分。

1.5.11 和 1.5.12 的 Windows 结果满足了其中部分检查要求，但仍有可复现的子进程启动隔离失败。#8143 仍以不计划实现的状态关闭；本次复查既没有重新打开该 issue，也没有授权运行时开发。在维护者作出决定且资格评估完成之前，不应新增运行时服务商条目。
