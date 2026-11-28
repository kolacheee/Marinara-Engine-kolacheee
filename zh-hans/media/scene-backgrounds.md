# Illustrator 生成的背景

**插画师** 智能体可以为故事绘制背景：手动请求时、每次抵达新地点时、天气变化时绘制雨雪或雾天版本，时间变化时绘制黎明、白天、日落或夜晚版本。本指南介绍这些功能，以及 Illustrator 如何复用已有图片，避免重新绘制。

手动上传和挑选的图片见[背景库](../appearance/chat-backgrounds.md)。聊天如何选择显示哪张图片（Background 智能体、固定地点和图库图片），见[跟随故事变化的背景](../roleplay/backgrounds.md)。

## 开始之前

- 从 **Library → Agents**(资料库 → 智能体) 安装 **Illustrator**。见 [Illustrator 智能体](illustrator-agent.md)。
- 为它指定图像模型：在 Connections 页面的 **Defaults**(默认值) 框里设置 **Images**(图像) 这项工作，或在 Illustrator 的 **Open Setup**(打开设置) 页面上选择一个。见[图像生成服务商与设置](image-providers.md)。

生成的背景适用于 Roleplay(角色扮演) 和 Game 聊天，不适用于 Conversation(对话模式)。在 Conversation 中，应用会提示“Scene background generation is available in Roleplay and Game modes.”

## 立即生成背景

1. 点击聊天里的滑块按钮，打开 **Chat Settings**(聊天设置)，展开 **Gallery**(图库)。
2. 点击 **Background**(背景)。生成期间会显示 **Generating...**(正在生成...)。
3. 完成后，新图片会加入背景库并显示在聊天后方，同时显示“Background generated.”确认。

不需要为此把 Illustrator 添加到聊天里。它只运行一次，不会开始自动运行。

Marinara 根据场景构建提示词：在游戏里，这包括题材、设定、地点、天气和时间。图片使用 **Backgrounds**(背景) 画布尺寸，默认为 1280 × 720 像素，可以在 **Settings → Media → Image Generation**(设置 → 媒体 → 图像生成) 下修改。

如果没有成功：“Choose an image generation connection for the Illustrator agent, or mark one as the default image connection.”表示没有找到图像模型。按**开始之前**的说明设置一个。如果没有 **Background** 按钮，说明尚未安装 Illustrator。

## 每到新地点生成新背景

开启后，故事来到没有背景的地点时，Illustrator 就会绘制背景，保存到背景库并显示。

1. 将 **Illustrator** 添加到聊天：打开 **Chat Settings → Agents**(聊天设置 → 智能体)，开启 **Enable Agents**(启用智能体)，再从 **Misc Agents**(其他智能体) 添加 **Illustrator**。
2. 在 **Illustrator** 卡片上开启 **Generate Scene Backgrounds**(生成场景背景)。

