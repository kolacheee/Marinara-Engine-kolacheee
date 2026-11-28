# 引导生成与 Impersonate

左右聊天走向有两种办法。引导生成给下一条回复指个方向，同时不会发出一条可见的消息。Impersonate(替你发言) 则让模型替你写出你自己的那条回复。Quick replies(快捷回复) 菜单把这两种操作都放在 **Send**(发送) 旁边。

## 用 /guided 引导一条回复

你给出的方向属于戏外内容。它会影响回复，但不会作为聊天消息显示出来。

1. 在消息框里输入 `/guided` 和你的方向说明。
2. 按 <kbd>Enter</kbd> 或点击 **Send**。

模型写下一条回复时会朝你给的方向走。例如：

```text
/guided make him admit he is lying
```

也可以用 `/narrator`、`/narrate` 或 `/nar` 代替 `/guided`。在群聊里，用 `respond as`、`reply as` 或 `respond for` 让方向只针对某一个角色：

```text
/guided respond as Alice make her admit she is lying
```

## 引导式重新生成

这种方式会把消息框里的文字当成一次性的方向说明，用于重新生成。

1. 打开 **Settings → Chatting → Editing & Swipes**(设置 → 聊天中 → 编辑与备选回复)，开启 **Guide swipes/regens with chat input**(用聊天输入引导备选回复和重新生成)。它默认关闭。
2. 在聊天里，往消息框里写下方向说明，但不要发送。
3. 点击 AI 消息上的 **Regenerate**(重新生成)。输入框里有文字时，按钮的标签是 **Regenerate (guided)**(带引导的重新生成)。

之后方向说明仍会留在输入框里，所以可以调整一下再重新生成一次。如果想让它自动清空，就在 **Settings → Chatting → Message Box**(设置 → 聊天中 → 消息输入框) 里关闭 **Keep guidance after regenerating**(重新生成后保留引导)。

如果没有成功：按钮的标签必须是 **Regenerate (guided)**。如果只显示 **Regenerate**，说明设置是关闭的，或者输入框是空的。

<a id="read-stored-guidance"></a>

## 查看 Stored guidance

Marinara 会把影响过一条回复的方向说明保存下来。

1. 点击 AI 消息上的 **Stored guidance**(已保存的引导) 图标（一卷卷轴）。
2. 一个标题为 **Stored guidance** 的窗口会显示这条方向说明。

窗口会标注方向说明的来源：**/guided**、**Guided regenerate**(引导式重新生成) 或 **Game start**(游戏开始，即 Game Mode 的初始设置)。对于 `/guided` 和引导式重新生成产生的方向说明，**Copy /guided**(复制为 /guided) 会复制一条可以直接用的 `/guided` 命令，你可以把它粘贴到另一个聊天里。

## 用 Impersonate 写你的回复

Impersonate 让模型用你的用户角色的口吻写出你的下一条消息。用户角色就是你扮演的那个角色，写作 `{{user}}`。见[用户角色](../characters/personas.md)。

开始之前：Impersonate 只能在 Roleplay(角色扮演) 聊天里用。在 Conversation(对话模式) 里你会看到“Impersonate is not available in Conversation mode.”在 Game 里也不能用。

1. 在消息框里输入 `/impersonate`。如果需要，可以在后面接一段方向说明。
2. 按 <kbd>Enter</kbd> 或点击 **Send**。

模型会以你的用户角色的身份发出一条用户消息。例如，下面这条会写出一条询问天气的消息：

```text
/impersonate ask about the weather
```

简写是 `/imp`。**Regenerate** 对 Impersonate 写出的消息同样有效，所以可以换一个版本。

发布的消息算作你的回合，因此智能体和追踪器会像处理手动输入的消息一样运行，除非开启了 **跳过智能体**。开启 **将 CYOA 用作生成方向** 后，选择 CYOA 选项还会紧接着请求角色回复。想在这些操作之前阅读和修改消息，可以让 Impersonate 先写草稿。

### 先写草稿

草稿写入消息框，不会进入聊天。它不会被保存，发送前也不会触发任何操作：没有角色回复，不运行智能体和追踪器，也不改变世界状态。

1. 在 Roleplay 聊天中打开 **聊天设置**，找到 **代写** 部分。
2. 将 **结果去向** 设为 **消息草稿**。默认为 **发布**。
3. 输入 `/impersonate`，按需附上方向说明，然后按 <kbd>Enter</kbd>。

草稿会逐步写入消息框。撰写时，上方会显示 **正在撰写你的下一条消息…**；点击那里的 **停止** 或消息框中的停止按钮，可以保留已经写出的内容。完成后修改文字，再点击 **发送**。发送前，上方提供以下操作：

| 按钮 | 作用 |
| --- | --- |
| **重做** | 按同一方向说明重写草稿，替换消息框中的草稿。 |
| **撤销** | 丢弃草稿，恢复消息框原来的内容。 |

切换到其他聊天或标签页后，草稿仍会继续撰写。回来时，它就在原聊天的消息框中。每个聊天都有自己的草稿。

要只选择这一次的行为，而不修改设置：

