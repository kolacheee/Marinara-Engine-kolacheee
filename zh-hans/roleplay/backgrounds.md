# 随故事变化的背景

Roleplay(角色扮演) 聊天会在消息后面铺一整张场景图。背景可以保持不变，也可以随着故事变化：**Background**(背景) 智能体从已有图片里挑选，固定了背景的地点始终显示对应图片，角色图库里的背景则会跟着角色出现在每个聊天里。图片切换时，Marinara 会把旧图淡出、新图淡入。

这些功能都不要求图像生成。没有图像模型时，可以从上传的图片里挑选；完全没有图片时，背景就显示为纯色。

## 背景功能一览

| 想做什么 | 使用什么 | 指南 |
| --- | --- | --- |
| 给这个聊天放一张背景图 | **Chat Background**(聊天背景) | [给单个聊天指定背景](#set-a-background-for-one-chat) |
| 让背景随场景变化 | **Background** 智能体 | [让 Background 智能体挑选背景](#let-the-background-agent-pick) |
| 让一个地点始终保持同样的样子 | 为地点固定背景 | [为地点固定背景](#pin-a-background-to-a-place) |
| 让角色的房间出现在角色参与的每个聊天里 | 图库背景 | [跟随角色的背景](#backgrounds-that-follow-a-character) |
| 为新地点和天气绘制新图 | **Illustrator** 智能体 | [Illustrator 绘制的背景](../media/scene-backgrounds.md) |
| 上传图片、添加标签、整理图片或设置模糊 | 背景库 | [背景库](../appearance/chat-backgrounds.md) |

故事来到某个地点时，Marinara 会按这个顺序选择：先用这个聊天为该地点固定的背景，再用标有该地点的图库背景，最后用 Background 智能体挑选的图片。只有这些都不合适时，Illustrator 才会绘制新图。无论最终选中哪张图，只要它有对应当前故事天气的版本，就会显示那个版本。

## 给单个聊天指定背景

1. 打开这个聊天，再打开 **Settings → Appearance → Backgrounds**(设置 → 外观 → 背景)。
2. 在 **Chat Background** 下面，点击 **Browse library**(浏览背景库)，选一张图片。

它只改变这一个聊天。想换回默认背景，点击 **Chat Background** 旁边的 **Remove**(移除)。也可以在聊天里的 **Chat Settings → Background**(聊天设置 → 背景) 中挑选。还没有图片？见[导入背景](../appearance/chat-backgrounds.md#import-a-background)。

## 让 Background 智能体挑选背景

**Background** 智能体会在每次回复之后运行。它读取场景，从你所有的背景里挑出最贴合的一张。它只挑已有的图片；想绘制新图，用 Illustrator。

1. 打开 Roleplay 聊天，用滑块按钮打开 **Chat Settings**(聊天设置)。
2. 打开 **Agents**(智能体)，开启 **Enable Agents**(启用智能体)。
3. 添加 **Background** 智能体。

之后故事走到哪里，背景就会自己跟着换。它能看到背景库里的每张图片，包括文件夹里的图片，并根据名称和标签挑选，所以清楚的名称和地点标签会有帮助。

如果没有成功：背景只有一两张时，智能体会一直挑这几张。往图库里多加一些。

## 为地点固定背景

想让一个地点始终保持同样的样子，就用这个功能：John 的卧室始终显示 `john-bedroom`，你自己的卧室始终显示 `my-bedroom`。故事来到固定了背景的地点时，就会显示对应图片，不管 Background 智能体原本会选哪张。

1. 用聊天里的滑块按钮打开 **Chat Settings**，再打开 **Background**。
2. 在 **Pinned places**(固定背景的地点) 下点击 **Add place**(添加地点)。
3. 点击空白图片，选择背景。按故事里的写法输入地点，例如 `John's bedroom`。
4. 可选：在下面添加故事可能用到的其他名称，用逗号分隔，例如 `John's room, the master bedroom`。

更快的办法：故事正好在某个地点、显示的图片也合适时，点击 **Pin this picture to "John's bedroom"**(将这张图片固定到“John 的卧室”)。

固定背景需要知道故事发生在哪里，所以会使用 **World State**(世界状态) 智能体的地点（或 World Maps）。列表底部会显示 **Story is at**(故事所在地点) 和地点名称，正在使用的固定背景会标上 **Here**(此处)。

### 地点如何匹配

- 最具体的名称优先。`John's bedroom` 和 `{{user}}'s bedroom` 不会混淆，只写 `bedroom` 的固定背景仅用于没有单独固定背景的卧室。
- 名称中间多一两个词也算匹配：“John's guest bedroom”会匹配 `John's bedroom`，除非另一项固定背景的名称与这个地点完全一致。匹配不会跨过逗号，也不会跨到另一个所有者，所以“John's house, Mara's bedroom”不会算作 John 的卧室。
- `{{user}}` 是你的用户角色名，`{{char}}` 是聊天里的任意角色名，所以 `{{user}}'s bedroom` 会匹配“Alyssa's bedroom”。
- “我的”和“我们的”取决于消息是谁写的。John 的回复说故事在“我的卧室”里，指的就是 John 的卧室；他的回复里说“你的卧室”，指的就是你的卧室。在你自己的消息里，如果聊天只有一个角色，“你的卧室”指的就是该角色的卧室。
- 大小写、重音符号和撇号不影响匹配。名称按完整单词匹配：`John` 不会匹配“Johnson”。
- 使用 **World Maps**(世界地图) 时，改为从 **World Maps place**(世界地图地点) 列表里选择地点。为建筑固定的背景也适用于其中没有单独固定背景的房间。

### 固定背景会改变什么

- 到达地点时会显示一次对应图片。停留期间如果手动选择了别的背景，就会一直保留你选的图片，直到故事离开这个地点。
- 在固定了背景的地点，Background 智能体不能切换图片，Illustrator 也不会为它绘制新背景。开启 **Weather Versions of Backgrounds**(背景天气版本) 后，固定的图片仍会使用对应的雨、雪或雾天版本。

如果没有成功：检查列表下方的 **Story is at** 是否显示了地点，以及其中是否逐字包含某个固定背景的地点名称。

## 跟随角色的背景

角色或用户角色的 **Gallery**(图库) 中的图片可以标记为背景。之后，这张图会出现在该角色参与的每个聊天里，不用逐个聊天设置固定背景。

1. 打开角色的 **Images → Gallery**(图片 → 图库)。点击图片上的标签按钮，选择 **Use as background**(用作背景)。
2. 输入图片展示的地点，用逗号分隔，例如 `{{char}}'s bedroom, {{char}}'s room`。在角色图库里，`{{char}}` 指这个角色；在用户角色图库里，`{{user}}` 指这个用户角色。如果图片不对应某个地点，就留空。

之后，图片的标签按钮会显示 **Background:**(背景：) 和对应地点。点击它可以 **Edit places**(编辑地点) 或 **Remove background tag**(移除背景标签)。

在有这个角色的聊天里，**Chat Settings → Background** 会在 **From character and persona galleries**(来自角色和用户角色图库) 下列出这些图片。点击一张即可使用。标有地点的图片也会像固定背景一样生效，列在 **Pinned places** 下，并标注“In John's gallery, follows them into every chat”。同一地点既有聊天里设置的固定背景，又有图库图片时，聊天里的固定背景优先。

### 把聊天图片移入角色图库

Illustrator 在某个聊天里绘制的背景，可以永久归到角色名下：

1. 在聊天里打开 **Chat Settings → Gallery**(聊天设置 → 图库)。
2. 点击图片上的人形按钮（**Add to a character's or persona's gallery**(添加到角色或用户角色的图库)），选择它属于谁。

背景标签和地点会一起保留。图片不会复制一份，删除聊天后也会留在角色的图库里。以 **Marinara Native** 格式导出角色时，这些标签也会保留。

图库背景也有天气版本。雨天或雪天版本会以 `gallery-…--wx-rain.png` 这样的名称保存在背景库里。

## 相关指南

- [Illustrator 绘制的背景](../media/scene-backgrounds.md)：绘制新地点、天气版本和窗户模板。
- [背景库](../appearance/chat-backgrounds.md)：上传、标签、文件夹和模糊。
- [角色与用户角色图库](../characters/galleries.md)
- [Roleplay 模式：入门](getting-started.md)