Illustrator 按 **Image Run Interval**(图片运行间隔) 检查场景，默认每 5 条消息一次。想在每次回复后检查，使用 [Decision 模型检查](#check-every-reply-with-a-decision-model)。在 Game Mode(游戏模式) 中，**Game Illustrator**(游戏插画师) 开关也涵盖背景。

### 复用已有图片

为新地点绘图之前，Illustrator 按以下顺序查找已有图片：

1. 在聊天或角色图库里固定到该地点的背景。见[把背景固定到地点](../roleplay/backgrounds.md#pin-a-background-to-a-place)。
2. 背景库中名称或至少包含两个单词的标签出现在 World State 地点中的图片。例如，`generated-guest-bedroom.png` 或带 `guest bedroom` 标签的图片，都能用于“Smith House, guest bedroom”。
3. 没有 World State 地点时，用同样的方法匹配 Illustrator 提示词模型写出的地点名。

匹配时不区分大小写、重音符号和“'s”，最具体的名称优先于 `bedroom.png` 这类泛称。找到匹配图片就会显示（如果有符合故事天气的版本，就显示那个版本），不会重新绘制。只有没有匹配图片的地点才会生成新图。

如果按名称找不到匹配项，而你在 Illustrator 卡片上开启了 **Reuse a library background that looks like the place**(复用图库中看起来符合该地点的背景)，[能读取图片的判定模型](../connections/decision-models.md#features-that-look-at-pictures) 就会查看资料库里最多 4 张与地点名称含有相同单词的图片，并显示符合地点的一张。只有全部不符合时才绘制新图。这项设置默认关闭，没有这样的模型时会变灰。

要确保某个地点一直使用同一张图片，可以用地点名命名文件（如用 `kitchen.png` 对应“Kitchen”），或添加至少包含两个单词的标签，例如 `smith house kitchen`（见[为背景添加标签](../appearance/chat-backgrounds.md#tag-a-background)）。`kitchen` 或 `night` 这种只有一个单词的标签在这里会被忽略，因为它们通常描述的是图片的样子。

## 背景的天气版本

开启后，背景会跟随故事里的天气变化。旅店开始下雨时，Illustrator 会重绘旅店背景，让窗外下起雨。在室内，动态雨滴只出现在窗玻璃后面，不会落满房间。

1. 打开 **Chat Settings → Agents → Illustrator**(聊天设置 → 智能体 → Illustrator)。
2. 开启 **Weather Versions of Backgrounds**(背景的天气版本)。

这需要支持从图片开始生成的图像模型。大多数模型都支持，包括 OpenAI、Gemini、NovelAI，以及带图像输入的 ComfyUI。如果模型不支持，图片会保持原样。

具体行为：

- 每张图片的每种天气只绘制**一次**。天气变回去，或故事再次回到雨中的旅店时，会直接显示保存的版本，不再产生费用。
- 天气版本保存在原图旁边，文件名如 `name--wx-rain.png`。其他类型有 `storm`、`snow`、`blizzard`、`hail`、`fog`、`sand`、`ash`、`embers`、`blossom` 和 `aurora`，以及 `clear`，用于把最初在恶劣天气下生成的图片变成无雨雪的版本。特殊天气会用故事中的原词命名：流星雨是 `name--wx-meteor-shower.png`。
- 晴朗、阳光充足、多云、有风等较温和的天气继续使用普通图片。
- 天气信息来自 **World State**(世界状态) 智能体，或下文的 Decision 模型检查。
- 它涵盖背景库里的所有背景，无论是手动挑选、Background 智能体选择，还是 Illustrator 绘制的；也涵盖固定地点和随角色出现的图库背景。**Background** 智能体在普通图片中选择，有匹配的天气版本时就显示该版本。

### 窗户：动态天气出现的位置

室内图片首次生成天气版本时，Illustrator 还会让图像模型找出图片中的窗户。它把结果保存为一张小型黑白蒙版，房间的所有天气版本共用这张蒙版。之后，动态天气（雨线、雪花、花瓣）只会绘制在玻璃上。

- 没有窗户的房间不会显示动态天气，只保留天气色调和闪电。
- 极光、流星雨等没有飘落物的天气保持静止：图片中会呈现这些天气，但上方没有动态效果。
- 蒙版保存在数据文件夹的 `backgrounds/weather-masks` 中。

### 重做天气图片或窗户

聊天显示天气版本时，**Chat Settings → Agents → Illustrator** 的 **Weather Versions of Backgrounds** 下会出现一行，以天气命名，比如 **This rain picture**(这张雨天图片)：

- **Remake picture**(重做图片) 从普通图片重新绘制这个天气版本。
- **Remake windows**(重做窗户) 让图像模型重新生成窗户蒙版。雨落在坐垫上或漏掉了某扇窗户时，就用这个。
- **No moving weather**(关闭动态天气) 关闭这个房间的蒙版。天气版本只显示天气色调和闪电。用 **Remake windows** 可以恢复。

如果没有成功：检查聊天的 World State 是否显示 **Weather**(天气)（或是否开启了下文的天气检查），并确认已将 **Illustrator** 添加到聊天且指定了图像模型。

## 背景的时段版本

开启后，背景会跟随故事的时钟。旅店入夜时，Illustrator 会重绘夜晚的旅店：窗外天色变暗，屋内灯火和蜡烛亮起。地点、布局和镜头都不变，只改变光线。

1. 打开 **聊天设置 → 智能体 → 插画师**。
2. 开启 **背景时段版本**。

与天气版本一样，需要支持以图片为起点的图像模型。

具体行为：

- 共有四个时段：**黎明**、**白天**、**日落** 和 **夜晚**。由 World State 的时间决定：优先使用钟表时间（`7:40 PM`、`21:15`），否则根据“黄昏”“午夜”“清晨”等词判断。凌晨 5 点前及晚上 8 点起算夜晚，早上 5 点到 7 点算黎明，早上 7 点到下午 5 点算白天，下午 5 点到晚上 8 点算日落。
- 图片被视为展示了绘制时的时段。Illustrator 会记住自己绘制的图片的时段。其他图片按文件名或标签中的时段词判断（`tavern-night.png`、`#sunset`），没有则按白天处理。因此白天图片会生成夜晚版本，夜晚绘制的图片会生成白天版本，不会再生成一张夜晚图。
- 每张图片与每个时段的组合只绘制**一次**，之后免费复用。版本保存在原图旁，命名为 `name--tod-night.png`（也包括 `--tod-dawn`、`--tod-day` 和 `--tod-sunset`）。
- 同时开启天气版本时，一张图会同时包含两者：雨夜为 `name--wx-rain--tod-night.png`，从普通原图绘制一次。只改变天气时保留时段，反过来也一样。
- 每次回复后都会检查时间，不限于 Illustrator 的运行间隔，因此 World State 时钟进入夜晚后就会显示夜景。这只适用于时段：新地点仍需等待 Illustrator 运行，或下方的新地点检查。
- 时段版本已有自己的天空，因此叠加绘制的天空色调、太阳、月亮和星星会减弱。
- World State 没有时间时，可由 Decision 模型检查判断（见下文）。

聊天显示时段版本时，会出现与天气图片相同的操作行，例如 **这张夜晚图片**，并提供 **重新生成图片**。

背景库中的版本归在普通原图下：卡片显示版本数量，打开后会列在 **天气和时段版本** 下。

## 用 Decision 模型检查每次回复

Illustrator 通常只按运行间隔检查场景，所以到新地点后，可能要等几次回复才会生成背景。[Decision 模型](../connections/decision-models.md)是一个做是非判断的小模型，可以在每次回复后检查。

开始之前：在 Connections 页面的 **默认值** 中选择 Decision 模型，并按需组合开启 **生成场景背景**、**背景的天气变体** 和 **背景时段版本**。

1. 打开 **Chat Settings → Agents → Illustrator**。
2. 在 **决策模型检查** 下选择单项检查，例如 **场景移至新地点**、**天气变化** 或 **时段发生变化**，也可选择所有已开启项，例如 **新地点、天气和时段变化**。只会列出已开启设置对应的检查。默认为 **关闭**。

每次回复之后：

- 新地点检查会判断最新消息是否让场景移到了新地点。如果是，就为该地点配上背景，尽量复用已有图片。只有回答为“是”时，提示词模型才会撰写新背景的提示词。
- 天气检查会判断最新消息中天气是否变化。如果是，就显示或绘制当前背景的天气版本。World State 没有天气信息时，Decision 模型还会选择天气类型。
- 时段检查判断最新消息中的时段是否变化。如果是，就显示或绘制当前背景的时段版本。World State 没有时间时，Decision 模型还会选择黎明、白天、日落或夜晚。
- 这些检查只增加触发机会。Illustrator 自身的运行和 World State 地点变化仍然有效。
- 没有答案时（未设置模型、超时或出错），跳过这次检查。

如果没有成功：未选择 Decision 模型时，列表会变灰，并提示去哪里选择。

## 在提示词发出前先检查一遍

1. 打开 **Settings → Media → Generation Defaults**(设置 → 媒体 → 生成默认设置)。
2. 开启 **Expose media prompts before sending**(发送前显示媒体提示词)。

之后每次图像请求发出前都会打开 **Review Image Prompt**(检查图像提示词) 窗口，包括生成背景。修改提示词和负面提示词，再点击 **Generate**(生成) 发送，或点击 **Cancel**(取消) 停止。输入的文字会原样发送。

## 相关指南

- [跟随故事变化的背景](../roleplay/backgrounds.md)：聊天显示哪张图片、固定地点和图库背景。
- [背景库](../appearance/chat-backgrounds.md)：上传、打标签、整理图片，以及模糊效果。
- [Illustrator 智能体](illustrator-agent.md)：场景插图、短片和运行间隔。
- [聊天图库](../chats/chat-gallery.md)：Gallery 区域及其按钮。
- [Decision 模型](../connections/decision-models.md)