| 命令 | 作用 |
| --- | --- |
| `/impersonate_draft` | 撰写草稿。也可用 `/impd` 和 `/imp_draft`。 |
| `/impersonate_post` | 发布消息。也可用 `/impp` 和 `/imp_post`。 |

开启 **快捷回复** 后，**发送** 旁的菜单也提供这两种操作：**代写** 遵循设置，另一个操作执行相反的行为。消息框为空也能开始写草稿，此时由模型选择你要说什么。

开启 **将 CYOA 用作生成方向**，并将 **结果去向** 设为 **消息草稿** 后，点击 CYOA 选项会以该选项为方向说明撰写草稿。选项会一直显示到发送为止。

### Impersonate 相关设置

这些设置适用于所有聊天中的每次 `/impersonate`，并在所有窗口和设备上生效。在 Roleplay 聊天中打开 **聊天设置**，找到 **代写** 部分。打开面板的方法见[聊天设置总览](chat-settings.md)。

| 控件 | 作用 |
| --- | --- |
| **结果去向** | **发布** 立即将消息加入聊天。**消息草稿** 将消息写入消息框，供你修改后自行发送。见[先写草稿](#write-a-draft-first)。默认：**发布**。 |
| **Prompt Template**(提示词模板) | 一段可选的指示，每次执行 impersonate 时都会发出去。留空则使用聊天自己的提示词，或者内置的默认值。它支持 `{{user}}`、`{{persona_description}}` 和 `{{impersonate_direction}}`，这些占位符会被 Marinara 替换成真实文字。选择 **Built-in default**(内置默认值) 可以查看默认文本，**Copy built-in default to edit**(复制内置默认值以编辑) 会以它为起点新建一份副本，**Save as**(另存为) 会保存一个命名模板，**Delete template**(删除模板) 会删掉一个模板。 |
| **Preset**(预设) | 只用于 impersonate 回复的提示词预设。默认：**Use chat default**(使用聊天默认值)。见[预设](../prompts/presets.md)。 |
| **Connection**(连接) | 用于 impersonate 回复的模型，比如更便宜或更快的模型。默认：**Use chat default**。也可以选 **Random**(随机)。见[连接 AI 服务商](../connections/connecting-to-a-provider.md)。 |
| **跳过智能体** | 代写时跳过智能体（追踪器、世界书路由等辅助程序），让生成更快，也避免改变世界状态。默认关闭。草稿始终跳过它们。见[智能体](../agents/agents-overview.md)。 |
| **Send Public Faces**(发送公开形象) | 在 Roleplay 聊天中，填写了 **Public Face**(公开形象) 的角色会只以名字和 Public Face 出现在代写提示词里，让代写的回复只知道你可能知道的事。这会替代角色卡发送的其他所有内容：Description、Personality、Backstory、Appearance、Scenario、System Prompt、对话示例、RPG 属性、Post-History Instructions 和 Depth Prompt。Public Face 为空的角色仍会发送完整角色卡。代写预设或提示词模板中放入的宏，例如 `{{description}}`，仍会发送各自指定的内容。**Regenerate**(重新生成) 会保留撰写该消息时的设置。默认关闭。见 [Card 选项卡](../characters/creating-and-editing-characters.md#card-tab)。 |
| **Use CYOA as direction**(把 CYOA 选项当作方向说明) | 点击一个 CYOA(自选冒险) 选项时，把它当作 impersonate 的方向说明，而不是直接发出去。默认关闭。如果在 **Settings → Chatting → Message Box** 里开启了 **Add CYOA choices to the message box instead of sending them**(把 CYOA 选项加入消息框而不是直接发送)，点击只会把文字加进你的消息框，这个设置也就不起作用。 |

### 为单个聊天设置提示词

1. 输入 `/impersonate_prompt`，后面用引号括上你的提示词。
2. 按 <kbd>Enter</kbd>。

```text
/impersonate_prompt "You will now play as my OC:"
```

要恢复默认，输入 `/impersonate_prompt reset`。简写是 `/imp_prompt`。

## 在 Send 旁边添加 Quick replies

Quick replies 会加上几个一键使用的 **Send** 替代操作，让你不用输入斜杠命令。

1. 打开 **Settings → Chatting → Message Box**。
2. 开启 **Quick replies**。它默认关闭。
3. 展开它，挑选要显示哪些操作。开启后，三个操作默认都是开启的。

| 操作 | 作用 |
| --- | --- |
| **Post only**(仅发布) | 把你打好的消息加进聊天，但不触发回复。命令 `/send <message>` 效果相同。 |
| **Guide reply**(引导回复) | 把你打好的文字当作 `/guided` 方向说明发出去。 |
| **代写** | 以输入的文字为方向说明，生成用户角色一方的回复。遵循 **结果去向**；Roleplay 中旁边的另一个操作执行相反行为（**代写为草稿** 或 **代写并发布**）。在 Conversation 聊天中隐藏。 |

只开启一个操作时，它的按钮就在 **Send** 旁边。开启多个时，它们会收进一个三点按钮（**Quick replies**），点它会打开一个菜单。
