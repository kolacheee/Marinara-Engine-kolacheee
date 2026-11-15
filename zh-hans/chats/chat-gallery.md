# 聊天图库

**Gallery**(图库) 存放聊天里的图片和视频：插图、自拍、绘制的背景、分镜帧，以及上传的内容。它是 **Chat Settings**(聊天设置) 里的一个分区。在电脑上，可以把它移出到独立窗口里（见[聊天设置概览](chat-settings.md#popping-a-section-out-into-its-own-window)）。

聊天的图库只属于这个聊天。想让角色在任何聊天里都能使用某张图片，就把它放进角色自己的图库。见[角色与用户角色图库](../characters/galleries.md)。

## 图片和视频

**Gallery** 有两个标签页：**Images**(图片) 和 **Videos**(视频)。每个标签页都会显示其中的项目数量。**Videos** 标签页存放 Roleplay(角色扮演) 和 Game Mode(游戏模式) 聊天的场景视频，以及 Conversation(对话模式) 聊天的视频消息。

分区顶部的操作按钮只会在对应功能适用于当前聊天时出现：

- **Illustrate**(绘制插图)：运行 Illustrator(插画师) 智能体，单次生成一张场景图片。见[插画师智能体](../media/illustrator-agent.md)。
- **Selfie**(自拍)：在 Conversation 模式里生成角色自拍。
- **Background**(背景)：为当前场景绘制并应用背景。见[插画师生成的背景](../media/scene-backgrounds.md#paint-a-background-now)。
- **Video**(视频)：用最新的插图制作场景视频。在 Conversation 模式里，这个按钮会改为发送角色的视频消息；见[视频消息](../conversation/selfies.md#video-messages)。
- **Create storyboard**(创建分镜)：启用 Storyboard(分镜) 时，为最新的 Game Mode 回合或已完成的 Roleplay 剧集生成关键帧。
- **Browse Images**(浏览图片)：打开已保存图片的浏览窗口，从中选择图片插入。
- **View storyboard**(查看分镜)：打开最新的 Game Mode 分镜。

按钮下方是 **Upload Images**(上传图像) 拖放区。把图片拖到这里，就能将自己的图片加入当前聊天的图库。

### 单张图片的操作

把鼠标指针移到 **Images** 标签页里的图片上，或在移动端点按图片，就能看到对应的操作：

- 以原尺寸打开图片（**Open gallery image**(打开图库图像)）。
- **Pin to chat**(固定到聊天)：将图片固定为聊天里的浮动图片。拖动图片可移动位置，用角上的手柄可调整大小。在当前浏览器里重新加载页面后，它仍会保留原来的位置和大小。关闭按钮旁的锁定按钮可以禁止移动和调整大小，直到再次解锁。
- **Download image**(下载图像)：将图片保存到设备。
- **Animate illustration**(让插图动起来)：将这张图片变成场景视频。
- **Copy prompt**(复制提示词)：复制已保存的图片提示词。如果图片没有保存提示词，这里会显示 **No prompt saved**(未保存提示词)，且无法点击。
- 图片左上角的标签按钮：**Use as background**(用作背景) 会把图片标记为背景，并询问图片里有哪些地点，例如 `John's bedroom`。
- **Add to a character's or persona's gallery**(添加到角色或用户角色的图库)（人物图标按钮）：把图片存入该角色或用户角色自己的图库，这样即使聊天不再保留，图片也还在。图片的背景标签和地点会一并保留，之后会跟随该角色出现在每个聊天里。见[跟随角色的背景](../roleplay/backgrounds.md#backgrounds-that-follow-a-character)。
- **Delete gallery image**(删除图库图像)：确认后移除图片。

### 重新生成图片

可以重新生成一张已生成的图片，而不必重新生成它所属的回复。这适用于聊天图库里保存了提示词的图片，例如插图、自拍和分镜帧。

1. 从图库或图片所在的消息里，以原尺寸打开图片。
2. 点击 **Regenerate image**(重新生成图片)（图片右上角的环形箭头按钮）。
3. 按需修改图片下方的输入框和选项：**Prompt**(提示词)、**Negative prompt**(负面提示词)、图片原本带有角色提示词时 **Character prompts**(角色提示词) 下每个角色各自的输入框，以及图片模型。
4. 点击 **Generate image**(生成图片)，或点击 **Cancel**(取消) 保留原图。

新图片会替换消息里的旧图片。旧图片仍会留在图库里，可以再次将它固定到聊天。参考图会根据角色当前的头像重新发送。有些较早生成的图片没有保存负面提示词和角色提示词；遇到这种情况，编辑器会给出说明。

## 相关指南

- [插画师智能体](../media/illustrator-agent.md)：场景插图和短片。
- [插画师生成的背景](../media/scene-backgrounds.md)：**Background** 按钮、不同天气的版本和窗户模板。
- [角色与用户角色图库](../characters/galleries.md)
- [场景视频生成](../media/scene-video.md)：把图库里的图片变成视频。
