# AI 入门：模型、Token 与上下文

刚开始用 AI 聊天？这篇指南介绍其他指南里会用到的几个词，不需要账号也能阅读。主页上的 **AI basics**(AI 入门) 导览会带你一步步了解。

## 什么是 AI 模型

AI 模型也叫大语言模型，简称 LLM。它是一个读过大量文字、学会预测后续内容的程序。收到消息后，它会一小段一小段地写回复，每次都选出一段可能接在后面的内容。

它不会边写边查资料。它知道的内容都来自训练完成前读过的文字，以及 Marinara 随消息一起发给它的内容。所以角色只知道自己卡片里、聊天里，以及 Marinara 加入的世界设定里的事。

## 模型在哪里运行

Marinara 是聊天用的应用，本身并没有内置大模型，而是把聊天内容发给模型：

- **在线服务**，比如 OpenRouter、NanoGPT、OpenAI 或 Anthropic。在那里注册账号，获取 API 密钥（一串让 Marinara 能使用这个账号的秘密代码），由服务来运行模型。大多数服务按用量收费，也有些提供免费模型。
- **自己电脑上的模型**，比如[内置模型](../connections/local-model.md)。不需要账号，也不花钱，不过比大型在线服务的模型更小、更慢，计算工作由自己的电脑承担。

两种方式怎么添加，见[连接 AI 服务商](../connections/connecting-to-a-provider.md)。

## Token

模型按 Token 读写，Token 是小段文本。一个 Token 平均约为四分之三个英文单词，所以 100 个 Token 大约相当于 75 个英文单词。服务用 Token 数来定价和设定限制：通常，发出去的和收到的 Token 都要计费。

## 上下文窗口

模型一次能读的 Token 数量有限，这个上限就是上下文窗口。每次回复前，Marinara 都会发送指令、角色卡、用户角色、相关世界设定，以及尽量多的聊天记录。

聊得久了，最早的消息就放不下了，模型也就忘了。Marinara 可以用摘要和 Memory Recall(记忆召回) 把重要内容找回来。见[记忆功能与聊天摘要](../agents/memory.md)。

## 不同模型负责不同工作

Marinara 可以使用不止一种模型：

| 类型 | 作用 | 是否必需？ |
| --- | --- | --- |
| **Chat model**(聊天模型) | 撰写回复。 | 必需，刚开始有一个就够。 |
| **Decision model**(决策模型) | 回答关于聊天的简单问题：是或否、几个选项里选哪个，或数量是多少。有些还能看图。 | 可选。 |
| **Embedding model**(嵌入模型) | 把文字变成代表其含义的数字，让 Marinara 能按含义查找世界设定和记忆。它本身不会写文字。 | 可选，内置了一个小模型。 |
| **Image reading**(读取图片) | 能看懂图片并描述内容的模型。 | 可选。 |
| **Image, video and voice**(图像、视频与语音) | 生成图片、短片和语音的独立服务。聊天模型做不了这些。 | 可选。 |

刚开始可以让一个聊天模型包办所有工作，等某项功能需要时，再添加其他模型。见[为每项工作选择模型](../connections/connecting-to-a-provider.md#choosing-the-model-for-each-job)。

## 提示词与预设

提示词就是 Marinara 为一次回复发送给模型的全部内容。预设决定提示词里放什么、按什么顺序放。聊天里的 **Peek prompt**(查看提示词) 会显示实际发送的完整提示词。见[预设编辑器与提示词管理器](../prompts/presets.md)。

## 相关指南

- [连接 AI 服务商](../connections/connecting-to-a-provider.md)
- [Decision 模型](../connections/decision-models.md)
- [世界书的语义搜索](../lorebooks/semantic-search.md)
- [Professor Mari](professor-mari.md)
