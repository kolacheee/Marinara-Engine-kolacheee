# 从 SillyTavern 转过来

在 SillyTavern 用过的大多数功能，Marinara Engine（下文简称 Marinara）都有，只是有些名称不同。在表格中找到熟悉的词，再点击 **Show me**(带我看看) 打开应用里的对应位置，或点击名称阅读指南。

也可以把 SillyTavern 的用词输入搜索框（**Ctrl+K**，手机上点击标题）。“chat completion preset”、“world info”、“regex”和“author's note”都能找到 Marinara 中的对应功能。

要迁移角色、聊天、预设和 World Info，见[从 SillyTavern 导入](importing-from-sillytavern.md)。聊天会保留消息日期、作者备注和用户角色，预设会保留采样设置。

## 相同功能，Marinara 的名称

| SillyTavern 中的名称 | Marinara 中的名称 | 位置 | |
| --- | --- | --- | --- |
| Chat Completion presets、AI Response Configuration（采样器） | [预设](../prompts/presets.md) | Library → **Presets**(预设)。温度、Top P/K、Min P 和惩罚项都在预设的 **Parameters**(参数) 里 | [带我看看](#show-presets) |
| Prompt Manager | [预设分区](../prompts/presets.md) | Library → **Presets**，打开预设 → **Sections**(分区) | [带我看看](#show-presets) |
| 保存的聊天设置、chat defaults | [设置方案](../chats/settings-profiles.md) | Library → **Settings profiles**(设置方案)，或 New Roleplay → **Use a Profile**(使用方案) | [带我看看](#show-settingsProfiles) |
| World Info、World Book | [世界书](../lorebooks/overview.md) | Library → **Lorebooks**(世界书) | [带我看看](#show-lorebooks) |
| Author's Note | [作者备注](../roleplay/getting-started.md) | Chat Settings(Roleplay) | [带我看看](#show-authorsNotes) |
| Regex | [正则脚本](../extending/regex-scripts.md) | Library → **Regex scripts**(正则脚本) | [带我看看](#show-regexScripts) |
| 群聊 | [群聊](../chats/group-chats.md) | 向聊天添加两个或更多角色 | [带我看看](#show-groupChats) |
| 角色卡、备选开场白 | [角色卡](../characters/import-export.md) | Library → **Characters**(角色) → **Import**(导入)。开始 Roleplay 聊天时可以选择备选开场白 | |
| Quick Replies、STscript | [快捷回复与斜杠命令](../chats/guided-and-impersonate.md) | **Send**(发送) 旁边，或输入 `/` | [带我看看](#show-quickReplies) |
| Extensions(Summarize、Image Generation…) | [智能体](../agents/agents-overview.md) | Library → **Agents**(智能体)，然后按聊天开启 | [带我看看](#show-agents) |
| Summarize、Vector Storage、Data Bank | [记忆功能与摘要](../agents/memory.md) | Chat Settings → **Memory Recall**(记忆功能) | [带我看看](#show-memory) |
| API Connections、Connection Profiles | [连接](../connections/connecting-to-a-provider.md) | Library → **Connections**(连接) | [带我看看](#show-connections) |
| Prompt Itemization | [查看提示词](../chats/peek-prompt.md) | 最新的 AI 回复 → **Peek prompt**(查看提示词) | [带我看看](#show-peekPrompt) |
| Checkpoints、branches | [分支](../chats/branches.md) | 一条消息 → **Branch from here**(从此处创建分支) | [带我看看](#show-branches) |
| Swipes、reroll | [备选回复](../chats/messages.md) | 回复下方的箭头，或在触屏上滑动 | [带我看看](#show-swipes) |
| Persona Management | [用户角色](../characters/personas.md) | Library → **Personas**(用户角色) | [带我看看](#show-personas) |
| UI Themes、Custom CSS | [主题与 CSS 主题](../appearance/custom-css-themes.md) | Settings → **Appearance**(外观) | [带我看看](#show-themes) |

**Show me** 会在可以时打开页面或开始对应步骤。对于聊天内的功能（查看提示词、记忆功能），要先打开一个聊天；否则会打开指南。

## 用法不同的地方

- **没有指令模板或上下文模板。** Marinara 发送聊天消息，由模型服务器套用模型自己的模板，因此没有对应 SillyTavern **Advanced Formatting**(高级格式设置) 的选项。预设分区代替了故事字符串。
- **采样器。** 预设的设置是使用它的聊天的初始值。连接或聊天里设置的值优先。最大回复长度和上下文大小由连接设置。这里没有 Top A 和重复惩罚的对应设置。
- **作者备注。** 每次回复都会按指定深度把它放入聊天。**Post-processing messages**(后处理消息) 设为 **Apply**(应用)（默认值）时，它会随附近的用户消息一起发送。SillyTavern 的频率、位置和角色设置在这里没有对应项。**Peek prompt**(查看提示词) 会标出它的位置。
- **群聊。** Roleplay 默认由一个旁白为所有角色发声，这样消耗的 Token 更少。要像 SillyTavern 一样让每个角色轮流回复，打开 Chat Settings → **Group Chat**(群聊)，切换模式。从 SillyTavern 导入的群聊已经使用 **Individual**(单独) 模式。
- **按键。** 聊天里按 Enter 换行，按 **Ctrl+Enter** 发送。要用 Enter 发送，在 Settings → **Chatting**(聊天) 中开启 **Send on Enter**(按 Enter 发送)。只有在同一标签页开启 **Intuitive swipe navigation**(直观的候选回复导航)，方向键才会切换备选回复。
- **快捷回复。** 这里指 **Send** 旁边的一键操作（代写、引导回复）。SillyTavern 的 Quick Reply 集合不会导入。

- **三种聊天模式。** Marinara 将聊天分为 **Conversation**(对话模式)（像私信一样发消息）、**Roleplay**(角色扮演)（带旁白的长场景）和 **Game**(游戏模式)（游戏主持人按规则管理一个世界）。每次新建聊天都会询问要选哪种，设置界面只显示该模式用到的内容。
- **开始聊天。** 新聊天会打开简短的设置流程。把常用设置保存为设置方案，下次就只需一步：**Use a Profile**，然后 **Apply & Start**(应用并开始)。为方案加星，就能把它设为该模式新聊天的默认方案。
- **搜索能找到所有内容。** **Ctrl+K** 可以查找聊天、角色、设置和指南，运行命令，还能借助 Professor Mari 回答问题。
- **Professor Mari。** Marinara 的内置助手会回答应用相关问题，也能帮你制作角色、世界书和智能体。从主页打开她。

## 相关指南

- [从 SillyTavern 导入](importing-from-sillytavern.md)
- [设置方案](../chats/settings-profiles.md)
- [聊天设置](../chats/chat-settings.md)
